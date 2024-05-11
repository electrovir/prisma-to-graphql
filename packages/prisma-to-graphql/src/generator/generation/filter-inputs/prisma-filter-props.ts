import {GraphqlBlockByType} from '../../../builders/graphql-builder/graphql-block';

/**
 * Creates common property GraphQL blocks for filter GraphQL input blocks.
 *
 * @category Prisma Generator
 */
export function generateCommonFilterProps(
    scalarName: string,
    filterName: string,
): GraphqlBlockByType<'property'>[] {
    return [
        {
            type: 'property',
            name: 'equals',
            value: scalarName,
            required: false,
        },
        {
            type: 'property',
            name: 'in',
            value: `[${scalarName}!]`,
            required: false,
        },
        {
            type: 'property',
            name: 'notIn',
            value: `[${scalarName}!]`,
            required: false,
        },
        {
            type: 'property',
            name: 'lt',
            value: scalarName,
            required: false,
        },
        {
            type: 'property',
            name: 'lte',
            value: scalarName,
            required: false,
        },
        {
            type: 'property',
            name: 'gt',
            value: scalarName,
            required: false,
        },
        {
            type: 'property',
            name: 'gte',
            value: scalarName,
            required: false,
        },
        {
            type: 'property',
            name: 'not',
            value: filterName,
            required: false,
        },
    ];
}

/**
 * Creates property GraphQL blocks for filter GraphQL input blocks for filters for types that are
 * iterable.
 *
 * @category Prisma Generator
 */
export function createIterableFilterProps(scalarName: string): GraphqlBlockByType<'property'>[] {
    return [
        {
            type: 'property',
            name: 'contains',
            value: scalarName,
            required: false,
        },
        {
            type: 'property',
            name: 'startsWith',
            value: scalarName,
            required: false,
        },
        {
            type: 'property',
            name: 'endsWith',
            value: scalarName,
            required: false,
        },
    ];
}
