import {PrismaClient} from '.prisma';
import {models} from '.prisma/graphql/models';
import {parseJson} from '@augment-vir/common';
import {OperationScope} from '@prisma-to-graphql/operation-scope';
import {notCommittedDir, setupFullServer, SetupFullServerConfig} from '@prisma-to-graphql/scripts';
import {seedDatabase} from '@prisma-to-graphql/scripts/src/seed-test-database.test-helper';
import {rm} from 'node:fs/promises';
import {join} from 'node:path';
import {packageDir} from '../util/file-paths';
import {testFilesDir} from '../util/file-paths.test-helper';
import {graphqlServerHeaders} from './server-headers.mock';

export async function setupTestServerConfig(): Promise<
    Readonly<SetupFullServerConfig<PrismaClient, typeof models>>
> {
    await rm(join(notCommittedDir, 'full-run-time-test'), {
        recursive: true,
        force: true,
    });
    return {
        generatedPrismaImportPath: join(packageDir, 'node_modules', '.prisma'),
        graphqlOutputDirPath: join(packageDir, 'node_modules', '.prisma', 'graphql'),
        async prismaInitCallback(prismaClient) {
            await seedDatabase(prismaClient);
        },
        prismaSchemaFilePath: join(testFilesDir, 'full-run-time', 'schema.prisma'),
        createOperationScope(request) {
            const userId = request.headers.get(graphqlServerHeaders.userId) || '';
            const setOperationScope =
                request.headers.get(graphqlServerHeaders.setOperationScope) || '';

            const operationScope: OperationScope<typeof models> | undefined = userId
                ? {
                      where: {
                          User: {
                              id: {
                                  equals: userId,
                              },
                          },
                      },
                  }
                : parseJson({
                      jsonString: setOperationScope,
                      errorHandler() {
                          return undefined;
                      },
                  });

            return operationScope;
        },
    };
}

async function runServerAsScript() {
    await setupFullServer(await setupTestServerConfig());
}

if (require.main === module) {
    runServerAsScript();
}
