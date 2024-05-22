import {filterMap, isTruthy} from '@augment-vir/common';
import {GraphqlBlockByType} from '../../../builders/graphql-builder/graphql-block';
import {prismaFilters} from '../filter-inputs/prisma-filters';
import {GeneratedGraphql} from '../generated-graphql';
import {PrismaModel} from '../model/prisma-model';
import {ResolverGenerator} from '../resolver-generator';
import {createQueryOutputName, createResolverInputName} from './model-resolver-io';

const sortOrderBlock: GraphqlBlockByType<'enum'> = {
    type: 'enum',
    name: 'SortOrder',
    values: [
        'asc',
        'desc',
    ],
};

const orderByCountBlock: GraphqlBlockByType<'input'> = {
    type: 'input',
    name: 'OrderByCount',
    props: [
        {
            type: 'property',
            name: '_count',
            value: sortOrderBlock.name,
            required: false,
        },
    ],
};

const nullsOrderBlock: GraphqlBlockByType<'enum'> = {
    type: 'enum',
    name: 'NullsOrder',
    values: [
        'first',
        'last',
    ],
};

/** Sort order used for properties that are optionally null. */
const sortOrderWithNullsBlock: GraphqlBlockByType<'input'> = {
    type: 'input',
    name: 'SortOrderWithNulls',
    props: [
        {
            type: 'property',
            name: 'sort',
            value: sortOrderBlock.name,
            required: true,
        },
        {
            type: 'property',
            name: 'nulls',
            value: nullsOrderBlock.name,
            required: false,
        },
    ],
};

/**
 * Creates a `where` block used for querying an array relation.
 *
 * @category Prisma Generator
 */
export function createWhereManyInputBlock(
    prismaModel: Readonly<PrismaModel>,
): GraphqlBlockByType<'input'> {
    const whereInputName = createResolverInputName({
        modelName: prismaModel.modelName,
        inputName: 'where',
    });

    return {
        type: 'input',
        name: createResolverInputName({
            modelName: prismaModel.modelName,
            inputName: 'whereMany',
        }),
        props: [
            {
                type: 'property',
                name: 'every',
                value: whereInputName,
                required: false,
            },
            {
                type: 'property',
                name: 'none',
                value: whereInputName,
                required: false,
            },
            {
                type: 'property',
                name: 'some',
                value: whereInputName,
                required: false,
            },
        ],
    };
}

/**
 * Creates a `where` GraphQL input block that matches Prisma's expected `where` inputs.
 *
 * @category Prisma Generator
 */
export function createWhereInputBlock(
    prismaModel: Readonly<PrismaModel>,
): GraphqlBlockByType<'input'> {
    const whereInputName = createResolverInputName({
        modelName: prismaModel.modelName,
        inputName: 'where',
    });

    return {
        type: 'input',
        name: whereInputName,
        props: [
            {
                type: 'property',
                name: 'AND',
                value: `[${whereInputName}!]`,
                required: false,
            },
            {
                type: 'property',
                name: 'OR',
                value: `[${whereInputName}!]`,
                required: false,
            },
            {
                type: 'property',
                name: 'NOT',
                value: `[${whereInputName}!]`,
                required: false,
            },
            ...filterMap(
                Object.values(prismaModel.fields),
                (field): GraphqlBlockByType<'property'> | undefined => {
                    if (field.hideIn?.inputs) {
                        return undefined;
                    }

                    if (field.isList) {
                        return {
                            type: 'property',
                            name: field.name,
                            value: createResolverInputName({
                                modelName: field.type,
                                inputName: 'whereMany',
                            }),
                            required: false,
                        };
                    } else if (field.relationName) {
                        return {
                            type: 'property',
                            name: field.name,
                            value: createResolverInputName({
                                modelName: field.type,
                                inputName: 'where',
                            }),
                            required: false,
                        };
                    } else {
                        const filterName = prismaFilters[field.type]?.name;
                        if (!filterName) {
                            throw new Error(`No filter exists yet for type '${field.type}'`);
                        }

                        return {
                            type: 'property',
                            name: field.name,
                            value: filterName,
                            required: false,
                        };
                    }
                },
                isTruthy,
            ),
        ],
    };
}

function createQueryInputBlocks(prismaModel: Readonly<PrismaModel>) {
    const orderByInputBlock: GraphqlBlockByType<'input'> = {
        type: 'input',
        name: createResolverInputName({
            modelName: prismaModel.modelName,
            inputName: 'orderBy',
        }),
        props: filterMap(
            Object.values(prismaModel.fields),
            (field): GraphqlBlockByType<'property'> | undefined => {
                if (field.hideIn?.inputs) {
                    return undefined;
                } else if (field.isList) {
                    return {
                        type: 'property',
                        name: field.name,
                        value: orderByCountBlock.name,
                        required: false,
                    };
                } else if (field.relationName) {
                    return {
                        type: 'property',
                        name: field.name,
                        value: createResolverInputName({
                            modelName: field.type,
                            inputName: 'orderBy',
                        }),
                        required: false,
                    };
                } else {
                    const sortType = field.isRequired
                        ? sortOrderBlock.name
                        : sortOrderWithNullsBlock.name;

                    return {
                        type: 'property',
                        name: field.name,
                        value: sortType,
                        required: false,
                    };
                }
            },
            isTruthy,
        ),
    };

    const distinctInputBlock: GraphqlBlockByType<'enum'> = {
        type: 'enum',
        name: createResolverInputName({
            modelName: prismaModel.modelName,
            inputName: 'distinct',
        }),
        values: filterMap(
            Object.values(prismaModel.fields),
            (field) => field.name,
            (name, field) => {
                return !field.relationName && !field.hideIn?.inputs;
            },
        ),
    };

    return {
        where: createWhereInputBlock(prismaModel),
        orderBy: orderByInputBlock,
        distinct: distinctInputBlock,
        whereUnfilteredUnique: createWhereUnfilteredUniqueInputBlock(prismaModel),
    };
}

