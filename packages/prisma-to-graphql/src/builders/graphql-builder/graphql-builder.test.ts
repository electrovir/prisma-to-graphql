import {itCases} from '@augment-vir/chai';
import {assert} from 'chai';
import {assertThrows} from 'run-time-assertions';
import {GraphqlBlockByType, GraphqlBlockType} from './graphql-block';
import {GraphqlBuildError} from './graphql-build.error';
import {
    buildGraphqlBlock,
    buildGraphqlComment,
    buildGraphqlEnumBlock,
    buildGraphqlOperationBlock,
    buildGraphqlPropertyBlock,
    buildGraphqlScalarBlock,
    buildGraphqlSchemaBlock,
    buildGraphqlSchemaString,
    buildGraphqlTypeBlock,
    buildGraphqlUnionBlock,
    flattenAllSchemaBlocks,
    flattenOperationBlocks,
    makeOperationsBlockBuilder,
} from './graphql-builder';
import {defaultGraphqlBuilderOptions} from './graphql-builder-options';

function indentOutput(indent: string, count: number, output: string): string {
    if (!output) {
        return '';
    }

    const fixedOutput = output
        .split('\n')
        .map((line) => {
            if (line) {
                return [
                    indent.repeat(count),
                    line,
                ].join('');
            } else {
                // handle empty lines, which shouldn't be indented
                return line;
            }
        })
        .join('\n');

    return [
        '',
        fixedOutput,
        indent.repeat(count - 1),
    ].join('\n');
}

function createGraphqlBlockBuilderTest<const BlockType extends GraphqlBlockType>(
    defaultOptions = defaultGraphqlBuilderOptions,
    indent = '    ',
    count = 4,
) {
    return (block: GraphqlBlockByType<BlockType>, options = defaultOptions): string =>
        indentOutput(indent, count, buildGraphqlBlock(block, options));
}

describe(buildGraphqlBlock.name, () => {
    it('errors if the given type is invalid', () => {
        assertThrows(() =>
            buildGraphqlBlock(
                // @ts-expect-error: this is not a valid block type.
                {type: 'invalid-type'},
                defaultGraphqlBuilderOptions,
            ),
        );
    });
});

describe(buildGraphqlUnionBlock.name, () => {
    itCases(createGraphqlBlockBuilderTest<'union'>(), [
        {
            it: 'rejects a union with no values',
            inputs: [
                {
                    type: 'union',
                    name: 'invalid',
                    values: [],
                },
            ],
            expect: '',
        },
        {
            it: 'builds a union',
            inputs: [
                {
                    type: 'union',
                    name: 'MyUnion',
                    values: [
                        'HI',
                        'BYE',
                    ],
                },
            ],
            expect: /* GraphQL */ `
                union MyUnion = HI | BYE
            `,
        },
    ]);
});

describe(buildGraphqlEnumBlock.name, () => {
    itCases(createGraphqlBlockBuilderTest<'enum'>(), [
        {
            it: 'rejects an enum with no values',
            inputs: [
                {
                    type: 'enum',
                    name: 'invalid',
                    values: [],
                },
            ],
            expect: '',
        },
        {
            it: 'builds an enum',
            inputs: [
                {
                    type: 'enum',
                    name: 'MyEnum',
                    values: [
                        'HI',
                        'BYE',
                    ],
                },
            ],
            expect: /* GraphQL */ `
                enum MyEnum {
                    HI
                    BYE
                }
            `,
        },
    ]);
});

