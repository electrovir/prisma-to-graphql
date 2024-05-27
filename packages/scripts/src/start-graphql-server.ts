import {createDeferredPromiseWrapper} from '@augment-vir/common';
import {log} from '@augment-vir/node-js';
import {Plugin, YogaInitialContext, createSchema, createYoga} from 'graphql-yoga';
import {readFile} from 'node:fs/promises';
import {RequestListener, createServer} from 'node:http';
import {getPortPromise} from 'portfinder';
import {ModelMap, OperationScope, ResolverContext} from './resolver-context';

export type GraphqlServerPlugin<PrismaClient> = Plugin<
    {
        prismaClient: PrismaClient;
    } & YogaInitialContext
>;

export async function runGraphqlServer<PrismaClient, Models extends ModelMap>({
    schemaGraphqlFilePath,
    resolversCjsFilePath,
    modelMapCjsFilePath,
    prismaClient,
    plugins,
    createOperationScope,
}: {
    schemaGraphqlFilePath: string;
    resolversCjsFilePath: string;
    modelMapCjsFilePath: string;
    prismaClient: PrismaClient;
    plugins?: GraphqlServerPlugin<PrismaClient>[];
    createOperationScope?: ((request: Request) => OperationScope<Models> | undefined) | undefined;
}) {
    const typeDefs = [
        (await readFile(schemaGraphqlFilePath)).toString(),
    ];
    const {resolvers} = await import(resolversCjsFilePath);
    const {models} = await import(modelMapCjsFilePath);

    const schema = createSchema<ResolverContext<PrismaClient, Models>>({
        typeDefs,
        resolvers,
    });

    const yogaServer = createYoga({
        schema,
        context({request}): ResolverContext<PrismaClient, Models> {
            const context: ResolverContext<PrismaClient, Models> = {
                prismaClient,
                models,
                operationScope: createOperationScope?.(request),
            };

            return context;
        },
        plugins,
        maskedErrors: false,
        logging: true,
    });

    const server = createServer(
        /** `as` cast to compensate for incorrect Yoga usage of optional properties. */
        yogaServer as RequestListener,
    );

    const port = await getAvailablePort(4000);

    const startedDeferredWrapper = createDeferredPromiseWrapper<{
        port: number;
        server: typeof server;
    }>();

    server.listen(port, () => {
        log.info(`GraphQL server listening at: http://localhost:${port}/graphql`);
        startedDeferredWrapper.resolve({port, server});
    });

    return startedDeferredWrapper.promise;
}

async function getAvailablePort(startingPort: number): Promise<number> {
    return await getPortPromise({
        port: startingPort,
    });
}
