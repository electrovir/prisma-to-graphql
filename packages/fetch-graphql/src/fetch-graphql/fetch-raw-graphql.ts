import {check} from '@augment-vir/assert';
import {combineErrors, mergeDeep} from '@augment-vir/common';
import {JsonObject, JsonValue} from 'type-fest';
import {FetchGraphqlResponseError} from './fetch-graphql-response.error.js';

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
 * Subset of the global built-in `fetch` function needed for `fetchGraphql` to work.
 *
 * @category Main Types
 */
export type InnerFetch = (
    url: string | URL,
    requestInit: RequestInit,
) => Promise<Pick<Response, 'json' | 'status' | 'statusText' | 'ok'>>;

/**
 * Lower level fetch options that are also included in `FetchGraphqlParams['options']`.
 *
 * @category Main Types
 */
export type FetchRawGraphqlOptions = {
    fetch: InnerFetch;
    requestInit: Omit<RequestInit, 'body'>;
};

/**
 * Untyped graphql fetch function. This is used by the output of `createGraphqlFetcher`.
 *
 * @category Internals
 */
export async function fetchRawGraphql(
    url: string | URL,
    graphql: Readonly<GraphqlQuery>,
    /* node:coverage next: all tests must use a custom fetch for testing purposes */
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
        options.requestInit || {},
        {
            /** `body` cannot be overwritten by `fetchOptions`. */
            body: JSON.stringify(graphql),
        },
    );

    /* node:coverage ignore next: not going to use real fetch in tests */
    const response = await (options.fetch || globalThis.fetch)(url, requestInit);

    if (!response.ok) {
        throw new Error(
            `Fetch to '${String(url)}' failed: ${response.status}: ${response.statusText}`,
        );
    }

    const responseJson: JsonObject = await response.json();

    if (
        check.hasKey(responseJson, 'errors') &&
        Array.isArray(responseJson.errors) &&
        responseJson.errors.length
    ) {
        throw combineErrors(
            responseJson.errors.map((error) => {
                if (check.isObject(error)) {
                    return new FetchGraphqlResponseError(error);
                } else {
                    return new FetchGraphqlResponseError({message: String(error)});
                }
            }),
        );
    } else if (!check.hasKey(responseJson, 'data') || !check.isObject(responseJson.data)) {
        throw new Error(`GraphQL Response from '${String(url)}' had no data.`);
    }

    return responseJson.data;
}