describe(buildGraphqlTypeBlock.name, () => {
    itCases(createGraphqlBlockBuilderTest<'type' | 'input'>(), [
        {
            it: 'builds a required prop',
            inputs: [
                {
                    type: 'type',
                    name: 'Stuff',
                    props: [
                        {
                            type: 'property',
                            name: 'prop1',
                            value: 'Something',
                            required: true,
                        },
                    ],
                },
            ],
            expect: /* GraphQL */ `
                type Stuff {
                    prop1: Something!
                }
            `,
        },
        {
            it: 'works on a type block',
            inputs: [
                {
                    type: 'type',
                    name: 'BlahBlahBlah',
                    props: [
                        {
                            type: 'property',
                            name: 'Prop1',
                            value: 'MyProp',
                            required: false,
                        },
                        {
                            type: 'property',
                            name: 'Prop2',
                            value: 'MyProp',
                            required: false,
                        },
                        {
                            type: 'operation',
                            name: 'Op1',
                            args: [
                                {
                                    type: 'property',
                                    name: 'Arg1',
                                    value: 'String',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    name: 'Arg2',
                                    value: 'Int',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    name: 'Arg3',
                                    value: 'Int',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    name: 'Arg4',
                                    value: 'Int',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    name: 'Arg5',
                                    value: 'Int',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    name: 'Arg6',
                                    value: 'Int',
                                    required: false,
                                },
                            ],
                            output: {
                                value: 'Op1Output',
                                required: true,
                            },
                        },
                        {
                            type: 'property',
                            name: 'Prop3',
                            value: 'MyProp',
                            required: false,
                        },
                    ],
                },
            ],
            expect: /* GraphQL */ `
                type BlahBlahBlah {
                    Prop1: MyProp
                    Prop2: MyProp
                    Op1(
                        Arg1: String
                        Arg2: Int
                        Arg3: Int
                        Arg4: Int
                        Arg5: Int
                        Arg6: Int
                    ): Op1Output!
                    Prop3: MyProp
                }
            `,
        },
        {
            it: 'works on an input block',
            inputs: [
                {
                    type: 'input',
                    name: 'BlahBlahBlah',
                    props: [
                        {
                            type: 'property',
                            name: 'Prop1',
                            value: 'MyProp',
                            required: false,
                        },
                        {
                            type: 'property',
                            name: 'Prop2',
                            value: 'MyProp',
                            required: false,
                        },
                        {
                            type: 'operation',
                            name: 'Op1',
                            args: [
                                {
                                    type: 'property',
                                    name: 'Arg1',
                                    value: 'String',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    name: 'Arg2',
                                    value: 'Int',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    name: 'Arg3',
                                    value: 'Int',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    name: 'Arg4',
                                    value: 'Int',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    name: 'Arg5',
                                    value: 'Int',
                                    required: false,
                                },
                            ],
                            output: {
                                value: 'Op1Output',
                                required: true,
                            },
                        },
                        {
                            type: 'property',
                            name: 'Prop3',
                            value: 'MyProp',
                            required: false,
                        },
                    ],
                },
            ],
            expect: /* GraphQL */ `
                input BlahBlahBlah {
                    Prop1: MyProp
                    Prop2: MyProp
                    Op1(
                        Arg1: String
                        Arg2: Int
                        Arg3: Int
                        Arg4: Int
                        Arg5: Int
                    ): Op1Output!
                    Prop3: MyProp
                }
            `,
        },
        {
            it: 'includes comment',
            inputs: [
                {
                    type: 'type',
                    comment: ['comment here'],
                    name: 'Blah',
                    props: [
                        {
                            type: 'property',
                            name: 'Prop1',
                            value: 'MyProp',
                            required: false,
                        },
                    ],
                },
            ],
            expect: /* GraphQL */ `
                # comment here
                type Blah {
                    Prop1: MyProp
                }
            `,
        },
        {
            it: 'creates an empty block when there are no props',
            inputs: [
                {
                    type: 'type',
                    comment: ['comment here'],
                    name: 'Blah',
                    props: [],
                },
            ],
            expect: /* GraphQL */ `
                # comment here
                type Blah {}
            `,
        },
    ]);
});

describe(buildGraphqlComment.name, () => {
    itCases(buildGraphqlComment, [
        {
            it: 'builds a single line comment',
            inputs: [
                ['hello there'],
                '',
            ],
            expect: '# hello there',
        },
        {
            it: 'ignores a comment without any lines',
            inputs: [
                [],
                '',
            ],
            expect: '',
        },
        {
            it: 'ignores just white space comments',
            inputs: [
                [
                    '   ',
                    '   ',
                ],
                '',
            ],
            expect: '',
        },
        {
            it: 'removes empty lines',
            inputs: [
                [
                    'comment 1',
                    '',
                    'comment 2',
                ],
                '',
            ],
            expect: '# comment 1\n# comment 2',
        },
        {
            it: 'handles lines already with #',
            inputs: [
                [
                    '#comment 1',
                    '# comment 2',
                    'comment 3',
                ],
                '',
            ],
            expect: '#comment 1\n# comment 2\n# comment 3',
        },
        {
            it: 'properly indents each line',
            inputs: [
                [
                    '# comment 1',
                    '# comment 2',
                    'comment 3',
                ],
                '    ',
            ],
            expect: '    # comment 1\n    # comment 2\n    # comment 3',
        },
    ]);
});

