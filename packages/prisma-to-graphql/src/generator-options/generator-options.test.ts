import {describe, itCases} from '@augment-vir/test';
import {join} from 'node:path';
import {
    defaultPrismaToGraphqlGeneratorOptions,
    readPrismaToGraphqlGeneratorOptions,
} from './generator-options.js';

describe(readPrismaToGraphqlGeneratorOptions.name, () => {
    itCases(readPrismaToGraphqlGeneratorOptions, [
        {
            it: 'defaults the output path if no client js generator is found',
            inputs: [
                {
                    config: {},
                    isCustomOutput: false,
                    output: null,
                },
                [],
            ],
            expect: defaultPrismaToGraphqlGeneratorOptions,
        },
        {
            it: 'uses the prisma client js output path',
            inputs: [
                {
                    config: {},
                    isCustomOutput: false,
                    output: null,
                },
                [
                    {
                        provider: {
                            value: 'prisma-client-js',
                        },
                        output: {
                            fromEnvVar: null,
                            value: join('custom', 'path'),
                        },
                    },
                ],
            ],
            expect: {
                ...defaultPrismaToGraphqlGeneratorOptions,
                outputDirPath: join('custom', 'path', 'graphql'),
            },
        },
        {
            it: 'handles a missing prisma client js output path',
            inputs: [
                {
                    config: {},
                    isCustomOutput: false,
                    output: null,
                },
                [
                    {
                        provider: {
                            value: 'prisma-client-js',
                        },
                        output: null,
                    },
                ],
            ],
            expect: defaultPrismaToGraphqlGeneratorOptions,
        },
        {
            it: 'uses an output override',
            inputs: [
                {
                    config: {},
                    isCustomOutput: true,
                    output: {
                        fromEnvVar: null,
                        value: join('another', 'path'),
                    },
                },
                [
                    {
                        provider: {
                            value: 'prisma-client-js',
                        },
                        output: {
                            fromEnvVar: null,
                            value: join('custom', 'path'),
                        },
                    },
                ],
            ],
            expect: {
                ...defaultPrismaToGraphqlGeneratorOptions,
                outputDirPath: join('another', 'path'),
            },
        },
        {
            it: 'parses boolean options',
            inputs: [
                {
                    config: {
                        generateQuery: 'false',
                    },
                    isCustomOutput: false,
                    output: null,
                },
                [],
            ],
            expect: {
                ...defaultPrismaToGraphqlGeneratorOptions,
                generateQuery: false,
            },
        },
        {
            it: 'ignores an array option value',
            inputs: [
                {
                    config: {
                        generateQuery: ['false'],
                    },
                    isCustomOutput: false,
                    output: null,
                },
                [],
            ],
            expect: defaultPrismaToGraphqlGeneratorOptions,
        },
        {
            it: 'ignores an array option value',
            inputs: [
                {
                    config: {
                        generateQuery: ['false'],
                    },
                    isCustomOutput: false,
                    output: null,
                },
                [],
            ],
            expect: defaultPrismaToGraphqlGeneratorOptions,
        },
    ]);
});
