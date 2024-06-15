import {AnyObject, RequiredAndNotNullBy, isObject, mapObjectValues} from '@augment-vir/common';
import {assertDefined, assertRunTimeType} from 'run-time-assertions';
import {OutputMessage, outputMessages} from '../output-messages';
import {ResolverOperation} from '../resolver-operation-type';
import {extractMaxCountScope} from './max-count';
import {ModelMap} from './model-map';
import {OperationScope} from './operation-scope';
import {generatePrismaWhere} from './prisma-where';

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
): {select: AnyObject; messages: OutputMessage[]} {
    const whereScope = operationScope?.where;

    if (
        !whereScope ||
        !querySelect ||
        !isObject(querySelect) ||
        !Object.keys(querySelect).length ||
        !operationScope
    ) {
        return {
            select: querySelect || {},
            messages: [],
        };
    }

    assertDefined(
        models,
        'Missing `models` GraphQL context variable, needed to use the `operationScope` context variable.',
    );

    return buildSelectRecursively(
        querySelect,
        modelUnderQuery,
        models,
        {
            where: whereScope,
            maxCount: operationScope.maxCount,
        },
        [modelUnderQuery],
    );
}

function buildSelectRecursively<const Models extends ModelMap>(
    querySelect: Record<string, any>,
    modelUnderQuery: string,
    models: Readonly<Models>,
    operationScope: Readonly<RequiredAndNotNullBy<OperationScope<Models>, 'where'>>,
    parentFieldChain: string[],
): {select: AnyObject; messages: OutputMessage[]} {
    const messages: OutputMessage[] = [];

    const select = mapObjectValues(querySelect, (fieldName, fieldSelection) => {
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

            const maxCount = extractMaxCountScope(operationScope, ResolverOperation.Query);
            const useMaxCount =
                maxCount != undefined &&
                (querySelect[fieldName].take == undefined ||
                    maxCount <= querySelect[fieldName].take);
            const take = useMaxCount ? maxCount : querySelect[fieldName].take;

            const fieldChain = parentFieldChain.concat(fieldName);

            if (useMaxCount) {
                messages.push(
                    outputMessages.byDescription['field possibly truncated'].create({
                        fieldChain,
                        max: maxCount,
                    }),
                );
            }

            const recursiveSelect = buildSelectRecursively(
                querySelect[fieldName].select,
                currentField.type,
                models,
                operationScope,
                fieldChain,
            );

            messages.push(...recursiveSelect.messages);

            return {
                select: recursiveSelect.select,
                ...(expandedWhereScope ? {where: expandedWhereScope} : {}),
                ...(take == undefined ? {} : {take}),
            };
        }

        return fieldSelection;
    });

    return {select, messages};
}
