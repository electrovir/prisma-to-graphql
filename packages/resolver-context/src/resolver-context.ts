/**
 * Note: this file is symlinked to from the scripts package so it can be used when setting up test
 * GraphQL servers.
 */

import {FieldRequirements} from './field-requirements/field-requirements';
import {ModelMap} from './operation-scope/model-map';
import {OperationScope} from './operation-scope/operation-scope';

/**
 * The context object which `prisma-to-graphql` generated resolvers require and thus must be
 * attached to the containing GraphQL server.
 *
 * @category GraphQL Context
 */
export type ResolverContext<PrismaClient, Models extends Readonly<ModelMap>> = {
    prismaClient: PrismaClient;
    models?: ModelMap | undefined;
    operationScope?: NoInfer<OperationScope<Models>> | undefined;
    fieldRequirements?: NoInfer<FieldRequirements<Models>>;
};

/**
 * A simple helper function that makes it easier to write a type-safe GraphQL context object for
 * `prisma-to-graphql`'s resolvers. Using this function is not necessary to write a proper context
 * object, but it makes it a little bit easier.
 *
 * @category GraphQL Context
 */
export function definePrismaToGraphqlResolverContext<
    const PrismaClient,
    const Models extends Readonly<ModelMap>,
>(
    models: Readonly<Models>,
    context: Omit<Readonly<ResolverContext<PrismaClient, Models>>, 'models'>,
): ResolverContext<PrismaClient, Models> {
    return {
        ...context,
        models,
    };
}
