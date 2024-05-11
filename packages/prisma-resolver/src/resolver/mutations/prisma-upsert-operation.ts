import {AnyObject, extractErrorMessage, filterObject, isObject} from '@augment-vir/common';
import {GraphQLError} from 'graphql';
import {isPrimitive, isRunTimeType} from 'run-time-assertions';
import {PrismaResolverInputs, PrismaResolverOutput} from '../prisma-resolver';

/**
 * Runs the CRUD Upsert operation using a Prisma client. `graphqlArgs` must contain `upsert.data`
 * which matches Prisma's upsert `create` input and `upsert.where` which matches Prisma's `where`
 * type:
 *
 *     {
 *         "upsert": {
 *             "data": {
 *                 // this must match Prisma's `.upsert()` `create.data` input
 *             },
 *             "where": {
 *                 // this must match Prisma's `.upsert()` `where` input
 *             }
 *         }
 *     }
 *
 * Note that the `upsert.data` is used for the `update` data passed to Prisma and the `upsert.data`
 * and `upsert.where` are combined to form the `create` data passed to Prisma.
 *
 * See Prisma's upsert documentation:
 * https://www.prisma.io/docs/orm/reference/prisma-client-reference#upsert
 *
 * @category Operations
 */
export async function runUpsert({
    graphqlArgs,
    prismaClient,
    prismaModelName,
    selection,
}: Readonly<
    Pick<PrismaResolverInputs, 'graphqlArgs' | 'prismaClient' | 'prismaModelName' | 'selection'>
>): Promise<PrismaResolverOutput> {
    try {
        const upsertData = graphqlArgs.upsert?.data;
        const upsertWhere = graphqlArgs.upsert?.where;

        if (!isRunTimeType(upsertData, 'object')) {
            throw new GraphQLError("Missing valid 'upsert.data' input.");
        } else if (!isRunTimeType(upsertWhere, 'object')) {
            throw new GraphQLError("Missing valid 'upsert.where' input.");
        }

        const updatedEntry = await prismaClient[prismaModelName].upsert({
            where: upsertWhere,
            create: createCreateData({upsertData, upsertWhere}),
            update: upsertData,
            select: isObject(selection.select.items) ? selection.select.items.select : undefined,
        });

        return {
            total: 1,
            items: isObject(selection.select.items) ? [updatedEntry] : [],
        };
    } catch (error) {
        rethrowPrismaError(error);
    }
}

function createCreateData({
    upsertData,
    upsertWhere,
}: {
    upsertData: AnyObject;
    upsertWhere: AnyObject;
}) {
    const whereToCombine = filterObject(upsertWhere, (key, value) => {
        return isPrimitive(value);
    });

    return {
        ...upsertData,
        ...whereToCombine,
    };
}

const needsArgumentErrorMessageRegExp =
    /(?:\n|.)+(Argument [^ ]+ )of type [^ ]+ (needs [^\.]+\.).+/;

/**
 * Truncates and rethrows specifically enumerated Prisma errors as GraphQL errors so that the
 * GraphQL requester can figure out what's going wrong.
 *
 * @category Operations
 */
export function rethrowPrismaError(error: unknown): never {
    const message = extractErrorMessage(error);
    if (!(error instanceof GraphQLError) && message.match(needsArgumentErrorMessageRegExp)) {
        const newMessage = message.replace(needsArgumentErrorMessageRegExp, '$1$2');
        throw new GraphQLError(newMessage);
    }

    throw error;
}
