import {ArrayElement} from '@augment-vir/common';
import {OperationType} from '../operation-type';

/**
 * All resolver building blocks, used to generate the resolver TypeScript code.
 *
 * @category Builders
 */
export type ResolverBlock =
    | {
          /**
           * A generic resolver, with an arbitrary function body. Note that `'prisma'` type resolver
           * are preferred. Use `ResolverBodyVars` to read resolver input variables.
           */
          type: 'generic';
          resolverName: string;
          operationType: OperationType;
          body: string;
      }
    | {
          /** A resolver that maps directly to a prisma operation. */
          type: 'prisma';
          resolverName: string;
          operationType: OperationType;
          prismaModelName: string;
      };

/**
 * Names of all the variables that resolvers can access within their bodies if they wish to do so.
 *
 * @category Builders
 */
export enum ResolverBodyVarNames {
    context = 'context',
    graphqlArgs = 'graphqlArgs',
    parentValue = 'parentValue',
    resolveInfo = 'resolveInfo',
    runPrismaResolver = 'runPrismaResolver',
}

/**
 * These correspond exactly to the order in which the args are passed into GraphQL resolvers,
 * defined by the GraphQL spec: https://graphql.org/learn/execution/#root-fields--resolvers
 *
 * @category Builders
 */
export const orderedResolverInputVars = [
    ResolverBodyVarNames.parentValue,
    ResolverBodyVarNames.graphqlArgs,
    ResolverBodyVarNames.context,
    ResolverBodyVarNames.resolveInfo,
] satisfies ResolverBodyVarNames[];

/**
 * The type strings for each of the resolver inputs.
 *
 * @category Builders
 */
export const resolverInputVarTypes: Record<
    ArrayElement<typeof orderedResolverInputVars>,
    string
> = {
    [ResolverBodyVarNames.parentValue]: 'unknown',
    [ResolverBodyVarNames.graphqlArgs]: 'unknown',
    [ResolverBodyVarNames.context]: 'any',
    [ResolverBodyVarNames.resolveInfo]: 'GraphQLResolveInfo',
};

/**
 * All the resolver block type strings.
 *
 * @category Builders
 */
export type ResolverBlockType = ResolverBlock['type'];

/**
 * Extracts the resolver block by the given resolver block type string.
 *
 * @category Builders
 */
export type ResolverBlockByType<BlockType extends ResolverBlockType> = Exclude<
    ResolverBlock,
    {type: Exclude<ResolverBlockType, BlockType>}
>;
