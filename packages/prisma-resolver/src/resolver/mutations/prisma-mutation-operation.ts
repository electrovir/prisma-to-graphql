import {GraphQLError} from 'graphql';
import {PrismaResolverInputs, PrismaResolverOutput} from '../prisma-resolver';
import {runCreate} from './prisma-create-operation';
import {runUpdate} from './prisma-update-operation';
import {runUpsert} from './prisma-upsert-operation';

/**
 * Decides which CRUD resolver to use based on the given graphql args.
 *
 * - An `upsert` arg triggers the upsert resolver.
 * - A `create` arg triggers the create resolver.
 * - An `update` arg triggers the update resolver.
 *
 * (in that order)
 *
 * @category Operations
 */
export async function runPrismaMutationOperation(
    params: Readonly<PrismaResolverInputs>,
): Promise<PrismaResolverOutput> {
    const upsertArg = params.graphqlArgs.upsert;
    const createArg = params.graphqlArgs.create;
    const updateArg = params.graphqlArgs.update;

    if (upsertArg) {
        return await runUpsert(params);
    } else if (createArg) {
        return await runCreate(params);
    } else if (updateArg) {
        return await runUpdate(params);
    } else {
        throw new GraphQLError(
            'At least one mutation arg must be provided: create, update, or upsert.',
        );
    }
}
