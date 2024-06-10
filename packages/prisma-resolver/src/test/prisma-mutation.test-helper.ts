import {runPrismaMutationOperation} from '../resolver/mutations/prisma-mutation-operation';
import {ResolverTests} from './resolver-test-case.test-helper';

export const prismaMutationTests: ResolverTests = {
    describe: runPrismaMutationOperation.name,
    cases: [
        {
            it: 'rejects if all args are missing',
            async test({prismaClient}) {
                return runPrismaMutationOperation({
                    graphqlArgs: {},
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {select: {}},
                });
            },
            throws: 'At least one mutation arg must be provided: create, update, or upsert',
        },
        {
            it: 'errors in upsert command',
            async test({prismaClient}) {
                return runPrismaMutationOperation({
                    graphqlArgs: {
                        upsert: {},
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {select: {}},
                });
            },
            throws: "Missing valid 'upsert.data' input",
        },
        {
            it: 'errors in create command',
            async test({prismaClient}) {
                return runPrismaMutationOperation({
                    graphqlArgs: {
                        create: {},
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {select: {}},
                });
            },
            throws: "Missing valid 'create.data' input.",
        },
        {
            it: 'errors in update command',
            async test({prismaClient}) {
                return runPrismaMutationOperation({
                    graphqlArgs: {
                        update: {},
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {select: {}},
                });
            },
            throws: "Missing valid 'update.data' input.",
        },
    ],
};
