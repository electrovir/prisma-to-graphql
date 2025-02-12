# @prisma-to-graphql/graphql-codegen-operation-params

This is a plugin for [GraphQL-Codegen](https://the-guild.dev/graphql/codegen) that generates a run-time `const` containing all `Mutation` and `Query` GraphQL resolver type names as strings.

In particular, this package is needed by [`@prisma-to-graphql/fetch-graphql`](https://www.npmjs.com/package/@prisma-to-graphql/fetch-graphql) to automatically build strictly typed GraphQL requests.

This plugin does not generate TS types for the GraphQL types encoded in the strings (use [`@graphql-codegen/typescript`](https://www.npmjs.com/package/@graphql-codegen/typescript) for that), it merely stores them as strings so that run-time query builders can use them.

## Install

```sh
npm i -D @prisma-to-graphql/graphql-codegen-operation-params
npm i @prisma-to-graphql/core
```

(Non-dev install is recommended for `@prisma-to-graphql` because the generated code includes `import` statements from that package.)

# Example

The output looks like this:

<!-- example-link: src/readme-examples/output.example.ts -->

```TypeScript
import {SchemaOperationTypeNames} from '@prisma-to-graphql/core';

export const operationFields: Readonly<SchemaOperationTypeNames> = {
    Mutation: {
        myMutationResolver: {
            args: {
                where: 'User!',
                data: 'UserInput!',
            },
            output: 'Boolean!',
        },
    },
    Query: {
        getLatestUser: {
            args: {},
            output: 'User!',
        },
        findUser: {
            args: {
                id: 'String',
                settings: 'Settings',
            },
            output: 'User',
        },
    },
};
```

## Usage

This plugin is used internally by the [`prisma-to-graphql`](https://www.npmjs.com/package/prisma-to-graphql). If you are using `prisma-to-graphql` directly, there's no need to worry about how to install or use _this_ package (`prisma-to-graphql` will take care of that for you).

Otherwise, you can use this package as a plugin for any [`graphql-codegen`](https://the-guild.dev/graphql/codegen/docs/getting-started/installation) execution.

-   Example [`graphql-codegen` API](https://the-guild.dev/graphql/codegen/docs/advanced/programmatic-usage) usage:

    <!-- example-link: src/readme-examples/codegen-api-usage.example.ts -->

    ```TypeScript
    import {codegen} from '@graphql-codegen/core';
    import {Types} from '@graphql-codegen/plugin-helpers';
    import {buildSchema, parse, printSchema} from 'graphql';
    import * as operationParamsPlugin from '@prisma-to-graphql/graphql-codegen-operation-params';

    export async function generateCodegenOutput(schemaString: string): Promise<string> {
        const config: Types.GenerateOptions = {
            documents: [],
            config: {},
            filename: '',
            schema: parse(printSchema(buildSchema(schemaString))),
            plugins: [
                {
                    // this plugin needs no config
                    'operation-params': {},
                },
            ],
            pluginMap: {
                'operation-params': operationParamsPlugin,
            },
        };

        return await codegen(config);
    }
    ```

Note that there is no config for this plugin.
