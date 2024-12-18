import {check} from '@augment-vir/assert';
import {filterMap} from '@augment-vir/common';
import {OperationType} from '@prisma-to-graphql/core';
import {
    GraphqlBlockType,
    type GraphqlBlockByType,
    type TopLevelNamedGraphqlBlock,
} from '../graphql/graphql-block.js';
import {createScalarWhereInputName} from '../graphql/graphql-scalars/scalar-where-input-blocks.js';
import type {PrismaField, PrismaModel} from '../prisma/dmmf-model.js';
import {
    createOutputTypeBlocks,
    createWhereInputBlock,
    createWhereManyInputBlock,
} from './find-many-builder.js';
import {ResolverBuilder} from './resolver-builder.js';
import {createResolverInputName, createWithoutRelationInputName} from './resolver-names.js';

function isFieldRequired(field: Readonly<PrismaField>): boolean {
    return (
        field.isRequired &&
        !field.isGenerated &&
        !field.hasDefaultValue &&
        !field.isUpdatedAt &&
        !(field.relationName && field.isList)
    );
}

function createNestedCreateInputBlocks(prismaModel: PrismaModel): TopLevelNamedGraphqlBlock[] {
    const relationFields = Object.values(prismaModel.fields).filter((field) => field.relationName);

    const createWithoutRelationBlocks = relationFields.flatMap(
        (omittedField): TopLevelNamedGraphqlBlock[] => {
            const createWithoutRelationBlock: GraphqlBlockByType['input'] = {
                type: GraphqlBlockType.Input,
                name: createWithoutRelationInputName({
                    modelNameGettingCreated: prismaModel.modelName,
                    modelNameGettingOmitted: omittedField.type,
                    operationName: 'create',
                }),
                props: filterMap(
                    Object.values(prismaModel.fields),
                    (field): GraphqlBlockByType['property'] => {
                        const required = isFieldRequired(field);

                        if (field.relationName) {
                            return {
                                type: GraphqlBlockType.Property,
                                name: field.name,
                                // here
                                value: field.isList
                                    ? createWithoutRelationInputName({
                                          modelNameGettingCreated: field.type,
                                          modelNameGettingOmitted: prismaModel.modelName,
                                          operationName: 'connectionMany',
                                      })
                                    : createWithoutRelationInputName({
                                          modelNameGettingCreated: field.type,
                                          modelNameGettingOmitted: prismaModel.modelName,
                                          operationName: 'connection',
                                      }),
                                required,
                            };
                        } else {
                            return {
                                type: GraphqlBlockType.Property,
                                name: field.name,
                                value: field.type,
                                required,
                            };
                        }
                    },
                    (mappedFieldName, field) => {
                        return field.name !== omittedField.name;
                    },
                ),
            };

            const createOrConnectManyWithoutRelationBlock: GraphqlBlockByType['input'] = {
                type: GraphqlBlockType.Input,
                name: createWithoutRelationInputName({
                    modelNameGettingCreated: prismaModel.modelName,
                    modelNameGettingOmitted: omittedField.type,
                    operationName: 'createOrConnect',
                }),
                props: [
                    {
                        type: GraphqlBlockType.Property,
                        name: 'connect',
                        value: `[${createResolverInputName({
                            modelName: prismaModel.modelName,
                            inputName: 'whereUnfilteredUnique',
                        })}]`,
                        required: true,
                    },
                    {
                        type: GraphqlBlockType.Property,
                        name: 'create',
                        value: `[${createWithoutRelationBlock.name}]`,
                        required: true,
                    },
                ],
            };
            const createOrConnectWithoutRelationBlock: GraphqlBlockByType['input'] = {
                type: GraphqlBlockType.Input,
                name: createWithoutRelationInputName({
                    modelNameGettingCreated: prismaModel.modelName,
                    modelNameGettingOmitted: omittedField.type,
                    operationName: 'createOrConnect',
                }),
                props: [
                    {
                        type: GraphqlBlockType.Property,
                        name: 'connect',
                        value: createResolverInputName({
                            modelName: prismaModel.modelName,
                            inputName: 'whereUnfilteredUnique',
                        }),
                        required: true,
                    },
                    {
                        type: GraphqlBlockType.Property,
                        name: 'create',
                        value: createWithoutRelationBlock.name,
                        required: true,
                    },
                ],
            };

            const connectManyWithoutRelationBlock: GraphqlBlockByType['input'] = {
                type: GraphqlBlockType.Input,
                name: createWithoutRelationInputName({
                    modelNameGettingCreated: prismaModel.modelName,
                    modelNameGettingOmitted: omittedField.type,
                    operationName: 'connectionMany',
                }),
                props: [
                    {
                        type: GraphqlBlockType.Property,
                        name: 'create',
                        value: `[${createWithoutRelationBlock.name}]`,
                        required: false,
                    },
                    {
                        type: GraphqlBlockType.Property,
                        name: 'connectOrCreate',
                        value: createOrConnectManyWithoutRelationBlock.name,
                        required: false,
                    },
                    {
                        type: GraphqlBlockType.Property,
                        name: 'connect',
                        value: `[${createResolverInputName({
                            modelName: prismaModel.modelName,
                            inputName: 'whereUnfilteredUnique',
                        })}]`,
                        required: false,
                    },
                ],
            };

            const connectionWithoutRelationBlock: GraphqlBlockByType['input'] = {
                type: GraphqlBlockType.Input,
                name: createWithoutRelationInputName({
                    modelNameGettingCreated: prismaModel.modelName,
                    modelNameGettingOmitted: omittedField.type,
                    operationName: 'connection',
                }),
                props: [
                    {
                        type: GraphqlBlockType.Property,
                        name: 'create',
                        value: createWithoutRelationBlock.name,
                        required: false,
                    },
                    {
                        type: GraphqlBlockType.Property,
                        name: 'connectOrCreate',
                        value: createOrConnectWithoutRelationBlock.name,
                        required: false,
                    },
                    {
                        type: GraphqlBlockType.Property,
                        name: 'connect',
                        value: createResolverInputName({
                            modelName: prismaModel.modelName,
                            inputName: 'whereUnfilteredUnique',
                        }),
                        required: false,
                    },
                ],
            };

            return [
                createOrConnectWithoutRelationBlock,
                createOrConnectManyWithoutRelationBlock,
                createWithoutRelationBlock,
                connectManyWithoutRelationBlock,
                connectionWithoutRelationBlock,
            ];
        },
    );

    return createWithoutRelationBlocks;
}

