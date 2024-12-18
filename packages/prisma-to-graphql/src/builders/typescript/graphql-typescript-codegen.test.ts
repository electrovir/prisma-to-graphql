import {describe, snapshotCases} from '@augment-vir/test';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {schemaTestFilesPath} from '../../file-paths.mock.js';
import {buildSchemaTs} from './graphql-typescript-codegen.js';

describe(buildSchemaTs.name, () => {
    async function testBuildSchemaTs(testName: string) {
        const graphqlSchemaFilePath = join(
            schemaTestFilesPath,
            testName,
            'output',
            'schema.graphql',
        );
        const graphqlSchema = String(await readFile(graphqlSchemaFilePath));
        return await buildSchemaTs(graphqlSchema);
    }

    const testFilesSubDirNames = [
        'multi-model',
        'scalar-list',
    ];

    snapshotCases(
        testBuildSchemaTs,
        testFilesSubDirNames.map((subDirName) => {
            return {
                it: subDirName,
                input: subDirName,
            };
        }),
    );
});
