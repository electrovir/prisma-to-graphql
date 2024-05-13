import {
    ArrayElement,
    MaybePromise,
    assertLengthAtLeast,
    awaitedForEach,
    createDeferredPromiseWrapper,
    ensureErrorAndPrependMessage,
    isUuid,
    waitUntilTruthy,
} from '@augment-vir/common';
import {
    GraphqlFetcher,
    createGraphqlFetcher,
    fetchRawGraphql,
} from '@prisma-to-graphql/fetch-graphql';
import {assert} from 'chai';
import {createUtcFullDate} from 'date-vir';
import {Server} from 'node:http';
import {assertRunTimeType, assertThrows, assertTypeOf} from 'run-time-assertions';
import {buildUrl, joinUrlParts} from 'url-vir';
import {setupFullServer} from './full-run-time.test-helper';

// @ts-ignore: this won't be generated until tests run at least once
import type {PrismaClient} from '.prisma';
// @ts-ignore: this won't be generated until tests run at least once
import type {Resolvers} from '.prisma/graphql/schema';
import {ResolverOutput} from '@prisma-to-graphql/fetch-graphql';

type GraphqlTestCase = {
    it: string;
    test: (params: {
        serverUrl: string;
        fetchGraphql: GraphqlFetcher<Resolvers>;
        prismaClient: PrismaClient;
    }) => MaybePromise<void>;
};

const testCases: GraphqlTestCase[] = [
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
                                take: 1
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
                take: 1,
                select: {
                    id: true,
                    firstName: true,
                },
            });

            assert.deepStrictEqual(firstPageFromPrisma, firstPageFromGraphql.items);

            assert.deepStrictEqual(
                firstPageFromGraphql.items.map((item) => item.firstName),
                ['Derp'],
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
                                skip: 1
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
            type UsersOutput = ArrayElement<ResolverOutput<Resolvers, 'Query', 'Users'>['items']>;

            assertTypeOf<UsersOutput>().toHaveProperty('email');
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

                    // @ts-expect-error: this field is hidden
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
];

async function runTests(testCases: ReadonlyArray<Readonly<GraphqlTestCase>>) {
    let server: Server | undefined;
    try {
        const fullServer = await setupFullServer();
        server = fullServer.server;
        const serverUrl = buildUrl('http://localhost', {
            port: fullServer.port,
        }).href;

        await waitUntilTruthy(async () => {
            const response = await fetch(joinUrlParts(serverUrl, 'health'));

            return response.ok;
        });

        // @ts-ignore: this won't be generated until tests run at least once
        const {operationParams} = await import('.prisma/graphql/schema.cjs');

        const fetchGraphql = createGraphqlFetcher<Resolvers>(operationParams);

        await awaitedForEach(testCases, async (testCase) => {
            try {
                await testCase.test({
                    serverUrl,
                    fetchGraphql,
                    prismaClient: fullServer.prismaClient,
                });
            } catch (error) {
                throw ensureErrorAndPrependMessage(error, testCase.it);
            }
        });
    } finally {
        if (server) {
            const serverCloseDeferredPromise = createDeferredPromiseWrapper();
            server.closeAllConnections();
            server.close((error) => {
                if (error) {
                    serverCloseDeferredPromise.reject(error);
                }
                {
                    serverCloseDeferredPromise.resolve();
                }
            });
            await serverCloseDeferredPromise.promise;
        }
    }
}

describe('resolver run time', () => {
    it('passes all tests', async () => {
        await runTests(testCases);
    });
});
