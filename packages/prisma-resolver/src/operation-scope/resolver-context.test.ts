import {assertTypeOf} from 'run-time-assertions';
import {generatedModels} from './generated-models.mock';
import {FieldScope, ModelScope, OperationScope} from './resolver-context';

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
});

describe('ModelScope', () => {
    it('excludes relation fields', () => {
        assertTypeOf<
            keyof Required<ModelScope<(typeof generatedModels)['Region']>>
        >().toEqualTypeOf<'createdAt' | 'regionName' | 'updatedAt'>();

        assertTypeOf<ModelScope<(typeof generatedModels)['Region']>>().toEqualTypeOf<
            Readonly<
                Partial<{
                    createdAt: FieldScope<'DateTime'>;
                    regionName: FieldScope<'String'>;
                    updatedAt: FieldScope<'DateTime'>;
                }>
            >
        >();
    });

    it('allow field specific props', () => {
        assertTypeOf<
            keyof NonNullable<
                NonNullable<ModelScope<(typeof generatedModels)['UserPost']>>['title']
            >
        >().toEqualTypeOf<'equals' | 'in' | 'listOperation' | 'contains'>();
    });
});

describe('FieldScope', () => {
    it('allows `contains` for string fields', () => {
        assertTypeOf<keyof FieldScope<'String'>>().toEqualTypeOf<
            'equals' | 'in' | 'listOperation' | 'contains'
        >();
    });
});
