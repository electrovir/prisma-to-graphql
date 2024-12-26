import {check} from '@augment-vir/assert';
import type {OperationType, SchemaOperationTypeNames} from '@prisma-to-graphql/core';
import {JsonValue} from 'type-fest';
import {BaseGraphqlOperation} from '../fetch-graphql/type-transforms/selection.js';
import {buildArgStrings, buildArgVariableName} from './build-arg-strings.js';
import {BuildGraphqlQueryOptions} from './build-graphql-query-options.js';
import {buildSelectionStrings} from './build-selection-strings.js';
import {sanitizeQueryString} from './sanitize-query-string.js';

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
    schemaOperationTypeNames,
    operationIndex,
}: Readonly<{
    resolverName: string;
    operationType: OperationType | `${OperationType}`;
    operation: Readonly<BaseGraphqlOperation>;
    options: Readonly<Pick<BuildGraphqlQueryOptions, 'indent'>>;
    schemaOperationTypeNames: Readonly<SchemaOperationTypeNames>;
    operationIndex: number;
}>) {
    const argStringParams = {
        schemaOperationTypeNames,
        operationType,
        resolverName,
        args: operation.args,
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

    const selectionStrings = buildSelectionStrings(operation.select, options.indent).map((line) =>
        [
            options.indent,
            line,
        ].join(''),
    );

    const selectionString = selectionStrings.length
        ? ` {\n${selectionStrings.join('\n')}\n${options.indent}}`
        : '';

    const variables: [string, JsonValue][] = Object.entries(operation.args || {}).map(
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
        sanitizeQueryString(operation.alias || ''),
        resolverName,
    ]
        .filter(check.isTruthy)
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
