import {
    awaitedForEach,
    filterMap,
    getObjectTypedEntries,
    isTruthy,
    mergePropertyArrays,
} from '@augment-vir/common';
import {notCommittedDir} from '@prisma-to-graphql/scripts';
import {DMMF} from '@prisma/generator-helper';
import {existsSync} from 'node:fs';
import {mkdir, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {
    GraphqlBlockByType,
    TopLevelNamedGraphqlBlock,
} from '../builders/graphql-builder/graphql-block';
import {
    buildGraphqlSchemaString,
    deduplicateNamedBlocks,
} from '../builders/graphql-builder/graphql-builder';
import {buildAllResolverBlocks} from '../builders/resolver-builder/resolver-builder';
import {buildSchemaTs} from './build-schema-ts';
import {compileTs} from './compile-ts';
import {GeneratedGraphql} from './generation/generated-graphql';
import {generateGraphqlModel} from './generation/model/generate-model';
import {parseDmmfModel} from './generation/model/parse-dmmf-model';
import {GeneratorOptions, defaultGeneratorOptions} from './generator-options';

/**
 * Reads inputs from a Prisma generator and then generates and writes all the needed GraphQL and JS
 * code required for a full Node.js GraphQL server to function.
 *
 * @category Prisma Generator
 */
export async function generate(dmmf: DMMF.Document, options: GeneratorOptions) {
    const graphqlOutputs = await generateGraphqlOutputs(dmmf, options);

    await writeOutputs(graphqlOutputs, options);
    await compileOutputs(options);
}

/**
 * All the outputs of the generator before writing them to their respective files.
 *
 * @category Prisma Generator
 */
export type GraphqlOutputs = {
    resolversTs: string;
    schema: string;
    schemaTs: string;
};

/**
 * All the original (non-compiled) generated file names from `prisma-to-graphql`. Note that this
 * does not include the compiled output file names for the TypeScript files.
 *
 * @category Prisma Generator
 */
export const graphqlOutputFileNames: GraphqlOutputs = {
    resolversTs: 'resolvers.ts',
    schema: 'schema.graphql',
    schemaTs: 'schema.ts',
};

/**
 * Generates all the `prisma-to-graphql` output file strings, ready to be written as files.
 *
 * @category Prisma Generator
 */
export async function generateGraphqlOutputs(
    dmmf: DMMF.Document,
    partialOptions: Partial<GeneratorOptions> = {},
): Promise<GraphqlOutputs> {
    const options = {
        ...defaultGeneratorOptions,
        ...partialOptions,
    };

    const prismaModels = filterMap(
        dmmf.datamodel.models,
        (model) => {
            return parseDmmfModel(model, options);
        },
        isTruthy,
    );

    const generatedModels = prismaModels.map((model) => generateGraphqlModel(model, options));

    const allGeneratedGraphql: GeneratedGraphql = mergePropertyArrays(...generatedModels);

    const allModels: GraphqlBlockByType<'type'> = {
        type: 'type',
        name: '_AllModels',
        props: prismaModels.map((model): GraphqlBlockByType<'property'> => {
            return {
                type: 'property',
                name: model.modelName,
                value: model.modelName,
                required: false,
            };
        }),
    };

    const resolversTs = buildAllResolverBlocks(allGeneratedGraphql.resolvers, options);

    const schemaString = buildGraphqlSchemaString(
        {
            type: 'schema',
            blocks: [
                allModels,
                ...allGeneratedGraphql.resolverBlocks,
                ...deduplicateNamedBlocks<TopLevelNamedGraphqlBlock>(
                    allGeneratedGraphql.topLevelNamedGraphqlBlocks,
                ),
            ],
        },
        options,
    );

    await writeFile(join(notCommittedDir, 'temp.graphql'), schemaString);

    const schemaTs = options.generateSchemaTs ? await buildSchemaTs(schemaString) : '';

    return {
        resolversTs,
        schema: schemaString,
        schemaTs,
    };
}

async function writeOutputs(
    graphqlOutputs: GraphqlOutputs,
    options: Readonly<Pick<GeneratorOptions, 'outputDir'>>,
) {
    await mkdir(options.outputDir, {recursive: true});

    await awaitedForEach(
        getObjectTypedEntries(graphqlOutputFileNames),
        async ([
            outputKey,
            outputFileName,
        ]) => {
            const output = graphqlOutputs[outputKey];
            if (!output) {
                return;
            }
            await writeFile(join(options.outputDir, outputFileName), output);
        },
    );
}

async function compileOutputs(options: Readonly<Pick<GeneratorOptions, 'outputDir'>>) {
    const tsOutputPaths = filterMap(
        Object.values(graphqlOutputFileNames),
        (fileName) => join(options.outputDir, fileName),
        (filePath) => filePath.endsWith('.ts') && existsSync(filePath),
    );

    await compileTs(tsOutputPaths);
}
