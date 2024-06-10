import {randomString} from '@augment-vir/common';
import {runPrismaUpsert} from '../resolver/mutations/prisma-upsert-operation';
import {resolverSeedData} from './resolver-seed-data.mock';
import {ResolverTests} from './resolver-test-case.test-helper';

export const prismaUpsertTests: ResolverTests = {
    describe: runPrismaUpsert.name,
    cases: [
        {
            it: 'updates an existing entry',
            async test({prismaClient}) {
                return await runPrismaUpsert({
                    graphqlArgs: {
                        upsert: {
                            data: {
                                firstName: 'updated',
                            },
                            where: {
                                email: resolverSeedData.basic.email,
                            },
                        },
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            items: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                },
                            },
                            count: true,
                        },
                    },
                });
            },
            expect: {
                items: [
                    {
                        firstName: 'updated',
                        lastName: 'McGee',
                        email: resolverSeedData.basic.email,
                    },
                ],
                messages: [],
                total: 1,
            },
        },
        {
            it: 'creates a new entry',
            async test({prismaClient}) {
                return await runPrismaUpsert({
                    graphqlArgs: {
                        upsert: {
                            data: {
                                firstName: 'new user',
                            },
                            where: {
                                email: 'new-email@example.com',
                            },
                        },
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            items: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    role: true,
                                },
                            },
                            count: true,
                        },
                    },
                });
            },
            expect: {
                items: [
                    {
                        firstName: 'new user',
                        lastName: null,
                        role: null,
                        email: 'new-email@example.com',
                    },
                ],
                messages: [],
                total: 1,
            },
        },
        {
            it: 'fails creating a new entry without required unique fields',
            async test({prismaClient}) {
                return await runPrismaUpsert({
                    graphqlArgs: {
                        upsert: {
                            data: {
                                firstName: 'new user',
                            },
                            where: {},
                        },
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            items: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    role: true,
                                },
                            },
                            count: true,
                        },
                    },
                });
            },
            throws: 'Argument `where` needs at least one of `id` or `email` arguments.',
        },
        {
            it: 'fails if no data',
            async test({prismaClient}) {
                return await runPrismaUpsert({
                    graphqlArgs: {
                        upsert: {
                            where: {},
                        },
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            items: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    role: true,
                                },
                            },
                            count: true,
                        },
                    },
                });
            },
            throws: "Missing valid 'upsert.data' input",
        },
        {
            it: 'fails if no where',
            async test({prismaClient}) {
                return await runPrismaUpsert({
                    graphqlArgs: {
                        upsert: {
                            data: {},
                        },
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            items: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    role: true,
                                },
                            },
                            count: true,
                        },
                    },
                });
            },
            throws: "Missing valid 'upsert.where' input",
        },
        {
            it: 'omits items if not selected',
            async test({prismaClient}) {
                return await runPrismaUpsert({
                    graphqlArgs: {
                        upsert: {
                            data: {
                                firstName: 'updated 2',
                            },
                            where: {
                                email: resolverSeedData.basic.email,
                            },
                        },
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            count: true,
                        },
                    },
                });
            },
            expect: {
                total: 1,
                messages: [],
                items: [],
            },
        },
        {
            it: 'rejects upsert with too much data and general operation scope',
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

                return await runPrismaUpsert({
                    graphqlArgs: {
                        upsert: {
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
                    selection: {
                        select: {
                            total: true,
                        },
                    },
                });
            },
            throws: 'ptg-3: Update failed. The given query would update 12 rows but the max is 2. Please provide a tighter "where" argument.',
        },
        {
            it: 'rejects upsert with too much data and specific operation scope',
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

                return await runPrismaUpsert({
                    graphqlArgs: {
                        upsert: {
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
                    selection: {
                        select: {
                            total: true,
                        },
                    },
                });
            },
            throws: 'ptg-3: Update failed. The given query would update 12 rows but the max is 2. Please provide a tighter "where" argument.',
        },
        {
            it: 'accepts upsert with unreached operation scope max',
            async test({prismaClient}) {
                return await runPrismaUpsert({
                    graphqlArgs: {
                        upsert: {
                            data: {
                                firstName: 'updated 2',
                            },
                            where: {
                                email: resolverSeedData.basic.email,
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
                    selection: {
                        select: {
                            total: true,
                        },
                    },
                });
            },
            expect: {
                items: [],
                messages: [],
                total: 1,
            },
        },
    ],
};