describe(buildGraphqlOperationBlock.name, () => {
    itCases(createGraphqlBlockBuilderTest<'operation'>(), [
        {
            it: 'builds an operation with build-in indent',
            inputs: [
                {
                    type: 'operation',
                    name: 'myOp',
                    args: [
                        {
                            type: 'property',
                            name: 'arg1',
                            value: 'String',
                            required: false,
                        },
                    ],
                    output: {
                        value: 'MyOutput',
                        required: true,
                    },
                },
            ],
            expect: /* GraphQL */ `
                    myOp(
                        arg1: String
                    ): MyOutput!
            `,
        },
        {
            it: 'omits arg list if empty',
            inputs: [
                {
                    type: 'operation',
                    name: 'myOp',
                    args: [],
                    output: {
                        value: 'MyOutput',
                        required: true,
                    },
                },
            ],
            expect: /* GraphQL */ `
                    myOp: MyOutput!
            `,
        },
        {
            it: 'includes comment',
            inputs: [
                {
                    type: 'operation',
                    comment: [
                        'comment 1',
                        'comment 2',
                    ],
                    name: 'myOp',
                    args: [],
                    output: {
                        value: 'MyOutput',
                        required: true,
                    },
                },
            ],
            expect: /* GraphQL */ `
                    # comment 1
                    # comment 2
                    myOp: MyOutput!
            `,
        },
    ]);
});

describe(makeOperationsBlockBuilder.name, () => {
    itCases(createGraphqlBlockBuilderTest<'Mutation'>(), [
        {
            it: 'builds nothing if there are no mutations',
            inputs: [
                {
                    type: 'Mutation',
                    blocks: [],
                },
            ],
            expect: /* GraphQL */ ``,
        },
        {
            it: 'builds mutations',
            inputs: [
                {
                    type: 'Mutation',
                    comment: ['mutations comment'],
                    blocks: [
                        {
                            type: 'operation',
                            name: 'myOp',
                            args: [
                                {
                                    type: 'property',
                                    name: 'Arg1',
                                    value: 'String',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    name: 'Arg2',
                                    value: 'Int',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    comment: [
                                        'arg3 comment',
                                    ],
                                    name: 'Arg3',
                                    value: 'Int',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    name: 'Arg4',
                                    value: 'Int',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    comment: [
                                        'arg5 comment1',
                                        'arg5 comment2',
                                    ],
                                    name: 'Arg5',
                                    value: 'Int',
                                    required: false,
                                },
                            ],
                            output: {
                                value: 'OpOutput',
                                required: true,
                            },
                        },
                        {
                            type: 'operation',
                            comment: ['op2 comment'],
                            name: 'myOp2',
                            args: [],
                            output: {
                                value: 'OpOutput',
                                required: true,
                            },
                        },
                    ],
                },
            ],
            expect: /* GraphQL */ `
                # mutations comment
                type Mutation {
                    myOp(
                        Arg1: String
                        Arg2: Int
                        # arg3 comment
                        Arg3: Int
                        Arg4: Int
                        # arg5 comment1
                        # arg5 comment2
                        Arg5: Int
                    ): OpOutput!
                    # op2 comment
                    myOp2: OpOutput!
                }
            `,
        },
    ]);
    itCases(createGraphqlBlockBuilderTest<'Query'>(), [
        {
            it: 'builds nothing if there are no queries',
            inputs: [
                {
                    type: 'Query',
                    blocks: [],
                },
            ],
            expect: /* GraphQL */ ``,
        },
        {
            it: 'builds queries',
            inputs: [
                {
                    type: 'Query',
                    comment: ['queries comment'],
                    blocks: [
                        {
                            type: 'operation',
                            name: 'myOp',
                            args: [
                                {
                                    type: 'property',
                                    name: 'Arg1',
                                    value: 'String',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    name: 'Arg2',
                                    value: 'Int',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    comment: [
                                        'arg3 comment',
                                    ],
                                    name: 'Arg3',
                                    value: 'Int',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    name: 'Arg4',
                                    value: 'Int',
                                    required: false,
                                },
                                {
                                    type: 'property',
                                    comment: [
                                        'arg5 comment1',
                                        'arg5 comment2',
                                    ],
                                    name: 'Arg5',
                                    value: 'Int',
                                    required: false,
                                },
                            ],
                            output: {
                                value: 'OpOutput',
                                required: true,
                            },
                        },
                        {
                            type: 'operation',
                            comment: ['op2 comment'],
                            name: 'myOp2',
                            args: [],
                            output: {
                                value: 'OpOutput',
                                required: true,
                            },
                        },
                    ],
                },
            ],
            expect: /* GraphQL */ `
                # queries comment
                type Query {
                    myOp(
                        Arg1: String
                        Arg2: Int
                        # arg3 comment
                        Arg3: Int
                        Arg4: Int
                        # arg5 comment1
                        # arg5 comment2
                        Arg5: Int
                    ): OpOutput!
                    # op2 comment
                    myOp2: OpOutput!
                }
            `,
        },
    ]);
});

