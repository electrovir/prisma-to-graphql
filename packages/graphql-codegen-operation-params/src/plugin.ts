import type {ResolverTypeNames, SchemaOperationTypeNames} from '@prisma-to-graphql/core';
import {GraphQLSchema, Kind, TypeNode, type GraphQLNamedType} from 'graphql';
import JSON5 from 'json5';

export const defaultGenerationOutput = `import {type SchemaOperationTypeNames} from 'prisma-to-graphql';

export const schemaOperationTypeNames: Readonly<SchemaOperationTypeNames> = `;

/**
 * The plugin which codegen will run.
 *
 * @category Plugin
 * @example
 *
 * ```ts
 * import {codegen} from '@graphql-codegen/core';
 * import {Types} from '@graphql-codegen/plugin-helpers';
 * import {buildSchema, parse, printSchema} from 'graphql';
 * import * as operationParamsPlugin from '@prisma-to-graphql/graphql-codegen-operation-params';
 *
 * const config: Types.GenerateOptions = {
 *     documents: [],
 *     config: {},
 *     filename: '',
 *     schema: parse(printSchema(buildSchema(schemaString))),
 *     plugins: [
 *         {
 *             'operation-params': {},
 *         },
 *     ],
 *     pluginMap: {
 *         'operation-params': operationParamsPlugin,
 *     },
 * };
 *
 * const output = await codegen(config);
 * ```
 */
export function plugin(schema: GraphQLSchema) {
    const typeMap = schema.getTypeMap();

    const fieldsTree: SchemaOperationTypeNames = {
        Mutation: createFieldNames(typeMap.Mutation),
        Query: createFieldNames(typeMap.Query),
    };

    return [
        defaultGenerationOutput,
        JSON5.stringify(fieldsTree, null, 4),
        ';',
    ].join('');
}

function createFieldNames(
    operationTypeMap: Readonly<GraphQLNamedType> | undefined,
): ResolverTypeNames {
    const fields =
        (operationTypeMap?.astNode?.kind === Kind.OBJECT_TYPE_DEFINITION &&
            operationTypeMap.astNode.fields) ||
        [];

    const fieldNames: ResolverTypeNames = fields.reduce((accum, field) => {
        accum[field.name.value] = {
            /* node:coverage ignore next: type guard */
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
    }, {} as ResolverTypeNames);
    return fieldNames;
}

function getTypeName(typeNode: Readonly<TypeNode>): string {
    if (typeNode.kind === Kind.NAMED_TYPE) {
        return typeNode.name.value;
    } else if (typeNode.kind === Kind.LIST_TYPE) {
        return `[${getTypeName(typeNode.type)}]`;
    } else if ((typeNode.kind as string) === Kind.NON_NULL_TYPE) {
        return `${getTypeName(typeNode.type)}!`;
        /* node:coverage ignore next 3: covering an edge cause so we get good errors */
    } else {
        throw new Error(`Unexpected typeNode kind: ${(typeNode as TypeNode).kind}`);
    }
}
