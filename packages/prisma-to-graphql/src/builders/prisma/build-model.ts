import {check} from '@augment-vir/assert';
import {filterMap, log, mergePropertyArrays} from '@augment-vir/common';
import {OperationType} from '@prisma-to-graphql/core';
import type {PrismaToGraphqlGeneratorOptions} from '../../generator-options/generator-options.js';
import {
    GraphqlBlockType,
    type GraphqlBlockByType,
    type TopLevelNamedGraphqlBlock,
} from '../graphql/graphql-block.js';
import {
    generateExtraScalarBlocks,
    UsedExtraGraphqlScalars,
} from '../graphql/graphql-scalars/graphql-scalars.js';
import {
    getFieldGraphqlScalar,
    GraphqlExtraScalar,
} from '../graphql/graphql-scalars/scalar-type-map.js';
import {findManyBuilder} from '../resolvers/find-many-builder.js';
import {mutationsBuilder} from '../resolvers/mutations-builder.js';
import {ResolverBuilder, type BuildOutput} from '../resolvers/resolver-builder.js';
import type {PrismaModel} from './dmmf-model.js';

/**
 * All current resolver builders.
 *
 * @category Internal
 */
export const allResolverBuilders: ReadonlyArray<Readonly<ResolverBuilder>> = [
    findManyBuilder,
    mutationsBuilder,
];

function buildModelResolvers(
    prismaModel: Readonly<PrismaModel>,
    options: Readonly<Pick<PrismaToGraphqlGeneratorOptions, `generate${OperationType}`>>,
    resolverBuilders: ReadonlyArray<Readonly<ResolverBuilder>>,
): BuildOutput | undefined {
    const filteredOperationGenerators = resolverBuilders.filter((resolverBuilder) => {
        return options[`generate${resolverBuilder.type}`];
    });

    if (!filteredOperationGenerators.length) {
        return undefined;
    }

    const generatedOperations: BuildOutput[] = filteredOperationGenerators.map(
        (resolverGenerator) => {
            return resolverGenerator.build(prismaModel);
        },
    );

    return mergePropertyArrays(...generatedOperations);
}

/**
 * Build all output for a single model.
 *
 * @category Prisma Generator
 */
export function buildModel(
    prismaModel: Readonly<PrismaModel>,
    options: Readonly<Pick<PrismaToGraphqlGeneratorOptions, `generate${OperationType}`>>,
    resolverBuilders = allResolverBuilders,
): BuildOutput {
    const resolverBlocks = buildModelResolvers(prismaModel, options, resolverBuilders);

    const topLevelNamedGraphqlBlocks: TopLevelNamedGraphqlBlock[] = [
        ...buildModelTypeBlocks(prismaModel),
        ...(resolverBlocks?.topLevelNamedGraphqlBlocks || []),
    ];

    return {
        topLevelNamedGraphqlBlocks,
        resolverGraphqlBlocks: resolverBlocks?.resolverGraphqlBlocks || [],
    };
}

function buildModelTypeBlocks(
    prismaModel: Readonly<Pick<PrismaModel, 'fields' | 'modelName'>>,
): GraphqlBlockByType['type' | 'scalar'][] {
    const usedExtraScalars: UsedExtraGraphqlScalars = {};

    const propertyBlocks = filterMap(
        Object.values(prismaModel.fields),
        (field): GraphqlBlockByType['property'] | undefined => {
            const propType = getFieldGraphqlScalar(field);
            if (!propType) {
                log.warning(
                    `Encountered unknown field type '${field.type}' on field '${prismaModel.modelName}.${field.name}'. This field will not be included in prisma-to-graphql.`,
                );
                return undefined;
            } else if (check.isEnumValue(propType, GraphqlExtraScalar)) {
                usedExtraScalars[propType] = true;
            }

            return {
                type: GraphqlBlockType.Property,
                name: field.name,
                value: field.isList ? `[${propType}]` : propType,
                required: field.isRequired,
            };
        },
        check.isTruthy,
    );

    const modelBlock: GraphqlBlockByType['type'] = {
        type: GraphqlBlockType.Type,
        name: prismaModel.modelName,
        props: propertyBlocks,
    };

    return [
        ...generateExtraScalarBlocks(usedExtraScalars),
        modelBlock,
    ];
}
