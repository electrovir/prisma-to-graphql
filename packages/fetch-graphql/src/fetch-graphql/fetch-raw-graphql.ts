import {combineErrors, mergeDeep} from '@augment-vir/common';
import {hasProperty, isRunTimeType} from 'run-time-assertions';
import {JsonObject, JsonValue} from 'type-fest';
import {FetchGraphqlResponseError} from './fetch-graphql-response.error';

/**
 * Required GraphQL query input for `fetchRawGraphql`.
 *
 * @category Internals
 */
export type GraphqlQuery = {
    query: string;
    variables?: Record<string, JsonValue> | undefined;
};

/**
 * Lower level fetch options that are also included in `FetchGraphqlParams['options']`.
 *
 * @category Main Types
 */
export type FetchRawGraphqlOptions = {
    customFetch: typeof fetch;
    fetchOptions: Omit<RequestInit, 'body'>;
};

/**
 * Untyped graphql fetch function. This is used by the output of `createGraphqlFetcher`.
 *
 * @category Internals
 */
export async function fetchRawGraphql(
    url: string | URL,
    graphql: Readonly<GraphqlQuery>,
    /* istanbul ignore next: all tests must use a custom fetch */
    options: Partial<FetchRawGraphqlOptions> = {},
): Promise<any> {
    if (!url) {
        throw new Error('No URL provided for fetching GraphQL.');
    }

    const requestInit = mergeDeep<RequestInit>(
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
        },
        options.fetchOptions || {},
        {
            /** `body` cannot be overwritten by `fetchOptions`. */
            body: JSON.stringify(graphql),
        },
    );

    /* istanbul ignore next: not going to use real fetch in tests */
    const response = await (options.customFetch || fetch)(url, requestInit);

    if (!response.ok) {
        throw new Error(`Fetch to '${url}' failed: ${response.status}: ${response.statusText}`);
    }

    const responseJson: JsonObject = await response.json();

    if (
        hasProperty(responseJson, 'errors') &&
        Array.isArray(responseJson.errors) &&
        responseJson.errors.length
    ) {
        throw combineErrors(
            responseJson.errors.map((error) => {
                if (isRunTimeType(error, 'object')) {
                    return new FetchGraphqlResponseError(error);
                } else {
                    return new FetchGraphqlResponseError({message: String(error)});
                }
            }),
        );
    } else if (!hasProperty(responseJson, 'data') || !isRunTimeType(responseJson.data, 'object')) {
        throw new Error(`GraphQL Response from '${url}' had no data.`);
    }

    return responseJson.data;
}
