/** Run this a script for manual testing via npm start. */

import {join} from 'node:path';
import {packageDir} from '../util/file-paths';
import {testFilesDir} from '../util/file-paths.test-helper';
import {runGraphqlServer} from './run-graphql-server.test-helper';
import {setupPrisma} from './setup-prisma.test-helper';

let setupCount = 0;

const graphqlOutputDir = join(packageDir, 'node_modules', '.prisma', 'graphql');
const prismaSchemaPath = join(testFilesDir, 'full-run-time', 'schema.prisma');

export async function setupFullServer() {
    setupCount++;
    if (setupCount > 1) {
        throw new Error("Do not run multiple test servers, it'll be too expensive.");
    }

    const prismaClient = await setupPrisma(prismaSchemaPath);

    const graphqlServer = await runGraphqlServer(graphqlOutputDir, prismaClient);

    return {
        ...graphqlServer,
        prismaClient,
    };
}

if (require.main === module) {
    setupFullServer();
}
