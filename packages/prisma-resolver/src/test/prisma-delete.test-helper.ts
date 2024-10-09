import {randomString} from '@augment-vir/common';
import {outputMessages} from '@prisma-to-graphql/resolver-context';
import {runPrismaDelete} from '../mutations/prisma-delete-operation';
import {ResolverTests} from './resolver-test-case.test-helper';

export const prismaDeleteTests: ResolverTests = {
    describe: runPrismaDelete.name,
    cases: [
        {
            it: 'updates an existing value',
            async test({prismaClient}) {
                return await runPrismaDelete({
                    graphqlArgs: {
                        delete: {
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
            expect: {
                items: [],
                messages: [],
                total: 1,
            },
        },
        {
            it: 'rejects missing where for update',
            async test({prismaClient}) {
                return await runPrismaDelete({
                    graphqlArgs: {
                        delete: {},
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                });
            },
            throws: outputMessages.byDescription['invalid input'].message({
                inputName: 'delete.where',
            }),
        },
        {
            it: 'rejects too many deletes from general operation scope',
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

                return await runPrismaDelete({
                    graphqlArgs: {
                        delete: {
                            where: {
                                role: {
                                    equals: 'user',
                                },
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
            throws: 'ptg-12: Delete failed. The given query would delete 12 rows but the max is 2. Please provide a tighter "where" argument.',
        },
        {
            it: 'rejects too many deletes from specific operation scope',
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

                return await runPrismaDelete({
                    graphqlArgs: {
                        delete: {
                            where: {
                                role: {
                                    equals: 'user',
                                },
                            },
                        },
                    },
                    context: {
                        prismaClient,
                        operationScope: {
                            maxCount: {
                                delete: 2,
                            },
                        },
                    },
                    prismaModelName: 'User',
                });
            },
            throws: 'ptg-12: Delete failed. The given query would delete 12 rows but the max is 2. Please provide a tighter "where" argument.',
        },
        {
            it: 'accepts delete with unreached operation scope max',
            async test({prismaClient}) {
                return await runPrismaDelete({
                    graphqlArgs: {
                        delete: {
                            where: {
                                role: {
                                    equals: 'user',
                                },
                            },
                        },
                    },
                    context: {
                        prismaClient,
                        operationScope: {
                            maxCount: {
                                delete: 20,
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
