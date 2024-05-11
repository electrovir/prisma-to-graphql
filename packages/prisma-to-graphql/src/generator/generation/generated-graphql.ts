import {
    GraphqlBlockByType,
    TopLevelNamedGraphqlBlock,
} from '../../builders/graphql-builder/graphql-block';
import {OperationType} from '../../builders/operation-type';
import {ResolverBlock} from '../../builders/resolver-builder/resolver-block';

/**
 * Generated GraphQL blocks which will eventually be combined to form the complete GraphQL schema.
 *
 * @category Prisma Generator
 */
export type GeneratedGraphql = {
    topLevelNamedGraphqlBlocks: TopLevelNamedGraphqlBlock[];
    /** Standard graphql blocks. */
    resolverBlocks: GraphqlBlockByType<OperationType>[];
    resolvers: ResolverBlock[];
};
