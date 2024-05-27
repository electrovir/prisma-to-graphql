import {assertDefined} from 'run-time-assertions';
import {generatePrismaWhere} from './prisma-where';
import {ModelMap, OperationScope} from './resolver-context';

/**
 * Combines operation scope and Prisma where into a single Prisma where clause.
 *
 * @category Internals
 */
export function combineWhere<const Models extends ModelMap>(
    /** The where provided by the query. */
    queryWhere: unknown,
    modelUnderQuery: string,
    models: Readonly<Models> | undefined,
    operationScope: Readonly<OperationScope<Models>> | undefined,
) {
    const whereScope = operationScope?.where;

    if (!whereScope) {
        return queryWhere;
    }

    assertDefined(
        models,
        'Missing `models` GraphQL context variable, needed to use the `operationScope` context variable.',
    );

    const expandedWhereScope = generatePrismaWhere(modelUnderQuery, models, whereScope);

    if (!queryWhere && expandedWhereScope) {
        return expandedWhereScope;
    } else if (queryWhere && !expandedWhereScope) {
        return queryWhere;
    } else if (queryWhere && expandedWhereScope) {
        return {
            AND: [
                queryWhere,
                expandedWhereScope,
            ],
        };
    } else {
        return {};
    }
}
