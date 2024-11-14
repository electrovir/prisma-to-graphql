import {join} from 'node:path';

export const monoRepoPath = process.env.npm_config_local_prefix as string;
export const prismaToGraphqlPackagePath = join(monoRepoPath, 'packages', 'prisma-to-graphql');
export const testFilesPath = join(prismaToGraphqlPackagePath, 'test-files');
export const schemaTestFilesPath = join(testFilesPath, 'schemas');
