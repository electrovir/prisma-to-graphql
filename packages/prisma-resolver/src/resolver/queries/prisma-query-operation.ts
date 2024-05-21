import {isObject} from '@augment-vir/common';
import {GraphQLError} from 'graphql';
import {combineWhere} from '../../operation-scope/combine-where';
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
export async function runPrismaQueryOperations({
    context: {models, operationScope, prismaClient},
    prismaModelName,
    graphqlArgs,
    selection,
}: Readonly<PrismaResolverInputs>): Promise<PrismaResolverOutput> {
    const queryWhere = graphqlArgs.where;

    if (!queryWhere) {
        throw new GraphQLError("Missing valid 'where' input.");
    } else if (!selection.select.total && !selection.select.items) {
        throw new GraphQLError("Neither 'total' or 'items' where selected: there's nothing to do.");
    }

    const finalWhere = combineWhere(queryWhere, prismaModelName, models, operationScope);

    const total = selection.select.total
        ? await prismaClient[prismaModelName].count({
              where: finalWhere,
          })
        : 0;

    const items = isObject(selection.select.items)
        ? await prismaClient[prismaModelName].findMany({
              where: finalWhere,
              select: selection.select.items.select,
              orderBy: graphqlArgs.orderBy,
              take: graphqlArgs.take,
              skip: graphqlArgs.skip,
              distinct: graphqlArgs.distinct,
          })
        : [];

    return {total, items};
}
