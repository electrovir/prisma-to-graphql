import {describe, itCases} from '@augment-vir/test';
import {OperationType} from '@prisma-to-graphql/core';
import {buildOperationQuery} from './build-operation-query.js';

describe(buildOperationQuery.name, () => {
    itCases(buildOperationQuery, [
        {
            it: 'builds an operation query',
            input: {
                resolverName: 'MyResolver',
                operationType: OperationType.Query,
                operation: {
                    alias: 'MyAlias',
                    args: {
                        arg1: 'arg value',
                    },
                    select: {
                        something: true,
                        nested: {
                            nestedSomething: true,
                        },
                    },
                },
                options: {
                    indent: '    ',
                },
                schemaOperationTypeNames: {
                    [OperationType.Query]: {
                        MyResolver: {
                            args: {
                                arg1: 'Arg1',
                            },
                            output: 'MyResolver_Output',
                        },
                    },
                    [OperationType.Mutation]: {},
                },
                operationIndex: 2,
            },
            expect: {
                queries: [
                    `    MyAlias: MyResolver(
        arg1: $MyResolver_2_arg1_var
    ) {
        something
        nested {
            nestedSomething
        }
    }`,
                ],
                varDefinitions: [
                    '    $MyResolver_2_arg1_var: Arg1',
                ],
                variables: [
                    [
                        'MyResolver_2_arg1_var',
                        'arg value',
                    ],
                ],
            },
        },
        {
            it: 'omits missing args',
            input: {
                resolverName: 'MyResolver',
                operationType: OperationType.Query,
                operation: {
                    alias: 'MyAlias',
                    select: {
                        something: true,
                        nested: {
                            nestedSomething: true,
                        },
                    },
                },
                options: {
                    indent: '    ',
                },
                schemaOperationTypeNames: {
                    [OperationType.Query]: {
                        MyResolver: {
                            args: {
                                arg1: 'Arg1',
                            },
                            output: 'MyResolver_Output',
                        },
                    },
                    [OperationType.Mutation]: {},
                },
                operationIndex: 2,
            },
            expect: {
                queries: [
                    `    MyAlias: MyResolver {
        something
        nested {
            nestedSomething
        }
    }`,
                ],
                varDefinitions: [],
                variables: [],
            },
        },
    ]);
});
