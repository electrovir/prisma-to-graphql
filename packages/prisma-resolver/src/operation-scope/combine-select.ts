import {AnyObject, RequiredAndNotNullBy, isObject, mapObjectValues} from '@augment-vir/common';
import {assertDefined, assertRunTimeType} from 'run-time-assertions';
import {generatePrismaWhere} from './prisma-where';
import {ModelMap, OperationScope} from './resolver-context';

/**
 * Combines operation scope and Prisma selection into a Prisma selection with where clauses (to meet
 * the operation scope requirements).
 *
 * @category Internals
 */
export function combineSelect<const Models extends ModelMap>(
    /** The where provided by the query. */
    querySelect: unknown,
    modelUnderQuery: string,
    models: Readonly<Models> | undefined,
    operationScope: Readonly<OperationScope<Models>> | undefined,
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

function buildSelectRecursively<const Models extends ModelMap>(
    querySelect: Record<string, any>,
    modelUnderQuery: string,
    models: Readonly<Models>,
    operationScope: Readonly<RequiredAndNotNullBy<OperationScope<Models>, 'where'>>,
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

            const expandedWhereScope = generatePrismaWhere(
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
