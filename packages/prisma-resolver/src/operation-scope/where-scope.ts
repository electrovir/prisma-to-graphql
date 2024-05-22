import {omitObjectKeys} from '@augment-vir/common';
import {assertDefined} from 'run-time-assertions';
import {
    FieldScope,
    ModelMap,
    WhereEquality,
    WhereScope,
    customWhereProps,
} from './resolver-context';

/**
 * Expand an operations scope's "where" into a Prisma client compatible "where" input, based on the
 * current model which is being queried.
 *
 * @category Internals
 */
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
    const currentWhere = whereScope[modelName];
    const where: FieldScope = currentWhere ? omitObjectKeys(currentWhere, customWhereProps) : {};

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

            const rawNewWhere = recursivelyBuildWhere(
                field.type,
                models,
                whereScope,
                visitedModels,
            );

            if (!rawNewWhere) {
                return;
            }

            const newWhere = field.isList
                ? createListWhere(currentWhere?.[fieldName] || {}, rawNewWhere)
                : rawNewWhere;

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

function createListWhere(whereDefinition: WhereEquality, rawWhere: FieldScope): FieldScope {
    const listOperation = whereDefinition.listOperation || 'some';

    return {
        [listOperation]: rawWhere,
    };
}
