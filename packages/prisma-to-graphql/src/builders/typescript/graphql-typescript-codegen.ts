import {AnyObject, Values} from '@augment-vir/common';
import {codegen} from '@graphql-codegen/core';
import {Types} from '@graphql-codegen/plugin-helpers';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import {TypeScriptPluginConfig} from '@graphql-codegen/typescript';
import * as typescriptResolversPlugin from '@graphql-codegen/typescript-resolvers';
import * as operationParamsPlugin from '@prisma-to-graphql/graphql-codegen-operation-params';
import {buildSchema, parse, printSchema} from 'graphql';
import {GraphqlExtraScalar} from '../graphql/graphql-scalars/scalar-type-map.js';

const supportedExtraScalarMapping: Record<
    GraphqlExtraScalar,
    Values<Extract<NonNullable<TypeScriptPluginConfig['scalars']>, AnyObject>>
> = {
    [GraphqlExtraScalar.DateTime]: {
        input: 'string | Date',
        output: 'date-vir#UtcIsoString',
    },
    [GraphqlExtraScalar.BigInt]: {
        input: 'bigint',
        output: 'bigint',
    },
    [GraphqlExtraScalar.Decimal]: {
        input: 'number | string',
        output: 'string',
    },
};

const typescriptConfig: TypeScriptPluginConfig = {
    immutableTypes: true,
    addUnderscoreToArgsType: true,
    strictScalars: true,
    namingConvention: 'keep',
    skipTypename: true,
    useTypeImports: true,
    extractAllFieldsToTypes: true,
    maybeValue: 'T | null | undefined',
    allowEnumStringTypes: true,
    scalars: supportedExtraScalarMapping,
};

/**
 * Generates a TS file string from the given GraphQL schema string, using graphql-codegen.
 *
 * @category Builders
 */
export async function buildSchemaTs(schemaString: string): Promise<string> {
    const schemaObject = buildSchema(schemaString);

    const config: Types.GenerateOptions = {
        documents: [],
        config: {},
        filename: '',
        schema: parse(printSchema(schemaObject)),
        plugins: [
            {
                typescript: typescriptConfig,
            },
            {
                'typescript-resolvers': typescriptConfig,
            },
            {
                'operation-params': {},
            },
        ],
        pluginMap: {
            typescript: typescriptPlugin,
            'typescript-resolvers': typescriptResolversPlugin,
            'operation-params': operationParamsPlugin,
        },
    };

    const output = await codegen(config);
    return [
        '// generated by prisma-to-graphql',
        output,
    ].join('\n\n');
}
