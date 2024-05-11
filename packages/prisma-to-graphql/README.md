# prisma-to-graphql

Convert a Prisma schema to a GraphQL schema using a Prisma generator.

Also check out the [`@prisma-to-graphql/fetch-graphql`](https://www.npmjs.com/package/@prisma-to-graphql/fetch-graphql) package, for making type-safe fetches to a GraphQL server based on the generated outputs of this package.

# Installation

```sh
npm i -D prisma-to-graphql
```

# Usage

## Generation

Place a new `generator` block into your Prisma schema:

```prisma
generator graphql {
    provider = "prisma-to-graphql"
}
```

## GraphQL server

To use the generated outputs in a GraphQL server, import the generated resolvers file and the generated GraphQL schema:

```typescript
import {resolvers} from '.prisma/graphql/resolvers';
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
        /**
         * Inserting `prismaClient` into your GraphQL server's context is required for
         * `prisma-to-graphql`'s generated resolvers to function.
         */
        context: {prismaClient},
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

# Usage Details

[Here's an full example schema](https://github.com/electrovir/prisma-to-graphql/tree/dev/packages/prisma-to-graphql/test-files/full-run-time/schema.prisma) with this generator.

## Generation output

The default output is `node_modules/.prisma/graphql`, right next to the default Prisma JS client's outputs. The generated files include:

-   `schema.graphql`
-   `schema.ts` + compiled: TypeScript types and JavaScript variables from the GraphQL schema, needed for typed GraphQL fetches (from [`@prisma-to-graphql/fetch-graphql`](https://www.npmjs.com/package/@prisma-to-graphql/fetch-graphql)).
-   `resolvers.ts` + compiled: JavaScript implementations of the resolvers in the generated `schema.graphql` that use a Prisma client for completing operations.

"+ compiled" outputs include:

-   `.cjs` JS
-   `.mjs` JS
-   `.d.ts` TS

## Generation options

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
-   `removeRelationFromFields`: set to true or false to enable or disable removal of relation id fields from the output GraphQL types and resolvers. Meaning, if your `User` table has a relation to `UserSettings` through the `userSettingsId` field, the `userSettingsId` field will not exist in the GraphQL schema (but all relations will still work).
    -   default: `"true"`
    -   example:
        ```prisma
        generator graphql {
            provider                 = "prisma-to-graphql"
            removeRelationFromFields = "false"
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
