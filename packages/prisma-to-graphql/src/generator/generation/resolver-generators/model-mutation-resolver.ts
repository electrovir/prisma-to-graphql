import {filterMap, isTruthy} from '@augment-vir/common';
import {
    GraphqlBlockByType,
    TopLevelNamedGraphqlBlock,
} from '../../../builders/graphql-builder/graphql-block';
import {prismaFilters} from '../filter-inputs/prisma-filters';
import {GeneratedGraphql} from '../generated-graphql';
import {GenerationOptions} from '../generation-options';
import {PrismaField, PrismaModel} from '../model/prisma-model';
import {ResolverGenerator} from '../resolver-generator';
import {
    createOutputTypeBlocks,
    createWhereInputBlock,
    createWhereManyInputBlock,
} from './model-find-many-resolver';
import {createResolverInputName, createWithoutRelationInputName} from './model-resolver-names';

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
    const relationFields = Object.values(prismaModel.fields).filter(
        (field) => field.relationName && !field.hideIn?.inputs,
    );

    const createWithoutRelationBlocks = relationFields.flatMap(
        (omittedField): TopLevelNamedGraphqlBlock[] => {
            const createWithoutRelationBlock: GraphqlBlockByType<'input'> = {
                type: 'input',
                name: createWithoutRelationInputName({
                    modelNameGettingCreated: prismaModel.modelName,
                    modelNameGettingOmitted: omittedField.type,
                    operationName: 'create',
                }),
                props: filterMap(
                    Object.values(prismaModel.fields),
                    (field): GraphqlBlockByType<'property'> => {
                        const required = isFieldRequired(field);

                        if (field.relationName) {
                            return {
                                type: 'property',
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
                                type: 'property',
                                name: field.name,
                                value: field.type,
                                required,
                            };
                        }
                    },
                    (mappedFieldName, field) => {
                        return field.name !== omittedField.name && !field.hideIn?.inputs;
                    },
                ),
            };

            const createOrConnectManyWithoutRelationBlock: GraphqlBlockByType<'input'> = {
                type: 'input',
                name: createWithoutRelationInputName({
                    modelNameGettingCreated: prismaModel.modelName,
                    modelNameGettingOmitted: omittedField.type,
                    operationName: 'createOrConnect',
                }),
                props: [
                    {
                        type: 'property',
                        name: 'connect',
                        value: `[${createResolverInputName({
                            modelName: prismaModel.modelName,
                            inputName: 'whereUnfilteredUnique',
                        })}]`,
                        required: true,
                    },
                    {
                        type: 'property',
                        name: 'create',
                        value: `[${createWithoutRelationBlock.name}]`,
                        required: true,
                    },
                ],
            };
            const createOrConnectWithoutRelationBlock: GraphqlBlockByType<'input'> = {
                type: 'input',
                name: createWithoutRelationInputName({
                    modelNameGettingCreated: prismaModel.modelName,
                    modelNameGettingOmitted: omittedField.type,
                    operationName: 'createOrConnect',
                }),
                props: [
                    {
                        type: 'property',
                        name: 'connect',
                        value: createResolverInputName({
                            modelName: prismaModel.modelName,
                            inputName: 'whereUnfilteredUnique',
                        }),
                        required: true,
                    },
                    {
                        type: 'property',
                        name: 'create',
                        value: createWithoutRelationBlock.name,
                        required: true,
                    },
                ],
            };

            const connectManyWithoutRelationBlock: GraphqlBlockByType<'input'> = {
                type: 'input',
                name: createWithoutRelationInputName({
                    modelNameGettingCreated: prismaModel.modelName,
                    modelNameGettingOmitted: omittedField.type,
                    operationName: 'connectionMany',
                }),
                props: [
                    {
                        type: 'property',
                        name: 'create',
                        value: `[${createWithoutRelationBlock.name}]`,
                        required: false,
                    },
                    {
                        type: 'property',
                        name: 'connectOrCreate',
                        value: createOrConnectManyWithoutRelationBlock.name,
                        required: false,
                    },
                    {
                        type: 'property',
                        name: 'connect',
                        value: `[${createResolverInputName({
                            modelName: prismaModel.modelName,
                            inputName: 'whereUnfilteredUnique',
                        })}]`,
                        required: false,
                    },
                ],
            };

            const connectionWithoutRelationBlock: GraphqlBlockByType<'input'> = {
                type: 'input',
                name: createWithoutRelationInputName({
                    modelNameGettingCreated: prismaModel.modelName,
                    modelNameGettingOmitted: omittedField.type,
                    operationName: 'connection',
                }),
                props: [
                    {
                        type: 'property',
                        name: 'create',
                        value: createWithoutRelationBlock.name,
                        required: false,
                    },
                    {
                        type: 'property',
                        name: 'connectOrCreate',
                        value: createOrConnectWithoutRelationBlock.name,
                        required: false,
                    },
                    {
                        type: 'property',
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

function createWhereRequiredProvidedUniqueBlock(
    prismaModel: PrismaModel,
): GraphqlBlockByType<'input'> {
    return {
        type: 'input',
        name: createResolverInputName({
            modelName: prismaModel.modelName,
            inputName: 'whereRequiredProvidedUnique',
        }),
        props: [
            ...filterMap(
                Object.values(prismaModel.fields),
                (field): GraphqlBlockByType<'property'> | undefined => {
                    if (field.hideIn?.inputs) {
                        return undefined;
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
                        const required = isUnique && !field.isGenerated;

                        const propType = isUnique ? field.type : prismaFilters[field.type]?.name;
                        if (!propType) {
                            throw new Error(`No filter exists yet for type '${field.type}'`);
                        }

                        return {
                            type: 'property',
                            name: field.name,
                            value: propType,
                            required,
                        };
                    }
                },
                isTruthy,
            ),
        ],
    };
}

function createCreateInputBlocks(prismaModel: PrismaModel) {
    const createInputBlock: GraphqlBlockByType<'input'> = {
        type: 'input',
        name: createResolverInputName({
            modelName: prismaModel.modelName,
            inputName: 'createData',
        }),
        props: filterMap(
            Object.values(prismaModel.fields),
            (field): GraphqlBlockByType<'property'> | undefined => {
                if (field.hideIn?.inputs) {
                    return undefined;
                }
                const required = isFieldRequired(field);

                if (field.relationName) {
                    return {
                        type: 'property',
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
                        type: 'property',
                        name: field.name,
                        value: field.type,
                        required,
                    };
                }
            },
            isTruthy,
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
    const updateDataInputBlock: GraphqlBlockByType<'input'> = {
        type: 'input',
        name: createResolverInputName({
            modelName: prismaModel.modelName,
            inputName: 'updateData',
        }),
        props: filterMap(
            Object.values(prismaModel.fields),
            (field): GraphqlBlockByType<'property'> | undefined => {
                if (field.hideIn?.inputs) {
                    return undefined;
                } else if (field.relationName) {
                    return {
                        type: 'property',
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
                        type: 'property',
                        name: field.name,
                        value: field.type,
                        required: false,
                    };
                }
            },
            isTruthy,
        ),
    };

    return {
        updateData: updateDataInputBlock,
    };
}

function createArgInputBlocks(prismaModel: Readonly<PrismaModel>) {
    const createInputBlocks = createCreateInputBlocks(prismaModel);

    const createArgInputBlock: GraphqlBlockByType<'input'> = {
        type: 'input',
        name: createResolverInputName({
            inputName: 'create',
            modelName: prismaModel.modelName,
        }),
        props: [
            {
                type: 'property',
                name: 'data',
                value: `[${createInputBlocks.createData.name}!]`,
                required: true,
            },
        ],
    };

    const updateInputBlocks = createUpdateInputBlocks(prismaModel);

    const updateArgInputBlock: GraphqlBlockByType<'input'> = {
        type: 'input',
        name: createResolverInputName({
            inputName: 'update',
            modelName: prismaModel.modelName,
        }),
        props: [
            {
                type: 'property',
                name: 'data',
                value: updateInputBlocks.updateData.name,
                required: true,
            },
            {
                type: 'property',
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

    const deleteArgInputBlock: GraphqlBlockByType<'input'> = {
        type: 'input',
        name: createResolverInputName({
            inputName: 'delete',
            modelName: prismaModel.modelName,
        }),
        props: [
            {
                type: 'property',
                name: 'where',
                value: deleteInputBlocks.where.name,
                required: true,
            },
        ],
    };

    const whereRequiredProvidedUniqueBlock: GraphqlBlockByType<'input'> =
        createWhereRequiredProvidedUniqueBlock(prismaModel);

    const upsertArgInputBlock: GraphqlBlockByType<'input'> = {
        type: 'input',
        name: createResolverInputName({
            inputName: 'upsert',
            modelName: prismaModel.modelName,
        }),
        props: [
            {
                type: 'property',
                name: 'data',
                value: updateInputBlocks.updateData.name,
                required: true,
            },
            {
                type: 'property',
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
 * @category Prisma Generator
 */
export const modelMutationOperation: ResolverGenerator = {
    type: 'Mutation',
    generate(
        prismaModel: Readonly<PrismaModel>,
        options: Readonly<GenerationOptions>,
    ): GeneratedGraphql {
        const argBlocks = createArgInputBlocks(prismaModel);
        const outputBlocks = createOutputTypeBlocks(prismaModel);

        const operationBlock: GraphqlBlockByType<'operation'> = {
            type: 'operation',
            name: prismaModel.pluralModelName,
            args: [
                {
                    type: 'property',
                    name: 'create',
                    value: argBlocks.create.name,
                    required: false,
                },
                {
                    type: 'property',
                    name: 'update',
                    value: argBlocks.update.name,
                    required: false,
                },
                {
                    type: 'property',
                    name: 'upsert',
                    value: argBlocks.upsert.name,
                    required: false,
                },
                {
                    type: 'property',
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
            resolverBlocks: [
                {
                    type: 'Mutation',
                    blocks: [operationBlock],
                },
            ],
            topLevelNamedGraphqlBlocks: [
                ...Object.values(argBlocks).flat(),
                ...createNestedCreateInputBlocks(prismaModel),
                createWhereManyInputBlock(prismaModel),
                ...Object.values(outputBlocks),
            ],
            resolvers: [
                {
                    type: 'prisma',
                    operationType: 'Mutation',
                    prismaModelName: prismaModel.modelName,
                    resolverName: operationBlock.name,
                },
            ],
        };
    },
};
