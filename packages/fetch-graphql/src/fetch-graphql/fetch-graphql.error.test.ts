import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {FetchGraphqlResponseError} from './fetch-graphql-response.error.js';

describe(FetchGraphqlResponseError.name, () => {
    it('has the proper error name', () => {
        const instance = new FetchGraphqlResponseError({});
        assert.strictEquals(instance.name, FetchGraphqlResponseError.name);
    });

    it('extracts a message', () => {
        const instance = new FetchGraphqlResponseError({message: 'derp', somethingElse: 4});
        assert.strictEquals(instance.message, 'derp');
    });

    it('defaults to no message', () => {
        const instance = new FetchGraphqlResponseError({somethingElse: 4});
        assert.strictEquals(instance.message, 'no message');
    });
});
