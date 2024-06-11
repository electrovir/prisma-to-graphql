import {isObject, isTruthy} from '@augment-vir/common';
import {
    combineSelect,
    combineWhere,
    extractMaxCountScope,
    outputMessages,
} from '@prisma-to-graphql/operation-scope';
import {GraphQLError} from 'graphql';
import {PrismaResolverInputs, PrismaResolverOutput} from '../prisma-resolver';

/**
 * Runs the CRUD Read operation using a Prisma client's `findMany` operation. `graphqlArgs` must
 * contain `create.data` which matches Prisma's types:
 *
 *     {
 *         "where": {
 *             // this must match Prisma's `.findMany()` `where` input
 *         }
 *     }
 *
 * See Prisma's findMany documentation:
 * https://www.prisma.io/docs/orm/reference/prisma-client-reference#findmany
 *
 * @category Operations
 */
export async function runPrismaQuery({
    context: {models, operationScope, prismaClient},
    prismaModelName,
    graphqlArgs,
    selection,
}: Readonly<PrismaResolverInputs<any, any>>): Promise<PrismaResolverOutput> {
    const queryWhere = graphqlArgs.where || undefined;

    if (!selection.select.total && !selection.select.items) {
        throw new GraphQLError("Neither 'total' or 'items' where selected: there's nothing to do.");
    }

    const finalWhere = combineWhere(queryWhere, prismaModelName, models, operationScope);

    const maxResultCount = extractMaxCountScope(operationScope, 'query');
    const useMaxCount =
        maxResultCount && (graphqlArgs.take == undefined || graphqlArgs.take > maxResultCount);
    const finalTake = useMaxCount ? maxResultCount : graphqlArgs.take;

    const finalSelect = isObject(selection.select.items)
        ? combineSelect(selection.select.items.select, prismaModelName, models, operationScope)
        : undefined;

    const total =
        selection.select.total || useMaxCount
            ? await prismaClient[prismaModelName].count({
                  where: finalWhere,
              })
            : 0;

    const items = isObject(selection.select.items)
        ? await prismaClient[prismaModelName].findMany({
              where: finalWhere,
              select: finalSelect?.select,
              orderBy: graphqlArgs.orderBy,
              take: finalTake,
              skip: graphqlArgs.cursor == undefined ? undefined : 1,
              cursor: graphqlArgs.cursor,
              distinct: graphqlArgs.distinct,
          })
        : [];

    const wereQueryResultsTruncated = useMaxCount && finalTake < total;

    return {
        total,
        items,
        messages: [
            ...(finalSelect ? finalSelect.messages : []),
            wereQueryResultsTruncated &&
                maxResultCount &&
                outputMessages.byDescription['query results truncated'].create({
                    max: maxResultCount,
                }),
        ].filter(isTruthy),
    };
}