/**
 * A block similar to the `where` block that, for each unique or id property, requires the type
 * itself rather than a filter. (This is required for Prisma. I don't know why Prisma does this.)
 *
 * @category Prisma Generator
 */
export function createWhereUnfilteredUniqueInputBlock(
    prismaModel: Readonly<PrismaModel>,
): GraphqlBlockByType<'input'> {
    const whereInputName = createResolverInputName({
        modelName: prismaModel.modelName,
        inputName: 'where',
    });

    return {
        type: 'input',
        name: createResolverInputName({
            modelName: prismaModel.modelName,
            inputName: 'whereUnfilteredUnique',
        }),
        props: [
            {
                type: 'property',
                name: 'AND',
                value: `[${whereInputName}!]`,
                required: false,
            },
            {
                type: 'property',
                name: 'OR',
                value: `[${whereInputName}!]`,
                required: false,
            },
            {
                type: 'property',
                name: 'NOT',
                value: `[${whereInputName}!]`,
                required: false,
            },
            ...filterMap(
                Object.values(prismaModel.fields),
                (field): GraphqlBlockByType<'property'> | undefined => {
                    if (field.hideIn?.inputs) {
                        return undefined;
                    } else if (field.isList) {
                        return {
                            type: 'property',
                            name: field.name,
                            value: createResolverInputName({
                                modelName: field.type,
                                inputName: 'whereMany',
                            }),
                            required: false,
                        };
                    } else if (field.relationName) {
                        return {
                            type: 'property',
                            name: field.name,
                            value: createResolverInputName({
                                modelName: field.type,
                                inputName: 'where',
                            }),
                            required: false,
                        };
                    } else {
                        const isUnique = field.isUnique || field.isId;

                        const propType = isUnique ? field.type : prismaFilters[field.type]?.name;
                        if (!propType) {
                            throw new Error(`No filter exists yet for type '${field.type}'`);
                        }

                        return {
                            type: 'property',
                            name: field.name,
                            value: propType,
                            required: false,
                        };
                    }
                },
                isTruthy,
            ),
        ],
    };
}

/**
 * Creates the GraphQL type block used as an output by all of this generator's resolvers.
 *
 * @category Prisma Generator
 */
export function createOutputTypeBlock(
    prismaModel: Readonly<PrismaModel>,
): GraphqlBlockByType<'type'> {
    return {
        type: 'type',
        name: createQueryOutputName(prismaModel.modelName),
        props: [
            {
                type: 'property',
                name: 'total',
                comment: [
                    "Total count of items based on the provided 'where' argument.",
                    'This total ignores pagination args so that, when using pagination, you can know how many pages are needed.',
                ],
                value: 'Int',
                required: true,
            },
            {
                type: 'property',
                name: 'items',
                value: `[${prismaModel.modelName}!]`,
                required: true,
            },
        ],
    };
}

/**
 * Generates a query GraphQL resolver that wraps Prisma's `findMany` method. The generated resolver
 * is named the plural version of the table name.
 *
 * @category Prisma Generator
 */
export const modelFindManyOperation: ResolverGenerator = {
    type: 'Query',
    generate(prismaModel: Readonly<PrismaModel>): GeneratedGraphql {
        const propTypes = filterMap(
            Object.values(prismaModel.fields),
            (field) => {
                return field.type;
            },
            (fieldType, field) => {
                return !field.relationName && !field.hideIn?.inputs;
            },
        );
        const propFiltersNeeded = propTypes.map((propType) => {
            const typeFilterBlock = prismaFilters[propType];
            if (!typeFilterBlock) {
                throw new Error(`No filter exists yet for type '${propType}'`);
            }

            return typeFilterBlock;
        });

        const queryInputBlocks = createQueryInputBlocks(prismaModel);
        const outputTypeBlock = createOutputTypeBlock(prismaModel);

        const operationBlock: GraphqlBlockByType<'operation'> = {
            type: 'operation',
            args: [
                {
                    type: 'property',
                    name: 'where',
                    value: queryInputBlocks.where.name,
                    required: false,
                },
                {
                    type: 'property',
                    name: 'orderBy',
                    value: `[${queryInputBlocks.orderBy.name}!]`,
                    required: false,
                },
                {
                    type: 'property',
                    name: 'cursor',
                    value: queryInputBlocks.whereUnfilteredUnique.name,
                    required: false,
                },
                {
                    type: 'property',
                    name: 'distinct',
                    value: `[${queryInputBlocks.distinct.name}!]`,
                    required: false,
                },
                {
                    type: 'property',
                    name: 'take',
                    value: 'Int',
                    required: false,
                },
                {
                    type: 'property',
                    name: 'skip',
                    value: 'Int',
                    required: false,
                },
            ],
            name: prismaModel.pluralModelName,
            output: {
                value: outputTypeBlock.name,
                required: true,
            },
        };

        return {
            resolverBlocks: [
                {
                    type: 'Query',
                    blocks: [operationBlock],
                },
            ],
            topLevelNamedGraphqlBlocks: [
                sortOrderBlock,
                sortOrderWithNullsBlock,
                nullsOrderBlock,
                outputTypeBlock,
                orderByCountBlock,
                ...Object.values(queryInputBlocks),
                ...propFiltersNeeded,
                createWhereManyInputBlock(prismaModel),
            ],
            resolvers: [
                {
                    type: 'prisma',
                    operationType: 'Query',
                    prismaModelName: prismaModel.modelName,
                    resolverName: operationBlock.name,
                },
            ],
        };
    },
};
