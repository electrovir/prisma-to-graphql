import {AnyObject, RequiredAndNotNullBy, isObject, mapObjectValues} from '@augment-vir/common';
import {assertDefined, assertRunTimeType} from 'run-time-assertions';
import {ModelMap, OperationScope} from './resolver-context';
import {expandModelScope} from './where-scope';

/**
 * Combines operation scope and Prisma selection into a Prisma selection with where clauses (to meet
 * the operation scope requirements).
 *
 * @category Internals
 */
export function combineSelect(
    /** The where provided by the query. */
    querySelect: unknown,
    modelUnderQuery: string,
    models: Readonly<ModelMap> | undefined,
    operationScope: Readonly<OperationScope> | undefined,
) {
    const whereScope = operationScope?.where;

    if (
        !whereScope ||
        !querySelect ||
        !isObject(querySelect) ||
        !Object.keys(querySelect).length ||
        !operationScope
    ) {
        return querySelect || {};
    }

    assertDefined(
        models,
        'Missing `models` GraphQL context variable, needed to use the `operationScope` context variable.',
    );

    return buildSelectRecursively(querySelect, modelUnderQuery, models, {where: whereScope});
}

function buildSelectRecursively(
    querySelect: Record<string, any>,
    modelUnderQuery: string,
    models: Readonly<ModelMap>,
    operationScope: Readonly<RequiredAndNotNullBy<OperationScope, 'where'>>,
): AnyObject {
    return mapObjectValues(querySelect, (fieldName, fieldSelection) => {
        const currentField = models?.[modelUnderQuery]?.[fieldName];

        assertDefined(
            currentField,
            `Failed to find field definition for '${modelUnderQuery} -> ${fieldName}'`,
        );
        if (currentField.isRelation && currentField.isList) {
            assertRunTimeType(
                fieldSelection,
                'object',
                `relation field selection is not an object: '${modelUnderQuery} -> ${fieldName}'`,
            );

            const expandedWhereScope = expandModelScope(
                currentField.type,
                models,
                operationScope.where,
            );

            return {
                select: buildSelectRecursively(
                    querySelect[fieldName].select,
                    currentField.type,
                    models,
                    operationScope,
                ),
                ...(expandedWhereScope ? {where: expandedWhereScope} : {}),
            };
        }

        return fieldSelection;
    });
}
