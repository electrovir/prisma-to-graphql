import {ModelMap} from './model-map';
import {OperationScope} from './operation-scope';
import {generatePrismaWhere} from './prisma-where';

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
    const expandedWhereScope = generatePrismaWhere(modelUnderQuery, models, operationScope?.where);

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
