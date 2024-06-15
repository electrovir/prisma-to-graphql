import {outputMessages} from '@prisma-to-graphql/resolver-context';
import {runPrismaMutationOperation} from '../mutations/prisma-mutation-operation';
import {resolverSeedData} from './resolver-seed-data.mock';
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
            throws: outputMessages.byDescription['invalid input'].message({
                inputName: 'upsert.data',
            }),
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
            throws: outputMessages.byDescription['invalid input'].message({
                inputName: 'create.data',
            }),
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
            throws: outputMessages.byDescription['invalid input'].message({
                inputName: 'update.data',
            }),
        },
        {
            it: 'notifies about ignored arguments on upsert',
            async test({prismaClient}) {
                return await runPrismaMutationOperation({
                    graphqlArgs: {
                        upsert: {
                            data: {
                                firstName: 'updated',
                            },
                            where: {
                                email: resolverSeedData.basic.email,
                            },
                        },
                        create: {
                            data: [
                                {
                                    ...resolverSeedData.admin,
                                    email: 'another-admin@example.com',
                                },
                            ],
                        },
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
                        delete: {},
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
                messages: [
                    outputMessages.byDescription['mutation input ignored'].create({
                        create: true,
                        delete: true,
                        update: true,
                        upsert: false,
                    }),
                ],
                total: 1,
            },
        },
        {
            it: 'notifies about ignored arguments on create',
            async test({prismaClient}) {
                return await runPrismaMutationOperation({
                    graphqlArgs: {
                        create: {
                            data: [
                                {
                                    ...resolverSeedData.admin,
                                    email: 'another-admin@example.com',
                                },
                            ],
                        },
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
                        delete: {},
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            total: true,
                        },
                    },
                });
            },
            expect: {
                total: 1,
                messages: [
                    outputMessages.byDescription['mutation input ignored'].create({
                        create: false,
                        delete: true,
                        update: true,
                        upsert: false,
                    }),
                ],
                items: [],
            },
        },
        {
            it: 'runs creation',
            async test({prismaClient}) {
                return await runPrismaMutationOperation({
                    graphqlArgs: {
                        create: {
                            data: [
                                {
                                    ...resolverSeedData.admin,
                                    email: 'another-admin@example.com',
                                },
                            ],
                        },
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            total: true,
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
            it: 'fails on delete',
            async test({prismaClient}) {
                return await runPrismaMutationOperation({
                    graphqlArgs: {
                        delete: {},
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            total: true,
                        },
                    },
                });
            },
            throws: outputMessages.byDescription['not yet implemented'].message({
                name: 'delete resolver',
            }),
        },
        {
            it: 'fails on delete',
            async test({prismaClient}) {
                return await runPrismaMutationOperation({
                    graphqlArgs: {
                        delete: {
                            where: {
                                regions: {
                                    some: {
                                        regionName: {
                                            equals: 'USA',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    context: {
                        prismaClient,
                        operationScope: {
                            maxDepth: 2,
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
            throws: outputMessages.byDescription['max depth violated'].message({
                depth: 5,
                maxDepth: 2,
                capitalizedName: 'Delete data',
            }),
        },
        {
            it: 'notifies about ignored arguments on update',
            async test({prismaClient}) {
                return await runPrismaMutationOperation({
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
                        delete: {},
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
                items: [],
                messages: [
                    outputMessages.byDescription['mutation input ignored'].create({
                        create: false,
                        delete: true,
                        update: false,
                        upsert: false,
                    }),
                ],
                total: 1,
            },
        },
        {
            it: 'rejects creation data that is too deep',
            async test({prismaClient}) {
                return await runPrismaMutationOperation({
                    graphqlArgs: {
                        create: {
                            data: [
                                {
                                    email: 'truncated-1@example.com',
                                    regions: {
                                        create: {
                                            regionName: 'hi',
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    context: {
                        prismaClient,
                        operationScope: {
                            maxDepth: 2,
                        },
                    },
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            total: true,
                            items: {
                                select: {
                                    email: true,
                                },
                            },
                            messages: {
                                select: {
                                    code: true,
                                    description: true,
                                    message: true,
                                },
                            },
                        },
                    },
                });
            },
            throws: outputMessages.byDescription['max depth violated'].message({
                depth: 5,
                maxDepth: 2,
                capitalizedName: 'Create data',
            }),
        },
    ],
};
