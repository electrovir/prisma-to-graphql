/** Run this as a script for manual testing via `npm start`. */

import {notCommittedDir, runGraphqlServer, setupTestPrismaDb} from '@prisma-to-graphql/scripts';
import {rm} from 'node:fs/promises';
import {join} from 'node:path';
import {packageDir} from '../util/file-paths';
import {testFilesDir} from '../util/file-paths.test-helper';
import {seedDatabase} from './seed-test-database.test-helper';

let setupCount = 0;

const graphqlOutputDir = join(packageDir, 'node_modules', '.prisma', 'graphql');
const prismaSchemaPath = join(testFilesDir, 'full-run-time', 'schema.prisma');

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

    const graphqlServer = await runGraphqlServer({
        resolversCjsFilePath: join(graphqlOutputDir, 'resolvers.cjs'),
        schemaGraphqlFilePath: join(graphqlOutputDir, 'schema.graphql'),
        modelMapCjsFilePath: join(graphqlOutputDir, 'models.cjs'),
        prismaClient,
    });

    return {
        ...graphqlServer,
        prismaClient,
    };
}

if (require.main === module) {
    setupFullServer();
}
