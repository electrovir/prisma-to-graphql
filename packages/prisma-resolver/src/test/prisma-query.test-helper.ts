import {randomString} from '@augment-vir/common';
import {outputMessages} from '@prisma-to-graphql/resolver-context';
import {runPrismaQuery} from '../queries/prisma-query-operation';
import {generatedModels} from './generated-models.mock';
import {ResolverTests} from './resolver-test-case.test-helper';

export const prismaQueryTests: ResolverTests = {
    describe: runPrismaQuery.name,
    cases: [
        {
            it: 'does not calculate total if not selected',
            async test({prismaClient}) {
                return await runPrismaQuery({
                    graphqlArgs: {
                        where: {
                            role: {
                                equals: 'user',
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
                                    phoneNumber: true,
                                    email: true,
                                    role: true,
                                },
                            },
                        },
                    },
                });
            },
            expect: {
                total: 0,
                messages: [],
                items: [
                    {
                        email: 'basic@example.com',
                        firstName: 'Basic',
                        lastName: 'McGee',
                        phoneNumber: '12345678900',
                        role: 'user',
                    },
                    {
                        email: 'super-liked@example.com',
                        firstName: 'Super',
                        lastName: 'Liked',
                        phoneNumber: '12345678900',
                        role: 'user',
                    },
                ],
            },
        },
        {
            it: 'rejects a where that is too deep',
            async test({prismaClient}) {
                return await runPrismaQuery({
                    graphqlArgs: {
                        where: {
                            regions: {
                                some: {
                                    users: {
                                        some: {
                                            firstName: {
                                                equals: 'hi',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    context: {
                        prismaClient,
                        operationScope: {
                            maxDepth: {
                                read: 3,
                            },
                        },
                    },
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            items: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    phoneNumber: true,
                                    email: true,
                                    role: true,
                                },
                            },
                        },
                    },
                });
            },
            throws: outputMessages.byDescription['max depth violated'].message({
                depth: 6,
                maxDepth: 3,
                capitalizedName: 'Query "where"',
            }),
        },
        {
            it: 'handles missing where',
            async test({prismaClient}) {
                return await runPrismaQuery({
                    graphqlArgs: {},
                    context: {
                        prismaClient,
                        models: generatedModels,
                        operationScope: {
                            where: {
                                User: {
                                    firstName: {equals: 'Basic'},
                                },
                            },
                        },
                    },
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            items: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    phoneNumber: true,
                                    email: true,
                                    role: true,
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
                        role: 'user',
                    },
                ],
                messages: [],
                total: 0,
            },
        },
        {
            it: 'handles irrelevant operation scope',
            async test({prismaClient}) {
                return await runPrismaQuery({
                    graphqlArgs: {},
                    context: {
                        prismaClient,
                        models: generatedModels,
                        operationScope: {
                            where: {
                                User: {},
                            },
                        },
                    },
                    prismaModelName: 'Region',
                    selection: {
                        select: {
                            items: {
                                select: {
                                    regionName: true,
                                    users: {
                                        select: {
                                            firstName: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
            },
            expect: {
                items: [
                    {
                        regionName: 'Fake',
                        users: [
                            {
                                firstName: 'Basic',
                            },
                        ],
                    },
                ],
                messages: [],
                total: 0,
            },
        },
        {
            it: 'handles irrelevant operation scope with a where',
            async test({prismaClient}) {
                return await runPrismaQuery({
                    graphqlArgs: {
                        where: {
                            regionName: {equals: 'Fake'},
                        },
                    },
                    context: {
                        prismaClient,
                        models: generatedModels,
                        operationScope: {
                            where: {
                                User: {},
                            },
                        },
                    },
                    prismaModelName: 'Region',
                    selection: {
                        select: {
                            items: {
                                select: {
                                    regionName: true,
                                    users: {
                                        select: {
                                            firstName: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
            },
            expect: {
                items: [
                    {
                        regionName: 'Fake',
                        users: [
                            {
                                firstName: 'Basic',
                            },
                        ],
                    },
                ],
                messages: [],
                total: 0,
            },
        },
        {
            it: 'handles relevant operation scope with a where',
            async test({prismaClient}) {
                return await runPrismaQuery({
                    graphqlArgs: {
                        where: {
                            regionName: {equals: 'Fake'},
                        },
                    },
                    context: {
                        prismaClient,
                        models: generatedModels,
                        operationScope: {
                            where: {
                                User: {
                                    firstName: {equals: 'Basic'},
                                },
                            },
                        },
                    },
                    prismaModelName: 'Region',
                    selection: {
                        select: {
                            items: {
                                select: {
                                    regionName: true,
                                    users: {
                                        select: {
                                            firstName: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
            },
            expect: {
                items: [
                    {
                        regionName: 'Fake',
                        users: [
                            {
                                firstName: 'Basic',
                            },
                        ],
                    },
                ],
                messages: [],
                total: 0,
            },
        },
        {
            it: 'does not return query items if not selected',
            async test({prismaClient}) {
                return await runPrismaQuery({
                    graphqlArgs: {
                        where: {
                            role: {
                                equals: 'user',
                            },
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
                total: 2,
                messages: [],
                items: [],
            },
        },
        {
            it: 'calculates total when selected',
            async test({prismaClient}) {
                return await runPrismaQuery({
                    graphqlArgs: {
                        where: {
                            role: {
                                equals: 'user',
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
                        },
                    },
                });
            },
            expect: {
                total: 0,
                messages: [],
                items: [
                    {
                        email: 'basic@example.com',
                        firstName: 'Basic',
                        lastName: 'McGee',
                        role: 'user',
                    },
                    {
                        email: 'super-liked@example.com',
                        firstName: 'Super',
                        lastName: 'Liked',
                        role: 'user',
                    },
                ],
            },
        },
        {
            it: 'supports a cursor',
            async test({prismaClient}) {
                const firstUser = await prismaClient.user.findFirstOrThrow({
                    orderBy: {
                        firstName: {
                            sort: 'asc',
                        },
                    },
                    select: {
                        firstName: true,
                        id: true,
                    },
                });

                return await runPrismaQuery({
                    graphqlArgs: {
                        orderBy: {
                            firstName: {
                                sort: 'asc',
                            },
                        },
                        cursor: {
                            id: firstUser.id,
                        },
                        take: 2,
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            total: true,
                            items: {
                                select: {
                                    firstName: true,
                                },
                            },
                        },
                    },
                });
            },
            expect: {
                total: 4,
                messages: [],
                items: [
                    {
                        firstName: 'Has',
                    },
                    {
                        firstName: 'Over',
                    },
                ],
            },
        },
        {
            it: 'fails on an invalid cursor',
            async test({prismaClient}) {
                return await runPrismaQuery({
                    graphqlArgs: {
                        orderBy: {
                            firstName: {
                                sort: 'asc',
                            },
                        },
                        cursor: 'this should be an object',
                        take: 2,
                    },
                    context: {prismaClient},
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            total: true,
                            items: {
                                select: {
                                    firstName: true,
                                    id: true,
                                },
                            },
                        },
                    },
                });
            },
            throws: 'Invalid value provided. Expected UserWhereUniqueInput, provided String.',
        },
        {
            it: 'limits by specific operation scope max',
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

                return await runPrismaQuery({
                    graphqlArgs: {
                        where: {
                            role: {
                                equals: 'user',
                            },
                        },
                        orderBy: {
                            createdAt: 'asc',
                        },
                    },
                    context: {
                        prismaClient,
                        operationScope: {
                            maxCount: {
                                query: 2,
                            },
                        },
                    },
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            total: true,
                            items: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    phoneNumber: true,
                                    email: true,
                                    role: true,
                                },
                            },
                        },
                    },
                });
            },
            expect: {
                total: 12,
                messages: [
                    {
                        code: 'ptg-2',
                        description: 'query results truncated',
                        message:
                            'ptg-2: Query results were truncated to the first 2 entries. Please use pagination to split your query up.',
                    },
                ],
                items: [
                    {
                        email: 'basic@example.com',
                        firstName: 'Basic',
                        lastName: 'McGee',
                        phoneNumber: '12345678900',
                        role: 'user',
                    },
                    {
                        email: 'super-liked@example.com',
                        firstName: 'Super',
                        lastName: 'Liked',
                        phoneNumber: '12345678900',
                        role: 'user',
                    },
                ],
            },
        },
        {
            it: 'limits by general operation scope max',
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

                return await runPrismaQuery({
                    graphqlArgs: {
                        where: {
                            role: {
                                equals: 'user',
                            },
                        },
                        orderBy: {
                            createdAt: 'asc',
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
                                    firstName: true,
                                    lastName: true,
                                    phoneNumber: true,
                                    email: true,
                                    role: true,
                                },
                            },
                        },
                    },
                });
            },
            expect: {
                total: 12,
                messages: [
                    {
                        code: 'ptg-2',
                        description: 'query results truncated',
                        message:
                            'ptg-2: Query results were truncated to the first 2 entries. Please use pagination to split your query up.',
                    },
                ],
                items: [
                    {
                        email: 'basic@example.com',
                        firstName: 'Basic',
                        lastName: 'McGee',
                        phoneNumber: '12345678900',
                        role: 'user',
                    },
                    {
                        email: 'super-liked@example.com',
                        firstName: 'Super',
                        lastName: 'Liked',
                        phoneNumber: '12345678900',
                        role: 'user',
                    },
                ],
            },
        },
        {
            it: 'ignores unreached operation scope max',
            async test({prismaClient}) {
                return await runPrismaQuery({
                    graphqlArgs: {
                        where: {
                            role: {
                                equals: 'user',
                            },
                        },
                        orderBy: {
                            createdAt: 'asc',
                        },
                    },
                    context: {
                        prismaClient,
                        operationScope: {
                            maxCount: {
                                query: 20,
                            },
                        },
                    },
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            total: true,
                            items: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    phoneNumber: true,
                                    email: true,
                                    role: true,
                                },
                            },
                        },
                    },
                });
            },
            expect: {
                total: 2,
                messages: [],
                items: [
                    {
                        email: 'basic@example.com',
                        firstName: 'Basic',
                        lastName: 'McGee',
                        phoneNumber: '12345678900',
                        role: 'user',
                    },
                    {
                        email: 'super-liked@example.com',
                        firstName: 'Super',
                        lastName: 'Liked',
                        phoneNumber: '12345678900',
                        role: 'user',
                    },
                ],
            },
        },
        {
            it: 'ignores operation scope max if take is smaller',
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

                return await runPrismaQuery({
                    graphqlArgs: {
                        where: {
                            role: {
                                equals: 'user',
                            },
                        },
                        orderBy: {
                            createdAt: 'asc',
                        },
                        take: 2,
                    },
                    context: {
                        prismaClient,
                        operationScope: {
                            maxCount: {
                                query: 5,
                            },
                        },
                    },
                    prismaModelName: 'User',
                    selection: {
                        select: {
                            total: true,
                            items: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    phoneNumber: true,
                                    email: true,
                                    role: true,
                                },
                            },
                        },
                    },
                });
            },
            expect: {
                total: 12,
                messages: [],
                items: [
                    {
                        email: 'basic@example.com',
                        firstName: 'Basic',
                        lastName: 'McGee',
                        phoneNumber: '12345678900',
                        role: 'user',
                    },
                    {
                        email: 'super-liked@example.com',
                        firstName: 'Super',
                        lastName: 'Liked',
                        phoneNumber: '12345678900',
                        role: 'user',
                    },
                ],
            },
        },
    ],
};
