import {generatorHandler} from '@prisma/generator-helper';
import {join} from 'node:path';
import {readThisPackageJson} from '../util/package-file';
import {generate} from './generate';
import {readGeneratorOptions} from './generator-options';

const defaultOutputDir = join('node_modules', '.prisma', 'graphql');

/**
 * Registers the generator with Prisma so it can be triggered via a `prisma generate` command.
 *
 * @category Prisma Generator
 */
export function registerGenerator() {
    generatorHandler({
        onManifest() {
            return {
                defaultOutput: defaultOutputDir,
                prettyName: 'GraphQL Schema Generator',
                version: readThisPackageJson().version,
            };
        },
        async onGenerate({generator, dmmf}) {
            try {
                const options = readGeneratorOptions(generator);

                dmmf.datamodel.models;

                await generate(dmmf, options);
            } catch (error) {
                console.info(error);
                throw error;
            }
        },
    });
}