describe(buildGraphqlPropertyBlock.name, () => {
    itCases(createGraphqlBlockBuilderTest<'property'>(), [
        {
            it: 'builds a property',
            inputs: [
                {
                    type: 'property',
                    name: 'Prop1',
                    value: 'String',
                    required: false,
                },
            ],
            expect: /* GraphQL */ `
                    Prop1: String
            `,
        },
        {
            it: 'includes a comment',
            inputs: [
                {
                    type: 'property',
                    comment: [
                        'my comment1',
                        'my comment2',
                    ],
                    name: 'Prop1',
                    value: 'String',
                    required: false,
                },
            ],
            expect: /* GraphQL */ `
                    # my comment1
                    # my comment2
                    Prop1: String
            `,
        },
        {
            it: 'builds a required property',
            inputs: [
                {
                    type: 'property',
                    name: 'Prop1',
                    value: 'String',
                    required: true,
                },
            ],
            expect: /* GraphQL */ `
                    Prop1: String!
            `,
        },
    ]);
});

describe(buildGraphqlScalarBlock.name, () => {
    itCases(createGraphqlBlockBuilderTest<'scalar'>(), [
        {
            it: 'builds a scalar',
            inputs: [
                {
                    type: 'scalar',
                    name: 'DateTime',
                },
            ],
            expect: /* GraphQL */ `
                scalar DateTime
            `,
        },
        {
            it: 'includes a comment',
            inputs: [
                {
                    type: 'scalar',
                    comment: [
                        'comment 1',
                        'comment 2',
                    ],
                    name: 'DateTime',
                },
            ],
            expect: /* GraphQL */ `
                # comment 1
                # comment 2
                scalar DateTime
            `,
        },
    ]);
});

