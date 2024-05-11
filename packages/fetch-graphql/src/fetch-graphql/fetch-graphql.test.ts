import {itCases} from '@augment-vir/chai';
import {assert} from 'chai';
import {Resolvers, operationParams} from '../my-generated-schema-outputs';
import {createGraphqlFetcher} from './fetch-graphql';

describe(createGraphqlFetcher.name, () => {
    const fetchGraphql = createGraphqlFetcher<Resolvers>(operationParams);

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
                operationType: 'Mutation',
                url: 'example.com',
                options: {
                    customFetch: fakeFetch,
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

        assert.deepStrictEqual(fakeResult, {Users: {}});
    });

    itCases(fetchGraphql, [
        {
            it: 'rejects missing operations',
            inputs: [
                {
                    operationName: 'Test1',
                    operationType: 'Mutation',
                    url: '',
                    options: {
                        customFetch: fakeFetch,
                    },
                },
                {},
            ],
            throws: 'Nothing to fetch: no operations given',
        },
        {
            it: 'rejects missing URL',
            inputs: [
                {
                    operationName: 'Test1',
                    operationType: 'Query',
                    url: '',
                    options: {
                        customFetch: fakeFetch,
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
            throws: 'No URL provided for fetching GraphQL',
        },
        {
            it: 'rejects failed fetch',
            inputs: [
                {
                    operationName: 'Test1',
                    operationType: 'Query',
                    url: 'example.com',
                    options: {
                        customFetch() {
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
            throws: "Fetch to 'example.com' failed: 418: test",
        },
        {
            it: 'combines graphql errors',
            inputs: [
                {
                    operationName: 'Test1',
                    operationType: 'Query',
                    url: 'example.com',
                    options: {
                        customFetch() {
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
            throws: 'failure 1\nfailure 2',
        },
        {
            it: 'rejects missing response data',
            inputs: [
                {
                    operationName: 'Test1',
                    operationType: 'Query',
                    url: 'example.com',
                    options: {
                        customFetch() {
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
            throws: "GraphQL Response from 'example.com' had no data.",
        },
    ]);
});
