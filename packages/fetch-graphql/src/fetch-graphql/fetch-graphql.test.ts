import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {OperationType} from '@prisma-to-graphql/core';
import {Resolvers, schemaOperationTypeNames} from '../schema-output.mock.js';
import {createGraphqlFetcher} from './fetch-graphql.js';

describe(createGraphqlFetcher.name, () => {
    const fetchGraphql = createGraphqlFetcher<Resolvers>(schemaOperationTypeNames);

    /** Mocked fetch. */
    function fakeFetch() {
        return {
            ok: true,
            json() {
                return {
                    data: {
                        Users: {},
                    },
                };
            },
        } as unknown as ReturnType<typeof fetch>;
    }

    it('has correct operation types', async () => {
        const fakeResult = await fetchGraphql(
            {
                operationName: 'Test1',
                operationType: OperationType.Mutation,
                url: 'example.com',
                options: {
                    fetch: fakeFetch,
                },
            },
            {
                Users: {
                    args: {
                        create: {
                            data: [
                                {
                                    email: '',
                                    password: '',
                                    createdAt: '',
                                    firstName: '',
                                    id: '',
                                    lastName: '',
                                    phoneNumber: '',
                                    role: '',
                                    settings: {
                                        connect: {
                                            canViewReports: {
                                                equals: true,
                                                not: false,
                                            },
                                            AND: [],
                                        },
                                    },
                                    updatedAt: '',
                                },
                            ],
                        },
                    },
                    select: {},
                },
            },
        );

        const fakeResult2 = await fetchGraphql(
            {
                operationName: 'Test1',
                operationType: OperationType.Query,
                url: 'example.com',
                options: {
                    fetch: fakeFetch,
                },
            },
            {
                Users: {
                    args: {},
                    select: {},
                },
            },
        );

        fakeResult.Users;

        assert.deepEquals(fakeResult, {Users: {}});
    });

    itCases(fetchGraphql, [
        {
            it: 'rejects missing operations',
            inputs: [
                {
                    operationName: 'Test1',
                    operationType: OperationType.Mutation,
                    url: '',
                    options: {
                        fetch: fakeFetch,
                    },
                },
                {},
            ],
            throws: {
                matchMessage: 'Nothing to fetch: no operations given',
            },
        },
        {
            it: 'rejects missing URL',
            inputs: [
                {
                    operationName: 'Test1',
                    operationType: OperationType.Query,
                    url: '',
                    options: {
                        fetch: fakeFetch,
                    },
                },
                {
                    Users: {
                        args: {
                            where: {role: {equals: 'user'}},
                        },
                        select: {},
                    },
                },
            ],
            throws: {
                matchMessage: 'No URL provided for fetching GraphQL',
            },
        },
        {
            it: 'rejects failed fetch',
            inputs: [
                {
                    operationName: 'Test1',
                    operationType: OperationType.Query,
                    url: 'example.com',
                    options: {
                        fetch() {
                            return {
                                status: 418,
                                statusText: 'test',
                            } as unknown as ReturnType<typeof fetch>;
                        },
                    },
                },
                {
                    Users: {
                        args: {
                            where: {role: {equals: 'user'}},
                        },
                        select: {},
                    },
                },
            ],
            throws: {
                matchMessage: "Fetch to 'example.com/?operation=Test1' failed: 418: test",
            },
        },
        {
            it: 'combines graphql errors',
            inputs: [
                {
                    operationName: 'Test1',
                    operationType: OperationType.Query,
                    url: 'example.com',
                    options: {
                        fetch() {
                            return {
                                ok: true,
                                json() {
                                    return {
                                        errors: [
                                            {message: 'failure 1'},
                                            'failure 2',
                                        ],
                                    };
                                },
                            } as unknown as ReturnType<typeof fetch>;
                        },
                    },
                },
                {
                    Users: {
                        args: {
                            where: {role: {equals: 'user'}},
                        },
                        select: {},
                    },
                },
            ],
            throws: {
                matchMessage: 'failure 1\nfailure 2',
            },
        },
        {
            it: 'rejects missing response data',
            inputs: [
                {
                    operationName: 'Test1',
                    operationType: OperationType.Query,
                    url: 'example.com',
                    options: {
                        fetch() {
                            return {
                                ok: true,
                                json() {
                                    return {};
                                },
                            } as unknown as ReturnType<typeof fetch>;
                        },
                    },
                },
                {
                    Users: {
                        args: {
                            where: {role: {equals: 'user'}},
                        },
                        select: {},
                    },
                },
            ],
            throws: {
                matchMessage: "GraphQL Response from 'example.com/?operation=Test1' had no data.",
            },
        },
        {
            it: 'rejects missing response data and omits operation name from url',
            inputs: [
                {
                    operationName: 'Test1',
                    operationType: OperationType.Query,
                    url: 'example.com',
                    options: {
                        omitOperationNameFromUrl: true,
                        fetch() {
                            return {
                                ok: true,
                                json() {
                                    return {};
                                },
                            } as unknown as ReturnType<typeof fetch>;
                        },
                    },
                },
                {
                    Users: {
                        args: {
                            where: {role: {equals: 'user'}},
                        },
                        select: {},
                    },
                },
            ],
            throws: {
                matchMessage: "GraphQL Response from 'example.com' had no data.",
            },
        },
    ]);
});
