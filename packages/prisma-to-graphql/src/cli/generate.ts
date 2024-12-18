import {
    awaitedForEach,
    filterMap,
    getObjectTypedEntries,
    mergePropertyArrays,
} from '@augment-vir/common';
import {type DMMF} from '@prisma/generator-helper';
import {existsSync} from 'node:fs';
import {mkdir, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {
    GraphqlBlockType,
    type GraphqlBlockByType,
    type TopLevelNamedGraphqlBlock,
} from '../builders/graphql/graphql-block.js';
import {
    buildGraphqlSchemaString,
    deduplicateNamedBlocks,
} from '../builders/graphql/graphql-builder.js';
import {buildEnum} from '../builders/prisma/build-enum.js';
import {buildModel} from '../builders/prisma/build-model.js';
import {parseDmmfModel} from '../builders/prisma/dmmf-model.js';
import type {BuildOutput} from '../builders/resolvers/resolver-builder.js';
import {buildSchemaTs} from '../builders/typescript/graphql-typescript-codegen.js';
import {type PrismaToGraphqlGeneratorOptions} from '../generator-options/generator-options.js';

/**
 * Reads inputs from a Prisma generator and then generates and writes all the needed GraphQL and JS
 * code required for a full Node.js GraphQL server to function.
 *
 * @category Prisma Generator
 */
export async function generate(
    dmmf: DMMF.Document,
    options: Readonly<PrismaToGraphqlGeneratorOptions>,
) {
    const graphqlOutputs = await buildAllOutputs(dmmf, options);

    await writeOutputs(graphqlOutputs, options);
    await compileOutputs(options);
}

/**
 * Builds all the `prisma-to-graphql` output file strings, ready to be written to files.
 *
 * @category Prisma Generator
 */
export async function buildAllOutputs(
    dmmf: DMMF.Document,
    options: Readonly<PrismaToGraphqlGeneratorOptions>,
): Promise<PrismaToGraphqlOutputs> {
    const builtEnums = dmmf.datamodel.enums.map(buildEnum);
    const enumNames = builtEnums.map((builtEnum) => builtEnum.name);
    const prismaModels = dmmf.datamodel.models.map((model) => parseDmmfModel(model, enumNames));

    const builtModels = prismaModels.map((model) => buildModel(model, options));

    const builtOutputs: BuildOutput = mergePropertyArrays(...builtModels);

    const allModels: GraphqlBlockByType['type'] = {
        type: GraphqlBlockType.Type,
        name: '_AllModels',
        props: prismaModels.map((model): GraphqlBlockByType['property'] => {
            return {
                type: GraphqlBlockType.Property,
                name: model.modelName,
                value: model.modelName,
                required: false,
            };
        }),
    };

    const schemaString = buildGraphqlSchemaString({
        type: GraphqlBlockType.Schema,
        blocks: [
            allModels,
            ...builtOutputs.resolverGraphqlBlocks,
            ...deduplicateNamedBlocks<TopLevelNamedGraphqlBlock>(
                builtOutputs.topLevelNamedGraphqlBlocks,
            ),
            ...deduplicateNamedBlocks<TopLevelNamedGraphqlBlock>(builtEnums),
        ],
    });

    return {
        schemaTs: await buildSchemaTs(schemaString),
        graphqlSchema: schemaString,
    };
}

/**
 * All the outputs of the generator before writing them to their respective files.
 *
 * @category Internal
 */
export type PrismaToGraphqlOutputs = {
    // resolversTs: string;
    graphqlSchema: string;
    schemaTs: string;
    // modelsTs: string;
};

/**
 * All the original (non-compiled) generated file names from `prisma-to-graphql`. Note that this
 * does not include the compiled output file names for the TypeScript files.
 *
 * @category Internal
 */
export const graphqlOutputFileNames: PrismaToGraphqlOutputs = {
    // resolversTs: 'resolvers.ts',
    graphqlSchema: 'schema.graphql',
    schemaTs: 'schema.ts',
    // modelsTs: 'models.ts',
};

async function writeOutputs(
    graphqlOutputs: PrismaToGraphqlOutputs,
    options: Readonly<Pick<PrismaToGraphqlGeneratorOptions, 'outputDirPath'>>,
) {
    await mkdir(options.outputDirPath, {recursive: true});

    await awaitedForEach(
        getObjectTypedEntries(graphqlOutputFileNames),
        async ([
            outputKey,
            outputFileName,
        ]) => {
            const output = graphqlOutputs[outputKey];
            await writeFile(join(options.outputDirPath, outputFileName), output + '\n');
        },
    );
}

async function compileOutputs(
    options: Readonly<Pick<PrismaToGraphqlGeneratorOptions, 'outputDirPath'>>,
) {
    const tsOutputPaths = filterMap(
        Object.values(graphqlOutputFileNames),
        (fileName) => join(options.outputDirPath, fileName),
        (filePath) => filePath.endsWith('.ts') && existsSync(filePath),
    );

    await compileTs(tsOutputPaths);
}
