import {assertTypeOf} from 'run-time-assertions';
import {GraphqlBlockByType} from './graphql-block';

describe('GraphqlBlockByType', () => {
    it('extracts specific block types', () => {
        type blah = GraphqlBlockByType<'Mutation'>['type'];

        assertTypeOf<GraphqlBlockByType<'property'>['type']>().toEqualTypeOf<'property'>();
        assertTypeOf<GraphqlBlockByType<'input'>['type']>().toEqualTypeOf<'input' | 'type'>();
        assertTypeOf<GraphqlBlockByType<'Mutation'>['type']>().toEqualTypeOf<
            'Mutation' | 'Query'
        >();
    });
});
