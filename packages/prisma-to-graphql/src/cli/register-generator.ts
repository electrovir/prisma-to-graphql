import {log} from '@augment-vir/common';
import generatorHelper from '@prisma/generator-helper';
import {version} from '../../package.json';
import {
    defaultPrismaToGraphqlGeneratorOptions,
    readPrismaToGraphqlGeneratorOptions,
} from '../generator-options/generator-options.js';
import {generate} from './generate.js';

/**
 * Registers the generator with Prisma so it can be triggered via a `prisma generate` command.
 *
 * @category Prisma Generator
 */
export function registerGenerator() {
    generatorHelper.generatorHandler({
        onManifest() {
            return {
                defaultOutput: defaultPrismaToGraphqlGeneratorOptions.outputDirPath,
                prettyName: 'GraphQL Schema Generator',
                version,
            };
        },
        async onGenerate({generator, dmmf, otherGenerators}) {
            try {
                const options = readPrismaToGraphqlGeneratorOptions(generator, otherGenerators);

                await generate(dmmf, options);
                /**
                 * Make sure to log errors, but I don't know how to internally trigger a real error
                 * so ignore this in code coverage.
                 */
                /* node:coverage ignore next 4 */
            } catch (error) {
                log.error(error);
                throw error;
            }
        },
    });
}