describe(flattenAllSchemaBlocks.name, () => {
    itCases(flattenAllSchemaBlocks, [
        {
            it: 'does nothing with no blocks',
            input: {
                type: 'schema',
                blocks: [],
            },
            expect: {
                blocks: [],
                comments: [],
            },
        },
        {
            it: 'simply extracts blocks from a non-nested schema',
            input: {
                type: 'schema',
                blocks: [
                    {
                        type: 'scalar',
                        name: 'MyScalar',
                    },
                    {
                        type: 'input',
                        name: 'hi',
                        props: [
                            {
                                type: 'property',
                                name: 'yo',
                                value: 'String',
                                required: false,
                            },
                        ],
                    },
                ],
            },
            expect: {
                blocks: [
                    {
                        type: 'scalar',
                        name: 'MyScalar',
                    },
                    {
                        type: 'input',
                        name: 'hi',
                        props: [
                            {
                                type: 'property',
                                name: 'yo',
                                value: 'String',
                                required: false,
                            },
                        ],
                    },
                ],
                comments: [],
            },
        },
        {
            it: 'flattens nested schemas',
            input: {
                type: 'schema',
                comment: ['top level comment'],
                blocks: [
                    {
                        type: 'scalar',
                        name: 'MyScalar1',
                    },
                    {
                        type: 'schema',
                        blocks: [
                            {
                                type: 'scalar',
                                name: 'MyScalar',
                            },
                            {
                                type: 'schema',
                                comment: ['nested comment'],
                                blocks: [
                                    {
                                        type: 'Query',
                                        blocks: [
                                            {
                                                type: 'property',
                                                name: 'Prop1',
                                                value: 'String',
                                                required: false,
                                            },
                                            {
                                                type: 'property',
                                                name: 'Prop2',
                                                value: 'String',
                                                required: false,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'input',
                        name: 'hi',
                        props: [
                            {
                                type: 'property',
                                name: 'yo',
                                value: 'String',
                                required: false,
                            },
                        ],
                    },
                ],
            },
            expect: {
                comments: [
                    'top level comment',
                    'nested comment',
                ],
                blocks: [
                    {
                        type: 'scalar',
                        name: 'MyScalar1',
                    },
                    {
                        type: 'scalar',
                        name: 'MyScalar',
                    },
                    {
                        type: 'Query',
                        blocks: [
                            {
                                type: 'property',
                                name: 'Prop1',
                                value: 'String',
                                required: false,
                            },
                            {
                                type: 'property',
                                name: 'Prop2',
                                value: 'String',
                                required: false,
                            },
                        ],
                    },
                    {
                        type: 'input',
                        name: 'hi',
                        props: [
                            {
                                type: 'property',
                                name: 'yo',
                                value: 'String',
                                required: false,
                            },
                        ],
                    },
                ],
            },
        },
    ]);
});

describe(flattenOperationBlocks.name, () => {
    itCases(flattenOperationBlocks, [
        {
            it: 'rejects an empty array',
            input: [],
            expect: undefined,
        },
        {
            it: 'rejects undefined',
            input: undefined,
            expect: undefined,
        },
        {
            it: 'rejects missing sub blocks',
            input: [
                {
                    type: 'Query',
                    blocks: [],
                },
                {
                    type: 'Mutation',
                    blocks: [],
                },
            ],
            expect: undefined,
        },
        {
            it: 'collapses multiple blocks',
            input: [
                {
                    type: 'Query',
                    comment: [
                        'comment 1',
                        'comment 2',
                    ],
                    blocks: [
                        {
                            type: 'operation',
                            comment: ['operation comment'],
                            name: 'firstOp',
                            args: [],
                            output: {
                                value: 'String',
                                required: true,
                            },
                        },
                    ],
                },
                {
                    type: 'Mutation',
                    blocks: [
                        {
                            type: 'operation',
                            name: 'secondOp',
                            args: [
                                {
                                    type: 'property',
                                    name: 'yo',
                                    value: 'Int',
                                    required: false,
                                },
                            ],
                            output: {
                                value: 'String',
                                required: true,
                            },
                        },
                    ],
                },
                {
                    type: 'Query',
                    comment: [
                        'comment 3',
                    ],
                    blocks: [
                        {
                            type: 'operation',
                            name: 'ThirdOp',
                            args: [],
                            output: {
                                value: 'String',
                                required: true,
                            },
                        },
                        {
                            type: 'operation',
                            comment: ['operation comment'],
                            name: 'FourthOp',
                            args: [],
                            output: {
                                value: 'String',
                                required: true,
                            },
                        },
                    ],
                },
            ],
            expect: {
                comments: [
                    'comment 1',
                    'comment 2',
                    'comment 3',
                ],
                blocks: [
                    {
                        type: 'operation',
                        comment: ['operation comment'],
                        name: 'firstOp',
                        args: [],
                        output: {
                            value: 'String',
                            required: true,
                        },
                    },
                    {
                        type: 'operation',
                        name: 'secondOp',
                        args: [
                            {
                                type: 'property',
                                name: 'yo',
                                value: 'Int',
                                required: false,
                            },
                        ],
                        output: {
                            value: 'String',
                            required: true,
                        },
                    },
                    {
                        type: 'operation',
                        name: 'ThirdOp',
                        args: [],
                        output: {
                            value: 'String',
                            required: true,
                        },
                    },
                    {
                        type: 'operation',
                        comment: ['operation comment'],
                        name: 'FourthOp',
                        args: [],
                        output: {
                            value: 'String',
                            required: true,
                        },
                    },
                ],
            },
        },
    ]);
});

describe(buildGraphqlSchemaBlock.name, () => {
    itCases(createGraphqlBlockBuilderTest<'schema'>(), [
        {
            it: 'builds nothing with no blocks',
            inputs: [
                {
                    type: 'schema',
                    blocks: [],
                },
            ],
            expect: '',
        },
        {
            it: 'builds a single child block',
            inputs: [
                {
                    type: 'schema',
                    blocks: [
                        {
                            type: 'scalar',
                            name: 'DateTime',
                        },
                    ],
                },
            ],
            expect: /* GraphQL */ `
                # generated by prisma-to-graphql

                scalar DateTime
            `,
        },
        {
            it: 'omits empty operation blocks',
            inputs: [
                {
                    type: 'schema',
                    blocks: [
                        {
                            type: 'Query',
                            blocks: [],
                        },
                        {
                            type: 'Mutation',
                            blocks: [],
                        },
                        {
                            type: 'scalar',
                            name: 'DateTime',
                        },
                    ],
                },
            ],
            expect: /* GraphQL */ `
                # generated by prisma-to-graphql

                scalar DateTime
            `,
        },
        {
            it: 'builds and sorts all blocks',
            inputs: [
                {
                    type: 'schema',
                    blocks: [
                        {
                            type: 'type',
                            name: 'Another',
                            props: [
                                {
                                    type: 'property',
                                    name: 'blue',
                                    value: 'Int',
                                    required: false,
                                },
                                {
                                    type: 'operation',
                                    name: 'doThing',
                                    args: [
                                        {
                                            type: 'property',
                                            name: 'arg1',
                                            value: 'String',
                                            required: false,
                                        },
                                        {
                                            type: 'property',
                                            name: 'arg2',
                                            value: 'Int',
                                            required: false,
                                        },
                                        {
                                            type: 'property',
                                            comment: [
                                                'arg3 comment',
                                            ],
                                            name: 'arg3',
                                            value: 'Int',
                                            required: false,
                                        },
                                        {
                                            type: 'property',
                                            name: 'arg4',
                                            value: 'Int',
                                            required: false,
                                        },
                                        {
                                            type: 'property',
                                            name: 'arg5',
                                            value: 'Int',
                                            required: false,
                                        },
                                    ],
                                    output: {
                                        value: 'String',
                                        required: true,
                                    },
                                },
                            ],
                        },
                        {
                            type: 'input',
                            name: 'Blah',
                            props: [
                                {
                                    type: 'property',
                                    name: 'violet',
                                    value: 'String',
                                    required: false,
                                },
                            ],
                        },
                        {
                            type: 'scalar',
                            name: 'Derp',
                        },
                        {
                            type: 'Mutation',
                            blocks: [
                                {
                                    type: 'property',
                                    name: 'MyProp',
                                    value: 'Derp',
                                    required: false,
                                },
                            ],
                        },
                        {
                            type: 'scalar',
                            name: 'DateTime',
                        },
                        {
                            type: 'Query',
                            blocks: [
                                {
                                    type: 'operation',
                                    name: 'myQuery',
                                    args: [
                                        {
                                            type: 'property',
                                            name: 'arg1',
                                            value: 'String',
                                            required: false,
                                        },
                                        {
                                            type: 'property',
                                            name: 'arg2',
                                            value: 'Int',
                                            required: false,
                                        },
                                        {
                                            type: 'property',
                                            name: 'arg3',
                                            value: 'Int',
                                            required: false,
                                        },
                                        {
                                            type: 'property',
                                            name: 'arg4',
                                            value: 'Int',
                                            required: false,
                                        },
                                        {
                                            type: 'property',
                                            name: 'arg5',
                                            value: 'Int',
                                            required: false,
                                        },
                                        {
                                            type: 'property',
                                            name: 'arg6',
                                            value: 'Int',
                                            required: false,
                                        },
                                    ],
                                    output: {
                                        value: 'MyOutput',
                                        required: true,
                                    },
                                },
                                {
                                    type: 'operation',
                                    name: 'myQuery2',
                                    args: [
                                        {
                                            type: 'property',
                                            name: 'arg1',
                                            value: 'String',
                                            required: false,
                                        },
                                        {
                                            type: 'property',
                                            name: 'arg2',
                                            value: 'Int',
                                            required: false,
                                        },
                                        {
                                            type: 'property',
                                            name: 'arg3',
                                            value: 'Int',
                                            required: false,
                                        },
                                        {
                                            type: 'property',
                                            name: 'arg4',
                                            value: 'Int',
                                            required: false,
                                        },
                                        {
                                            type: 'property',
                                            name: 'arg5',
                                            value: 'Int',
                                            required: false,
                                        },
                                        {
                                            type: 'property',
                                            name: 'arg6',
                                            value: 'Int',
                                            required: false,
                                        },
                                    ],
                                    output: {
                                        value: 'MyOutput',
                                        required: true,
                                    },
                                },
                            ],
                        },

                        {
                            type: 'scalar',
                            name: 'MyOutput',
                        },
                    ],
                },
            ],
            expect: /* GraphQL */ `
                # generated by prisma-to-graphql

                type Mutation {
                    MyProp: Derp
                }

                type Query {
                    myQuery(
                        arg1: String
                        arg2: Int
                        arg3: Int
                        arg4: Int
                        arg5: Int
                        arg6: Int
                    ): MyOutput!
                    myQuery2(
                        arg1: String
                        arg2: Int
                        arg3: Int
                        arg4: Int
                        arg5: Int
                        arg6: Int
                    ): MyOutput!
                }

                scalar Derp
                scalar DateTime
                scalar MyOutput

                type Another {
                    blue: Int
                    doThing(
                        arg1: String
                        arg2: Int
                        # arg3 comment
                        arg3: Int
                        arg4: Int
                        arg5: Int
                    ): String!
                }

                input Blah {
                    violet: String
                }
            `,
        },
        {
            it: 'combines multiple query blocks',
            inputs: [
                {
                    type: 'schema',
                    blocks: [
                        {
                            type: 'Mutation',
                            blocks: [
                                {
                                    type: 'property',
                                    name: 'mutate1',
                                    value: 'String',
                                    required: false,
                                },
                            ],
                        },
                        {
                            type: 'scalar',
                            name: 'DateTime',
                        },
                        {
                            type: 'Mutation',
                            blocks: [
                                {
                                    type: 'property',
                                    name: 'mutate2',
                                    value: 'Int',
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
            ],
            expect: /* GraphQL */ `
                # generated by prisma-to-graphql

                type Mutation {
                    mutate1: String
                    mutate2: Int
                }

                scalar DateTime
            `,
        },
        {
            it: 'errors with a top level property',
            inputs: [
                {
                    type: 'schema',
                    blocks: [
                        {
                            // @ts-expect-error: intentionally non-top-level block
                            type: 'property',
                            name: 'invalid',
                            value: 'TopLevel',
                        },
                    ],
                },
            ],
            throws: GraphqlBuildError,
        },
        {
            it: 'errors with a top level operation',
            inputs: [
                {
                    type: 'schema',
                    blocks: [
                        {
                            // @ts-expect-error: intentionally non-top-level block
                            type: 'operation',
                            name: 'invalid',
                            args: [],
                            output: {
                                value: 'String',
                                required: true,
                            },
                        },
                    ],
                },
            ],
            throws: GraphqlBuildError,
        },
    ]);
});

describe(buildGraphqlSchemaString.name, () => {
    it('also builds a schema', () => {
        const schema = buildGraphqlSchemaString(
            {
                type: 'schema',
                blocks: [
                    {
                        type: 'scalar',
                        name: 'DateTime',
                    },
                ],
            },
            defaultGraphqlBuilderOptions,
        );

        assert.deepStrictEqual(schema, `# generated by prisma-to-graphql\n\nscalar DateTime`);
    });
});
