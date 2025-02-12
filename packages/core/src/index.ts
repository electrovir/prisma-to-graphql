/** The GraphQL operation types supported by `prisma-to-graphql`. */
export enum OperationType {
    Mutation = 'Mutation',
    Query = 'Query',
}

/**
 * All input and output type names for all supported GraphQL operations from the given GraphQL
 * schema.
 *
 * Outputs using this type are generated by the
 * [`prisma-to-graphql`](https://www.npmjs.com/package/prisma-to-graphql) Prisma generator and used
 * by
 * [`@prisma-to-graphql/fetch-graphql`](https://www.npmjs.com/package/@prisma-to-graphql/fetch-graphql)
 * to construct GraphQL query strings.
 */
export type SchemaOperationTypeNames = Record<OperationType, ResolverTypeNames>;

/**
 * A type used for runtime values generate by the
 * [`prisma-to-graphql`](https://www.npmjs.com/package/prisma-to-graphql) Prisma generator. These
 * values are in turn used by
 * [`@prisma-to-graphql/fetch-graphql`](https://www.npmjs.com/package/@prisma-to-graphql/fetch-graphql)
 * to construct GraphQL query strings.
 *
 * This type contains the argument and output type names in the generated GraphQL schema.
 */
export type ResolverTypeNames = {
    [ResolverName in string]: {
        /** This maps each argument name to its output type in the GraphQL schema. */
        args: {
            [ArgName in string]: string;
        };
        /** The name of the output type in the GraphQL schema. */
        output: string;
    };
};
