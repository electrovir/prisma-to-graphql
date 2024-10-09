import {isTruthy} from '@augment-vir/common';
import {
    OutputMessage,
    assertValidMaxDepth,
    outputMessages,
} from '@prisma-to-graphql/resolver-context';
import {GraphQLError} from 'graphql';
import {PrismaResolverInputs, PrismaResolverOutput} from '../prisma-resolver';
import {runPrismaCreate} from './prisma-create-operation';
import {runPrismaDelete} from './prisma-delete-operation';
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
    const deleteArg = params.graphqlArgs.delete;

    if (upsertArg) {
        assertValidMaxDepth({
            data: upsertArg,
            operation: 'write',
            scope: params.context.operationScope,
            capitalizedDataName: 'Upsert data',
        });
        const result = await runPrismaUpsert(params);
        return {
            ...result,
            messages: [
                ...result.messages,
                createIgnoredInputsMessages({
                    createArg,
                    deleteArg,
                    updateArg,
                }),
            ].filter(isTruthy),
        };
    } else if (createArg) {
        assertValidMaxDepth({
            data: createArg,
            operation: 'write',
            scope: params.context.operationScope,
            capitalizedDataName: 'Create data',
        });
        const result = await runPrismaCreate(params);
        return {
            ...result,
            messages: [
                ...result.messages,
                createIgnoredInputsMessages({
                    deleteArg,
                    updateArg,
                    upsertArg,
                }),
            ].filter(isTruthy),
        };
    } else if (updateArg) {
        assertValidMaxDepth({
            data: updateArg,
            operation: 'write',
            scope: params.context.operationScope,
            capitalizedDataName: 'Update data',
        });
        const result = await runPrismaUpdate(params);
        return {
            ...result,
            messages: [
                ...result.messages,
                createIgnoredInputsMessages({
                    createArg,
                    deleteArg,
                    upsertArg,
                }),
            ].filter(isTruthy),
        };
    } else if (deleteArg) {
        assertValidMaxDepth({
            data: deleteArg,
            operation: 'write',
            scope: params.context.operationScope,
            capitalizedDataName: 'Delete data',
        });
        const result = await runPrismaDelete(params);
        return {
            ...result,
            messages: [
                ...result.messages,
                createIgnoredInputsMessages({
                    createArg,
                    updateArg,
                    upsertArg,
                }),
            ].filter(isTruthy),
        };
    } else {
        throw new GraphQLError(outputMessages.byDescription['missing mutation args'].message());
    }
}

function createIgnoredInputsMessages(
    args: Partial<{
        upsertArg: unknown;
        createArg: unknown;
        updateArg: unknown;
        deleteArg: unknown;
    }>,
): OutputMessage | undefined {
    if (!Object.values(args).some(isTruthy)) {
        return undefined;
    }

    return outputMessages.byDescription['mutation input ignored'].create({
        create: !!args.createArg,
        delete: !!args.deleteArg,
        update: !!args.updateArg,
        upsert: !!args.upsertArg,
    });
}
