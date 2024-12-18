import {assert} from '@augment-vir/assert';
import {assertSnapshot, describe, it} from '@augment-vir/test';
import {
    GraphqlBuiltinScalar,
    GraphqlExtraScalar,
    type SupportedGraphqlScalar,
} from './scalar-type-map.js';
import {
    createCommonScalarWhereBlockProps,
    createIterableScalarWhereBlockProps,
    graphqlScalarWhereInputBlocks,
} from './scalar-where-input-blocks.js';

describe(createCommonScalarWhereBlockProps.name, () => {
    it('builds common input props', async (testContext) => {
        await assertSnapshot(
            testContext,
            createCommonScalarWhereBlockProps(GraphqlExtraScalar.DateTime, 'DateTimeWhereInput'),
        );
    });
});

describe(createIterableScalarWhereBlockProps.name, () => {
    it('builds iterable where input properties', async (testContext) => {
        await assertSnapshot(
            testContext,
            createIterableScalarWhereBlockProps(GraphqlBuiltinScalar.String),
        );
    });
});

describe('graphqlScalarWhereBlocks', () => {
    it('has all supported GraphQL scalars', () => {
        type MissingGraphqlScalars = Exclude<
            SupportedGraphqlScalar,
            keyof typeof graphqlScalarWhereInputBlocks
        >;

        assert.tsType<MissingGraphqlScalars>().equals<never>();
    });
});
