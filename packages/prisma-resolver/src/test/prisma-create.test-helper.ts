import {outputMessages} from '@prisma-to-graphql/resolver-context';
import {runPrismaCreate} from '../mutations/prisma-create-operation';
import {resolverSeedData} from './resolver-seed-data.mock';
import {ResolverTests} from './resolver-test-case.test-helper';

export const prismaCreateTests: ResolverTests = {
    describe: runPrismaCreate.name,
    cases: [
        {
            it: 'creates multiple entries',
            skipSeeding: true,
            async test({prismaClient}) {
                return await runPrismaCreate({
                    graphqlArgs: {
                        create: {
                            data: Object.values(resolverSeedData),
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
                                    phoneNumber: true,
                                },
                            },
                        },
                    },
                });
            },
            expect: {
                items: [
                    {
                        email: 'basic@example.com',
                        firstName: 'Basic',
                        lastName: 'McGee',
                        phoneNumber: '12345678900',
                    },
                    {
                        email: 'has-id@example.com',
                        firstName: 'Has',
                        lastName: 'Id',
                        phoneNumber: '12345678900',
                    },
                    {
                        email: 'super-liked@example.com',
                        firstName: 'Super',
                        lastName: 'Liked',
                        phoneNumber: '12345678900',
                    },
                    {
                        email: 'admin@example.com',
                        firstName: 'Over',
                        lastName: 'Lord',
                        phoneNumber: '12345678900',
                    },
                ],
                messages: [],
                total: 4,
            },
        },
        {
            it: 'fails to create with a duplicate id',
            async test({prismaClient}) {
                return await runPrismaCreate({
                    graphqlArgs: {
                        create: {
                            data: [resolverSeedData.withId],
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
                                    phoneNumber: true,
                                },
                            },
                        },
                    },
                });
            },
            expect: {
                items: [],
                messages: [],
                total: 0,
            },
        },
        {
            it: 'rejects a non-object data entry',
            async test({prismaClient}) {
                return await runPrismaCreate({
                    graphqlArgs: {
                        create: {
                            data: ['invalid data'],
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
            throws: "Invalid data array entry at index '0': expected an object.",
        },
        {
            it: 'selects no items',
            async test({prismaClient}) {
                return await runPrismaCreate({
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
            it: 'rejects missing data',
            async test({prismaClient}) {
                return await runPrismaCreate({
                    graphqlArgs: {
                        create: {},
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {
                        select: {},
                    },
                });
            },
            throws: outputMessages.byDescription['invalid input'].message({
                inputName: 'create.data',
            }),
        },
        {
            it: 'truncates create data',
            async test({prismaClient}) {
                return await runPrismaCreate({
                    graphqlArgs: {
                        create: {
                            data: [
                                {
                                    email: 'truncated-1@example.com',
                                },
                                {
                                    email: 'truncated-2@example.com',
                                },
                                {
                                    email: 'truncated-3@example.com',
                                },
                                {
                                    email: 'truncated-4@example.com',
                                },
                                {
                                    email: 'truncated-5@example.com',
                                },
                            ],
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
            expect: {
                items: [
                    {
                        email: 'truncated-1@example.com',
                    },
                    {
                        email: 'truncated-2@example.com',
                    },
                ],
                messages: [
                    {
                        code: 'ptg-1',
                        description: 'create data truncated',
                        message:
                            'ptg-1: Create data was truncated to the first 2 entries. You can only create 2 entries at once. Please split up your creation query.',
                    },
                ],
                total: 2,
            },
        },
    ],
};
