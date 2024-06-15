import {randomString} from '@augment-vir/common';
import {outputMessages} from '@prisma-to-graphql/resolver-context';
import {runPrismaUpdate} from '../mutations/prisma-update-operation';
import {ResolverTests} from './resolver-test-case.test-helper';

export const prismaUpdateTests: ResolverTests = {
    describe: runPrismaUpdate.name,
    cases: [
        {
            it: 'updates an existing value',
            async test({prismaClient}) {
                return await runPrismaUpdate({
                    graphqlArgs: {
                        update: {
                            where: {
                                lastName: {
                                    contains: 'Gee',
                                },
                            },
                            data: {
                                phoneNumber: 'invalid number',
                            },
                        },
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                });
            },
            expect: {
                items: [],
                messages: [],
                total: 1,
            },
        },
        {
            it: 'rejects missing where for update',
            async test({prismaClient}) {
                return await runPrismaUpdate({
                    graphqlArgs: {
                        update: {
                            data: {
                                phoneNumber: 'invalid number',
                            },
                        },
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                });
            },
            throws: outputMessages.byDescription['invalid input'].message({
                inputName: 'update.where',
            }),
        },
        {
            it: 'rejects missing data',
            async test({prismaClient}) {
                return await runPrismaUpdate({
                    graphqlArgs: {
                        update: {
                            where: {
                                lastName: {
                                    contains: 'Gee',
                                },
                            },
                        },
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                });
            },
            throws: outputMessages.byDescription['invalid input'].message({
                inputName: 'update.data',
            }),
        },
        {
            it: 'rejects too much data from general operation scope',
            async test({prismaClient}) {
                await prismaClient.user.createMany({
                    data: Array(10)
                        .fill(0)
                        .map(() => {
                            return {
                                email: randomString(),
                                role: 'user',
                            };
                        }),
                });

                return await runPrismaUpdate({
                    graphqlArgs: {
                        update: {
                            where: {
                                role: {
                                    equals: 'user',
                                },
                            },
                            data: {
                                phoneNumber: 'invalid number',
                            },
                        },
                    },
                    context: {
                        prismaClient,
                        operationScope: {
                            maxCount: 2,
                        },
                    },
                    prismaModelName: 'User',
                });
            },
            throws: 'ptg-3: Update failed. The given query would update 12 rows but the max is 2. Please provide a tighter "where" argument.',
        },
        {
            it: 'rejects too much data from specific operation scope',
            async test({prismaClient}) {
                await prismaClient.user.createMany({
                    data: Array(10)
                        .fill(0)
                        .map(() => {
                            return {
                                email: randomString(),
                                role: 'user',
                            };
                        }),
                });

                return await runPrismaUpdate({
                    graphqlArgs: {
                        update: {
                            where: {
                                role: {
                                    equals: 'user',
                                },
                            },
                            data: {
                                phoneNumber: 'invalid number',
                            },
                        },
                    },
                    context: {
                        prismaClient,
                        operationScope: {
                            maxCount: {
                                update: 2,
                            },
                        },
                    },
                    prismaModelName: 'User',
                });
            },
            throws: 'ptg-3: Update failed. The given query would update 12 rows but the max is 2. Please provide a tighter "where" argument.',
        },
        {
            it: 'accepts update with unreached operation scope max',
            async test({prismaClient}) {
                return await runPrismaUpdate({
                    graphqlArgs: {
                        update: {
                            where: {
                                role: {
                                    equals: 'user',
                                },
                            },
                            data: {
                                phoneNumber: 'invalid number',
                            },
                        },
                    },
                    context: {
                        prismaClient,
                        operationScope: {
                            maxCount: {
                                update: 20,
                            },
                        },
                    },
                    prismaModelName: 'User',
                });
            },
            expect: {
                items: [],
                messages: [],
                total: 2,
            },
        },
    ],
};
