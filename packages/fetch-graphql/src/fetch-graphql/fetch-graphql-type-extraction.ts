import {OperationType} from '@prisma-to-graphql/core';
import {FetchGraphqlParams, GraphqlFetcher} from './fetch-graphql.js';
import {GraphqlOperations} from './type-transforms/operations.js';
import {AvailableOperationTypes, BaseResolvers} from './type-transforms/resolvers.js';

/**
 * Extracts the allowed `operations` input for a created {@link GraphqlFetcher} function and a given
 * `OperationType`.
 *
 * @category Types
 */
export type Operations<
    FetchGraphql extends GraphqlFetcher<any>,
    ThisOperationType extends OperationType,
> =
    FetchGraphql extends GraphqlFetcher<infer Resolvers extends Readonly<BaseResolvers>>
        ? ThisOperationType extends AvailableOperationTypes<Resolvers>
            ? Readonly<GraphqlOperations<Resolvers, ThisOperationType>>
            : `ERROR: the provided operation type ${ThisOperationType} is not available in your schema.`
        : 'ERROR: failed to extract Resolvers type parameter from GraphqlFetcher';

/**
 * Extracts the allowed `params` input for a created {@link GraphqlFetcher} function.
 *
 * @category Types
 */
export type FetchParams<FetchGraphql extends GraphqlFetcher<any>> =
    FetchGraphql extends GraphqlFetcher<infer Resolvers extends Readonly<BaseResolvers>>
        ? Readonly<FetchGraphqlParams<Resolvers, AvailableOperationTypes<Resolvers>>>
        : 'ERROR: failed to extract Resolvers type parameter from GraphqlFetcher';
