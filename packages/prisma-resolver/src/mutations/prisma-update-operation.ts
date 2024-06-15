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
 * Runs the CRUD Update operation using a Prisma client. `graphqlArgs` must contain `update.data`
 * and `update.where` which matches Prisma's types:
 *
 *     {
 *         "update": {
 *             "data": {
 *                 // this must match Prisma's `.update()` `data` input
 *             },
 *             "where": {
 *                 // this must match Prisma's `.update()` `where` input
 *             }
 *         }
 *     }
 *
 * See Prisma's update documentation:
 * https://www.prisma.io/docs/orm/reference/prisma-client-reference#update
 *
 * @category Operations
 */
export async function runPrismaUpdate({
    graphqlArgs,
    context: {prismaClient, models, operationScope},
    prismaModelName,
}: Readonly<
    Pick<PrismaResolverInputs<any, any>, 'graphqlArgs' | 'context' | 'prismaModelName'>
>): Promise<PrismaResolverOutput> {
    const updateData = graphqlArgs.update?.data;
    const updateWhere = graphqlArgs.update?.where;

    if (!isRunTimeType(updateData, 'object')) {
        throw new GraphQLError(
            outputMessages.byDescription['invalid input'].message({inputName: 'update.data'}),
        );
    } else if (!isRunTimeType(updateWhere, 'object')) {
        throw new GraphQLError(
            outputMessages.byDescription['invalid input'].message({inputName: 'update.where'}),
        );
    }

    const finalWhere = combineWhere(updateWhere, prismaModelName, models, operationScope);

    const maxUpdateCount = extractMaxCountScope(operationScope, ResolverOperation.Update);
    if (maxUpdateCount) {
        const updateCount = await prismaClient[prismaModelName].count({
            where: finalWhere,
        });

        if (updateCount > maxUpdateCount) {
            throw new GraphQLError(
                outputMessages.byDescription['update too big'].message({
                    count: updateCount,
                    max: maxUpdateCount,
                }),
            );
        }
    }

    const updateOutput: {count: number} = await prismaClient[prismaModelName].updateMany({
        where: finalWhere,
        data: updateData,
    });

    return {
        total: updateOutput.count,
        messages: [],
        items: [],
    };
}
