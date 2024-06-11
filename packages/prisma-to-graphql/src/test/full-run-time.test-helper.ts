/** Run this as a script for manual testing via `npm start`. */

// @ts-ignore: this won't be generated until tests run at least once
import type {models} from '.prisma/graphql/models';

import {parseJson} from '@augment-vir/common';
import {OperationScope} from '@prisma-to-graphql/operation-scope';
import {notCommittedDir, runGraphqlServer, setupTestPrismaDb} from '@prisma-to-graphql/scripts';
import {rm} from 'node:fs/promises';
import {join} from 'node:path';
import {packageDir} from '../util/file-paths';
import {testFilesDir} from '../util/file-paths.test-helper';
import {seedDatabase} from './seed-test-database.test-helper';

let setupCount = 0;

const graphqlOutputDir = join(packageDir, 'node_modules', '.prisma', 'graphql');
export const prismaSchemaPath = join(testFilesDir, 'full-run-time', 'schema.prisma');

export const graphqlServerHeaders = {
    setOperationScope: 'set-operation-scope',
    userId: 'user-id',
};

export async function setupFullServer() {
    setupCount++;
    if (setupCount > 1) {
        throw new Error("Do not run multiple test servers, it'll be too expensive.");
    }

    await rm(join(notCommittedDir, 'full-run-time-test'), {
        recursive: true,
        force: true,
    });

    await setupTestPrismaDb(prismaSchemaPath);

    // @ts-ignore: this won't be generated until tests run at least once
    const {PrismaClient} = (await import('../../node_modules/.prisma')) as any;

    const prismaClient = new PrismaClient();

    await seedDatabase(prismaClient);

    const graphqlServer = await runGraphqlServer<typeof prismaClient, typeof models>({
        resolversCjsFilePath: join(graphqlOutputDir, 'resolvers.cjs'),
        schemaGraphqlFilePath: join(graphqlOutputDir, 'schema.graphql'),
        modelMapCjsFilePath: join(graphqlOutputDir, 'models.cjs'),
        prismaClient,
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
    });

    return {
        ...graphqlServer,
        prismaClient,
    };
}

if (require.main === module) {
    setupFullServer();
}
