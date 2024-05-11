/**
 * Options for building GraphQL queries.
 *
 * @category Internal Query Builders
 */
export type BuildGraphqlQueryOptions = {
    indent: string;
};

/**
 * Default options for building GraphQL queries.
 *
 * @category Internal Query Builders
 */
export const defaultBuildGraphqlQueryOptions: BuildGraphqlQueryOptions = {
    indent: '    ',
};
