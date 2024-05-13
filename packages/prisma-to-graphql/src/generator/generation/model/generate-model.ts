import {filterMap, isTruthy} from '@augment-vir/common';
import {
    GraphqlBlockByType,
    TopLevelNamedGraphqlBlock,
} from '../../../builders/graphql-builder/graphql-block';
import {generateModelGraphqlResolvers} from '../generate-resolvers';
import {GeneratedGraphql} from '../generated-graphql';
import {GenerationOptions} from '../generation-options';
import {generateExtraScalarBlocks, matchExtraGraphqlScalars} from '../graphql-scalars';
import {PrismaModel} from './prisma-model';

/**
 * Generates all the GraphQL blocks needed for the given model.
 *
 * @category Prisma Generator
 */
export function generateGraphqlModel(
    prismaModel: Readonly<PrismaModel>,
    options: Readonly<GenerationOptions>,
): GeneratedGraphql {
    const resolverBlocks = generateModelGraphqlResolvers(prismaModel, options);

    const topLevelNamedGraphqlBlocks: TopLevelNamedGraphqlBlock[] = [
        ...generateModelTypeBlocks(prismaModel),
        ...(resolverBlocks?.topLevelNamedGraphqlBlocks || []),
    ];

    return {
        topLevelNamedGraphqlBlocks,
        resolverBlocks: resolverBlocks?.resolverBlocks || [],
        resolvers: resolverBlocks?.resolvers || [],
    };
}

function generateModelTypeBlocks(
    prismaModel: Readonly<Pick<PrismaModel, 'fields' | 'modelName'>>,
): GraphqlBlockByType<'type' | 'scalar'>[] {
    const neededScalars: string[] = [];

    const propertyBlocks = filterMap(
        Object.values(prismaModel.fields),
        (field): GraphqlBlockByType<'property'> | undefined => {
            if (field.hideIn?.outputs) {
                return undefined;
            }
            const propType = field.type;
            neededScalars.push(matchExtraGraphqlScalars(propType));
            return {
                type: 'property',
                name: field.name,
                value: field.isList ? `[${propType}]` : propType,
                required: field.isRequired,
            };
        },
        isTruthy,
    );

    const modelBlock: GraphqlBlockByType<'type'> = {
        type: 'type',
        name: prismaModel.modelName,
        props: propertyBlocks,
    };

    return [
        ...generateExtraScalarBlocks(neededScalars),
        modelBlock,
    ];
}
