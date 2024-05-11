import {GraphqlBlockByType} from '../../../builders/graphql-builder/graphql-block';
import {createIterableFilterProps, generateCommonFilterProps} from './prisma-filter-props';

/**
 * All currently defined filter inputs mapped by the type that they support filtering.
 *
 * @category Prisma Generator
 */
export const prismaFilters: Record<string, GraphqlBlockByType<'input'>> = {
    String: {
        type: 'input',
        name: 'StringFilterInput',
        props: [
            ...generateCommonFilterProps('String', 'StringFilterInput'),
            ...createIterableFilterProps('String'),
        ],
    },
    Boolean: {
        type: 'input',
        name: 'BooleanFilterInput',
        props: [
            {
                type: 'property',
                name: 'equals',
                value: 'Boolean',
                required: false,
            },
            {
                type: 'property',
                name: 'not',
                value: 'Boolean',
                required: false,
            },
        ],
    },
    DateTime: {
        type: 'input',
        name: 'DateTimeFilterInput',
        props: generateCommonFilterProps('DateTime', 'DateTimeFilterInput'),
    },
    Int: {
        type: 'input',
        name: 'IntFilterInput',
        props: generateCommonFilterProps('Int', 'IntFilterInput'),
    },
};
