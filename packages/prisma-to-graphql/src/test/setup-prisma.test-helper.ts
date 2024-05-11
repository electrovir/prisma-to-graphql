import {runShellCommand} from '@augment-vir/node-js';
import {notCommittedDir} from '@prisma-to-graphql/scripts';
import {rm} from 'node:fs/promises';
import {join} from 'node:path';
import {seedDatabase} from './seed-test-database.test-helper';

export async function setupPrisma(prismaSchemaPath: string) {
    await rm(join(notCommittedDir, 'full-run-time-test'), {recursive: true, force: true});
    await runShellCommand(`prisma generate --schema=${prismaSchemaPath}`, {
        hookUpToConsole: true,
        rejectOnError: true,
    });
    await runShellCommand(`prisma db push --schema=${prismaSchemaPath}`, {
        hookUpToConsole: true,
        rejectOnError: true,
    });

    // @ts-ignore: this won't be generated until tests run at least once
    const {PrismaClient} = (await import('../../node_modules/.prisma')) as any;

    const prismaClient = new PrismaClient();

    await seedDatabase(prismaClient);

    return prismaClient;
}
