import {collapseWhiteSpace, mapObjectValues} from '@augment-vir/common';
import {runShellCommand} from '@augment-vir/node-js';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {ExpectationTestCast, expectationCases} from 'test-established-expectations';
import {wrapString} from '../augments/wrap-string';
import {GraphqlBlock} from '../builders/graphql-builder/graphql-block';
import {ResolverBlock} from '../builders/resolver-builder/resolver-block';
import {testFilesDir} from '../util/file-paths.test-helper';
import {readThisPackageJson} from '../util/package-file';
import {GraphqlOutputs, generate, graphqlOutputFileNames} from './generate';
import {GeneratorOptions} from './generator-options';

const dbSourceString = `
    datasource db {
        provider = "sqlite"
        url      = "file:../../../.not-committed/dev.db"
    }
`;

const packageName = readThisPackageJson().name;

async function testGeneration(
    testKey: string,
    prismaSchema: string,
    options?: Readonly<Partial<GeneratorOptions>>,
) {
    const testDir = join(testFilesDir, testKey);
    const generatedOutputDir = join(testDir, 'output');
    const prismaSchemaPath = join(testDir, 'schema.prisma');
    await mkdir(generatedOutputDir, {recursive: true});

    const optionKeys = Object.entries(options || {})
        .map(
            ([
                key,
                value,
            ]) => {
                return `                ${key} = ${wrapString({value: String(value), wrapper: '"'})}`;
            },
        )
        .join('\n');

    const fullPrismaSchemaString = [
        `
            generator graphql {
                provider = "${packageName}"
                output = "./output/"
                ${optionKeys}
            }
        `,
        dbSourceString,
        prismaSchema,
    ].join('\n\n');

    await writeFile(prismaSchemaPath, fullPrismaSchemaString);

    await runShellCommand(`npx prisma generate --schema ${prismaSchemaPath}`, {
        hookUpToConsole: true,
        rejectOnError: true,
    });

    const outputs: GraphqlOutputs = await mapObjectValues(
        graphqlOutputFileNames,
        async (key, fileName) => {
            return collapseWhiteSpace(
                (await readFile(join(generatedOutputDir, fileName))).toString(),
                {keepNewLines: true},
            );
        },
    );

    return outputs;
}

export type GeneratedGraphql = {
    graphql: GraphqlBlock[];
    resolvers: ResolverBlock[];
};

describe(generate.name, () => {
    const testCases: {
        it: string;
        schema: string;
        options?: Partial<GeneratorOptions>;
        force?: true;
    }[] = [
        {
            it: 'single-model',
            schema: /* Prisma */ `
                model User {
                    id        String   @id @default(uuid())
                    createdAt DateTime @default(now())
                    updatedAt DateTime @updatedAt

                    email    String
                    password String

                    firstName   String?
                    lastName    String?
                    role        String?
                    phoneNumber String?
                }
            `,
            options: {
                generateMutation: false,
                generateQuery: false,
            },
        },
        {
            it: 'multi-model',
            schema: /* Prisma */ `
                model User {
                    id        String   @id @default(uuid())
                    createdAt DateTime @default(now())
                    updatedAt DateTime @updatedAt

                    email    String
                    password String

                    firstName   String?
                    lastName    String?
                    role        String?
                    phoneNumber String?
                }
                
                model Company {
                    id        String   @id @default(uuid())
                    createdAt DateTime @default(now())
                    updatedAt DateTime @updatedAt

                    name String
                }
            `,
            options: {
                generateMutation: false,
                generateQuery: false,
            },
        },
        {
            it: 'multi-with-operations',
            schema: /* Prisma */ `
                model User {
                    id        String   @id @default(uuid())
                    createdAt DateTime @default(now())
                    updatedAt DateTime @updatedAt

                    email    String
                    password String

                    firstName   String?
                    lastName    String?
                    role        String?
                    phoneNumber String?
                }
                
                model Company {
                    id        String   @id @default(uuid())
                    createdAt DateTime @default(now())
                    updatedAt DateTime @updatedAt

                    name String
                }
            `,
        },
        {
            it: 'relational-operations',
            schema: /* Prisma */ `
                model User {
                    id        String   @id @default(uuid())
                    createdAt DateTime @default(now())
                    updatedAt DateTime @updatedAt

                    email    String
                    password String

                    firstName   String?
                    lastName    String?
                    role        String?
                    phoneNumber String?
                    
                    settings UserSettings?
                }
                
                model UserSettings {
                    id        String   @id @default(uuid())
                    createdAt DateTime @default(now())
                    updatedAt DateTime @updatedAt

                    userId String @unique

                    user User @relation(fields: [userId], references: [id])
                }
            `,
        },
        {
            it: 'omits-fields',
            schema: /* Prisma */ `
                model User {
                    id        String   @id @default(uuid())
                    createdAt DateTime @default(now())
                    updatedAt DateTime @updatedAt

                    email    String
                    /// @graphql-omit
                    password String

                    firstName   String?
                }
            `,
        },
        {
            force: true,
            it: 'omits-output-fields',
            schema: /* Prisma */ `
                model User {
                    id        String   @id @default(uuid())
                    createdAt DateTime @default(now())
                    updatedAt DateTime @updatedAt

                    email    String
                    /// @graphql-omit {output: true}
                    password String

                    firstName   String?
                }
            `,
        },
        {
            force: true,
            it: 'omits-input-fields',
            schema: /* Prisma */ `
                model User {
                    id        String   @id @default(uuid())
                    createdAt DateTime @default(now())
                    updatedAt DateTime @updatedAt

                    email    String
                    /// @graphql-omit {input: true}
                    password String

                    firstName   String?
                }
            `,
        },
        {
            it: 'omits-models',
            schema: /* Prisma */ `
                model User {
                    id        String   @id @default(uuid())
                    createdAt DateTime @default(now())
                    updatedAt DateTime @updatedAt

                    email    String
                    /// @graphql-omit
                    password String

                    firstName   String?
                }
                
                /// @graphql-omit
                model UserSettings {
                    id        String   @id @default(uuid())
                    createdAt DateTime @default(now())
                    updatedAt DateTime @updatedAt
                    
                    something Boolean
                }
            `,
        },
    ];

    expectationCases(
        testGeneration,
        testCases
            .sort((a, b) => a.it.localeCompare(b.it))
            .map((testCase): ExpectationTestCast<typeof testGeneration> => {
                return {
                    it: testCase.it,
                    force: testCase.force,
                    inputs: [
                        testCase.it,
                        testCase.schema,
                        testCase.options,
                    ],
                } as const;
            }),
    );
});
