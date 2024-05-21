import {notCommittedDir, packageDirs, setupTestPrismaDb} from '@prisma-to-graphql/scripts';
import {rm} from 'node:fs/promises';
import {join} from 'node:path';

const paths = {
    prismaSchema: join(packageDirs.prismaResolver, 'test-files', 'prisma-resolver.schema.prisma'),
    prismaDb: join(notCommittedDir, 'prisma-resolver', 'test.db'),
};

export async function setupTestEnv() {
    await rm(paths.prismaDb, {force: true});
    await setupTestPrismaDb(paths.prismaSchema);
    // @ts-ignore: the .prisma module will only exist after the above line has generated it.
    const {PrismaClient} = await import('.prisma');
    return new PrismaClient();
}
