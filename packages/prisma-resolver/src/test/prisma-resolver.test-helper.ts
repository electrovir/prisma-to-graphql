import {outputMessages} from '@prisma-to-graphql/resolver-context';
import {Kind, OperationTypeNode} from 'graphql';
import {runPrismaResolver} from '../run-prisma-resolver';
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
            it: 'rejects selection data that is too deep',
            async test({prismaClient}) {
                return await runPrismaResolver(
                    {
                        prismaClient,
                        operationScope: {
                            maxDepth: 2,
                        },
                    },
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
                                                        value: 'items',
                                                    },
                                                    selectionSet: {
                                                        kind: Kind.SELECTION_SET,
                                                        selections: [
                                                            {
                                                                kind: Kind.FIELD,
                                                                name: {
                                                                    kind: Kind.NAME,
                                                                    value: 'regions',
                                                                },
                                                                selectionSet: {
                                                                    kind: Kind.SELECTION_SET,
                                                                    selections: [
                                                                        {
                                                                            kind: Kind.FIELD,
                                                                            name: {
                                                                                kind: Kind.NAME,
                                                                                value: 'regionName',
                                                                            },
                                                                        },
                                                                    ],
                                                                },
                                                            },
                                                        ],
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
            throws: outputMessages.byDescription['max depth violated'].message({
                depth: 6,
                maxDepth: 2,
                capitalizedName: 'Selection',
            }),
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
            throws: outputMessages.byDescription['missing query args'].message(),
        },
    ],
};