/**
 * Creates a where block used for Prisma queries that require all unique inputs.
 *
 * @category Resolver Builders
 */
export function createWhereRequiredProvidedUniqueBlock(
    prismaModel: PrismaModel,
): GraphqlBlockByType['input'] {
    return {
        type: GraphqlBlockType.Input,
        name: createResolverInputName({
            modelName: prismaModel.modelName,
            inputName: 'whereRequiredProvidedUnique',
        }),
        props: [
            ...filterMap(
                Object.values(prismaModel.fields),
                (field): GraphqlBlockByType['property'] | undefined => {
                    if (field.relationName) {
                        return {
                            type: GraphqlBlockType.Property,
                            name: field.name,
                            value: createResolverInputName({
                                modelName: field.type,
                                inputName: 'where',
                            }),
                            required: false,
                        };
                    } else {
                        const isUnique = field.isUnique || field.isId;
                        const required = isUnique && !field.isGenerated;

                        return {
                            type: GraphqlBlockType.Property,
                            name: field.name,
                            value: isUnique ? field.type : createScalarWhereInputName(field),
                            required,
                        };
                    }
                },
                check.isTruthy,
            ),
        ],
    };
}

function createCreateInputBlocks(prismaModel: PrismaModel) {
    const createInputBlock: GraphqlBlockByType['input'] = {
        type: GraphqlBlockType.Input,
        name: createResolverInputName({
            modelName: prismaModel.modelName,
            inputName: 'createData',
        }),
        props: filterMap(
            Object.values(prismaModel.fields),
            (field): GraphqlBlockByType['property'] | undefined => {
                const required = isFieldRequired(field);

                if (field.relationName) {
                    return {
                        type: GraphqlBlockType.Property,
                        name: field.name,
                        value: field.isList
                            ? createWithoutRelationInputName({
                                  modelNameGettingCreated: field.type,
                                  modelNameGettingOmitted: prismaModel.modelName,
                                  operationName: 'connectionMany',
                              })
                            : createWithoutRelationInputName({
                                  modelNameGettingCreated: field.type,
                                  modelNameGettingOmitted: prismaModel.modelName,
                                  operationName: 'connection',
                              }),

                        required,
                    };
                } else {
                    return {
                        type: GraphqlBlockType.Property,
                        name: field.name,
                        value: field.type,
                        required,
                    };
                }
            },
            check.isTruthy,
        ),
    };

    const whereInputBlock = createWhereInputBlock(prismaModel);

    return {
        createData: createInputBlock,
        where: whereInputBlock,
    };
}

function createDeleteInputBlocks(prismaModel: PrismaModel) {
    const whereInputBlock = createWhereInputBlock(prismaModel);

    return {
        where: whereInputBlock,
    };
}

function createUpdateInputBlocks(prismaModel: PrismaModel) {
    const updateDataInputBlock: GraphqlBlockByType['input'] = {
        type: GraphqlBlockType.Input,
        name: createResolverInputName({
            modelName: prismaModel.modelName,
            inputName: 'updateData',
        }),
        props: filterMap(
            Object.values(prismaModel.fields),
            (field): GraphqlBlockByType['property'] | undefined => {
                if (field.relationName) {
                    return {
                        type: GraphqlBlockType.Property,
                        name: field.name,
                        value: createWithoutRelationInputName({
                            modelNameGettingCreated: field.type,
                            modelNameGettingOmitted: prismaModel.modelName,
                            operationName: 'connection',
                        }),

                        required: false,
                    };
                } else {
                    return {
                        type: GraphqlBlockType.Property,
                        name: field.name,
                        value: field.type,
                        required: false,
                    };
                }
            },
            check.isTruthy,
        ),
    };

    return {
        updateData: updateDataInputBlock,
    };
}

