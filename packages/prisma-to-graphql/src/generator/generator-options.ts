import {PropertyValueType, mapObjectValues} from '@augment-vir/common';
import {GeneratorConfig} from '@prisma/generator-helper';
import {parseEnvValue} from '@prisma/internals';
import {join} from 'node:path';
import {and, defineShape} from 'object-shape-tester';
import {isRunTimeType} from 'run-time-assertions';
import {generationOptionsShape} from './generation/generation-options';

/**
 * Shape definition for all supported `prisma-to-graphql` options, for use as run-time validation.
 *
 * @category Prisma Generator
 */
export const generatorOptionsShape = defineShape(
    and(
        {
            /** The folder path to output all generated outputs. */
            outputDir: join('node_modules', '.prisma', 'graphql'),
        },
        generationOptionsShape,
    ),
);

/**
 * All supported options for the `prisma-to-graphql` generator. They are assigned in the Prisma
 * schema file which is passed to the generator.
 *
 * @category Main Types
 */
export type GeneratorOptions = typeof generatorOptionsShape.runTimeType;
/**
 * All default options for the `prisma-to-graphql` generator.
 *
 * @category Prisma Generator
 */
export const defaultGeneratorOptions = generatorOptionsShape.defaultValue;

/**
 * Reads all options for the `prisma-to-graphql` generator from the current Prisma generator
 * context.
 *
 * @category Prisma Generator
 */
export function readGeneratorOptions(
    generatorConfig: Readonly<Pick<GeneratorConfig, 'output' | 'config'>>,
): GeneratorOptions {
    const output = generatorConfig.output
        ? parseEnvValue(generatorConfig.output)
        : generatorOptionsShape.defaultValue.outputDir;

    const finalOptions: Record<
        keyof GeneratorOptions,
        PropertyValueType<GeneratorOptions>
    > = mapObjectValues(defaultGeneratorOptions, (key, defaultValue) => {
        if (key === 'outputDir') {
            return output;
        }

        const overrideValue = parseOverrideValue(generatorConfig.config[key], defaultValue);

        return overrideValue ?? defaultValue;
    });

    return finalOptions as GeneratorOptions;
}

function parseOverrideValue(
    overrideValue: string | string[] | undefined,
    defaultValue: PropertyValueType<GeneratorOptions>,
): PropertyValueType<GeneratorOptions> | undefined {
    if (!overrideValue || isRunTimeType(overrideValue, 'array')) {
        return undefined;
    }

    if (isRunTimeType(defaultValue, 'boolean')) {
        return String(overrideValue) === 'true';
    } else {
        return overrideValue;
    }
}
