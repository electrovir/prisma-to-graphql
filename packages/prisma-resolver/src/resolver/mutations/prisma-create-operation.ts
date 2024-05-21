import {awaitedBlockingMap, isObject, isTruthy} from '@augment-vir/common';
import {GraphQLError} from 'graphql';
import {isRunTimeType} from 'run-time-assertions';
import {PrismaResolverInputs, PrismaResolverOutput} from '../prisma-resolver';

/**
 * Runs the CRUD Create operation using a Prisma client. `graphqlArgs` must contain `create.data`
 * which matches Prisma's types:
 *
 *     {
 *         "create": {
 *             "data": {
 *                 // this must match Prisma's `.create()` `data` input
 *             }
 *         }
 *     }
 *
 * See Prisma's create documentation:
 * https://www.prisma.io/docs/orm/reference/prisma-client-reference#create
 *
 * @category Operations
 */
export async function runCreate({
    graphqlArgs,
    context: {prismaClient},
    prismaModelName,
    selection,
}: Readonly<PrismaResolverInputs>): Promise<PrismaResolverOutput> {
    const createData = graphqlArgs.create?.data;

    if (!isRunTimeType(createData, 'array')) {
        throw new GraphQLError("Missing valid 'create.data' input.");
    }

    const items = (
        await awaitedBlockingMap(createData, async (dataEntry, dataIndex) => {
            if (!isRunTimeType(dataEntry, 'object')) {
                throw new GraphQLError(
                    `Invalid data array entry at index '${dataIndex}': expected an object.`,
                );
            }

            try {
                return await prismaClient[prismaModelName].create({
                    ...(isObject(selection.select.items) ? selection.select.items : {}),
                    data: dataEntry,
                });
            } catch (error) {
                console.error(error);
                return undefined;
            }
        })
    ).filter(isTruthy);

    return {
        items: isObject(selection.select.items) ? items : [],
        total: items.length,
    };
}
