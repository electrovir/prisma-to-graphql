import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {
    GraphqlBlockByType,
    GraphqlBlockType,
    OperationType,
    TopLevelBlockType,
} from './graphql-block.js';

describe('GraphqlBlockByType', () => {
    it('extracts specific block types', () => {
        assert
            .tsType<GraphqlBlockByType[GraphqlBlockType.Property]['type']>()
            .equals<GraphqlBlockType.Property>();
        assert
            .tsType<GraphqlBlockByType[GraphqlBlockType.Input]['type']>()
            .equals<GraphqlBlockType.Input | GraphqlBlockType.Type>();
        assert.tsType<GraphqlBlockByType[OperationType.Mutation]['type']>().equals<OperationType>();
    });
});

describe('TopLevelBlockType', () => {
    it('is a subset of all block types', () => {
        assert
            .tsType<Exclude<TopLevelBlockType, GraphqlBlockType | OperationType>>()
            .equals<never>();
        assert.tsType<TopLevelBlockType>().matches<GraphqlBlockType | OperationType>();
    });
});
