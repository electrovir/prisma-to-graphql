import {mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';

export const monoRepoDir = dirname(dirname(dirname(__dirname)));
export const packagesDir = join(monoRepoDir, 'packages');

export const packageDirs = {
    prismaResolver: join(packagesDir, 'prisma-resolver'),
};

export const notCommittedDir = join(monoRepoDir, '.not-committed');
mkdirSync(notCommittedDir, {recursive: true});
