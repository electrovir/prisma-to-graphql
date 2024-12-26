# `@prisma-to-graphql/fetch-graphql`

Typed and autocomplete supported fetching for the following:

-   resolvers
-   resolver arguments
-   resolver outputs
-   field selection
-   aliased outputs

Part of the `prisma-to-graphql` suite. As such, the expected inputs for this package to work are generated from the [`prisma-to-graphql`](https://www.npmjs.com/package/prisma-to-graphql) package.

# Install

```sh
npm i @prisma-to-graphql/fetch-graphql
```

You'll likely want to also install the `prisma-to-graphql` package to generate the outputs necessary for this package. See the README in [`prisma-to-graphql`](https://www.npmjs.com/package/prisma-to-graphql) on how to setup and use that package.

# Usage

The heart of the operation, and possibly the only thing you'll need to use from this package, is the exported `createGraphqlFetcher` function. This function requires two (typically generated from `prisma-to-graphql`) inputs to inform if about the shape of your GraphQL schema, and returns a `fetchGraphql` function. All inputs to the resulting `fetchGraphql` function are typed:

<!-- example-link: src/readme-examples/create-graphql-fetch.example.ts -->

```TypeScript
import {OperationType} from '@prisma-to-graphql/core';
import {createGraphqlFetcher} from '@prisma-to-graphql/fetch-graphql';

/**
 * Both `Resolvers` and `schemaOperationTypeNames` will be generated from the `prisma-to-graphql`
 * package.
 */
import {Resolvers, schemaOperationTypeNames} from '../schema-output.mock.js';

const fetchGraphql = createGraphqlFetcher<Resolvers>(schemaOperationTypeNames);
export type FetchGraphql = typeof fetchGraphql;

async function getUsers(fetchGraphql: FetchGraphql) {
    const users = await fetchGraphql(
        {
            operationType: OperationType.Query,
            operationName: 'MyOperation',
            url: 'https://example.com/graphql',
        },
        {
            Users: [
                {
                    args: {
                        where: {
                            role: {equals: 'user'},
                        },
                    },
                    select: {
                        items: {
                            firstName: true,
                            lastName: true,
                            role: true,
                        },
                    },
                },
            ],
        },
    );

    console.info(users);
}

await getUsers(fetchGraphql);
```

The `fetchGraphql` output of `createGraphqlFetcher` is intended to be reused multiple times and passed around to wherever needs to fetch GraphQL data with the same schema. That being said, there's also no harm in calling `createGraphqlFetcher` itself multiple times.
