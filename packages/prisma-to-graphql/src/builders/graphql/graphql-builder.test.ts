import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {OperationType} from '@prisma-to-graphql/core';
import {GraphqlBlockByType, GraphqlBlockType} from './graphql-block.js';
import {GraphqlBuildError} from './graphql-build.error.js';
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
} from './graphql-builders/graphql-builder.js';

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

function createGraphqlBlockBuilderTest<const BlockType extends GraphqlBlockType | OperationType>(
    indent = '    ',
    count = 4,
) {
    return (block: GraphqlBlockByType[BlockType]): string =>
        indentOutput(indent, count, buildGraphqlBlock(block));
}

describe(buildGraphqlBlock.name, () => {
    it('errors if the given type is invalid', () => {
        assert.throws(() =>
            buildGraphqlBlock(
                // @ts-expect-error: this is not a valid block type.
                {type: 'invalid-type'},
            ),
        );
    });
});

describe(buildGraphqlUnionBlock.name, () => {
    itCases(createGraphqlBlockBuilderTest<GraphqlBlockType.Union>(), [
        {
            it: 'rejects a union with no values',
            input: {
                type: GraphqlBlockType.Union,
                name: 'invalid',
                values: [],
            },
            expect: '',
        },
        {
            it: 'builds a union',
            input: {
                type: GraphqlBlockType.Union,
                name: 'MyUnion',
                values: [
                    'HI',
                    'BYE',
                ],
            },
            expect: /* GraphQL */ `
                union MyUnion = HI | BYE
            `,
        },
    ]);
});

