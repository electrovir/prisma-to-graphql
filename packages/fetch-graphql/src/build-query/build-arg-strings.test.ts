import {itCases} from '@augment-vir/chai';
import {buildArgStrings, buildArgVariableName} from './build-arg-strings';

describe(buildArgVariableName.name, () => {
    itCases(buildArgVariableName, [
        {
            it: 'builds a var name with index',
            input: {
                resolverName: 'MyResolver',
                argName: 'MyArg',
                operationIndex: 2,
            },
            expect: 'MyResolver_2_MyArg_var',
        },
    ]);
});

describe(buildArgStrings.name, () => {
    itCases(buildArgStrings, [
        {
            it: 'returns nothing for an empty arg list',
            input: {
                resolverName: 'MyResolver',
                args: {},
                operationParams: {
                    Query: {
                        MyResolver: {
                            args: {
                                arg1: 'Arg1_Input',
                                something: 'Arg2_Input',
                            },
                            output: 'MyResolver_Output',
                        },
                    },
                    Mutation: {},
                },
                indent: '    ',
                argPlace: 'usage',
                operationType: 'Query',
                operationIndex: 0,
            },
            expect: [],
        },
        {
            it: 'builds arg usage strings',
            input: {
                resolverName: 'MyResolver',
                args: {
                    arg1: 'hello there',
                    something: 'hi',
                },
                operationParams: {
                    Query: {
                        MyResolver: {
                            args: {
                                arg1: 'Arg1_Input',
                                something: 'Arg2_Input',
                            },
                            output: 'MyResolver_Output',
                        },
                    },
                    Mutation: {},
                },
                indent: '    ',
                argPlace: 'usage',
                operationType: 'Query',
                operationIndex: 0,
            },
            expect: [
                '    arg1: $MyResolver_0_arg1_var',
                '    something: $MyResolver_0_something_var',
            ],
        },
        {
            it: 'builds arg definition strings',
            input: {
                resolverName: 'MyResolver',
                args: {
                    arg1: 'hello there',
                    something: 'hi',
                },
                operationParams: {
                    Query: {
                        MyResolver: {
                            args: {
                                arg1: 'Arg1_Input',
                                something: 'Arg2_Input',
                            },
                            output: 'MyResolver_Output',
                        },
                    },
                    Mutation: {},
                },
                indent: '    ',
                argPlace: 'definition',
                operationType: 'Query',
                operationIndex: 0,
            },
            expect: [
                '    $MyResolver_0_arg1_var: Arg1_Input',
                '    $MyResolver_0_something_var: Arg2_Input',
            ],
        },
        {
            it: 'fails if an arg type is missing',
            input: {
                resolverName: 'MyResolver',
                args: {
                    arg1: 'hello there',
                    something: 'hi',
                    argMissing: 'error here',
                },
                operationParams: {
                    Query: {
                        MyResolver: {
                            args: {
                                arg1: 'Arg1_Input',
                                something: 'Arg2_Input',
                            },
                            output: 'MyResolver_Output',
                        },
                    },
                    Mutation: {},
                },
                indent: '    ',
                argPlace: 'definition',
                operationType: 'Query',
                operationIndex: 0,
            },
            throws: "Failed to find argument type for 'Query -> MyResolver -> argMissing'",
        },
    ]);
});
