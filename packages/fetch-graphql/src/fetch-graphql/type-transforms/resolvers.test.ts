import {assertTypeOf} from 'run-time-assertions';
import {Resolvers} from '../../my-generated-schema-outputs';
import {
    AvailableOperationTypes,
    AvailableResolverNames,
    BaseResolver,
    ResolverInputs,
} from './resolvers';

describe('ResolverInputs', () => {
    it('extracts resolver input types', () => {
        assertTypeOf<ResolverInputs<{}, never, never>>().toEqualTypeOf<never>();
        assertTypeOf<
            ResolverInputs<
                {
                    Query: {
                        Users: (
                            parent: any,
                            args: {
                                helloThere: string;
                            },
                            context: any,
                            info: any,
                        ) => string;
                    };
                },
                'Query',
                'Users'
            >
        >().toEqualTypeOf<{
            helloThere: string;
        }>();

        assertTypeOf<
            ResolverInputs<
                {
                    Query: {
                        NoArgs: (parent: any, args: {}, context: any, info: any) => string;
                    };
                },
                'Query',
                'NoArgs'
            >
        >().toEqualTypeOf<never>();
    });
});

describe('AvailableResolverNames', () => {
    it('has correct types', () => {
        assertTypeOf<AvailableResolverNames<Resolvers, 'Mutation'>>().toEqualTypeOf<
            'Users' | 'UserSettings' | 'UserStats'
        >();
        assertTypeOf<AvailableResolverNames<Resolvers, 'Query'>>().toEqualTypeOf<
            'Users' | 'UserSettings' | 'UserStats'
        >();
    });

    it('extracts resolver names', () => {
        assertTypeOf<AvailableResolverNames<{}, never>>().toEqualTypeOf<never>();
        assertTypeOf<AvailableResolverNames<{Query: {}}, 'Query'>>().toEqualTypeOf<never>();
        assertTypeOf<
            AvailableResolverNames<{Query: {Users: BaseResolver}}, 'Query'>
        >().toEqualTypeOf<'Users'>();
    });
});

describe('AvailableOperationTypes', () => {
    it('extracts operation types', () => {
        assertTypeOf<AvailableOperationTypes<{}>>().toEqualTypeOf<never>();
        assertTypeOf<AvailableOperationTypes<{Query: any}>>().toEqualTypeOf<'Query'>();
        assertTypeOf<AvailableOperationTypes<{Query: any; Mutation: any}>>().toEqualTypeOf<
            'Query' | 'Mutation'
        >();
    });
});
