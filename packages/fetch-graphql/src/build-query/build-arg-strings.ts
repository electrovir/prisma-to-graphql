import {type OperationType, type SchemaOperationTypeNames} from '@prisma-to-graphql/core';

/**
 * Builds argument strings for a GraphQL query.
 *
 * @category Internal Query Builders
 */
export function buildArgStrings({
    resolverName,
    args,
    schemaOperationTypeNames,
    indent,
    argPlace,
    operationType,
    operationIndex,
}: {
    resolverName: string;
    args: Readonly<Record<string, any>> | undefined;
    schemaOperationTypeNames: Readonly<SchemaOperationTypeNames>;
    indent: string;
    argPlace: 'usage' | 'definition';
    operationType: OperationType | `${OperationType}`;
    operationIndex: number;
}): string[] {
    if (!args || !Object.keys(args).length) {
        return [];
    }

    return Object.keys(args).map((argName) => {
        const argVarName = `$${buildArgVariableName({argName, resolverName, operationIndex})}`;

        const argType = schemaOperationTypeNames[operationType][resolverName]?.args[argName];

        if (!argType) {
            const props = [
                operationType,
                resolverName,
                argName,
            ];
            throw new Error(`Failed to find argument type for '${props.join(' -> ')}'`);
        }

        const argStrings =
            argPlace === 'usage'
                ? [
                      argName,
                      argVarName,
                  ]
                : [
                      argVarName,
                      argType,
                  ];

        return [
            indent,
            argStrings.join(': '),
        ].join('');
    });
}

/**
 * Builds an argument name for a GraphQL query.
 *
 * @category Internal Query Builders
 */
export function buildArgVariableName({
    resolverName,
    argName,
    operationIndex,
}: {
    resolverName: string;
    argName: string;
    operationIndex: number;
}): string {
    return [
        resolverName,
        operationIndex,
        argName,
        'var',
    ].join('_');
}
