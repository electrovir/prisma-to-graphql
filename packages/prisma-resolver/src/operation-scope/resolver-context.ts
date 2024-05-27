import {MapPrismaType} from './prisma-type-map';
/**
 * Note: this file is symlinked to from the scripts package so it can be used when setting up test
 * GraphQL servers.
 */

/**
 * The context object which `prisma-to-graphql` generated resolvers require and thus must be
 * attached to the containing GraphQL server.
 *
 * @category Main
 */
export type ResolverContext<PrismaClient, Models extends ModelMap> = {
    prismaClient: PrismaClient;
    models?: ModelMap | undefined;
    operationScope?: OperationScope<Models> | undefined;
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
export type OperationScope<Models extends ModelMap> = Partial<{
    where: WhereScope<Models>;
}>;

/**
 * The user defined where scope. Includes entries for every model in the user provided model map.
 *
 * @category Types
 */
export type WhereScope<Models extends ModelMap> = {
    [ModelName in keyof Models]?: undefined | ModelScope<Models[ModelName]>;
};

/**
 * A user defined scope for a Model. Excludes all relation fields as they should be defined as their
 * own separate entry in the operation scope.
 *
 * @category Types
 */
export type ModelScope<Model extends ModelMapModel> = {
    [FieldName in keyof Model as Model[FieldName]['isRelation'] extends true
        ? never
        : FieldName]?: FieldScope<Model[FieldName]['type']>;
};

export type ListOperation = 'some' | 'none' | 'every';

/**
 * Field scope for an individual field within a model within an {@link OperationScope}.
 *
 * @category Types
 */
export type FieldScope<FieldTypeString extends string> = {
    equals?: MapPrismaType<FieldTypeString, 'input'>;
    in?: MapPrismaType<FieldTypeString, 'input'>[];
    /** Set this to override the default list operation when this field is used within a list. */
    listOperation?: ListOperation;
} & (FieldTypeString extends 'String'
    ? {
          contains?: MapPrismaType<FieldTypeString, 'input'>;
      }
    : {});

/**
 * All props from `WhereEquality` which should be removed from the where clause before being passed
 * to Prisma.
 *
 * @category Internals
 */
export const customFieldScopeProps: (keyof FieldScope<any>)[] = ['listOperation'];

/**
 * An individual model within a {@link ModelMap}.
 *
 * @category Types
 */
export type ModelMapModel = {
    [FieldName in string]: {
        type: string;
        isRelation: boolean;
        isList: boolean;
    };
};

/**
 * An individual field within a {@link ModelMapModel}.
 *
 * @category Types
 */
export type ModelMapField = {
    type: string;
    isRelation: boolean;
    isList: boolean;
};

/**
 * Model information generated from the `prisma-to-graphql` Prisma generator. This is required for
 * operation scope to work.
 *
 * @category Types
 */
export type ModelMap = {
    [ModelName in string]: ModelMapModel;
};
