import {assert} from 'chai';
import {FetchGraphqlResponseError} from './fetch-graphql-response.error';

describe(FetchGraphqlResponseError.name, () => {
    it('has the proper error name', () => {
        const instance = new FetchGraphqlResponseError({});
        assert.strictEqual(instance.name, FetchGraphqlResponseError.name);
    });

    it('extracts a message', () => {
        const instance = new FetchGraphqlResponseError({message: 'derp', somethingElse: 4});
        assert.strictEqual(instance.message, 'derp');
    });

    it('defaults to no message', () => {
        const instance = new FetchGraphqlResponseError({somethingElse: 4});
        assert.strictEqual(instance.message, 'no message');
    });
});
