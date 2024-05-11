import {codegen} from '@graphql-codegen/core';
import {Types} from '@graphql-codegen/plugin-helpers';
import {buildSchema, parse, printSchema} from 'graphql';
import * as operationParamsPlugin from '..';

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
