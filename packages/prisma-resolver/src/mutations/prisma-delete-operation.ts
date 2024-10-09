import {
    ResolverOperation,
    combineWhere,
    extractMaxCountScope,
    outputMessages,
} from '@prisma-to-graphql/resolver-context';
import {GraphQLError} from 'graphql';
import {isRunTimeType} from 'run-time-assertions';
import {PrismaResolverInputs, PrismaResolverOutput} from '../prisma-resolver';

/**
 * Runs the CRUD Delete operation using a Prisma client. `graphqlArgs` must contain `update.delete`
 * and `update.where` which matches Prisma's `deleteMany` types:
 *
 *     {
 *         "delete": {
 *             "where": {
 *                 // this must match Prisma's `.deleteMany()` `where` input
 *             }
 *         }
 *     }
 *
 * See Prisma's delete documentation:
 * https://www.prisma.io/docs/orm/reference/prisma-client-reference#deletemany
 *
 * @category Operations
 */
export async function runPrismaDelete({
    graphqlArgs,
    context: {prismaClient, models, operationScope},
    prismaModelName,
}: Readonly<
    Pick<PrismaResolverInputs<any, any>, 'graphqlArgs' | 'context' | 'prismaModelName'>
>): Promise<PrismaResolverOutput> {
    const deleteWhere = graphqlArgs.delete?.where;

    if (!isRunTimeType(deleteWhere, 'object')) {
        throw new GraphQLError(
            outputMessages.byDescription['invalid input'].message({inputName: 'delete.where'}),
        );
    }

    const finalWhere = combineWhere(deleteWhere, prismaModelName, models, operationScope);

    const maxDeleteCount = extractMaxCountScope(operationScope, ResolverOperation.Delete);
    if (maxDeleteCount) {
        const deleteCount = await prismaClient[prismaModelName].count({
            where: finalWhere,
        });

        if (deleteCount > maxDeleteCount) {
            throw new GraphQLError(
                outputMessages.byDescription['delete too big'].message({
                    count: deleteCount,
                    max: maxDeleteCount,
                }),
            );
        }
    }

    const deleteOutput: {count: number} = await prismaClient[prismaModelName].deleteMany({
        where: finalWhere,
    });

    return {
        total: deleteOutput.count,
        messages: [],
        items: [],
    };
}
