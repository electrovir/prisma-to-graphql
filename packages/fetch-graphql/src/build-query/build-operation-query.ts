import {isTruthy} from '@augment-vir/common';
import {SchemaOperationParams} from '@prisma-to-graphql/graphql-codegen-operation-params';
import {JsonValue} from 'type-fest';
import {OperationType} from '../fetch-graphql/type-transforms/resolvers';
import {BaseGraphqlOperation} from '../fetch-graphql/type-transforms/selection';
import {buildArgStrings, buildArgVariableName} from './build-arg-strings';
import {BuildGraphqlQueryOptions} from './build-graphql-query-options';
import {buildSelectionStrings} from './build-selection-strings';
import {sanitizeQueryString} from './sanitize-query-string';

/**
 * Builds a GraphQL query for a single operation (query / mutation).
 *
 * @category Internal Query Builders
 */
export function buildOperationQuery({
    resolverName,
    operationType,
    operation,
    options,
    operationParams,
    operationIndex,
}: Readonly<{
    resolverName: string;
    operationType: OperationType;
    operation: Readonly<BaseGraphqlOperation>;
    options: Readonly<Pick<BuildGraphqlQueryOptions, 'indent'>>;
    operationParams: Readonly<SchemaOperationParams>;
    operationIndex: number;
}>) {
    const argStringParams = {
        operationParams,
        operationType,
        resolverName,
        args: operation?.args,
        operationIndex,
    } as const;

    const argDefinitionStrings: string[] = buildArgStrings({
        argPlace: 'definition',
        indent: options.indent,
        ...argStringParams,
    });
    const argUsageStrings = buildArgStrings({
        argPlace: 'usage',
        indent: options.indent.repeat(2),
        ...argStringParams,
    });
    const argsUsageString = argUsageStrings.length
        ? `(\n${argUsageStrings.join('\n')}\n${options.indent})`
        : '';

    const selectionStrings = buildSelectionStrings(operation?.select, options.indent).map((line) =>
        [
            options.indent,
            line,
        ].join(''),
    );

    const selectionString = selectionStrings.length
        ? ` {\n${selectionStrings.join('\n')}\n${options.indent}}`
        : '';

    const variables: [string, JsonValue][] = Object.entries(operation?.args || {}).map(
        ([
            argName,
            argValue,
        ]) => {
            return [
                buildArgVariableName({
                    argName,
                    resolverName,
                    operationIndex,
                }),
                argValue,
            ];
        },
    );

    const resolverWithAlias = [
        sanitizeQueryString(operation?.alias || ''),
        resolverName,
    ]
        .filter(isTruthy)
        .join(': ');

    return {
        queries: [
            [
                options.indent,
                resolverWithAlias,
                argsUsageString,
                selectionString,
            ].join(''),
        ],
        varDefinitions: argDefinitionStrings,
        variables,
    };
}
