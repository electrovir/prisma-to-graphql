import {check} from '@augment-vir/assert';
import {mapObjectValues, SelectFrom, type Values} from '@augment-vir/common';
import {type GeneratorConfig} from '@prisma/generator-helper';
import prismaInternals from '@prisma/internals';
import {join} from 'node:path';
import {and, defineShape} from 'object-shape-tester';
import {graphqlGenerationOptionsShape} from './graphql-options.js';
import {getOriginalPrismaJsClientOutputPath} from './prisma-js-client.js';

/**
 * Shape definition for all supported `prisma-to-graphql` generator options, for use as run-time
 * validation.
 *
 * @category Internal
 */
export const prismaToGraphqlGeneratorOptionsShape = defineShape(
    and(
        {
            /**
             * The folder path to output all generated `prisma-to-graphql` outputs.
             *
             * This defaults to a `graphql` folder inside of your Prisma JS client's output path.
             */
            outputDirPath: join('node_modules', '.prisma', 'graphql'),
        },
        graphqlGenerationOptionsShape,
    ),
);

/**
 * All supported options for the `prisma-to-graphql` generator. They are assigned in the Prisma
 * schema file which is passed to the generator.
 *
 * @category Prisma Generator
 */
export type PrismaToGraphqlGeneratorOptions =
    typeof prismaToGraphqlGeneratorOptionsShape.runtimeType;
/**
 * All default options for the `prisma-to-graphql` generator.
 *
 * @category Internal
 */
export const defaultPrismaToGraphqlGeneratorOptions =
    prismaToGraphqlGeneratorOptionsShape.defaultValue;

/**
 * Reads all options for the `prisma-to-graphql` generator from the current Prisma generator
 * context.
 *
 * @category Internal
 */
export function readPrismaToGraphqlGeneratorOptions(
    generatorConfig: Readonly<Pick<GeneratorConfig, 'output' | 'config' | 'isCustomOutput'>>,
    otherGenerators: ReadonlyArray<
        Readonly<
            SelectFrom<
                GeneratorConfig,
                {
                    provider: {
                        value: true;
                    };
                    output: true;
                }
            >
        >
    >,
): PrismaToGraphqlGeneratorOptions {
    const outputPath = determineOutputDir(generatorConfig, otherGenerators);

    const finalOptions: Record<
        keyof PrismaToGraphqlGeneratorOptions,
        Values<PrismaToGraphqlGeneratorOptions>
    > = mapObjectValues(defaultPrismaToGraphqlGeneratorOptions, (key, defaultValue) => {
        if (key === 'outputDirPath') {
            return outputPath;
        }

        const overrideValue = parseOverrideValue(generatorConfig.config[key], defaultValue);

        return overrideValue ?? defaultValue;
    });

    return finalOptions as PrismaToGraphqlGeneratorOptions;
}

function determineOutputDir(
    generatorConfig: Readonly<Pick<GeneratorConfig, 'output' | 'isCustomOutput'>>,
    otherGenerators: ReadonlyArray<
        Readonly<
            SelectFrom<
                GeneratorConfig,
                {
                    provider: {
                        value: true;
                    };
                    output: true;
                }
            >
        >
    >,
) {
    if (generatorConfig.isCustomOutput && generatorConfig.output) {
        return prismaInternals.parseEnvValue(generatorConfig.output);
    }
    const jsClientOutputPath = getOriginalPrismaJsClientOutputPath(otherGenerators);

    if (!jsClientOutputPath) {
        return defaultPrismaToGraphqlGeneratorOptions.outputDirPath;
    }

    return join(jsClientOutputPath, 'graphql');
}

function parseOverrideValue(
    overrideValue: string | string[] | undefined,
    defaultValue: Values<PrismaToGraphqlGeneratorOptions>,
): Values<PrismaToGraphqlGeneratorOptions> | undefined {
    if (!overrideValue || check.isArray(overrideValue)) {
        return undefined;
    }

    if (check.isBoolean(defaultValue)) {
        return String(overrideValue) === 'true';
        /** We don't have any non-boolean values yet. */
        /* node:coverage ignore next 3 */
    } else {
        return overrideValue;
    }
}
