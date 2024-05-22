/**
 * Note: this file is symlinked to from the scripts package so it can be used when setting up test
 * GraphQL servers.
 */

import {AnyObject, PartialAndUndefined} from '@augment-vir/common';
import {JsonPrimitive} from 'type-fest';

/**
 * The context object which `prisma-to-graphql` generated resolvers require and thus must be
 * attached to the containing GraphQL server.
 *
 * @category Main
 */
export type ResolverContext<PrismaClient = AnyObject> = {
    prismaClient: PrismaClient;
    models?: ModelMap | undefined;
    operationScope?: OperationScope | undefined;
};

/**
 * Defines extra scopes, or extra requirements for each query. The defined scope will be merged with
 * all user queries to limit what data they can reach.
 *
 * @category Types
 * @example
 *     // this will limit all user queries or other queries that contain user relations to users
 *     // to only the id `current-user-id`.
 *     const example: OperationScope = {
 *         where: {
 *             User: {
 *                 id: 'current-user-id',
 *             },
 *         },
 *     };
 */
export type OperationScope = PartialAndUndefined<{
    where: WhereScope;
}>;

/**
 * The supported "where" properties for an operation scope.
 *
 * @category Types
 */
export type WhereEquality = {
    AND?: FieldScope[];
    equals?: JsonPrimitive;
    in?: JsonPrimitive[];
    contains?: string;
    /**
     * Specify the where operation to use when this model is within an array.
     *
     * @default 'some'
     */
    listOperation?: 'some' | 'none' | 'every';
};

/**
 * All props from `WhereEquality` which should be removed from the where clause before being passed
 * to Prisma.
 *
 * @category Internals
 */
export const customWhereProps: (keyof WhereEquality)[] = ['listOperation'];

/**
 * An object of field names (for the encompassed model) and their equality requirements. Used in
 * `OperationScope`.
 *
 * @category Types
 */
export type FieldScope = {
    [FieldName in string]: WhereEquality | FieldScope;
};

/**
 * An object of model names and their defined scopes. Used in `OperationScope`.
 *
 * @category Types
 */
export type WhereScope = {
    [ModelName in string]: FieldScope;
};

/**
 * Model information generated from the `prisma-to-graphql` Prisma generator. This is required for
 * operation scope to work.
 *
 * @category Types
 */
export type ModelMap = {
    [ModelName in string]: {
        [FieldName in string]: {
            type: string;
            isRelation: boolean;
            isList: boolean;
        };
    };
};
