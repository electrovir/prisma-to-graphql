import {assertTypeOf} from 'run-time-assertions';
import {Resolvers, operationParams} from '../my-generated-schema-outputs';
import {createGraphqlFetcher} from './fetch-graphql';
import {FetchParams, Operations} from './fetch-graphql-type-extraction';
import {AvailableOperationTypes} from './type-transforms/resolvers';

const mockFetchGraphql = createGraphqlFetcher<Resolvers>(operationParams);

describe('Operation', () => {
    it('provides auto complete for an operation', async () => {
        const myOperation: Operations<typeof mockFetchGraphql, 'Query'> = {
            Users: {
                args: {
                    where: {
                        role: {
                            equals: 'user',
                        },
                    },
                },
                select: {
                    items: {
                        firstName: true,
                    },
                },
            },
        };

        assertTypeOf(myOperation).toEqualTypeOf<
            Parameters<typeof mockFetchGraphql<'Query', typeof myOperation>>[1]
        >();
    });
});

describe('FetchParams', () => {
    it('stuff', () => {
        const myParams: FetchParams<typeof mockFetchGraphql> = {
            operationName: 'hello there',
            operationType: 'Query',
            url: 'something.com',
            options: {
                indent: '   ',
            },
        };

        assertTypeOf(myParams).toEqualTypeOf<
            Parameters<typeof mockFetchGraphql<AvailableOperationTypes<Resolvers>, any>>[0]
        >();
    });
});
