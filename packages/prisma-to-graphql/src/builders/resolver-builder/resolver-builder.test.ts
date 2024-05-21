import {itCases} from '@augment-vir/chai';
import {
    buildAllResolverBlocks,
    buildGenericResolverBlock,
    buildPrismaResolverBlock,
    buildResolverBlock,
    buildResolverFunctionSignature,
} from './resolver-builder';
import {defaultResolverBuilderOptions} from './resolver-builder-options';

describe(buildGenericResolverBlock.name, () => {
    itCases(buildGenericResolverBlock, [
        {
            it: 'simply returns the body',
            input: {
                type: 'generic',
                resolverName: 'myResolver',
                operationType: 'Query',
                body: 'this is from the body',
            },
            expect: {
                body: 'this is from the body',
            },
        },
    ]);
});

describe(buildPrismaResolverBlock.name, () => {
    itCases(buildPrismaResolverBlock, [
        {
            it: 'builds a prisma operation body',
            inputs: [
                {
                    type: 'prisma',
                    resolverName: 'MyResolver',
                    operationType: 'Query',
                    prismaModelName: 'User',
                },
                defaultResolverBuilderOptions,
            ],
            expect: {
                body: "return await runPrismaResolver(context, 'User', graphqlArgs, resolveInfo);",
            },
        },
    ]);
});

describe(buildResolverFunctionSignature.name, () => {
    itCases(buildResolverFunctionSignature, [
        {
            it: 'builds a resolver signature',
            input: {
                resolverName: 'myResolver',
                operationType: 'Mutation',
            },
            expect: 'async function Mutation_myResolver(parentValue: unknown, graphqlArgs: unknown, context: unknown, resolveInfo: GraphQLResolveInfo) {',
        },
    ]);
});

describe(buildResolverBlock.name, () => {
    itCases(buildResolverBlock, [
        {
            it: 'rejects invalid options',
            inputs: [
                {
                    type: 'generic',
                    resolverName: 'whatever',
                    operationType: 'Query',
                    body: 'derp',
                },
                {
                    // @ts-expect-error: this is intentionally invalid
                    invalidOption: 'fake',
                },
            ],
            throws: Error,
        },
        {
            it: 'builds a resolver',
            inputs: [
                {
                    type: 'prisma',
                    resolverName: 'MyResolver',
                    operationType: 'Query',
                    prismaModelName: 'User',
                },
                defaultResolverBuilderOptions,
            ],
            expect: {
                resolver:
                    "async function Query_MyResolver(parentValue: unknown, graphqlArgs: unknown, context: unknown, resolveInfo: GraphQLResolveInfo) {\n    return await runPrismaResolver(context, 'User', graphqlArgs, resolveInfo);\n}",
                operationType: 'Query',
            },
        },
        {
            it: 'builds an empty resolver',
            inputs: [
                {
                    type: 'generic',
                    resolverName: 'MyResolver2',
                    operationType: 'Mutation',
                    body: '',
                },
                defaultResolverBuilderOptions,
            ],
            expect: {
                resolver:
                    'async function Mutation_MyResolver2(parentValue: unknown, graphqlArgs: unknown, context: unknown, resolveInfo: GraphQLResolveInfo) {}',
                operationType: 'Mutation',
            },
        },
        {
            it: 'rejects an invalid block type',
            inputs: [
                {
                    // @ts-expect-error: intentionally incorrect block type for the test
                    type: 'fake block',
                    resolverName: 'MyResolver2',
                    operationType: 'Mutation',
                    body: '',
                },
                defaultResolverBuilderOptions,
            ],
            throws: Error,
        },
    ]);
});

describe(buildAllResolverBlocks.name, () => {
    itCases(buildAllResolverBlocks, [
        {
            it: 'rejects when missing blocks',
            inputs: [
                [],
                defaultResolverBuilderOptions,
            ],
            expect: '',
        },
        {
            it: 'builds the whole file',
            inputs: [
                [
                    {
                        type: 'prisma',
                        resolverName: 'MyResolver',
                        operationType: 'Query',
                        prismaModelName: 'User',
                    },
                    {
                        type: 'generic',
                        resolverName: 'MyResolver2',
                        operationType: 'Mutation',
                        body: '',
                    },
                ],
                defaultResolverBuilderOptions,
            ],
            expect: `// generated by prisma-to-graphql

import {GraphQLResolveInfo} from 'graphql';
import {runPrismaResolver} from '@prisma-to-graphql/prisma-resolver';

async function Query_MyResolver(parentValue: unknown, graphqlArgs: unknown, context: unknown, resolveInfo: GraphQLResolveInfo) {
    return await runPrismaResolver(context, 'User', graphqlArgs, resolveInfo);
}

async function Mutation_MyResolver2(parentValue: unknown, graphqlArgs: unknown, context: unknown, resolveInfo: GraphQLResolveInfo) {}

export const resolvers = {
    Mutation: {
        MyResolver2: Mutation_MyResolver2,
    },
    Query: {
        MyResolver: Query_MyResolver,
    },
};
`,
        },
        {
            it: 'handles missing mutations',
            inputs: [
                [
                    {
                        type: 'prisma',
                        resolverName: 'MyResolver',
                        operationType: 'Query',
                        prismaModelName: 'User',
                    },
                ],
                defaultResolverBuilderOptions,
            ],
            expect: `// generated by prisma-to-graphql

import {GraphQLResolveInfo} from 'graphql';
import {runPrismaResolver} from '@prisma-to-graphql/prisma-resolver';

async function Query_MyResolver(parentValue: unknown, graphqlArgs: unknown, context: unknown, resolveInfo: GraphQLResolveInfo) {
    return await runPrismaResolver(context, 'User', graphqlArgs, resolveInfo);
}

export const resolvers = {
    Query: {
        MyResolver: Query_MyResolver,
    },
};
`,
        },
    ]);
});
