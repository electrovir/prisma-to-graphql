import {filterMap} from '@augment-vir/common';
import {
    GraphqlBlockByType,
    TopLevelNamedGraphqlBlock,
} from '../../../builders/graphql-builder/graphql-block';
import {prismaFilters} from '../filter-inputs/prisma-filters';
import {GeneratedGraphql} from '../generated-graphql';
import {GenerationOptions} from '../generation-options';
import {PrismaModel} from '../prisma-model';
import {ResolverGenerator} from '../resolver-generator';
import {createOutputTypeBlock, createWhereInputBlock} from './model-find-many-resolver';
import {createResolverInputName, createWithoutRelationInputName} from './model-resolver-io';

function createNestedCreateInputBlocks(prismaModel: PrismaModel): TopLevelNamedGraphqlBlock[] {
    const relationFields = prismaModel.dmmfModel.fields.filter((field) => field.relationName);

    const createWithoutRelationBlocks = relationFields.flatMap(
        (omittedField): TopLevelNamedGraphqlBlock[] => {
            const createWithoutRelationBlock: GraphqlBlockByType<'input'> = {
                type: 'input',
                name: createWithoutRelationInputName({
                    modelNameGettingCreated: prismaModel.dmmfModel.name,
                    modelNameGettingOmitted: omittedField.type,
                    operationName: 'create',
                }),
                props: filterMap(
                    Object.values(prismaModel.fields),
                    (field): GraphqlBlockByType<'property'> => {
                        const required =
                            field.isRequired &&
                            !field.isGenerated &&
                            !field.hasDefaultValue &&
                            !field.isUpdatedAt;

                        if (field.relationName) {
                            return {
                                type: 'property',
                                name: field.name,
                                value: createWithoutRelationInputName({
                                    modelNameGettingCreated: field.type,
                                    modelNameGettingOmitted: prismaModel.dmmfModel.name,
                                    operationName: 'create',
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
                        return field.name !== omittedField.name;
                    },
                ),
            };

            const createOrConnectWithoutRelationBlock: GraphqlBlockByType<'input'> = {
                type: 'input',
                name: createWithoutRelationInputName({
                    modelNameGettingCreated: prismaModel.dmmfModel.name,
                    modelNameGettingOmitted: omittedField.type,
                    operationName: 'createOrConnect',
                }),
                props: [
                    {
                        type: 'property',
                        name: 'connect',
                        value: createResolverInputName({
                            modelName: prismaModel.dmmfModel.name,
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

            const connectionWithoutRelationBlock: GraphqlBlockByType<'input'> = {
                type: 'input',
                name: createWithoutRelationInputName({
                    modelNameGettingCreated: prismaModel.dmmfModel.name,
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
                            modelName: prismaModel.dmmfModel.name,
                            inputName: 'whereUnfilteredUnique',
                        }),
                        required: false,
                    },
                ],
            };

            return [
                createOrConnectWithoutRelationBlock,
                createWithoutRelationBlock,
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
            modelName: prismaModel.dmmfModel.name,
            inputName: 'whereRequiredProvidedUnique',
        }),
        props: [
            ...Object.values(prismaModel.fields).map((field): GraphqlBlockByType<'property'> => {
                if (field.relationName) {
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
                    const isRequired = isUnique && !field.isGenerated;

                    const propType = isUnique ? field.type : prismaFilters[field.type]?.name;
                    if (!propType) {
                        throw new Error(`No filter exists yet for type '${field.type}'`);
                    }

                    return {
                        type: 'property',
                        name: field.name,
                        value: propType,
                        required: isRequired,
                    };
                }
            }),
        ],
    };
}

function createCreateInputBlocks(prismaModel: PrismaModel) {
    const createInputBlock: GraphqlBlockByType<'input'> = {
        type: 'input',
        name: createResolverInputName({
            modelName: prismaModel.dmmfModel.name,
            inputName: 'createData',
        }),
        props: Object.values(prismaModel.fields).map((field): GraphqlBlockByType<'property'> => {
            const required =
                field.isRequired &&
                !field.isGenerated &&
                !field.hasDefaultValue &&
                !field.isUpdatedAt;

            if (field.relationName) {
                return {
                    type: 'property',
                    name: field.name,
                    value: createWithoutRelationInputName({
                        modelNameGettingCreated: field.type,
                        modelNameGettingOmitted: prismaModel.dmmfModel.name,
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
        }),
    };

    const whereInputBlock = createWhereInputBlock(prismaModel);

    return {
        createData: createInputBlock,
        where: whereInputBlock,
    };
}

function createUpdateInputBlocks(prismaModel: PrismaModel) {
    const updateDataInputBlock: GraphqlBlockByType<'input'> = {
        type: 'input',
        name: createResolverInputName({
            modelName: prismaModel.dmmfModel.name,
            inputName: 'updateData',
        }),
        props: Object.values(prismaModel.fields).map((field): GraphqlBlockByType<'property'> => {
            if (field.relationName) {
                return {
                    type: 'property',
                    name: field.name,
                    value: createWithoutRelationInputName({
                        modelNameGettingCreated: field.type,
                        modelNameGettingOmitted: prismaModel.dmmfModel.name,
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
        }),
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
            modelName: prismaModel.dmmfModel.name,
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
            modelName: prismaModel.dmmfModel.name,
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
                    modelName: prismaModel.dmmfModel.name,
                    inputName: 'whereUnfilteredUnique',
                }),
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
            modelName: prismaModel.dmmfModel.name,
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
        whereRequiredProvided: whereRequiredProvidedUniqueBlock,
        inputBlocks: [
            ...Object.values(createInputBlocks),
            ...Object.values(updateInputBlocks),
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
        const outputTypeBlock = createOutputTypeBlock(prismaModel);

        const operationBlock: GraphqlBlockByType<'operation'> = {
            type: 'operation',
            name: prismaModel.pluralName,
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
            ],
            output: {
                value: outputTypeBlock.name,
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
            ],
            resolvers: [
                {
                    type: 'prisma',
                    operationType: 'Mutation',
                    prismaModelName: prismaModel.dmmfModel.name,
                    resolverName: operationBlock.name,
                },
            ],
        };
    },
};
