import {FieldDefinitionNode, GraphQLSchema, Kind, TypeNode} from 'graphql';
import {ResolverParams, SchemaOperationParams} from './graphql-operations';

/**
 * A string that is shared between all outputs of this plugin.
 *
 * @category Plugin Internals
 */
export const defaultGenerationOutput = `import type {SchemaOperationParams} from '@prisma-to-graphql/graphql-codegen-operation-params';

export const operationParams: Readonly<SchemaOperationParams> = `;

/**
 * The plugin which codegen will run.
 *
 * @category Plugin Internals
 * @example
 *     import {codegen} from '@graphql-codegen/core';
 *     import {Types} from '@graphql-codegen/plugin-helpers';
 *     import {buildSchema, parse, printSchema} from 'graphql';
 *     import * as operationParamsPlugin from '@prisma-to-graphql/graphql-codegen-operation-params';
 *
 *     const config: Types.GenerateOptions = {
 *         documents: [],
 *         config: {},
 *         filename: '',
 *         schema: parse(printSchema(buildSchema(schemaString))),
 *         plugins: [
 *             {
 *                 'operation-params': {},
 *             },
 *         ],
 *         pluginMap: {
 *             'operation-params': operationParamsPlugin,
 *         },
 *     };
 *
 *     const output = await codegen(config);
 */
export function plugin(schema: GraphQLSchema) {
    const typeMap = schema.getTypeMap();
    const mutations = typeMap.Mutation;
    const mutationFields =
        (mutations?.astNode?.kind === Kind.OBJECT_TYPE_DEFINITION && mutations.astNode.fields) ||
        [];

    const queries = typeMap.Query;
    const queryFields =
        (queries?.astNode?.kind === Kind.OBJECT_TYPE_DEFINITION && queries.astNode.fields) || [];

    const fieldsTree: SchemaOperationParams = {
        Mutation: createFieldNames(mutationFields),
        Query: createFieldNames(queryFields),
    };

    return [
        defaultGenerationOutput,
        JSON.stringify(fieldsTree, null, 4),
        ';',
    ].join('');
}

function createFieldNames(fields: ReadonlyArray<Readonly<FieldDefinitionNode>>): ResolverParams {
    const fieldNames: ResolverParams = fields.reduce((accum, field) => {
        accum[field.name.value] = {
            args: (field.arguments || []).reduce(
                (accum, arg) => {
                    accum[arg.name.value] = getTypeName(arg.type);
                    return accum;
                },
                {} as Record<string, string>,
            ),
            output: getTypeName(field.type),
        };
        return accum;
    }, {} as ResolverParams);
    return fieldNames;
}

function getTypeName(typeNode: Readonly<TypeNode>): string {
    if (typeNode.kind === Kind.NAMED_TYPE) {
        return typeNode.name.value;
    } else if (typeNode.kind === Kind.LIST_TYPE) {
        return `[${getTypeName(typeNode.type)}]`;
    } else if (typeNode.kind === Kind.NON_NULL_TYPE) {
        return `${getTypeName(typeNode.type)}!`;
    } else {
        throw new Error(`Unexpected typeNode kind: ${(typeNode as TypeNode).kind}`);
    }
}
