import {assertTypeOf} from 'run-time-assertions';
import {generatedModels} from '../generated-models.mock';
import {FieldScope, ListOperation, ModelScope, OperationScope} from './operation-scope';

describe('OperationScope', () => {
    it('has proper types', () => {
        assertTypeOf<{}>().toBeAssignableTo<OperationScope<typeof generatedModels>>();
        assertTypeOf({
            where: {
                User: {
                    id: {
                        equals: 'hi',
                    },
                },
            },
        }).toBeAssignableTo<OperationScope<typeof generatedModels>>();
    });

    it('does not allow nested relations', () => {
        assertTypeOf<{
            where: {
                Region: {
                    users: {
                        equals: {};
                    };
                };
            };
        }>().not.toBeAssignableTo<OperationScope<typeof generatedModels>>();
    });

    it('allows contains for string fields', () => {
        assertTypeOf<{
            where: {
                UserPost: {
                    body: {
                        contains: 'hi';
                    };
                };
            };
        }>().toBeAssignableTo<OperationScope<typeof generatedModels>>();
        assertTypeOf<{
            where: {
                UserStats: {
                    likes: {
                        contains: 'hi';
                    };
                };
            };
        }>().not.toBeAssignableTo<OperationScope<typeof generatedModels>>();
    });
});

describe('ModelScope', () => {
    it('excludes relation fields', () => {
        assertTypeOf<
            keyof Required<ModelScope<(typeof generatedModels)['Region']>>
        >().toEqualTypeOf<'createdAt' | 'regionName' | 'updatedAt' | 'users'>();

        assertTypeOf<ModelScope<(typeof generatedModels)['Region']>>().toEqualTypeOf<
            Readonly<
                Partial<{
                    createdAt: FieldScope<(typeof generatedModels)['Region']['createdAt']>;
                    regionName: FieldScope<(typeof generatedModels)['Region']['regionName']>;
                    updatedAt: FieldScope<(typeof generatedModels)['Region']['updatedAt']>;
                    users: Partial<{
                        listOperation: ListOperation;
                    }>;
                }>
            >
        >();
    });

    it('allow field specific props', () => {
        assertTypeOf<
            keyof NonNullable<
                NonNullable<ModelScope<(typeof generatedModels)['UserPost']>>['title']
            >
        >().toEqualTypeOf<'equals' | 'in' | 'contains'>();
    });
});

describe('FieldScope', () => {
    it('allows `contains` for string fields', () => {
        assertTypeOf<
            keyof FieldScope<{
                isList: false;
                isRelation: false;
                type: 'String';
            }>
        >().toEqualTypeOf<'contains' | 'equals' | 'in'>();
        assertTypeOf<
            keyof FieldScope<{
                isList: false;
                isRelation: false;
                type: 'DateTime';
            }>
        >().toEqualTypeOf<'equals' | 'in'>();
    });
    it('allows `listOperation` for list fields', () => {
        assertTypeOf<
            keyof FieldScope<{
                isList: true;
                isRelation: false;
                type: 'String';
            }>
        >().toEqualTypeOf<'listOperation' | 'contains' | 'equals' | 'in'>();
        assertTypeOf<
            keyof FieldScope<{
                isList: false;
                isRelation: false;
                type: 'String';
            }>
        >().toEqualTypeOf<'contains' | 'equals' | 'in'>();
    });
});
