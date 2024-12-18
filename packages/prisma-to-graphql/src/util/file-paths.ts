import {dirname, join} from 'node:path';

export const prismaToGraphqlPackageDirPath = dirname(dirname(import.meta.dirname));
export const prismaToGraphqlPackageJsonFilePath = join(
    prismaToGraphqlPackageDirPath,
    'package.json',
);
