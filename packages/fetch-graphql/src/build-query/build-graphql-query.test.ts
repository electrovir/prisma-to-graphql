import {itCases} from '@augment-vir/chai';
import {buildGraphqlQuery} from './build-graphql-query';

function testCreateGraphqlQuery(
    ...args: Parameters<typeof buildGraphqlQuery>
): ReturnType<typeof buildGraphqlQuery> {
    const output = buildGraphqlQuery(...args);

    const indentedQueryLines = output.query.split('\n').map((line) =>
        [
            '                    ',
            line,
        ].join(''),
    );

    return {
        ...output,
        query: [
            '',
            ...indentedQueryLines,
            '                ',
        ].join('\n'),
    };
}

describe(buildGraphqlQuery.name, () => {
    itCases(testCreateGraphqlQuery, [
        {
            it: 'creates a single mutation',
            input: {
                operationType: 'Mutation',
                operationName: 'DoThing',
                operations: {
                    MyResolver: {
                        select: {
                            id: true,
                            email: true,
                        },
                        args: {
                            arg1: {here: 'there', no: 'where'},
                            arg2: 'yo',
                        },
                    },
                },
                operationParams: {
                    Mutation: {
                        MyResolver: {
                            args: {
                                arg1: 'MyResolver_Arg1_Input',
                                arg2: 'String',
                            },
                            output: 'MyResolver_Output',
                        },
                    },
                    Query: {},
                },
            },
            expect: {
                // to maintain arg wrapping
                // prettier-ignore
                query: /* GraphQL */ `
                    mutation DoThing(
                        $MyResolver_0_arg1_var: MyResolver_Arg1_Input
                        $MyResolver_0_arg2_var: String
                    ) {
                        MyResolver(
                            arg1: $MyResolver_0_arg1_var
                            arg2: $MyResolver_0_arg2_var
                        ) {
                            id
                            email
                        }
                    }
                `,
                variables: {
                    MyResolver_0_arg1_var: {here: 'there', no: 'where'},
                    MyResolver_0_arg2_var: 'yo',
                },
            },
        },
        {
            it: 'omits missing args',
            input: {
                operationType: 'Mutation',
                operationName: 'DoThing',
                operations: {
                    MyResolver: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
                operationParams: {
                    Mutation: {
                        MyResolver: {
                            args: {
                                arg1: 'MyResolver_Arg1_Input',
                                arg2: 'String',
                            },
                            output: 'MyResolver_Output',
                        },
                    },
                    Query: {},
                },
            },
            expect: {
                query: /* GraphQL */ `
                    mutation DoThing {
                        MyResolver {
                            id
                            email
                        }
                    }
                `,
                variables: {},
            },
        },
        {
            it: 'handles an alias',
            input: {
                operationType: 'Mutation',
                operationName: 'DoThing',
                operations: {
                    MyResolver: {
                        alias: 'fakeAlias',
                        select: {
                            id: true,
                            email: true,
                        },
                        args: {
                            arg1: {here: 'there', no: 'where'},
                            arg2: 'yo',
                        },
                    },
                },
                operationParams: {
                    Mutation: {
                        MyResolver: {
                            args: {
                                arg1: 'MyResolver_Arg1_Input',
                                arg2: 'String',
                            },
                            output: 'MyResolver_Output',
                        },
                    },
                    Query: {},
                },
            },
            expect: {
                // to maintain arg wrapping
                // prettier-ignore
                query: /* GraphQL */ `
                    mutation DoThing(
                        $MyResolver_0_arg1_var: MyResolver_Arg1_Input
                        $MyResolver_0_arg2_var: String
                    ) {
                        fakeAlias: MyResolver(
                            arg1: $MyResolver_0_arg1_var
                            arg2: $MyResolver_0_arg2_var
                        ) {
                            id
                            email
                        }
                    }
                `,
                variables: {
                    MyResolver_0_arg1_var: {here: 'there', no: 'where'},
                    MyResolver_0_arg2_var: 'yo',
                },
            },
        },
        {
            it: 'creates a nested query',
            input: {
                operationType: 'Query',
                operationName: 'DoThing',
                operations: {
                    Users: {
                        args: {
                            where: {
                                role: {equals: 'user'},
                            },
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
                operationParams: {
                    Query: {
                        Users: {
                            args: {
                                where: 'Users_Where',
                            },
                            output: 'Users_Output',
                        },
                    },
                    Mutation: {},
                },
            },
            expect: {
                // to maintain arg wrapping
                // prettier-ignore
                query: /* GraphQL */ `
                    query DoThing(
                        $Users_0_where_var: Users_Where
                    ) {
                        Users(
                            where: $Users_0_where_var
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
                variables: {
                    Users_0_where_var: {
                        role: {equals: 'user'},
                    },
                },
            },
        },
        {
            it: 'creates multiple queries',
            input: {
                operationType: 'Query',
                operationName: 'Do Thing2',
                operations: {
                    MyResolver: {
                        select: {
                            id: true,
                            email: true,
                        },
                        args: {
                            arg1: {here: 'there', no: 'where'},
                            arg2: 'yo',
                        },
                    },
                    MyResolver2: {
                        select: {
                            id: true,
                            firstName: true,
                        },
                        args: {
                            MyArg: 42,
                        },
                    },
                },
                operationParams: {
                    Mutation: {},
                    Query: {
                        MyResolver: {
                            args: {
                                arg1: 'MyResolver_Arg1_Input',
                                arg2: 'String',
                            },
                            output: 'MyResolver_Output',
                        },
                        MyResolver2: {
                            args: {
                                MyArg: 'Int',
                            },
                            output: 'String',
                        },
                    },
                },
            },
            expect: {
                // to maintain arg wrapping
                // prettier-ignore
                query: /* GraphQL */ `
                    query Do_Thing2(
                        $MyResolver_0_arg1_var: MyResolver_Arg1_Input
                        $MyResolver_0_arg2_var: String
                        $MyResolver2_0_MyArg_var: Int
                    ) {
                        MyResolver(
                            arg1: $MyResolver_0_arg1_var
                            arg2: $MyResolver_0_arg2_var
                        ) {
                            id
                            email
                        }
                        MyResolver2(
                            MyArg: $MyResolver2_0_MyArg_var
                        ) {
                            id
                            firstName
                        }
                    }
                `,
                variables: {
                    MyResolver_0_arg1_var: {here: 'there', no: 'where'},
                    MyResolver_0_arg2_var: 'yo',
                    MyResolver2_0_MyArg_var: 42,
                },
            },
        },
        {
            it: 'handles multiple queries to the same resolver',
            input: {
                operationType: 'Query',
                operationName: 'doubleQuery',
                operations: {
                    MyResolver: [
                        {
                            select: {
                                id: true,
                                email: true,
                            },
                            args: {
                                arg1: {here: 'there', no: 'where'},
                                arg2: 'yo',
                            },
                        },
                        {
                            alias: 'secondMyResolver',
                            select: {
                                id: true,
                                email: true,
                            },
                            args: {
                                arg1: {here: 'there', no: 'where'},
                                arg2: 'yo',
                            },
                        },
                    ],
                    MyResolver2: {
                        select: {
                            id: true,
                            firstName: true,
                        },
                        args: {
                            MyArg: 42,
                        },
                    },
                },
                operationParams: {
                    Mutation: {},
                    Query: {
                        MyResolver: {
                            args: {
                                arg1: 'MyResolver_Arg1_Input',
                                arg2: 'String',
                            },
                            output: 'MyResolver_Output',
                        },
                        MyResolver2: {
                            args: {
                                MyArg: 'Int',
                            },
                            output: 'String',
                        },
                    },
                },
            },
            expect: {
                // to maintain arg wrapping
                // prettier-ignore
                query: /* GraphQL */ `
                    query doubleQuery(
                        $MyResolver_0_arg1_var: MyResolver_Arg1_Input
                        $MyResolver_0_arg2_var: String
                        $MyResolver_1_arg1_var: MyResolver_Arg1_Input
                        $MyResolver_1_arg2_var: String
                        $MyResolver2_0_MyArg_var: Int
                    ) {
                        MyResolver(
                            arg1: $MyResolver_0_arg1_var
                            arg2: $MyResolver_0_arg2_var
                        ) {
                            id
                            email
                        }
                        secondMyResolver: MyResolver(
                            arg1: $MyResolver_1_arg1_var
                            arg2: $MyResolver_1_arg2_var
                        ) {
                            id
                            email
                        }
                        MyResolver2(
                            MyArg: $MyResolver2_0_MyArg_var
                        ) {
                            id
                            firstName
                        }
                    }
                `,
                variables: {
                    MyResolver_0_arg1_var: {here: 'there', no: 'where'},
                    MyResolver_0_arg2_var: 'yo',
                    MyResolver_1_arg1_var: {here: 'there', no: 'where'},
                    MyResolver_1_arg2_var: 'yo',
                    MyResolver2_0_MyArg_var: 42,
                },
            },
        },
    ]);
});
