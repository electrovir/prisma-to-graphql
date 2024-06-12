import {
    MaybePromise,
    awaitedForEach,
    createDeferredPromiseWrapper,
    ensureErrorAndPrependMessage,
    waitUntilTruthy,
} from '@augment-vir/common';
import {log} from '@augment-vir/node-js';
import {
    BaseResolvers,
    GraphqlFetcher,
    createGraphqlFetcher,
} from '@prisma-to-graphql/fetch-graphql';
import {ModelMap} from '@prisma-to-graphql/operation-scope';
import {Server} from 'node:http';
import {join} from 'node:path';
import {buildUrl, joinUrlParts} from 'url-vir';
import {setupTestPrismaDb} from './setup-prisma';
import {RunGraphqlServerConfig, runGraphqlServer} from './start-graphql-server';

let setupCount = 0;

export type SetupFullServerConfig<PrismaClient, Models extends ModelMap> = {
    prismaSchemaFilePath: string;
    generatedPrismaImportPath: string;
    graphqlOutputDirPath: string;
    prismaInitCallback?: ((prismaClient: PrismaClient) => Promise<void> | void) | undefined;
} & Pick<RunGraphqlServerConfig<PrismaClient, Models>, 'plugins' | 'createOperationScope'>;

export async function setupFullServer<const PrismaClient, const Models extends ModelMap>({
    prismaSchemaFilePath,
    generatedPrismaImportPath,
    graphqlOutputDirPath,
    prismaInitCallback,
    createOperationScope,
    plugins,
}: Readonly<SetupFullServerConfig<PrismaClient, Models>>) {
    setupCount++;
    if (setupCount > 1) {
        throw new Error("Do not run multiple test servers, it'll be too expensive.");
    }

    await setupTestPrismaDb(prismaSchemaFilePath);

    const PrismaClient = (await import(generatedPrismaImportPath)).PrismaClient as any;

    const prismaClient = new PrismaClient();

    await prismaInitCallback?.(prismaClient);

    const graphqlServer = await runGraphqlServer<PrismaClient, Models>({
        resolversCjsFilePath: join(graphqlOutputDirPath, 'resolvers.cjs'),
        schemaGraphqlFilePath: join(graphqlOutputDirPath, 'schema.graphql'),
        modelMapCjsFilePath: join(graphqlOutputDirPath, 'models.cjs'),
        prismaClient,
        plugins,
        createOperationScope,
    });

    return {
        ...graphqlServer,
        prismaClient,
    };
}

export type GraphqlTestCase<PrismaClient, Resolvers extends Readonly<BaseResolvers>> = {
    it: string;
    /**
     * Do not support `only` or `force` as each test is sequential and depends on the results of the
     * previous tests.
     */
    // only?: true;
    test(params: {
        serverUrl: string;
        fetchGraphql: GraphqlFetcher<Resolvers>;
        prismaClient: PrismaClient;
    }): MaybePromise<void>;
};

export async function runGraphqlServerTests<
    const PrismaClient,
    const Models extends ModelMap,
    const Resolvers extends Readonly<BaseResolvers>,
>(
    config: Readonly<SetupFullServerConfig<PrismaClient, Models>>,
    testCases: ReadonlyArray<Readonly<GraphqlTestCase<PrismaClient, Resolvers>>>,
) {
    let server: Server | undefined;
    try {
        const fullServer = await setupFullServer(config);
        server = fullServer.server;
        const serverUrl = buildUrl('http://localhost', {
            port: fullServer.port,
        }).href;

        await waitUntilTruthy(async () => {
            const response = await fetch(joinUrlParts(serverUrl, 'health'));

            return response.ok;
        });

        const {operationParams} = await import(join(config.graphqlOutputDirPath, 'schema.cjs'));

        const fetchGraphql = createGraphqlFetcher<Resolvers>(operationParams);

        const itNames = new Set<string>();

        await awaitedForEach(testCases, async (testCase) => {
            if (itNames.has(testCase.it)) {
                throw new Error(`Duplicate it name: '${testCase.it}'`);
            }
            itNames.add(testCase.it);
            try {
                log.faint(testCase.it);
                await testCase.test({
                    serverUrl,
                    fetchGraphql,
                    prismaClient: fullServer.prismaClient,
                });
            } catch (error) {
                throw ensureErrorAndPrependMessage(error, testCase.it);
            }
        });
    } finally {
        if (server) {
            const serverCloseDeferredPromise = createDeferredPromiseWrapper();
            server.closeAllConnections();
            server.close((error) => {
                if (error) {
                    serverCloseDeferredPromise.reject(error);
                } else {
                    serverCloseDeferredPromise.resolve();
                }
            });
            await serverCloseDeferredPromise.promise;
        }
    }
}
