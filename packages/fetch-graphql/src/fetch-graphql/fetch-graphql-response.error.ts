import {hasProperty, isRunTimeType} from 'run-time-assertions';
import {JsonObject} from 'type-fest';

/**
 * If a GraphQL response from `fetchGraphql` or `fetchRawGraphql` includes errors rather than data,
 * those errors are extracted, parsed, combined, and wrapped into this common Error class before
 * being thrown. Thus, you can expect that errors of this class always came from a GraphQL response,
 * rather than something else in the fetch stack.
 *
 * @category Main Types
 */
export class FetchGraphqlResponseError extends Error {
    public override name = 'FetchGraphqlResponseError';

    constructor(public readonly errorObject: JsonObject) {
        const message: string =
            (hasProperty(errorObject, 'message') &&
                isRunTimeType(errorObject.message, 'string') &&
                errorObject.message) ||
            'no message';
        super(message);
    }
}
