import {itCases} from '@augment-vir/chai';
import {buildOperationQuery} from './build-operation-query';

describe(buildOperationQuery.name, () => {
    itCases(buildOperationQuery, [
        {
            it: 'builds an operation query',
            input: {
                resolverName: 'MyResolver',
                operationType: 'Query',
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
                operationParams: {
                    Query: {
                        MyResolver: {
                            args: {
                                arg1: 'Arg1',
                            },
                            output: 'MyResolver_Output',
                        },
                    },
                    Mutation: {},
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
                operationType: 'Query',
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
                operationParams: {
                    Query: {
                        MyResolver: {
                            args: {
                                arg1: 'Arg1',
                            },
                            output: 'MyResolver_Output',
                        },
                    },
                    Mutation: {},
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
