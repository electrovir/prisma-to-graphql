import {check} from '@augment-vir/assert';
import {mergePropertyArrays} from '@augment-vir/common';
import type {OperationType, SchemaOperationTypeNames} from '@prisma-to-graphql/core';
import {GraphqlQuery} from '../fetch-graphql/fetch-raw-graphql.js';
import {BaseGraphqlOperations} from '../fetch-graphql/type-transforms/operations.js';
import {
    BuildGraphqlQueryOptions,
    defaultBuildGraphqlQueryOptions,
} from './build-graphql-query-options.js';
import {buildOperationQuery} from './build-operation-query.js';
import {sanitizeQueryString} from './sanitize-query-string.js';

/**
 * Builds a GraphQL query.
 *
 * @category Internal Query Builders
 */
export function buildGraphqlQuery({
    operationType,
    operationName,
    operations,
    options,
    schemaOperationTypeNames,
}: Readonly<{
    operationType: OperationType;
    operations: BaseGraphqlOperations;
    /**
     * A unique name given to this query. This name does not need to match any of your GraphQL
     * types, it just needs to be a string (and should be a unique string to make debugging
     * easier).
     *
     * See https://graphql.org/learn/queries/#operation-name.
     */
    operationName: string;
    options?: Partial<BuildGraphqlQueryOptions> | undefined;
    schemaOperationTypeNames: Readonly<SchemaOperationTypeNames>;
}>): GraphqlQuery {
    const fullOptions: BuildGraphqlQueryOptions = {
        ...defaultBuildGraphqlQueryOptions,
        ...options,
    };

    const operationParts = Object.entries(operations).flatMap(
        ([
            resolverName,
            operation,
        ]) => {
            const resolverOperations = (check.isArray(operation) ? operation : [operation]).filter(
                check.isTruthy,
            );

            return resolverOperations.map((operation, operationIndex) =>
                buildOperationQuery({
                    operation,
                    operationType,
                    options: fullOptions,
                    resolverName,
                    schemaOperationTypeNames,
                    operationIndex,
                }),
            );
        },
    );

    const allCalls = mergePropertyArrays(...operationParts);

    const argsDefinitionString = allCalls.varDefinitions.length
        ? `(\n${allCalls.varDefinitions.join('\n')}\n)`
        : '';

    const lines: string[] = [
        `${operationType.toLowerCase()} ${sanitizeQueryString(operationName)}${argsDefinitionString} {`,
        allCalls.queries.join('\n'),
        '}',
    ];

    return {
        query: lines.join('\n'),
        variables: Object.fromEntries(allCalls.variables),
    };
}
