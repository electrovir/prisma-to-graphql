import {check} from '@augment-vir/assert';
import {filterMap} from '@augment-vir/common';
import {
    GraphqlBlockType,
    OperationType,
    type GraphqlBlockByType,
} from '../graphql-blocks/graphql-block.js';
import {GraphqlBuiltinScalar, getFieldGraphqlScalar} from '../graphql-scalars/scalar-type-map.js';
import {
    createScalarWhereInputName,
    graphqlScalarWhereInputBlocks,
} from '../graphql-scalars/scalar-where-input-blocks.js';
import type {PrismaModel} from '../prisma-builders/dmmf-model.js';
import type {ResolverBuilder} from './resolver-builder.js';
import {createResolverInputName, createResolverOutputName} from './resolver-names.js';

const sortOrderBlock: GraphqlBlockByType['enum'] = {
    type: GraphqlBlockType.Enum,
    name: 'SortOrder',
    values: [
        'asc',
        'desc',
    ],
};

const orderByCountBlock: GraphqlBlockByType['input'] = {
    type: GraphqlBlockType.Input,
    name: 'OrderByCount',
    props: [
        {
            type: GraphqlBlockType.Property,
            name: '_count',
            value: sortOrderBlock.name,
            required: false,
        },
    ],
};

const nullsOrderBlock: GraphqlBlockByType['enum'] = {
    type: GraphqlBlockType.Enum,
    name: 'NullsOrder',
    values: [
        'first',
        'last',
    ],
};

/** Sort order used for properties that are optionally null. */
const sortOrderWithNullsBlock: GraphqlBlockByType['input'] = {
    type: GraphqlBlockType.Input,
    name: 'SortOrderWithNulls',
    props: [
        {
            type: GraphqlBlockType.Property,
            name: 'sort',
            value: sortOrderBlock.name,
            required: true,
        },
        {
            type: GraphqlBlockType.Property,
            name: 'nulls',
            value: nullsOrderBlock.name,
            required: false,
        },
    ],
};

/**
 * Creates a `where` block used for querying an array relation.
 *
 * @category Resolver Builders
 */
