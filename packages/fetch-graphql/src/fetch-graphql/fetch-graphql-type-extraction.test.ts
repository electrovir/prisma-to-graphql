import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {OperationType} from '@prisma-to-graphql/core';
import {Resolvers, schemaOperationTypeNames} from '../schema-output.mock.js';
import {FetchParams, Operations} from './fetch-graphql-type-extraction.js';
import {createGraphqlFetcher} from './fetch-graphql.js';
import {AvailableOperationTypes} from './type-transforms/resolvers.js';

const mockFetchGraphql = createGraphqlFetcher<Resolvers>(schemaOperationTypeNames);

describe('Operation', () => {
    it('provides auto complete for an operation', () => {
        const myOperation: Operations<typeof mockFetchGraphql, OperationType.Query> = {
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

        assert
            .tsType(myOperation)
            .equals<
                Parameters<typeof mockFetchGraphql<OperationType.Query, typeof myOperation>>[1]
            >();
    });
});

describe('FetchParams', () => {
    it('can be assigned to by a real variable instance', () => {
        const myParams: FetchParams<typeof mockFetchGraphql> = {
            operationName: 'hello there',
            operationType: OperationType.Query,
            url: 'something.com',
            options: {
                indent: '   ',
            },
        };

        assert
            .tsType(myParams)
            .equals<
                Parameters<typeof mockFetchGraphql<AvailableOperationTypes<Resolvers>, any>>[0]
            >();
    });
});
