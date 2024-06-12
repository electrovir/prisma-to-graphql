// @ts-ignore: this won't be generated until tests run at least once
import type {PrismaClient} from '.prisma';
// @ts-ignore: this won't be generated until tests run at least once
import type {Resolvers} from '.prisma/graphql/schema';

import {ArrayElement, assertLengthAtLeast, isUuid, omitObjectKeys} from '@augment-vir/common';
import {Operations, ResolverOutput, fetchRawGraphql} from '@prisma-to-graphql/fetch-graphql';
import {OperationScope} from '@prisma-to-graphql/operation-scope';
import {GraphqlTestCase, runGraphqlServerTests} from '@prisma-to-graphql/scripts';
import {assert} from 'chai';
import {createUtcFullDate} from 'date-vir';
import {assertDefined, assertRunTimeType, assertThrows, assertTypeOf} from 'run-time-assertions';
import {joinUrlParts} from 'url-vir';
import {setupTestServerConfig} from './full-run-time.test-helper';
import {graphqlServerHeaders} from './server-headers.mock';

const testCases: GraphqlTestCase<PrismaClient, Resolvers>[] = [
    {
        it: 'finds multiple users',
        async test({serverUrl, fetchGraphql}) {
            const graphqlFetchResult = await fetchGraphql(
                {
                    operationName: 'FindMultipleUsers',
                    // @ts-ignore: this won't be generated until tests run at least once
                    operationType: 'Query',
                    url: joinUrlParts(serverUrl, 'graphql'),
                },
                {
                    Users: {
                        args: {
                            where: {
                                role: {equals: 'user'},
                            },
                            orderBy: [
                                {
                                    firstName: {
                                        sort: 'asc',
                                    },
                                },
                            ],
                        },
                        select: {
                            total: true,
                            items: {
                                firstName: true,
                                settings: {
                                    receivesMarketingEmails: true,
                                    stats: {
                                        dislikes: true,
                                    },
                                },
                            },
                        },
                    },
                },
            );

            assertTypeOf(graphqlFetchResult).toMatchTypeOf<
                Readonly<{
                    Users: Readonly<{
                        total: number;
                        items: ReadonlyArray<
                            Readonly<{
                                firstName?: string | null | undefined;
                                settings?:
                                    | Readonly<{
                                          receivesMarketingEmails: boolean;
                                          stats?:
                                              | Readonly<{
                                                    dislikes: number;
                                                }>
                                              | null
                                              | undefined;
                                      }>
                                    | null
                                    | undefined;
                            }>
                        >;
                    }>;
                }>
            >();

            const users = (
                await fetchRawGraphql(joinUrlParts(serverUrl, 'graphql'), {
                    query: /* GraphQL */ `
                        query {
                            Users(
                                where: {role: {equals: "user"}}
                                orderBy: {firstName: {sort: asc}}
                            ) {
                                total
                                items {
                                    firstName
                                    settings {
                                        receivesMarketingEmails
                                        stats {
                                            dislikes
                                        }
                                    }
                                }
                            }
                        }
                    `,
                })
            ).Users;

            assert.deepStrictEqual(graphqlFetchResult.Users, users);

            assert.deepStrictEqual(users, {
                total: 4,
                items: [
                    {
                        firstName: 'Derp',
                        settings: {
                            receivesMarketingEmails: false,
                            stats: null,
                        },
                    },
                    {
                        firstName: 'No',
                        settings: null,
                    },
                    {
                        firstName: 'Super',
                        settings: {
                            receivesMarketingEmails: true,
                            stats: {
                                dislikes: 10,
                            },
                        },
                    },
                    {
                        firstName: 'Zebra',
                        settings: {
                            receivesMarketingEmails: false,
                            stats: null,
                        },
                    },
                ],
            });
        },
    },
    {
        it: 'supports multiple queries',
        async test({serverUrl, fetchGraphql}) {
            const graphqlFetchResult = await fetchGraphql(
                {
                    operationName: 'multiple queries',
                    // @ts-ignore: this won't be generated until tests run at least once
                    operationType: 'Query',
                    url: joinUrlParts(serverUrl, 'graphql'),
                },
                {
                    Users: {
                        args: {
                            where: {
                                role: {equals: 'user'},
                            },
                            orderBy: [
                                {
                                    firstName: {
                                        sort: 'asc',
                                    },
                                },
                            ],
                        },
                        select: {
                            total: true,
                            items: {
                                firstName: true,
                                settings: {
                                    receivesMarketingEmails: true,
                                    stats: {
                                        dislikes: true,
                                    },
                                },
                            },
                        },
                    },
                    UserSettings: {
                        args: {
                            where: {
                                user: {
                                    role: {
                                        equals: 'user',
                                    },
                                },
                            },
                        },
                        select: {
                            total: true,
                            items: {
                                canViewReports: true,
                                receivesMarketingEmails: true,
                                user: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                },
            );

            assertTypeOf(graphqlFetchResult).toMatchTypeOf<
                Readonly<{
                    Users: Readonly<{
                        total: number;
                        items: ReadonlyArray<
                            Readonly<{
                                firstName?: string | null | undefined;
                                settings?:
                                    | Readonly<{
                                          receivesMarketingEmails: boolean;
                                          stats?:
                                              | Readonly<{
                                                    dislikes: number;
                                                }>
                                              | null
                                              | undefined;
                                      }>
                                    | null
                                    | undefined;
                            }>
                        >;
                    }>;
                    UserSettings: Readonly<{
                        total: number;
                        items: ReadonlyArray<
                            Readonly<{
                                canViewReports: boolean;
                                receivesMarketingEmails: boolean;
                                user: Readonly<{
                                    firstName?: string | null | undefined;
                                    lastName?: string | null | undefined;
                                }>;
                            }>
                        >;
                    }>;
                }>
            >();

            assert.deepStrictEqual(graphqlFetchResult, {
                Users: {
                    items: [
                        {
                            firstName: 'Derp',
                            settings: {
                                receivesMarketingEmails: false,
                                stats: null,
                            },
                        },
                        {
                            firstName: 'No',
                            settings: null,
                        },
                        {
                            firstName: 'Super',
                            settings: {
                                receivesMarketingEmails: true,
                                stats: {
                                    dislikes: 10,
                                },
                            },
                        },
                        {
                            firstName: 'Zebra',
                            settings: {
                                receivesMarketingEmails: false,
                                stats: null,
                            },
                        },
                    ],
                    total: 4,
                },
                UserSettings: {
                    items: [
                        {
                            canViewReports: true,
                            receivesMarketingEmails: true,
                            user: {
                                firstName: 'Super',
                                lastName: 'Mega',
                            },
                        },
                        {
                            canViewReports: false,
                            receivesMarketingEmails: false,
                            user: {
                                firstName: 'Derp',
                                lastName: 'Doo',
                            },
                        },
                        {
                            canViewReports: true,
                            receivesMarketingEmails: false,
                            user: {
                                firstName: 'Zebra',
                                lastName: 'Proton',
                            },
                        },
                    ],
                    total: 3,
                },
            });
        },
    },
    {
        it: 'supports a query alias',
        async test({serverUrl, fetchGraphql}) {
            const graphqlFetchResult = await fetchGraphql(
                {
                    operationName: 'multiple queries',
                    // @ts-ignore: this won't be generated until tests run at least once
                    operationType: 'Query',
                    url: joinUrlParts(serverUrl, 'graphql'),
                },
                {
                    Users: {
                        alias: 'myUsers',
                        args: {
                            where: {
                                role: {equals: 'user'},
                            },
                            orderBy: [
                                {
                                    firstName: {
                                        sort: 'asc',
                                    },
                                },
                            ],
                        },
                        select: {
                            total: true,
                            items: {
                                firstName: true,
                                settings: {
                                    receivesMarketingEmails: true,
                                    stats: {
                                        dislikes: true,
                                    },
                                },
                            },
                        },
                    },
                },
            );

            assertTypeOf(graphqlFetchResult).toMatchTypeOf<
                Readonly<{
                    myUsers: Readonly<{
                        total: number;
                        items: ReadonlyArray<
                            Readonly<{
                                firstName?: string | null | undefined;
                                settings?:
                                    | Readonly<{
                                          receivesMarketingEmails: boolean;
                                          stats?:
                                              | Readonly<{
                                                    dislikes: number;
                                                }>
                                              | null
                                              | undefined;
                                      }>
                                    | null
                                    | undefined;
                            }>
                        >;
                    }>;
                }>
            >();

            assert.deepStrictEqual(graphqlFetchResult, {
                myUsers: {
                    items: [
                        {
                            firstName: 'Derp',
                            settings: {
                                receivesMarketingEmails: false,
                                stats: null,
                            },
                        },
                        {
                            firstName: 'No',
                            settings: null,
                        },
                        {
                            firstName: 'Super',
                            settings: {
                                receivesMarketingEmails: true,
                                stats: {
                                    dislikes: 10,
                                },
                            },
                        },
                        {
                            firstName: 'Zebra',
                            settings: {
                                receivesMarketingEmails: false,
                                stats: null,
                            },
                        },
                    ],
                    total: 4,
                },
            });
        },
    },
    {
        it: 'supports multiple queries to the same resolver',
        async test({serverUrl, fetchGraphql}) {
            const graphqlFetchResult = await fetchGraphql(
                {
                    operationName: 'multiple queries',
                    // @ts-ignore: this won't be generated until tests run at least once
                    operationType: 'Query',
                    url: joinUrlParts(serverUrl, 'graphql'),
                },
                {
                    Users: [
                        {
                            args: {
                                where: {
                                    role: {equals: 'user'},
                                },
                                orderBy: [
                                    {
                                        firstName: {
                                            sort: 'asc',
                                        },
                                    },
                                ],
                            },
                            select: {
                                total: true,
                                items: {
                                    firstName: true,
                                    settings: {
                                        receivesMarketingEmails: true,
                                        stats: {
                                            dislikes: true,
                                        },
                                    },
                                },
                            },
                        },
                        {
                            alias: 'adminsOnly',
                            args: {
                                where: {
                                    role: {not: {equals: 'user'}},
                                },
                                orderBy: [
                                    {
                                        firstName: {
                                            sort: 'asc',
                                        },
                                    },
                                ],
                            },
                            select: {
                                total: true,
                                items: {
                                    firstName: true,
                                },
                            },
                        },
                    ],
                },
            );

            assertTypeOf(graphqlFetchResult).toMatchTypeOf<
                Readonly<{
                    Users: Readonly<{
                        total: number;
                        items: ReadonlyArray<
                            Readonly<{
                                firstName?: string | null | undefined;
                                settings?:
                                    | Readonly<{
                                          receivesMarketingEmails: boolean;
                                          stats?:
                                              | Readonly<{
                                                    dislikes: number;
                                                }>
                                              | null
                                              | undefined;
                                      }>
                                    | null
                                    | undefined;
                            }>
                        >;
                    }>;
                    adminsOnly: Readonly<{
                        total: number;
                        items: ReadonlyArray<
                            Readonly<{
                                firstName?: string | null | undefined;
                            }>
                        >;
                    }>;
                }>
            >();

            assert.deepStrictEqual(graphqlFetchResult, {
                Users: {
                    items: [
                        {
                            firstName: 'Derp',
                            settings: {
                                receivesMarketingEmails: false,
                                stats: null,
                            },
                        },
                        {
                            firstName: 'No',
                            settings: null,
                        },
                        {
                            firstName: 'Super',
                            settings: {
                                receivesMarketingEmails: true,
                                stats: {
                                    dislikes: 10,
                                },
                            },
                        },
                        {
                            firstName: 'Zebra',
                            settings: {
                                receivesMarketingEmails: false,
                                stats: null,
                            },
                        },
                    ],
                    total: 4,
                },
                adminsOnly: {
                    items: [
                        {
                            firstName: 'Nick',
                        },
                    ],
                    total: 1,
                },
            });
        },
    },
    {
        it: 'loads dates as strings',
        async test({serverUrl}) {
            const users = (
                await fetchRawGraphql(joinUrlParts(serverUrl, 'graphql'), {
                    query: /* GraphQL */ `
                        query {
                            Users(where: {role: {equals: "user"}}, orderBy: {}) {
                                total
                                items {
                                    updatedAt
                                }
                            }
                        }
                    `,
                })
            ).Users;

            assertRunTimeType(users.items[0].updatedAt, 'string');
            /** Try creating a date. */
            createUtcFullDate(users.items[0].updatedAt);
        },
    },
    {
        it: 'can sort by a relational field',
        async test({serverUrl}) {
            const users = (
                await fetchRawGraphql(joinUrlParts(serverUrl, 'graphql'), {
                    query: /* GraphQL */ `
                        query {
                            Users(
                                where: {role: {equals: "user"}}
                                orderBy: {settings: {canViewReports: asc}}
                            ) {
                                total
                                items {
                                    firstName
                                    settings {
                                        canViewReports
                                    }
                                }
                            }
                        }
                    `,
                })
            ).Users;

            assert.deepStrictEqual(users, {
                total: 4,
                items: [
                    {
                        firstName: 'No',
                        settings: null,
                    },
                    {
                        firstName: 'Derp',
                        settings: {
                            canViewReports: false,
                        },
                    },
                    {
                        firstName: 'Super',
                        settings: {
                            canViewReports: true,
                        },
                    },
                    {
                        firstName: 'Zebra',
                        settings: {
                            canViewReports: true,
                        },
                    },
                ],
            });
        },
    },
    {
        it: 'can use a cursor',
        async test({serverUrl, prismaClient}) {
            const firstPageFromGraphql = (
                await fetchRawGraphql(joinUrlParts(serverUrl, 'graphql'), {
                    query: /* GraphQL */ `
                        query {
                            Users(
                                where: {role: {equals: "user"}}
                                orderBy: {firstName: {sort: asc}}
                                take: 2
                            ) {
                                total
                                items {
                                    id
                                    firstName
                                }
                            }
                        }
                    `,
                })
            ).Users as {total: number; items: {id: string; firstName: string}[]};

            assertLengthAtLeast(firstPageFromGraphql.items, 1);

            const firstPageFromPrisma = await prismaClient.user.findMany({
                where: {
                    role: {
                        equals: 'user',
                    },
                },
                orderBy: {
                    firstName: {
                        sort: 'asc',
                    },
                },
                take: 2,
                select: {
                    id: true,
                    firstName: true,
                },
            });

            assert.deepStrictEqual(firstPageFromPrisma, firstPageFromGraphql.items);

            assert.deepStrictEqual(
                firstPageFromGraphql.items.map((item) => item.firstName),
                [
                    'Derp',
                    'No',
                ],
            );

            const cursorId = firstPageFromGraphql.items[0].id;

            assert.isTrue(isUuid(cursorId));

            const secondPageFromGraphql = (
                await fetchRawGraphql(joinUrlParts(serverUrl, 'graphql'), {
                    query: /* GraphQL */ `
                        query ($cursorId: String!) {
                            Users(
                                where: {role: {equals: "user"}}
                                orderBy: {firstName: {sort: asc}}
                                take: 1
                                cursor: {id: $cursorId}
                            ) {
                                total
                                items {
                                    firstName
                                }
                            }
                        }
                    `,
                    variables: {
                        cursorId,
                    },
                })
            ).Users;

            const secondPageFromPrisma = await prismaClient.user.findMany({
                where: {
                    role: {
                        equals: 'user',
                    },
                },
                orderBy: {
                    firstName: {
                        sort: 'asc',
                    },
                },
                take: 1,
                /** This skip is automatically inserted inside the GraphQL resolver. */
                skip: 1,
                cursor: {
                    id: cursorId,
                },
                select: {
                    firstName: true,
                },
            });

            assert.deepStrictEqual(secondPageFromPrisma, secondPageFromGraphql.items);

            assert.deepStrictEqual(secondPageFromGraphql, {
                total: 4,
                items: [
                    {
                        firstName: 'No',
                    },
                ],
            });

            assert.deepEqual(secondPageFromPrisma[0]?.firstName, firstPageFromPrisma[1]?.firstName);
        },
    },
    {
        it: 'supports the distinct field',
        async test({serverUrl, prismaClient}) {
            const graphqlResult = (
                await fetchRawGraphql(joinUrlParts(serverUrl, 'graphql'), {
                    query: /* GraphQL */ `
                        query {
                            Users(
                                where: {phoneNumber: {not: {equals: ""}}}
                                orderBy: {phoneNumber: {sort: asc}}
                                distinct: [phoneNumber]
                            ) {
                                total
                                items {
                                    firstName
                                    phoneNumber
                                }
                            }
                        }
                    `,
                })
            ).Users;

            const prismaResult = await prismaClient.user.findMany({
                where: {
                    phoneNumber: {
                        not: '',
                    },
                },
                orderBy: {
                    phoneNumber: {
                        sort: 'asc',
                    },
                },
                distinct: ['phoneNumber'],
                select: {
                    phoneNumber: true,
                    firstName: true,
                },
            });

            assert.deepStrictEqual(graphqlResult.items, prismaResult);
            assert.deepStrictEqual(prismaResult, [
                {
                    firstName: 'Super',
                    phoneNumber: '1234567890',
                },
                {
                    firstName: 'Zebra',
                    phoneNumber: '5',
                },
            ]);
        },
    },
    {
        it: 'updates a value',
        async test({serverUrl, prismaClient}) {
            const createdUser = await prismaClient.user.create({
                data: {
                    password: 'yolo-password2',
                    email: 'yolo2@example.com',
                },
                select: {
                    id: true,
                },
            });

            const updateGraphqlResult = (
                await fetchRawGraphql(joinUrlParts(serverUrl, 'graphql'), {
                    query: /* GraphQL */ `
                        mutation {
                            Users(
                                update: {
                                    where: {
                                        password: {equals: "yolo-password2"}
                                        email: {equals: "yolo2@example.com"}
                                    }
                                    data: {password: "yo no", email: "yono@example.com"}
                                }
                            ) {
                                total
                            }
                        }
                    `,
                })
            ).Users;

            await prismaClient.user.updateMany({
                where: {
                    email: {
                        equals: 'yolo2@example.com',
                    },
                    password: {
                        equals: 'yolo-password2',
                    },
                },
                data: {
                    email: 'yono@example.com',
                    password: 'yo no',
                },
            });

            assert.strictEqual(updateGraphqlResult.total, 1);

            assert.isUndefined(updateGraphqlResult.items);

            const updatedPrismaResult = await prismaClient.user.findFirstOrThrow({
                where: {
                    id: createdUser.id,
                },
                select: {
                    password: true,
                    email: true,
                },
            });

            assert.deepStrictEqual(updatedPrismaResult, {
                password: 'yo no',
                email: 'yono@example.com',
            });
        },
    },
    {
        it: 'creates multiple values',
        async test({serverUrl, prismaClient}) {
            const usersBefore = await prismaClient.user.findMany({
                select: {
                    id: true,
                },
            });

            const multiCreationGraphqlResult = (
                await fetchRawGraphql(joinUrlParts(serverUrl, 'graphql'), {
                    query: /* GraphQL */ `
                        mutation {
                            Users(
                                create: {
                                    data: [
                                        {password: "multi-1", email: "multi-1"}
                                        {password: "multi-2", email: "multi-2"}
                                        {password: "multi-3", email: "multi-3"}
                                    ]
                                }
                            ) {
                                total
                                items {
                                    firstName
                                    phoneNumber
                                    email
                                }
                            }
                        }
                    `,
                })
            ).Users;

            assert.strictEqual(multiCreationGraphqlResult.total, 3);

            const usersAfter = await prismaClient.user.findMany({
                select: {
                    id: true,
                },
            });

            assert.strictEqual(
                usersAfter.length - usersBefore.length,
                multiCreationGraphqlResult.total,
            );

            const latestPrismaResults = await prismaClient.user.findMany({
                select: {
                    firstName: true,
                    phoneNumber: true,
                    email: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 3,
            });

            assert.deepStrictEqual(
                // @ts-ignore: this won't be generated until tests run at least once
                latestPrismaResults.sort((a, b) => a.email.localeCompare(b.email)),
                multiCreationGraphqlResult.items.sort(
                    (
                        a: ArrayElement<typeof latestPrismaResults>,
                        b: ArrayElement<typeof latestPrismaResults>,
                    ) => a.email.localeCompare(b.email),
                ),
            );
        },
    },
    {
        it: 'creates nested values',
        async test({serverUrl, prismaClient, fetchGraphql}) {
            const graphqlResult = await fetchGraphql(
                {
                    operationName: 'CreateNestedValues',
                    // @ts-ignore: this won't be generated until tests run at least once
                    operationType: 'Mutation',
                    url: joinUrlParts(serverUrl, 'graphql'),
                },
                {
                    Users: {
                        args: {
                            create: {
                                data: [
                                    {
                                        email: 'nested-creation@example.com',
                                        firstName: 'nested',
                                        password: 'something secret',
                                        posts: {
                                            create: [
                                                {
                                                    title: 'test 1',
                                                    body: 'this has been the first test',
                                                },
                                                {
                                                    title: 'test 2',
                                                    body: 'this has been the second test',
                                                },
                                            ],
                                        },
                                        settings: {
                                            create: {
                                                canViewReports: true,
                                                stats: {
                                                    create: {
                                                        dislikes: 5,
                                                        likes: 4,
                                                        views: 9,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                        select: {
                            items: {
                                firstName: true,
                                settings: {
                                    canViewReports: true,
                                    stats: {
                                        likes: true,
                                    },
                                },
                                posts: {
                                    title: true,
                                },
                            },
                            total: true,
                        },
                    },
                },
            );

            assert.deepStrictEqual(graphqlResult, {
                Users: {
                    items: [
                        {
                            firstName: 'nested',
                            settings: {
                                canViewReports: true,
                                stats: {
                                    likes: 4,
                                },
                            },
                            posts: [
                                {title: 'test 1'},
                                {title: 'test 2'},
                            ],
                        },
                    ],
                    total: 1,
                },
            });

            const prismaResult = await prismaClient.user.findMany({
                where: {
                    email: 'nested-creation@example.com',
                },
                select: {
                    firstName: true,
                    settings: {
                        select: {
                            canViewReports: true,
                            stats: {
                                select: {
                                    likes: true,
                                },
                            },
                        },
                    },
                    posts: {
                        select: {
                            title: true,
                        },
                    },
                },
            });

            assert.deepStrictEqual(prismaResult, graphqlResult.Users.items);
        },
    },
    {
        it: 'fails to read hidden output fields',
        async test({fetchGraphql, serverUrl}) {
            // @ts-ignore this will fail until the test is run once
            type UsersOutput = ArrayElement<ResolverOutput<Resolvers, 'Query', 'Users'>['items']>;

            assertTypeOf<UsersOutput>().toHaveProperty('email');
            // @ts-ignore this will fail until the test is run once
            assertTypeOf<UsersOutput>().not.toHaveProperty('password');

            await assertThrows(
                async () => {
                    const graphqlResult = await fetchGraphql(
                        {
                            operationName: 'CreateNestedValues',
                            // @ts-ignore: this won't be generated until tests run at least once
                            operationType: 'Query',
                            url: joinUrlParts(serverUrl, 'graphql'),
                        },
                        {
                            Users: {
                                args: {
                                    where: {
                                        email: {
                                            equals: 'nested-creation@example.com',
                                        },
                                    },
                                },
                                select: {
                                    items: {
                                        firstName: true,
                                        password: true,
                                    },
                                    total: true,
                                },
                            },
                        },
                    );

                    // @ts-ignore: this field is hidden, but it won't be an error until the test is run once
                    graphqlResult.Users.items[0]!.password;
                },
                {
                    matchMessage: 'Cannot query field "password" on type "User".',
                },
            );
        },
    },
    {
        it: 'updates multiple values',
        async test({serverUrl, prismaClient}) {
            const createdUsers = [
                await prismaClient.user.create({
                    data: {
                        password: 'yolo-password2',
                        email: 'yolo3@example.com',
                    },
                    select: {
                        id: true,
                    },
                }),
                await prismaClient.user.create({
                    data: {
                        password: 'yolo-password2',
                        email: 'yolo4@example.com',
                    },
                    select: {
                        id: true,
                    },
                }),
            ];

            const updateGraphqlResult = (
                await fetchRawGraphql(joinUrlParts(serverUrl, 'graphql'), {
                    query: /* GraphQL */ `
                        mutation {
                            Users(
                                update: {
                                    where: {password: {equals: "yolo-password2"}}
                                    data: {password: "yo no"}
                                }
                            ) {
                                total
                            }
                        }
                    `,
                })
            ).Users;

            assert.strictEqual(updateGraphqlResult.total, 2);

            assert.isUndefined(updateGraphqlResult.items);

            const updatedPrismaResult = await Promise.all(
                createdUsers.map(async (createdUser) => {
                    return await prismaClient.user.findFirstOrThrow({
                        where: {
                            id: createdUser.id,
                        },
                        select: {
                            password: true,
                            email: true,
                        },
                    });
                }),
            );

            assert.deepStrictEqual(updatedPrismaResult, [
                {
                    password: 'yo no',
                    email: 'yolo3@example.com',
                },
                {
                    password: 'yo no',
                    email: 'yolo4@example.com',
                },
            ]);
        },
    },
    {
        it: 'scopes data with lots of entries',
        async test({serverUrl, fetchGraphql}) {
            const query = {
                Users: {
                    args: {
                        where: {
                            role: {
                                equals: 'user',
                            },
                        },
                        orderBy: [
                            {
                                firstName: {
                                    sort: 'asc',
                                    nulls: 'first',
                                },
                            },
                        ],
                    },
                    select: {
                        total: true,
                        items: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                UserSettings: {
                    args: {
                        where: {
                            user: {
                                role: {equals: 'user'},
                            },
                        },
                        orderBy: [
                            {
                                user: {
                                    firstName: {
                                        sort: 'asc',
                                        nulls: 'first',
                                    },
                                },
                            },
                        ],
                    },
                    select: {
                        items: {
                            id: true,
                            user: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                        total: true,
                    },
                },
                // @ts-ignore: this won't work until the prisma output has been generated
            } as const satisfies Operations<typeof fetchGraphql, 'Query'>;

            const resultsWithoutScope = await fetchGraphql(
                {
                    operationName: 'non-scoped user stuff',
                    // @ts-ignore: this won't work until the prisma output has been generated
                    operationType: 'Query',
                    url: joinUrlParts(serverUrl, 'graphql'),
                },
                query,
            );

            /** Omit ids for equality checking because they are randomly generated. */
            const resultsWithoutScopeNoIds = {
                ...resultsWithoutScope,
                Users: {
                    ...resultsWithoutScope.Users,
                    // @ts-ignore: this won't work until the prisma output has been generated
                    items: resultsWithoutScope.Users.items.map((user) =>
                        // @ts-ignore: this won't work until the prisma output has been generated
                        omitObjectKeys(user, ['id']),
                    ),
                },
                UserSettings: {
                    ...resultsWithoutScope.UserSettings,
                    // @ts-ignore: this won't work until the prisma output has been generated
                    items: resultsWithoutScope.UserSettings.items.map((user) =>
                        // @ts-ignore: this won't work until the prisma output has been generated
                        omitObjectKeys(user, ['id']),
                    ),
                },
            };

            assert.deepStrictEqual(resultsWithoutScopeNoIds, {
                Users: {
                    items: [
                        {
                            firstName: 'Derp',
                            lastName: 'Doo',
                        },
                        {
                            firstName: 'No',
                            lastName: 'Settings',
                        },
                        {
                            firstName: 'Super',
                            lastName: 'Mega',
                        },
                        {
                            firstName: 'Zebra',
                            lastName: 'Proton',
                        },
                    ],
                    total: 4,
                },
                UserSettings: {
                    items: [
                        {
                            user: {
                                firstName: 'Derp',
                                lastName: 'Doo',
                            },
                        },
                        {
                            user: {
                                firstName: 'Super',
                                lastName: 'Mega',
                            },
                        },
                        {
                            user: {
                                firstName: 'Zebra',
                                lastName: 'Proton',
                            },
                        },
                    ],
                    total: 3,
                },
            });

            const scopedUserId = resultsWithoutScope.Users.items[0]?.id;

            assertDefined(scopedUserId, 'failed to find scoped user id');

            const resultsWithScope = await fetchGraphql(
                {
                    operationName: 'non-scoped user stuff',
                    // @ts-ignore: this won't work until the prisma output has been generated
                    operationType: 'Query',
                    url: joinUrlParts(serverUrl, 'graphql'),
                    options: {
                        fetchOptions: {
                            headers: {
                                [graphqlServerHeaders.userId]: scopedUserId,
                            },
                        },
                    },
                },
                query,
            );

            /** Omit ids for equality checking because they are randomly generated. */
            const resultsWithScopeNoIds = {
                ...resultsWithScope,
                Users: {
                    ...resultsWithScope.Users,
                    // @ts-ignore: this won't work until the prisma output has been generated
                    items: resultsWithScope.Users.items.map((user) => omitObjectKeys(user, ['id'])),
                },
                UserSettings: {
                    ...resultsWithScope.UserSettings,
                    // @ts-ignore: this won't work until the prisma output has been generated
                    items: resultsWithScope.UserSettings.items.map((user) =>
                        // @ts-ignore: this won't work until the prisma output has been generated
                        omitObjectKeys(user, ['id']),
                    ),
                },
            };

            assert.deepStrictEqual(resultsWithScopeNoIds, {
                Users: {
                    items: [
                        {
                            firstName: 'Derp',
                            lastName: 'Doo',
                        },
                    ],
                    total: 1,
                },
                UserSettings: {
                    items: [
                        {
                            user: {
                                firstName: 'Derp',
                                lastName: 'Doo',
                            },
                        },
                    ],
                    total: 1,
                },
            });

            assert.notStrictEqual(
                resultsWithoutScope.UserSettings.total,
                resultsWithScopeNoIds.UserSettings.total,
            );
            assert.notStrictEqual(
                resultsWithoutScope.Users.total,
                resultsWithScopeNoIds.Users.total,
            );
        },
    },
    {
        it: 'allows querying by a many field',
        async test({serverUrl, fetchGraphql}) {
            const uniquePostUsers = await fetchGraphql(
                {
                    operationName: 'many field where',
                    // @ts-ignore: this won't work until the prisma output has been generated
                    operationType: 'Query',
                    url: joinUrlParts(serverUrl, 'graphql'),
                },
                {
                    Users: {
                        args: {
                            where: {
                                posts: {
                                    some: {
                                        title: {
                                            contains: 'unique',
                                        },
                                    },
                                },
                            },
                            orderBy: [
                                {
                                    firstName: {
                                        sort: 'asc',
                                    },
                                },
                            ],
                        },
                        select: {
                            items: {
                                firstName: true,
                                lastName: true,
                                posts: {
                                    title: true,
                                    body: true,
                                },
                            },
                            total: true,
                        },
                    },
                },
            );

            assert.deepStrictEqual(uniquePostUsers, {
                Users: {
                    total: 2,
                    items: [
                        {
                            firstName: 'Derp',
                            lastName: 'Doo',
                            posts: [
                                {
                                    body: 'this is my post',
                                    title: 'this is my title',
                                },
                                {
                                    body: 'this is my post 2',
                                    title: 'this is my title 2',
                                },
                                {
                                    body: 'this is my post 3',
                                    title: 'this is my title 3',
                                },
                                {
                                    body: 'this is my post 4',
                                    title: 'unique title name',
                                },
                            ],
                        },
                        {
                            firstName: 'No',
                            lastName: 'Settings',
                            posts: [
                                {
                                    body: 'this is my post',
                                    title: 'this is my title',
                                },
                                {
                                    body: 'this is my post 2',
                                    title: 'this is my title 2',
                                },
                                {
                                    body: 'this is my post 3',
                                    title: 'this is my title 3',
                                },
                                {
                                    body: 'this is my post 4',
                                    title: 'unique title name',
                                },
                            ],
                        },
                    ],
                },
            });
        },
    },
    {
        it: 'supports operation scope by a many field',
        async test({serverUrl, fetchGraphql}) {
            const uniquePostUsers = await fetchGraphql(
                {
                    operationName: 'scoped many where',
                    // @ts-ignore: this won't work until the prisma output has been generated
                    operationType: 'Query',
                    url: joinUrlParts(serverUrl, 'graphql'),
                    options: {
                        fetchOptions: {
                            headers: {
                                [graphqlServerHeaders.setOperationScope]: JSON.stringify({
                                    where: {
                                        UserPost: {
                                            title: {
                                                contains: 'unique',
                                            },
                                        },
                                    },
                                }),
                            },
                        },
                    },
                },
                {
                    Users: {
                        args: {
                            orderBy: [
                                {
                                    firstName: {
                                        sort: 'asc',
                                    },
                                },
                            ],
                        },
                        select: {
                            items: {
                                firstName: true,
                                lastName: true,
                                posts: {
                                    title: true,
                                    body: true,
                                },
                            },
                            total: true,
                        },
                    },
                },
            );

            assert.deepStrictEqual(uniquePostUsers, {
                Users: {
                    total: 2,
                    items: [
                        {
                            firstName: 'Derp',
                            lastName: 'Doo',
                            posts: [
                                {
                                    body: 'this is my post 4',
                                    title: 'unique title name',
                                },
                            ],
                        },
                        {
                            firstName: 'No',
                            lastName: 'Settings',
                            posts: [
                                {
                                    body: 'this is my post 4',
                                    title: 'unique title name',
                                },
                            ],
                        },
                    ],
                },
            });
        },
    },
    {
        it: 'scopes deeply nested operations',
        async test({serverUrl, fetchGraphql}) {
            const uniquePostUsers = await fetchGraphql(
                {
                    operationName: 'nested scope',
                    // @ts-ignore: this won't work until the prisma output has been generated
                    operationType: 'Query',
                    url: joinUrlParts(serverUrl, 'graphql'),
                    options: {
                        fetchOptions: {
                            headers: {
                                [graphqlServerHeaders.setOperationScope]: JSON.stringify({
                                    where: {
                                        User: {
                                            firstName: {equals: 'Zebra'},
                                        },
                                    },
                                }),
                            },
                        },
                    },
                },
                {
                    Users: {
                        args: {
                            orderBy: [
                                {
                                    firstName: {
                                        sort: 'asc',
                                    },
                                },
                            ],
                        },
                        select: {
                            items: {
                                firstName: true,
                                lastName: true,
                                regions: {
                                    regionName: true,
                                    users: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                            total: true,
                        },
                    },
                },
            );

            assert.deepStrictEqual(uniquePostUsers, {
                Users: {
                    total: 1,
                    items: [
                        {
                            firstName: 'Zebra',
                            lastName: 'Proton',
                            regions: [
                                {
                                    regionName: 'USA',
                                    users: [
                                        {
                                            firstName: 'Zebra',
                                            lastName: 'Proton',
                                        },
                                    ],
                                },
                                {
                                    regionName: 'West Coast',
                                    users: [
                                        {
                                            firstName: 'Zebra',
                                            lastName: 'Proton',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            });
        },
    },
    {
        it: 'limits query result count',
        async test({serverUrl, fetchGraphql}) {
            const uniquePostUsers = await fetchGraphql(
                {
                    operationName: 'nested scope',
                    // @ts-ignore: this won't work until the prisma output has been generated
                    operationType: 'Query',
                    url: joinUrlParts(serverUrl, 'graphql'),
                    options: {
                        fetchOptions: {
                            headers: {
                                [graphqlServerHeaders.setOperationScope]: JSON.stringify({
                                    maxCount: 2,
                                } satisfies OperationScope<any>),
                            },
                        },
                    },
                },
                {
                    Users: {
                        args: {
                            orderBy: [
                                {
                                    firstName: {
                                        sort: 'asc',
                                    },
                                },
                            ],
                            where: {
                                firstName: {
                                    not: null,
                                },
                            },
                        },
                        select: {
                            items: {
                                firstName: true,
                                lastName: true,
                            },
                            total: true,
                            messages: {
                                code: true,
                                description: true,
                                message: true,
                            },
                        },
                    },
                },
            );

            assert.deepStrictEqual(uniquePostUsers, {
                Users: {
                    items: [
                        {
                            firstName: 'Derp',
                            lastName: 'Doo',
                        },
                        {
                            firstName: 'Nick',
                            lastName: 'Jordan',
                        },
                    ],
                    total: 6,
                    messages: [
                        {
                            code: 'ptg-2',
                            description: 'query results truncated',
                            message:
                                'ptg-2: Query results were truncated to the first 2 entries. Please use pagination to split your query up.',
                        },
                    ],
                },
            });
        },
    },
];

describe('resolver run time', () => {
    it('passes all tests', async () => {
        await runGraphqlServerTests(await setupTestServerConfig(), testCases);
    });
});
