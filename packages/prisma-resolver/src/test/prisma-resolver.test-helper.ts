import {Kind, OperationTypeNode} from 'graphql';
import {runPrismaResolver} from '../resolver/run-prisma-resolver';
import {ResolverTests} from './resolver-test-case.test-helper';

export const prismaResolverTests: ResolverTests = {
    describe: runPrismaResolver.name,
    cases: [
        {
            it: 'executes a query',
            async test({prismaClient}) {
                return await runPrismaResolver(
                    {prismaClient},
                    'User',
                    {
                        where: {
                            role: {
                                equals: 'user',
                            },
                        },
                    },
                    {
                        fieldName: 'Users',
                        fieldNodes: [
                            {
                                kind: Kind.FIELD,
                                name: {
                                    kind: Kind.NAME,
                                    value: 'Users',
                                },
                            },
                        ],
                        operation: {
                            kind: Kind.OPERATION_DEFINITION,
                            operation: OperationTypeNode.QUERY,
                            selectionSet: {
                                kind: Kind.SELECTION_SET,
                                selections: [
                                    {
                                        kind: Kind.FIELD,
                                        name: {
                                            kind: Kind.NAME,
                                            value: 'Users',
                                        },
                                        selectionSet: {
                                            kind: Kind.SELECTION_SET,
                                            selections: [
                                                {
                                                    kind: Kind.FIELD,
                                                    name: {
                                                        kind: Kind.NAME,
                                                        value: 'total',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    },
                );
            },
            expect: {
                total: 2,
                messages: [],
                items: [],
            },
        },
        {
            it: 'fails on a subscription',
            async test({prismaClient}) {
                return await runPrismaResolver(
                    {prismaClient},
                    'User',
                    {},
                    {
                        fieldName: 'Users',
                        fieldNodes: [
                            {
                                kind: Kind.FIELD,
                                name: {
                                    kind: Kind.NAME,
                                    value: 'Users',
                                },
                            },
                        ],
                        operation: {
                            kind: Kind.OPERATION_DEFINITION,
                            operation: OperationTypeNode.SUBSCRIPTION,
                            selectionSet: {
                                kind: Kind.SELECTION_SET,
                                selections: [
                                    {
                                        kind: Kind.FIELD,
                                        name: {
                                            kind: Kind.NAME,
                                            value: 'Users',
                                        },
                                        selectionSet: {
                                            kind: Kind.SELECTION_SET,
                                            selections: [
                                                {
                                                    kind: Kind.FIELD,
                                                    name: {
                                                        kind: Kind.NAME,
                                                        value: 'total',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    },
                );
            },
            throws: "Unsupported operation: 'subscription'",
        },
        {
            it: 'rejects empty selection',
            async test({prismaClient}) {
                return await runPrismaResolver(
                    {prismaClient},
                    'User',
                    {
                        where: {
                            role: {
                                equals: 'user',
                            },
                        },
                    },
                    {
                        fieldName: 'Users',
                        fieldNodes: [
                            {
                                kind: Kind.FIELD,
                                name: {
                                    kind: Kind.NAME,
                                    value: 'Users',
                                },
                            },
                        ],
                        operation: {
                            kind: Kind.OPERATION_DEFINITION,
                            operation: OperationTypeNode.QUERY,
                            selectionSet: {
                                kind: Kind.SELECTION_SET,
                                selections: [
                                    {
                                        kind: Kind.FIELD,
                                        name: {
                                            kind: Kind.NAME,
                                            value: 'total',
                                        },
                                    },
                                ],
                            },
                        },
                    },
                );
            },
            throws: "Neither 'total' or 'items' where selected: there's nothing to do",
        },
    ],
};
