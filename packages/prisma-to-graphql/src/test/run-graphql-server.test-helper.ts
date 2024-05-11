import {createDeferredPromiseWrapper} from '@augment-vir/common';
import {log} from '@augment-vir/node-js';
import {createSchema, createYoga} from 'graphql-yoga';
import {readFile} from 'node:fs/promises';
import {RequestListener, createServer} from 'node:http';
import {join} from 'node:path';
import {getPortPromise} from 'portfinder';

// @ts-ignore: this won't be generated until tests run at least once
import {PrismaClient} from '.prisma';

export async function runGraphqlServer(graphqlOutputDir: string, prismaClient: PrismaClient) {
    const typeDefs = [
        (await readFile(join(graphqlOutputDir, 'schema.graphql'))).toString(),
    ];
    const {resolvers} = await import(join(graphqlOutputDir, 'resolvers.cjs'));

    const schema = createSchema<{
        prismaClient: typeof prismaClient;
    }>({
        typeDefs,
        resolvers,
    });

    const yogaServer = createYoga({
        schema,
        async context({request, params}) {
            return {
                prismaClient,
            };
        },
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

export async function getAvailablePort(startingPort: number): Promise<number> {
    return await getPortPromise({
        port: startingPort,
    });
}
