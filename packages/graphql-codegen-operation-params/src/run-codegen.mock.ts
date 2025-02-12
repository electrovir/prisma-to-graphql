import {codegen} from '@graphql-codegen/core';
import {Types} from '@graphql-codegen/plugin-helpers';
import {buildSchema, parse, printSchema} from 'graphql';

const packagePath: string = '@prisma-to-graphql/graphql-codegen-operation-params';

export async function buildTestSchema(schemaString: string): Promise<string> {
    const config: Types.GenerateOptions = {
        documents: [],
        config: {},
        filename: '',
        schema: parse(printSchema(buildSchema(schemaString))),
        plugins: [
            {
                'operation-params': {},
            },
        ],
        pluginMap: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: this file is only used in tests and this import is generated by the tests
            /* node:coverage ignore next: c8 thinks imports are branches */
            'operation-params': await import(packagePath),
        },
    };

    const output = await codegen(config);
    return output;
}
