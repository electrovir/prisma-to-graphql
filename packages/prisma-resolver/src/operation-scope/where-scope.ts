import {assertDefined} from 'run-time-assertions';
import {FieldScope, ModelMap, WhereScope} from './resolver-context';

export function expandModelScope(
    modelUnderQuery: string,
    models: Readonly<ModelMap>,
    whereScope: Readonly<WhereScope>,
): FieldScope | undefined {
    return recursivelyBuildWhere(modelUnderQuery, models, whereScope, new Set());
}

function recursivelyBuildWhere(
    modelName: string,
    models: Readonly<ModelMap>,
    whereScope: Readonly<WhereScope>,
    visitedModels: Set<string>,
): FieldScope | undefined {
    if (visitedModels.has(modelName)) {
        return undefined;
    }
    visitedModels.add(modelName);
    const where: FieldScope = whereScope[modelName] || {};

    const model = models[modelName];
    assertDefined(model, `Failed to find model map entry by model name '${modelName}'`);

    Object.entries(model).forEach(
        ([
            fieldName,
            field,
        ]) => {
            if (!field.isRelation) {
                return;
            } else if (fieldName === 'AND') {
                throw new Error("Cannot handle a field named 'AND'.");
            }

            const newWhere = recursivelyBuildWhere(field.type, models, whereScope, visitedModels);

            if (!newWhere) {
                return;
            }

            const existingFieldWhere = where[fieldName] as FieldScope | undefined;

            if (existingFieldWhere) {
                where[fieldName] = {
                    AND: [
                        existingFieldWhere,
                        newWhere,
                    ],
                };
            } else {
                where[fieldName] = newWhere;
            }
        },
    );

    if (Object.keys(where).length) {
        return where;
    } else {
        return undefined;
    }
}
