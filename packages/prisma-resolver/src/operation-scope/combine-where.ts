import {assertDefined} from 'run-time-assertions';
import {ModelMap, OperationScope} from './resolver-context';
import {expandModelScope} from './where-scope';

/**
 * Combines operation scope and Prisma where into a single Prisma where clause.
 *
 * @category Internals
 */
export function combineWhere(
    /** The where provided by the query. */
    queryWhere: unknown,
    modelUnderQuery: string,
    models: Readonly<ModelMap> | undefined,
    operationScope: Readonly<OperationScope> | undefined,
) {
    const whereScope = operationScope?.where;

    if (!whereScope) {
        return queryWhere;
    }

    assertDefined(
        models,
        'Missing `models` GraphQL context variable, needed to use the `operationScope` context variable.',
    );

    const expandedWhereScope = expandModelScope(modelUnderQuery, models, whereScope);

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
