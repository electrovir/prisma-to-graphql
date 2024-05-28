/**
 * Note: this file is symlinked to from the scripts package so it can be used when setting up test
 * GraphQL servers.
 */

import {ModelMap} from './model-map';
import {OperationScope} from './operation-scope';

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
