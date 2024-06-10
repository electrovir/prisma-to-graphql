import {GraphQLError} from 'graphql';
import {PrismaResolverInputs, PrismaResolverOutput} from '../prisma-resolver';
import {runPrismaCreate} from './prisma-create-operation';
import {runPrismaUpdate} from './prisma-update-operation';
import {runPrismaUpsert} from './prisma-upsert-operation';

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
    params: Readonly<PrismaResolverInputs<any, any>>,
): Promise<PrismaResolverOutput> {
    const upsertArg = params.graphqlArgs.upsert;
    const createArg = params.graphqlArgs.create;
    const updateArg = params.graphqlArgs.update;

    if (upsertArg) {
        return await runPrismaUpsert(params);
    } else if (createArg) {
        return await runPrismaCreate(params);
    } else if (updateArg) {
        return await runPrismaUpdate(params);
    } else {
        throw new GraphQLError(
            'At least one mutation arg must be provided: create, update, or upsert.',
        );
    }
}
