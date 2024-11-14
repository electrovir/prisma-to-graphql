# prisma-to-graphql

This package is currently very WIP, big chunks of this README are not yet actually implemented.

`prisma-to-graphql` is a [Prisma](https://www.npmjs.com/package/prisma) generator that converts an existing Prisma schema into a fully functional GraphQL schema.

There is a suite of related packages that you might find useful:

-   [`@prisma-to-graphql/fetch-graphql`](https://www.npmjs.com/package/@prisma-to-graphql/fetch-graphql): for making type-safe fetches to a GraphQL server based on the generated outputs of this package.

## Installation

```sh
npm i -D prisma-to-graphql
```

## Usage

### Generation

Place a new `generator` block into your Prisma schema:

```prisma
generator graphql {
    provider = "prisma-to-graphql"
}
```

### GraphQL server

To use the generated outputs in a GraphQL server, import the generated resolvers file and the generated GraphQL schema:

```typescript
import {resolvers} from '.prisma/graphql/resolvers';
import {models} from '.prisma/graphql/models';
import {PrismaClient} from '@prisma/client';
import {createSchema, createYoga} from 'graphql-yoga';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {join} from 'node:path';

async function startServer() {
    const typeDefs = [
        (await readFile(join('node_modules', '.prisma', 'graphql', 'schema.graphql'))).toString(),
    ];

    const schema = createSchema<{
        prismaClient: typeof PrismaClient;
    }>({
        typeDefs,
        resolvers,
    });

    const prismaClient = new PrismaClient();

    const yoga = createYoga({
        schema,
        context: {
            /**
             * Inserting `prismaClient` into your GraphQL server's context is required for
             * `prisma-to-graphql`'s generated resolvers to function.
             */
            prismaClient,
            /**
             * Inserting `models` is optional but is needed for the also optional `operationScope`
             * to work.
             */
            models,
        },
    });

    /**
     * This part is straight out of Yoga's docs:
     * https://the-guild.dev/graphql/yoga-server/tutorial/basic/03-graphql-server
     */
    const server = createServer(yoga);
    server.listen(4000, () => {
        console.info('Server is running on http://localhost:4000/graphql');
    });
}

startServer();
```

This example starts a [Yoga](https://the-guild.dev/graphql/yoga-server) GraphQL server but any valid GraphQL server implementation will work.

#### Operation Scope

Provide a context object of `operationScope` to your GraphQL server to scope all operations for specific models. For example, you can restrict all queries for a specific user to just that user:

```typescript
const yogaServer = createYoga({
    schema,
    context({request}): ResolverContext<PrismaClient> {
        const userId = getUserIdFromRequest(request);

        const context: ResolverContext<PrismaClient> = {
            prismaClient,
            models,
            operationScope: {
                where: {
                    User: {
                        id: userId,
                    },
                },
            },
        };

        return context;
    },
});
```

## Usage Details

[Here's an full example schema](https://github.com/electrovir/prisma-to-graphql/tree/dev/packages/prisma-to-graphql/test-files/full-run-time/schema.prisma) with this generator.

### Generator output

The default output is `node_modules/.prisma/graphql`, right next to the default Prisma JS client's outputs. The generated files include:

-   `schema.graphql`
-   `schema.ts` + transpiled JS files: TypeScript types and JavaScript variables from the GraphQL schema, needed for typed GraphQL fetches (from [`@prisma-to-graphql/fetch-graphql`](https://www.npmjs.com/package/@prisma-to-graphql/fetch-graphql)).
-   `resolvers.ts` + transpiled JS files: JavaScript implementations of the resolvers in the generated `schema.graphql` that use a Prisma client for completing operations.

The "+ transpiled JS files" outputs are:

-   `.cjs` JS
-   `.mjs` JS
-   `.d.ts` TS

### Generator options

-   `output`: as always, the output path of Prisma generators can be configured with this option. Note that this package does not automatically follow your `prisma-client-js` configured output, but simply defaults to the same default. See [Prisma's docs](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client#using-a-custom-output-path) for more details.
    -   default: `"node_modules/.prisma/graphql"`
    -   example:
        ```prisma
        generator graphql {
            provider = "prisma-to-graphql"
            output = "./output/"
        }
        ```
-   `generateQuery`: set to true or false to enable or disable generation of query GraphQL resolvers.
    -   default: `"true"`
    -   example:
        ```prisma
        generator graphql {
            provider      = "prisma-to-graphql"
            generateQuery = "false"
        }
        ```
-   `generateMutation`: set to true or false to enable or disable generation of mutation GraphQL resolvers.
    -   default: `"true"`
    -   example:
        ```prisma
        generator graphql {
            provider         = "prisma-to-graphql"
            generateMutation = "false"
        }
        ```
-   `generateSchemaTs`: set to true or false to enable or disable generation of TypeScript files with the generated GraphQL schema's types (`schema.ts`). This file is not necessary for the generated resolvers to function, but it is necessary for [`@prisma-to-graphql/fetch-graphql`](https://www.npmjs.com/package/@prisma-to-graphql/fetch-graphql) to function.
    -   default: `"true"`
    -   example:
        ```prisma
        generator graphql {
            provider         = "prisma-to-graphql"
            generateSchemaTs = "false"
        }
        ```
-   `generateModelsTs`: set to true or false to enable or disable generation of TypeScript files with the model field names and types (`models.ts`). This file is not necessary for the generated resolvers to function, but it is necessary for [`@prisma-to-graphql/crud-auth`](https://www.npmjs.com/package/@prisma-to-graphql/crud-auth) to function.
    -   default: `"true"`
    -   example:
        ```prisma
        generator graphql {
            provider         = "prisma-to-graphql"
            generateModelsTs = "false"
        }
        ```

## Dev

This section includes explanations of how this package works internally.

1. When included a generator in a Prisma schema file, Prisma will execute this package's `"bin"` file whenever `prisma generate` is run.
2. When executed, that bin file registers the generator with Prisma.
3. Prisma then, at some later point, calls the registered generator's `generate` method.
4. The `generate` method reads all default and user configured generator options.
5. The DMMF model (object representation of the Prisma schema), given to the generator from Prisma, is parsed into the data needed.
6. Each model's GraphQL types, JS resolver implementations, and types are generated.
7. All generated model outputs are combined.
8. Outputs are saved to their respective files.
