import {isTruthy, mergePropertyArrays} from '@augment-vir/common';
import {SchemaOperationParams} from '@prisma-to-graphql/graphql-codegen-operation-params';
import {isRunTimeType} from 'run-time-assertions';
import {GraphqlQuery} from '../fetch-graphql/fetch-raw-graphql';
import {BaseGraphqlOperations} from '../fetch-graphql/type-transforms/operations';
import {OperationType} from '../fetch-graphql/type-transforms/resolvers';
import {
    BuildGraphqlQueryOptions,
    defaultBuildGraphqlQueryOptions,
} from './build-graphql-query-options';
import {buildOperationQuery} from './build-operation-query';
import {sanitizeQueryString} from './sanitize-query-string';

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
    operationParams,
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
    operationParams: Readonly<SchemaOperationParams>;
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
            const resolverOperations = (
                isRunTimeType(operation, 'array') ? operation : [operation]
            ).filter(isTruthy);

            return resolverOperations.map((operation, operationIndex) =>
                buildOperationQuery({
                    operation,
                    operationType,
                    options: fullOptions,
                    resolverName,
                    operationParams,
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
