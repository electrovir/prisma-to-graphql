import {runShellCommand} from '@augment-vir/node-js';

export async function setupTestPrismaDb(prismaSchemaPath: string) {
    await runShellCommand(`prisma generate --schema=${prismaSchemaPath}`, {
        hookUpToConsole: true,
        rejectOnError: true,
    });
    await runShellCommand(`prisma db push --schema=${prismaSchemaPath}`, {
        hookUpToConsole: true,
        rejectOnError: true,
    });
}
