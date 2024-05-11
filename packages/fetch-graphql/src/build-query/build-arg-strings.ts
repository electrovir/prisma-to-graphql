import {SchemaOperationParams} from '@prisma-to-graphql/graphql-codegen-operation-params';
import {OperationType} from '../fetch-graphql/type-transforms/resolvers';

/**
 * Builds argument strings for a GraphQL query.
 *
 * @category Internal Query Builders
 */
export function buildArgStrings({
    resolverName,
    args,
    operationParams,
    indent,
    argPlace,
    operationType,
    operationIndex,
}: {
    resolverName: string;
    args: Readonly<Record<string, any>> | undefined;
    operationParams: Readonly<SchemaOperationParams>;
    indent: string;
    argPlace: 'usage' | 'definition';
    operationType: OperationType;
    operationIndex: number;
}): string[] {
    if (!args || !Object.keys(args).length) {
        return [];
    }

    return Object.keys(args).map((argName) => {
        const argVarName = `$${buildArgVariableName({argName, resolverName, operationIndex})}`;

        const argType = operationParams[operationType][resolverName]?.args[argName];

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
