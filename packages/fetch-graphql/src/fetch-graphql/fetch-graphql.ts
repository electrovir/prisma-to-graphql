import {SchemaOperationParams} from '@prisma-to-graphql/graphql-codegen-operation-params';
import {IsAny} from 'type-fest';
import {buildGraphqlQuery} from '../build-query/build-graphql-query';
import {BuildGraphqlQueryOptions} from '../build-query/build-graphql-query-options';
import {FetchRawGraphqlOptions, GraphqlQuery, fetchRawGraphql} from './fetch-raw-graphql';
import {GraphqlOperations, ResolverOutputWithSelection} from './type-transforms/operations';
import {AvailableOperationTypes, BaseResolvers} from './type-transforms/resolvers';

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
    operationType: OperationType;
    /**
     * A unique name given to this query. This name does not need to match any of your GraphQL
     * types, it just needs to be a string (and should be a unique string to make debugging
     * easier).
     *
     * See https://graphql.org/learn/queries/#operation-name.
     */
    operationName: string;
    options?: Partial<FetchRawGraphqlOptions & BuildGraphqlQueryOptions> | undefined;
};

/**
 * The type of a `fetchGraphql` function. An instance of this is generated via
 * `createGraphqlFetcher`.
 *
 * @category Main Types
 */
export type GraphqlFetcher<Resolvers extends Readonly<BaseResolvers>> = <
    const OperationType extends AvailableOperationTypes<Resolvers>,
    const Operations extends GraphqlOperations<Resolvers, OperationType>,
>(
    params: Readonly<FetchGraphqlParams<Resolvers, OperationType>>,
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
 * The required `Resolvers` type parameter and required `operationParams` argument are both
 * generated from the `prisma-to-graphql` package's Prisma generator.
 *
 * @category Main
 * @example
 *     // both `Resolvers` and `operationParams` are generated from the `prisma-to-graphql` package.
 *     const fetchGraphql = createGraphqlFetcher<Resolvers>(operationParams);
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
export function createGraphqlFetcher<const Resolvers extends Readonly<BaseResolvers>>(
    operationParams: Readonly<SchemaOperationParams>,
): GraphqlFetcher<Resolvers> {
    async function fetchGraphql(
        ...[
            {operationType, operationName, url, options},
            operations,
        ]: Parameters<GraphqlFetcher<Resolvers>>
    ): Promise<ReturnType<GraphqlFetcher<Resolvers>>> {
        if (!Object.keys(operations).length) {
            throw new Error('Nothing to fetch: no operations given.');
        }

        const graphqlQuery: GraphqlQuery = buildGraphqlQuery({
            operationParams,
            operationName,
            operationType,
            operations,
            options,
        });

        return await fetchRawGraphql(url, graphqlQuery, options);
    }

    return fetchGraphql as unknown as GraphqlFetcher<Resolvers>;
}