export function createWhereManyInputBlock(
    prismaModel: Readonly<PrismaModel>,
): GraphqlBlockByType['input'] {
    const whereInputName = createResolverInputName({
        modelName: prismaModel.modelName,
        inputName: 'where',
    });

    return {
        type: GraphqlBlockType.Input,
        name: createResolverInputName({
            modelName: prismaModel.modelName,
            inputName: 'whereMany',
        }),
        props: [
            {
                type: GraphqlBlockType.Property,
                name: 'every',
                value: whereInputName,
                required: false,
            },
            {
                type: GraphqlBlockType.Property,
                name: 'none',
                value: whereInputName,
                required: false,
            },
            {
                type: GraphqlBlockType.Property,
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
 * @category Resolver Builders
 */
export function createWhereInputBlock(
    prismaModel: Readonly<PrismaModel>,
): GraphqlBlockByType['input'] {
    const whereInputName = createResolverInputName({
        modelName: prismaModel.modelName,
        inputName: 'where',
    });

    return {
        type: GraphqlBlockType.Input,
        name: whereInputName,
        props: [
            {
                type: GraphqlBlockType.Property,
                name: 'AND',
                value: `[${whereInputName}!]`,
                required: false,
            },
            {
                type: GraphqlBlockType.Property,
                name: 'OR',
                value: `[${whereInputName}!]`,
                required: false,
            },
            {
                type: GraphqlBlockType.Property,
                name: 'NOT',
                value: `[${whereInputName}!]`,
                required: false,
            },
            ...filterMap(
                Object.values(prismaModel.fields),
                (field): GraphqlBlockByType['property'] | undefined => {
                    if (field.relationName) {
                        return {
                            type: GraphqlBlockType.Property,
                            name: field.name,
                            value: createResolverInputName({
                                modelName: field.type,
                                inputName: field.isList ? 'whereMany' : 'where',
                            }),
                            required: false,
                        };
                    } else {
                        return {
                            type: GraphqlBlockType.Property,
                            name: field.name,
                            value: createScalarWhereInputName(field),
                            required: false,
                        };
                    }
                },
                check.isTruthy,
            ),
        ],
    };
}

function createQueryInputBlocks(prismaModel: Readonly<PrismaModel>) {
    const orderByInputBlock: GraphqlBlockByType['input'] = {
        type: GraphqlBlockType.Input,
        name: createResolverInputName({
            modelName: prismaModel.modelName,
            inputName: 'orderBy',
        }),
        props: filterMap(
            Object.values(prismaModel.fields),
            (field): GraphqlBlockByType['property'] | undefined => {
                if (field.isList) {
                    return {
                        type: GraphqlBlockType.Property,
                        name: field.name,
                        value: orderByCountBlock.name,
                        required: false,
                    };
                } else if (field.relationName) {
                    return {
                        type: GraphqlBlockType.Property,
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
                        type: GraphqlBlockType.Property,
                        name: field.name,
                        value: sortType,
                        required: false,
                    };
                }
            },
            check.isTruthy,
        ),
    };

    const distinctInputBlock: GraphqlBlockByType['enum'] = {
        type: GraphqlBlockType.Enum,
        name: createResolverInputName({
            modelName: prismaModel.modelName,
            inputName: 'distinct',
        }),
        values: filterMap(
            Object.values(prismaModel.fields),
            (field) => field.name,
            (name, field) => {
                return !field.relationName;
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
 * @category Resolver Builders
 */
export function createWhereUnfilteredUniqueInputBlock(
    prismaModel: Readonly<PrismaModel>,
): GraphqlBlockByType['input'] {
    const whereInputName = createResolverInputName({
        modelName: prismaModel.modelName,
        inputName: 'where',
    });

    return {
        type: GraphqlBlockType.Input,
        name: createResolverInputName({
            modelName: prismaModel.modelName,
            inputName: 'whereUnfilteredUnique',
        }),
        props: [
            {
                type: GraphqlBlockType.Property,
                name: 'AND',
                value: `[${whereInputName}!]`,
                required: false,
            },
            {
                type: GraphqlBlockType.Property,
                name: 'OR',
                value: `[${whereInputName}!]`,
                required: false,
            },
            {
                type: GraphqlBlockType.Property,
                name: 'NOT',
                value: `[${whereInputName}!]`,
                required: false,
            },
            ...filterMap(
                Object.values(prismaModel.fields),
                (field): GraphqlBlockByType['property'] | undefined => {
                    if (field.relationName) {
                        return {
                            type: GraphqlBlockType.Property,
                            name: field.name,
                            value: createResolverInputName({
                                modelName: field.type,
                                inputName: field.isList ? 'whereMany' : 'where',
                            }),
                            required: false,
                        };
                    } else {
                        const isUnique = field.isUnique || field.isId;

                        return {
                            type: GraphqlBlockType.Property,
                            name: field.name,
                            value: isUnique ? field.type : createScalarWhereInputName(field),
                            required: false,
                        };
                    }
                },
                check.isTruthy,
            ),
        ],
    };
}

/**
 * Creates the GraphQL type block used as an output by all of this generator's resolvers.
 *
 * @category Resolver Builders
 */
export function createOutputTypeBlocks(prismaModel: Readonly<PrismaModel>) {
    const outputMessageBlock: GraphqlBlockByType['type'] = {
        type: GraphqlBlockType.Type,
        name: 'OutputMessage',
        props: [
            {
                type: GraphqlBlockType.Property,
                name: 'code',
                value: 'String',
                required: true,
            },
            {
                type: GraphqlBlockType.Property,
                name: 'message',
                value: 'String',
                required: true,
            },
            {
                type: GraphqlBlockType.Property,
                name: 'description',
                value: 'String',
                required: true,
            },
        ],
    };

    const outputBlock: GraphqlBlockByType['type'] = {
        type: GraphqlBlockType.Type,
        name: createResolverOutputName(prismaModel.modelName),
        props: [
            {
                type: GraphqlBlockType.Property,
                name: 'total',
                comment: [
                    'Total count of items found or modified.',
                    'This count is not affected by pagination (it always counts all results).',
                ],
                value: 'Int',
                required: true,
            },
            {
                type: GraphqlBlockType.Property,
                name: 'items',
                value: `[${prismaModel.modelName}!]`,
                required: true,
            },
            {
                type: GraphqlBlockType.Property,
                name: 'messages',
                value: `[${outputMessageBlock.name}]`,
                required: true,
            },
        ],
    };

    return {
        output: outputBlock,
        outputMessage: outputMessageBlock,
    };
}

function createScalarWhereInputBlocks(
    prismaModel: Readonly<Pick<PrismaModel, 'modelName' | 'fields'>>,
): GraphqlBlockByType[GraphqlBlockType.Input][] {
    return filterMap(
        Object.values(prismaModel.fields),
        (field): GraphqlBlockByType[GraphqlBlockType.Input][] | undefined => {
            if (field.relationName) {
                /** This where input is not for a scalar type. */
                return undefined;
            } else if (field.isEnumType) {
                const nestedWhereInputBlock: GraphqlBlockByType[GraphqlBlockType.Input] = {
                    name: `${field.type}_Enum_NestedWhereInput`,
                    type: GraphqlBlockType.Input,
                    props: [
                        {
                            type: GraphqlBlockType.Property,
                            name: 'equals',
                            value: field.type,
                            required: false,
                        },
                        {
                            type: GraphqlBlockType.Property,
                            name: 'in',
                            value: `[${field.type}]`,
                            required: false,
                        },
                        {
                            type: GraphqlBlockType.Property,
                            name: 'notIn',
                            value: `[${field.type}]`,
                            required: false,
                        },
                    ],
                };

                return [
                    nestedWhereInputBlock,
                    {
                        name: createScalarWhereInputName(field),
                        type: GraphqlBlockType.Input,
                        props: [
                            ...nestedWhereInputBlock.props,
                            {
                                type: GraphqlBlockType.Property,
                                name: 'not',
                                value: nestedWhereInputBlock.name,
                                required: false,
                            },
                        ],
                    },
                ];
            } else if (field.isList) {
                return [
                    {
                        name: createScalarWhereInputName(field),
                        type: GraphqlBlockType.Input,
                        props: [
                            {
                                type: GraphqlBlockType.Property,
                                name: 'equals',
                                required: false,
                                value: `[${field.type}]`,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'has',
                                required: false,
                                value: field.type,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'hasEvery',
                                required: false,
                                value: `[${field.type}]`,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'hasSome',
                                required: false,
                                value: `[${field.type}]`,
                            },
                            {
                                type: GraphqlBlockType.Property,
                                name: 'isEmpty',
                                required: false,
                                value: GraphqlBuiltinScalar.Boolean,
                            },
                        ],
                    },
                ];
            }

            const graphqlScalarType = getFieldGraphqlScalar(field);

            if (!graphqlScalarType) {
                throw new Error(
                    `Unsupported scalar type '${field.type}' in field '${prismaModel.modelName}.${field.name}'`,
                );
            }

            return [graphqlScalarWhereInputBlocks[graphqlScalarType]];
        },
        check.isTruthy,
    ).flat();
}

/**
 * Generates a query GraphQL resolver that wraps Prisma's `findMany` method. The generated resolver
 * is named the plural version of the table name.
 *
 * @category Resolver Builders
 */
export const findManyBuilder: ResolverBuilder = {
    type: OperationType.Query,
    build(prismaModel) {
        const scalarWhereInputsBlocks = createScalarWhereInputBlocks(prismaModel);

        const queryInputBlocks = createQueryInputBlocks(prismaModel);
        const outputBlocks = createOutputTypeBlocks(prismaModel);

        const operationBlock: GraphqlBlockByType['operation'] = {
            type: GraphqlBlockType.Operation,
            args: [
                {
                    type: GraphqlBlockType.Property,
                    name: 'where',
                    value: queryInputBlocks.where.name,
                    required: false,
                },
                {
                    type: GraphqlBlockType.Property,
                    name: 'orderBy',
                    value: `[${queryInputBlocks.orderBy.name}!]`,
                    required: false,
                },
                {
                    type: GraphqlBlockType.Property,
                    name: 'cursor',
                    value: queryInputBlocks.whereUnfilteredUnique.name,
                    required: false,
                },
                {
                    type: GraphqlBlockType.Property,
                    name: 'distinct',
                    value: `[${queryInputBlocks.distinct.name}!]`,
                    required: false,
                },
                {
                    type: GraphqlBlockType.Property,
                    name: 'take',
                    value: 'Int',
                    required: false,
                },
            ],
            name: prismaModel.pluralModelName,
            output: {
                value: outputBlocks.output.name,
                required: true,
            },
        };

        return {
            resolverGraphqlBlocks: [
                {
                    type: OperationType.Query,
                    blocks: [operationBlock],
                },
            ],
            topLevelNamedGraphqlBlocks: [
                sortOrderBlock,
                sortOrderWithNullsBlock,
                nullsOrderBlock,
                ...Object.values(outputBlocks),
                orderByCountBlock,
                ...Object.values(queryInputBlocks),
                ...scalarWhereInputsBlocks,
                createWhereManyInputBlock(prismaModel),
            ],
        };
    },
};
