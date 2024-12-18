import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {OperationType} from '@prisma-to-graphql/core';
import {
    GraphqlBlockByType,
    GraphqlBlockType,
    TopLevelBlockType,
} from './graphql-blocks/graphql-block.js';

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
