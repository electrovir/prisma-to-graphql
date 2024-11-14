import {AssertionError, assertWrap} from '@augment-vir/assert';
import {extractErrorMessage} from '@augment-vir/common';
import {buildSchema, GraphQLError} from 'graphql';
import {readFileSync} from 'node:fs';
import type {RequireExactlyOne} from 'type-fest';

/**
 * Asserts that the given GraphQL text or file path contain valid GraphQL syntax.
 *
 * @category Util
 */
export function assertValidGraphql(
    input: RequireExactlyOne<{text: string; path: string}>,
    failureMessage?: string | undefined,
) {
    try {
        const contents: string = assertWrap.isDefined(
            input.path ? String(readFileSync(input.path)) : input.text,
        );

        buildSchema(contents);
    } catch (error) {
        const locationStrings =
            error instanceof GraphQLError && error.locations
                ? error.locations.map((location) => {
                      return [
                          location.line,
                          location.column,
                      ].join(':');
                  })
                : undefined;

        const appendMessage = locationStrings ? ` at ${locationStrings.join(',')}` : '';
        throw new AssertionError(extractErrorMessage(error) + appendMessage, failureMessage);
    }
}
