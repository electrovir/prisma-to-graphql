import {ensureErrorAndPrependMessage} from '@augment-vir/common';
import {runShellCommand} from '@augment-vir/node-js';

export async function setupTestPrismaDb(prismaSchemaPath: string) {
    try {
        await runShellCommand(`prisma generate --schema=${prismaSchemaPath}`, {
            hookUpToConsole: true,
            rejectOnError: true,
        });
        await runShellCommand(`prisma db push --schema=${prismaSchemaPath}`, {
            hookUpToConsole: true,
            rejectOnError: true,
        });
    } catch (error) {
        throw ensureErrorAndPrependMessage(
            error,
            `Failed to setup Prisma from schema at '${prismaSchemaPath}'`,
        );
    }
}