function createArgInputBlocks(prismaModel: Readonly<PrismaModel>) {
    const createInputBlocks = createCreateInputBlocks(prismaModel);

    const createArgInputBlock: GraphqlBlockByType['input'] = {
        type: GraphqlBlockType.Input,
        name: createResolverInputName({
            inputName: 'create',
            modelName: prismaModel.modelName,
        }),
        props: [
            {
                type: GraphqlBlockType.Property,
                name: 'data',
                value: `[${createInputBlocks.createData.name}!]`,
                required: true,
            },
        ],
    };

    const updateInputBlocks = createUpdateInputBlocks(prismaModel);

    const updateArgInputBlock: GraphqlBlockByType['input'] = {
        type: GraphqlBlockType.Input,
        name: createResolverInputName({
            inputName: 'update',
            modelName: prismaModel.modelName,
        }),
        props: [
            {
                type: GraphqlBlockType.Property,
                name: 'data',
                value: updateInputBlocks.updateData.name,
                required: true,
            },
            {
                type: GraphqlBlockType.Property,
                name: 'where',
                value: createResolverInputName({
                    modelName: prismaModel.modelName,
                    inputName: 'whereUnfilteredUnique',
                }),
                required: true,
            },
        ],
    };

    const deleteInputBlocks = createDeleteInputBlocks(prismaModel);

    const deleteArgInputBlock: GraphqlBlockByType['input'] = {
        type: GraphqlBlockType.Input,
        name: createResolverInputName({
            inputName: 'delete',
            modelName: prismaModel.modelName,
        }),
        props: [
            {
                type: GraphqlBlockType.Property,
                name: 'where',
                value: deleteInputBlocks.where.name,
                required: true,
            },
        ],
    };

    const whereRequiredProvidedUniqueBlock: GraphqlBlockByType['input'] =
        createWhereRequiredProvidedUniqueBlock(prismaModel);

    const upsertArgInputBlock: GraphqlBlockByType['input'] = {
        type: GraphqlBlockType.Input,
        name: createResolverInputName({
            inputName: 'upsert',
            modelName: prismaModel.modelName,
        }),
        props: [
            {
                type: GraphqlBlockType.Property,
                name: 'data',
                value: updateInputBlocks.updateData.name,
                required: true,
            },
            {
                type: GraphqlBlockType.Property,
                name: 'where',
                value: whereRequiredProvidedUniqueBlock.name,
                required: true,
            },
        ],
    };

    return {
        create: createArgInputBlock,
        update: updateArgInputBlock,
        upsert: upsertArgInputBlock,
        delete: deleteArgInputBlock,
        whereRequiredProvided: whereRequiredProvidedUniqueBlock,
        inputBlocks: [
            ...Object.values(createInputBlocks),
            ...Object.values(updateInputBlocks),
            ...Object.values(deleteInputBlocks),
        ],
    };
}

/**
 * Generates a mutation GraphQL resolver that wraps Prisma's `createMany`, `update`, and `upsert`
 * methods. The generated resolver is named the plural version of the table name.
 *
 * @category Resolver Builders
 */
export const mutationsBuilder: ResolverBuilder = {
    type: OperationType.Mutation,
    build(prismaModel) {
        const argBlocks = createArgInputBlocks(prismaModel);
        const outputBlocks = createOutputTypeBlocks(prismaModel);

        const operationBlock: GraphqlBlockByType['operation'] = {
            type: GraphqlBlockType.Operation,
            name: prismaModel.pluralModelName,
            args: [
                {
                    type: GraphqlBlockType.Property,
                    name: 'create',
                    value: argBlocks.create.name,
                    required: false,
                },
                {
                    type: GraphqlBlockType.Property,
                    name: 'update',
                    value: argBlocks.update.name,
                    required: false,
                },
                {
                    type: GraphqlBlockType.Property,
                    name: 'upsert',
                    value: argBlocks.upsert.name,
                    required: false,
                },
                {
                    type: GraphqlBlockType.Property,
                    name: 'delete',
                    value: argBlocks.delete.name,
                    required: false,
                },
            ],
            output: {
                value: outputBlocks.output.name,
                required: true,
            },
        };

        return {
            resolverGraphqlBlocks: [
                {
                    type: OperationType.Mutation,
                    blocks: [operationBlock],
                },
            ],
            topLevelNamedGraphqlBlocks: [
                ...Object.values(argBlocks).flat(),
                ...createNestedCreateInputBlocks(prismaModel),
                createWhereManyInputBlock(prismaModel),
                ...Object.values(outputBlocks),
            ],
        };
    },
};
