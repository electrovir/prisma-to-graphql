import {check} from '@augment-vir/assert';
import {mergeDefinedProperties} from '@augment-vir/common';
import type {SchemaOperationTypeNames} from '@prisma-to-graphql/core';
import {IsAny, type IsNever} from 'type-fest';
import {buildUrl} from 'url-vir';
import {buildGraphqlQuery} from '../build-query/build-graphql-query.js';
import {sanitizeQueryString} from '../build-query/sanitize-query-string.js';
import {FetchRawGraphqlOptions, GraphqlQuery, fetchRawGraphql} from './fetch-raw-graphql.js';
import {GraphqlOperations, ResolverOutputWithSelection} from './type-transforms/operations.js';
import {AvailableOperationTypes, BaseResolvers} from './type-transforms/resolvers.js';

export {OperationType} from '@prisma-to-graphql/core';

/**
 * Options passed to both {@link createGraphqlFetcher} and its output function.
 *
 * @category Main Types
 */
export type FetchGraphqlOptions = Partial<
    FetchRawGraphqlOptions & {
        /**
         * By default, the GraphQL operation name is appended to the URL as a query param to improve
         * searchability (particularly the in browser dev tools's network tab). Set this property to
         * true to prevent that behavior.
         */
        omitOperationNameFromUrl: boolean;
    }
>;

/**
 * Inputs to a function of type `GraphqlFetcher`.
 *
 * @category Main Types
 */
export type FetchGraphqlParams<
    Resolvers extends Readonly<BaseResolvers>,
    OperationType extends AvailableOperationTypes<Resolvers>,
> = {
    url: string | URL;
    operationType: OperationType | `${OperationType}`;
    /**
     * A unique name given to this query. This name does not need to match any of your GraphQL
     * types, it just needs to be a string (and should be a unique string to make debugging
     * easier).
     *
     * See https://graphql.org/learn/queries/#operation-name.
     */
    operationName: string;
    options?: FetchGraphqlOptions | undefined;
};

/**
 * The type of a `fetchGraphql` function. An instance of this is generated via
 * `createGraphqlFetcher`.
 *
 * @category Main Types
 */
export type GraphqlFetcher<Resolvers extends Readonly<BaseResolvers>> =
    IsNever<Resolvers> extends true
        ? 'ERROR: a type parameter must be provided to createGraphqlFetcher'
        : <
              const OperationType extends AvailableOperationTypes<Resolvers>,
              const Operations extends Readonly<GraphqlOperations<Resolvers, OperationType>>,
          >(
              params: Readonly<FetchGraphqlParams<Resolvers, OperationType>>,
              /** The queries to run. */
              operations: Operations,
          ) => Promise<
              IsAny<Resolvers> extends true
                  ? any
                  : ResolverOutputWithSelection<Resolvers, OperationType, Operations>
          >;

/**
 * This is required to generate a `fetchGraphql` function by wrapping it in the GraphQL schema's
 * Resolver types.
 *
 * The required `Resolvers` type parameter and required `schemaOperationTypeNames` argument are both
 * generated from the `prisma-to-graphql` package's Prisma generator.
 *
 * @category Main
 * @example // both `Resolvers` and `schemaOperationTypeNames` are generated from the
 * `prisma-to-graphql` package. const fetchGraphql =
 * createGraphqlFetcher<Resolvers>(schemaOperationTypeNames);
 *
 *     const users = await fetchGraphql(
 *         {
 *             operationType: 'Query',
 *             operationName: 'MyOperation',
 *             url: 'https://example.com/graphql',
 *         },
 *         {
 *             Users: [
 *                 {
 *                     args: {
 *                         where: {
 *                             role: {equals: 'user'},
 *                         },
 *                     },
 *                     select: {
 *                         items: {
 *                             firstName: true,
 *                             lastName: true,
 *                             role: true,
 *                         },
 *                     },
 *                 },
 *             ],
 *         },
 *     );
 */
export function createGraphqlFetcher<const Resolvers extends Readonly<BaseResolvers> = never>(
    schemaOperationTypeNames: IsNever<Resolvers> extends true
        ? 'ERROR: a type parameter must be provided to createGraphqlFetcher'
        : Readonly<SchemaOperationTypeNames>,
    options?: FetchGraphqlOptions | undefined,
): GraphqlFetcher<Resolvers> {
    if (check.isString(schemaOperationTypeNames)) {
        throw new TypeError('Invalid schemaOperationTypeNames input: it must be an object.');
    }

    async function fetchGraphql(
        ...[
            {operationType, operationName, url, options: fetchOptions},
            operations,
        ]: Parameters<Exclude<GraphqlFetcher<Resolvers>, string>>
    ): Promise<ReturnType<Exclude<GraphqlFetcher<Resolvers>, string>>> {
        if (!Object.keys(operations).length) {
            throw new Error('Nothing to fetch: no operations given.');
        }

        const graphqlQuery: GraphqlQuery = buildGraphqlQuery({
            schemaOperationTypeNames: schemaOperationTypeNames as Exclude<
                typeof schemaOperationTypeNames,
                string
            >,
            operationName,
            operationType,
            operations,
        });

        const finalOptions = options ? mergeDefinedProperties(options, fetchOptions) : fetchOptions;

        const urlWithOperationName =
            url && !finalOptions?.omitOperationNameFromUrl
                ? buildUrl(url, {search: {operation: sanitizeQueryString(operationName)}}).href
                : url;

        return await fetchRawGraphql(urlWithOperationName, graphqlQuery, finalOptions);
    }

    return fetchGraphql as unknown as GraphqlFetcher<Resolvers>;
}
