import {describe, itCases} from '@augment-vir/test';
import {assertValidGraphql} from './validate-graphql.js';

describe(assertValidGraphql.name, () => {
    itCases(assertValidGraphql, [
        {
            it: 'accepts a valid string',
            inputs: [
                {
                    text: /* GraphQL */ `
                        scalar DateTime
                    `,
                },
            ],
            throws: undefined,
        },
        {
            it: 'rejects a invalid string',
            inputs: [
                {
                    text: /* GraphQL */ `
                        enum User_DistinctInput {
                            id
                            createdAt
                            updatedAt
                        }}
                    `,
                },
            ],
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'rejects missing inputs',
            inputs: [
                // @ts-expect-error: intentionally missing properties
                {},
            ],
            throws: {
                matchConstructor: Error,
            },
        },
    ]);
});
