import {check} from '@augment-vir/assert';
import {
    collapseWhiteSpace,
    filterMap,
    mapObjectValues,
    omitObjectKeys,
    removeColor,
} from '@augment-vir/common';
import {interpolationSafeWindowsPath, runShellCommand} from '@augment-vir/node';
import {describe, snapshotCases} from '@augment-vir/test';
import {existsSync} from 'node:fs';
import {mkdir, readdir, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {monoRepoPath, prismaToGraphqlPackagePath, schemaTestFilesPath} from '../file-paths.mock.js';
import {assertValidGraphql} from '../validate-graphql.js';
import {buildAllOutputs} from './generate.js';

const allSchemaTestNames = await readdir(schemaTestFilesPath);

const exclusiveTests: string[] = [
    // 'relational-operations',
];

async function testGeneration(schemaTestName: string) {
    const testPath = join(schemaTestFilesPath, schemaTestName);
    const outputsPath = join(testPath, 'output');
    const prismaSchemaPath = join(testPath, 'schema.prisma');
    await rm(outputsPath, {recursive: true, force: true});
    await mkdir(outputsPath, {recursive: true});

    const commandOutput = await runShellCommand(
        `npx prisma generate --no-hints --schema ${interpolationSafeWindowsPath(prismaSchemaPath)}`,
        {
            cwd: prismaToGraphqlPackagePath,
            // // uncomment for debugging
            // hookUpToConsole: true,
        },
    );

    const graphqlSchemaPath = join(outputsPath, 'schema.graphql');

    if (existsSync(graphqlSchemaPath)) {
        assertValidGraphql({path: graphqlSchemaPath}, 'GraphQL schema assertion failed.');
    }

    return mapObjectValues(
        omitObjectKeys(commandOutput, [
            'error',
            'exitSignal',
        ]),
        (key, value) => {
            if (check.isString(value)) {
                return collapseWhiteSpace(
                    removeColor(value)
                        .replaceAll(/ in [\d.]+m?s/g, '')
                        .replaceAll(monoRepoPath, '')
                        .replaceAll(
                            /Generated GraphQL Schema Generator \([^)]+\) to/g,
                            'Generated GraphQL Schema Generator to',
                        ),
                );
            } else {
                return value;
            }
        },
    );
}

describe(buildAllOutputs.name, () => {
    snapshotCases(
        testGeneration,
        filterMap(
            allSchemaTestNames,
            (schemaTestName) => {
                if (exclusiveTests.length && !exclusiveTests.includes(schemaTestName)) {
                    return undefined;
                }

                return {
                    it: `generates outputs for 'test-files/${schemaTestName}'`,
                    input: schemaTestName,
                };
            },
            check.isTruthy,
        ),
    );
});
