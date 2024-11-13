import {defineShape} from 'object-shape-tester';

/**
 * GraphQL generation options shape for `prisma-to-graphql`. Used to verify option validity and set
 * default values.
 *
 * @category Prisma Generator
 */
export const graphqlGenerationOptionsShape = defineShape({
    /**
     * Generate GraphQL query resolvers.
     *
     * @default true
     */
    generateQuery: true,
    /**
     * Generate GraphQL mutation resolvers.
     *
     * @default true
     */
    generateMutation: true,
});

/**
 * GraphQL generation options for `prisma-to-graphql`.
 *
 * @category Prisma Generator
 */
export type GraphqlGenerationOptions = typeof graphqlGenerationOptionsShape.runtimeType;