describe(buildGraphqlEnumBlock.name, () => {
    itCases(createGraphqlBlockBuilderTest<GraphqlBlockType.Enum>(), [
        {
            it: 'rejects an enum with no values',
            input: {
                type: GraphqlBlockType.Enum,
                name: 'invalid',
                values: [],
            },
            expect: '',
        },
        {
            it: 'builds an enum',
            input: {
                type: GraphqlBlockType.Enum,
                name: 'MyEnum',
                values: [
                    'HI',
                    'BYE',
                ],
            },
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
    itCases(createGraphqlBlockBuilderTest<GraphqlBlockType.Type | GraphqlBlockType.Input>(), [
        {
            it: 'builds a required prop',
            input: {
                type: GraphqlBlockType.Type,
                name: 'Stuff',
                props: [
                    {
                        type: GraphqlBlockType.Property,
                        name: 'prop1',
                        value: 'Something',
                        required: true,
                    },
                ],
            },
            expect: /* GraphQL */ `
                type Stuff {
                    prop1: Something!
                }
            `,
        },
        {
            it: 'works on a type block',
            input: {
                type: GraphqlBlockType.Type,
                name: 'BlahBlahBlah',
                props: [
                    {
                        type: GraphqlBlockType.Property,
                        name: 'Prop1',
                        value: 'MyProp',
                        required: false,
                    },
                    {
                        type: GraphqlBlockType.Property,
                        name: 'Prop2',
                        value: 'MyProp',
                        required: false,
                    },
                    {
                        type: GraphqlBlockType.Operation,
                        name: 'Op1',
                        args: [
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Arg1',
                                value: 'String',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Arg2',
                                value: 'Int',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Arg3',
                                value: 'Int',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Arg4',
                                value: 'Int',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Arg5',
                                value: 'Int',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
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
                        type: GraphqlBlockType.Property,
                        name: 'Prop3',
                        value: 'MyProp',
                        required: false,
                    },
                ],
            },
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
            input: {
                type: GraphqlBlockType.Input,
                name: 'BlahBlahBlah',
                props: [
                    {
                        type: GraphqlBlockType.Property,
                        name: 'Prop1',
                        value: 'MyProp',
                        required: false,
                    },
                    {
                        type: GraphqlBlockType.Property,
                        name: 'Prop2',
                        value: 'MyProp',
                        required: false,
                    },
                    {
                        type: GraphqlBlockType.Operation,
                        name: 'Op1',
                        args: [
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Arg1',
                                value: 'String',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Arg2',
                                value: 'Int',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Arg3',
                                value: 'Int',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Arg4',
                                value: 'Int',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
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
                        type: GraphqlBlockType.Property,
                        name: 'Prop3',
                        value: 'MyProp',
                        required: false,
                    },
                ],
            },
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
            input: {
                type: GraphqlBlockType.Type,
                comment: ['comment here'],
                name: 'Blah',
                props: [
                    {
                        type: GraphqlBlockType.Property,
                        name: 'Prop1',
                        value: 'MyProp',
                        required: false,
                    },
                ],
            },
            expect: /* GraphQL */ `
                # comment here
                type Blah {
                    Prop1: MyProp
                }
            `,
        },
        {
            it: 'creates an empty block when there are no props',
            input: {
                type: GraphqlBlockType.Type,
                comment: ['comment here'],
                name: 'Blah',
                props: [],
            },
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
    itCases(createGraphqlBlockBuilderTest<GraphqlBlockType.Operation>(), [
        {
            it: 'builds an optional output',
            input: {
                type: GraphqlBlockType.Operation,
                name: 'myOp',
                args: [
                    {
                        type: GraphqlBlockType.Property,
                        name: 'arg1',
                        value: 'String',
                        required: false,
                    },
                ],
                output: {
                    value: 'MyOutput',
                    required: false,
                },
            },
            expect: /* GraphQL */ `
                    myOp(
                        arg1: String
                    ): MyOutput
            `,
        },
        {
            it: 'builds an operation with build-in indent',
            input: {
                type: GraphqlBlockType.Operation,
                name: 'myOp',
                args: [
                    {
                        type: GraphqlBlockType.Property,
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
            expect: /* GraphQL */ `
                    myOp(
                        arg1: String
                    ): MyOutput!
            `,
        },
        {
            it: 'omits arg list if empty',
            input: {
                type: GraphqlBlockType.Operation,
                name: 'myOp',
                args: [],
                output: {
                    value: 'MyOutput',
                    required: true,
                },
            },
            expect: /* GraphQL */ `
                    myOp: MyOutput!
            `,
        },
        {
            it: 'includes comment',
            input: {
                type: GraphqlBlockType.Operation,
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
            expect: /* GraphQL */ `
                    # comment 1
                    # comment 2
                    myOp: MyOutput!
            `,
        },
    ]);
});

describe(makeOperationsBlockBuilder.name, () => {
    itCases(createGraphqlBlockBuilderTest<OperationType.Mutation>(), [
        {
            it: 'builds nothing if there are no mutations',
            input: {
                type: OperationType.Mutation,
                blocks: [],
            },
            expect: /* GraphQL */ ``,
        },
        {
            it: 'builds mutations',
            input: {
                type: OperationType.Mutation,
                comment: ['mutations comment'],
                blocks: [
                    {
                        type: GraphqlBlockType.Operation,
                        name: 'myOp',
                        args: [
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Arg1',
                                value: 'String',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Arg2',
                                value: 'Int',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                comment: [
                                    'arg3 comment',
                                ],
                                name: 'Arg3',
                                value: 'Int',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Arg4',
                                value: 'Int',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
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
                        type: GraphqlBlockType.Operation,
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
    itCases(createGraphqlBlockBuilderTest<OperationType.Query>(), [
        {
            it: 'builds nothing if there are no queries',
            input: {
                type: OperationType.Query,
                blocks: [],
            },
            expect: /* GraphQL */ ``,
        },
        {
            it: 'builds queries',
            input: {
                type: OperationType.Query,
                comment: ['queries comment'],
                blocks: [
                    {
                        type: GraphqlBlockType.Operation,
                        name: 'myOp',
                        args: [
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Arg1',
                                value: 'String',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Arg2',
                                value: 'Int',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                comment: [
                                    'arg3 comment',
                                ],
                                name: 'Arg3',
                                value: 'Int',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Arg4',
                                value: 'Int',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
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
                        type: GraphqlBlockType.Operation,
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
    itCases(createGraphqlBlockBuilderTest<GraphqlBlockType.Property>(), [
        {
            it: 'builds a property',
            input: {
                type: GraphqlBlockType.Property,
                name: 'Prop1',
                value: 'String',
                required: false,
            },
            expect: /* GraphQL */ `
                    Prop1: String
            `,
        },
        {
            it: 'includes a comment',
            input: {
                type: GraphqlBlockType.Property,
                comment: [
                    'my comment1',
                    'my comment2',
                ],
                name: 'Prop1',
                value: 'String',
                required: false,
            },
            expect: /* GraphQL */ `
                    # my comment1
                    # my comment2
                    Prop1: String
            `,
        },
        {
            it: 'builds a required property',
            input: {
                type: GraphqlBlockType.Property,
                name: 'Prop1',
                value: 'String',
                required: true,
            },
            expect: /* GraphQL */ `
                    Prop1: String!
            `,
        },
    ]);
});

describe(buildGraphqlScalarBlock.name, () => {
    itCases(createGraphqlBlockBuilderTest<GraphqlBlockType.Scalar>(), [
        {
            it: 'builds a scalar',
            input: {
                type: GraphqlBlockType.Scalar,
                name: 'DateTime',
            },
            expect: /* GraphQL */ `
                scalar DateTime
            `,
        },
        {
            it: 'includes a comment',
            input: {
                type: GraphqlBlockType.Scalar,
                comment: [
                    'comment 1',
                    'comment 2',
                ],
                name: 'DateTime',
            },
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
                type: GraphqlBlockType.Schema,
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
                type: GraphqlBlockType.Schema,
                blocks: [
                    {
                        type: GraphqlBlockType.Scalar,
                        name: 'MyScalar',
                    },
                    {
                        type: GraphqlBlockType.Input,
                        name: 'hi',
                        props: [
                            {
                                type: GraphqlBlockType.Property,
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
                        type: GraphqlBlockType.Scalar,
                        name: 'MyScalar',
                    },
                    {
                        type: GraphqlBlockType.Input,
                        name: 'hi',
                        props: [
                            {
                                type: GraphqlBlockType.Property,
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
                type: GraphqlBlockType.Schema,
                comment: ['top level comment'],
                blocks: [
                    {
                        type: GraphqlBlockType.Scalar,
                        name: 'MyScalar1',
                    },
                    {
                        type: GraphqlBlockType.Schema,
                        blocks: [
                            {
                                type: GraphqlBlockType.Scalar,
                                name: 'MyScalar',
                            },
                            {
                                type: GraphqlBlockType.Schema,
                                comment: ['nested comment'],
                                blocks: [
                                    {
                                        type: OperationType.Query,
                                        blocks: [
                                            {
                                                type: GraphqlBlockType.Property,
                                                name: 'Prop1',
                                                value: 'String',
                                                required: false,
                                            },
                                            {
                                                type: GraphqlBlockType.Property,
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
                        type: GraphqlBlockType.Input,
                        name: 'hi',
                        props: [
                            {
                                type: GraphqlBlockType.Property,
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
                        type: GraphqlBlockType.Scalar,
                        name: 'MyScalar1',
                    },
                    {
                        type: GraphqlBlockType.Scalar,
                        name: 'MyScalar',
                    },
                    {
                        type: OperationType.Query,
                        blocks: [
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Prop1',
                                value: 'String',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'Prop2',
                                value: 'String',
                                required: false,
                            },
                        ],
                    },
                    {
                        type: GraphqlBlockType.Input,
                        name: 'hi',
                        props: [
                            {
                                type: GraphqlBlockType.Property,
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
                    type: OperationType.Query,
                    blocks: [],
                },
                {
                    type: OperationType.Mutation,
                    blocks: [],
                },
            ],
            expect: undefined,
        },
        {
            it: 'collapses multiple blocks',
            input: [
                {
                    type: OperationType.Query,
                    comment: [
                        'comment 1',
                        'comment 2',
                    ],
                    blocks: [
                        {
                            type: GraphqlBlockType.Operation,
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
                    type: OperationType.Mutation,
                    blocks: [
                        {
                            type: GraphqlBlockType.Operation,
                            name: 'secondOp',
                            args: [
                                {
                                    type: GraphqlBlockType.Property,
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
                    type: OperationType.Query,
                    comment: [
                        'comment 3',
                    ],
                    blocks: [
                        {
                            type: GraphqlBlockType.Operation,
                            name: 'ThirdOp',
                            args: [],
                            output: {
                                value: 'String',
                                required: true,
                            },
                        },
                        {
                            type: GraphqlBlockType.Operation,
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
                        type: GraphqlBlockType.Operation,
                        comment: ['operation comment'],
                        name: 'firstOp',
                        args: [],
                        output: {
                            value: 'String',
                            required: true,
                        },
                    },
                    {
                        type: GraphqlBlockType.Operation,
                        name: 'secondOp',
                        args: [
                            {
                                type: GraphqlBlockType.Property,
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
                        type: GraphqlBlockType.Operation,
                        name: 'ThirdOp',
                        args: [],
                        output: {
                            value: 'String',
                            required: true,
                        },
                    },
                    {
                        type: GraphqlBlockType.Operation,
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
    itCases(createGraphqlBlockBuilderTest<GraphqlBlockType.Schema>(), [
        {
            it: 'builds nothing with no blocks',
            input: {
                type: GraphqlBlockType.Schema,
                blocks: [],
            },
            expect: '',
        },
        {
            it: 'builds a single child block',
            input: {
                type: GraphqlBlockType.Schema,
                blocks: [
                    {
                        type: GraphqlBlockType.Scalar,
                        name: 'DateTime',
                    },
                ],
            },
            expect: /* GraphQL */ `
                # generated by prisma-to-graphql

                scalar DateTime
            `,
        },
        {
            it: 'omits empty operation blocks',
            input: {
                type: GraphqlBlockType.Schema,
                blocks: [
                    {
                        type: OperationType.Query,
                        blocks: [],
                    },
                    {
                        type: OperationType.Mutation,
                        blocks: [],
                    },
                    {
                        type: GraphqlBlockType.Scalar,
                        name: 'DateTime',
                    },
                ],
            },
            expect: /* GraphQL */ `
                # generated by prisma-to-graphql

                scalar DateTime
            `,
        },
        {
            it: 'builds and sorts all blocks',
            input: {
                type: GraphqlBlockType.Schema,
                blocks: [
                    {
                        type: GraphqlBlockType.Type,
                        name: 'Another',
                        props: [
                            {
                                type: GraphqlBlockType.Property,
                                name: 'blue',
                                value: 'Int',
                                required: false,
                            },
                            {
                                type: GraphqlBlockType.Operation,
                                name: 'doThing',
                                args: [
                                    {
                                        type: GraphqlBlockType.Property,
                                        name: 'arg1',
                                        value: 'String',
                                        required: false,
                                    },
                                    {
                                        type: GraphqlBlockType.Property,
                                        name: 'arg2',
                                        value: 'Int',
                                        required: false,
                                    },
                                    {
                                        type: GraphqlBlockType.Property,
                                        comment: [
                                            'arg3 comment',
                                        ],
                                        name: 'arg3',
                                        value: 'Int',
                                        required: false,
                                    },
                                    {
                                        type: GraphqlBlockType.Property,
                                        name: 'arg4',
                                        value: 'Int',
                                        required: false,
                                    },
                                    {
                                        type: GraphqlBlockType.Property,
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
                        type: GraphqlBlockType.Input,
                        name: 'Blah',
                        props: [
                            {
                                type: GraphqlBlockType.Property,
                                name: 'violet',
                                value: 'String',
                                required: false,
                            },
                        ],
                    },
                    {
                        type: GraphqlBlockType.Scalar,
                        name: 'Derp',
                    },
                    {
                        type: OperationType.Mutation,
                        blocks: [
                            {
                                type: GraphqlBlockType.Property,
                                name: 'MyProp',
                                value: 'Derp',
                                required: false,
                            },
                        ],
                    },
                    {
                        type: GraphqlBlockType.Scalar,
                        name: 'DateTime',
                    },
                    {
                        type: OperationType.Query,
                        blocks: [
                            {
                                type: GraphqlBlockType.Operation,
                                name: 'myQuery',
                                args: [
                                    {
                                        type: GraphqlBlockType.Property,
                                        name: 'arg1',
                                        value: 'String',
                                        required: false,
                                    },
                                    {
                                        type: GraphqlBlockType.Property,
                                        name: 'arg2',
                                        value: 'Int',
                                        required: false,
                                    },
                                    {
                                        type: GraphqlBlockType.Property,
                                        name: 'arg3',
                                        value: 'Int',
                                        required: false,
                                    },
                                    {
                                        type: GraphqlBlockType.Property,
                                        name: 'arg4',
                                        value: 'Int',
                                        required: false,
                                    },
                                    {
                                        type: GraphqlBlockType.Property,
                                        name: 'arg5',
                                        value: 'Int',
                                        required: false,
                                    },
                                    {
                                        type: GraphqlBlockType.Property,
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
                                type: GraphqlBlockType.Operation,
                                name: 'myQuery2',
                                args: [
                                    {
                                        type: GraphqlBlockType.Property,
                                        name: 'arg1',
                                        value: 'String',
                                        required: false,
                                    },
                                    {
                                        type: GraphqlBlockType.Property,
                                        name: 'arg2',
                                        value: 'Int',
                                        required: false,
                                    },
                                    {
                                        type: GraphqlBlockType.Property,
                                        name: 'arg3',
                                        value: 'Int',
                                        required: false,
                                    },
                                    {
                                        type: GraphqlBlockType.Property,
                                        name: 'arg4',
                                        value: 'Int',
                                        required: false,
                                    },
                                    {
                                        type: GraphqlBlockType.Property,
                                        name: 'arg5',
                                        value: 'Int',
                                        required: false,
                                    },
                                    {
                                        type: GraphqlBlockType.Property,
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
                        type: GraphqlBlockType.Scalar,
                        name: 'MyOutput',
                    },
                ],
            },
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
            input: {
                type: GraphqlBlockType.Schema,
                blocks: [
                    {
                        type: OperationType.Mutation,
                        blocks: [
                            {
                                type: GraphqlBlockType.Property,
                                name: 'mutate1',
                                value: 'String',
                                required: false,
                            },
                        ],
                    },
                    {
                        type: GraphqlBlockType.Scalar,
                        name: 'DateTime',
                    },
                    {
                        type: OperationType.Mutation,
                        blocks: [
                            {
                                type: GraphqlBlockType.Property,
                                name: 'mutate2',
                                value: 'Int',
                                required: false,
                            },
                        ],
                    },
                ],
            },
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
            it: 'errors with a top level Property',
            input: {
                type: GraphqlBlockType.Schema,
                blocks: [
                    {
                        // @ts-expect-error: intentionally non-top-level block
                        type: GraphqlBlockType.Property,
                        name: 'invalid',
                        value: 'TopLevel',
                    },
                ],
            },
            throws: {
                matchConstructor: GraphqlBuildError,
            },
        },
        {
            it: 'errors with a top level Operation',
            input: {
                type: GraphqlBlockType.Schema,
                blocks: [
                    {
                        // @ts-expect-error: intentionally non-top-level block
                        type: GraphqlBlockType.Operation,
                        name: 'invalid',
                        args: [],
                        output: {
                            value: 'String',
                            required: true,
                        },
                    },
                ],
            },
            throws: {
                matchConstructor: GraphqlBuildError,
            },
        },
    ]);
});

describe(buildGraphqlSchemaString.name, () => {
    it('also builds a schema', () => {
        const schema = buildGraphqlSchemaString({
            type: GraphqlBlockType.Schema,
            blocks: [
                {
                    type: GraphqlBlockType.Scalar,
                    name: 'DateTime',
                },
            ],
        });

        assert.strictEquals(schema, `# generated by prisma-to-graphql\n\nscalar DateTime`);
    });
});
