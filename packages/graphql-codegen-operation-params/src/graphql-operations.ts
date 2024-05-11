import {getObjectTypedKeys} from '@augment-vir/common';

/**
 * GraphQL operation types currently supported by the prisma-to-graphql stack.
 *
 * @category Main Types
 */
export type OperationType = 'Mutation' | 'Query';
const enabledOperationTypes = {
    Mutation: true,
    Query: true,
} as const satisfies Record<OperationType, boolean>;

/**
 * All options from `OperationType` in an array.
 *
 * @category Plugin Internals
 */
export const allValidOperationTypes = getObjectTypedKeys(enabledOperationTypes);

/**
 * All input and output type names for all supported GraphQL operations from the given GraphQL
 * schema.
 *
 * @category Main Types
 */
export type SchemaOperationParams = Record<OperationType, ResolverParams>;

/**
 * The inputs and output type names for a group of GraphQL resolvers.
 *
 * @category Main Types
 */
export type ResolverParams = {
    [ResolverName in string]: {
        args: {[ArgName in string]: string};
        output: string;
    };
};
