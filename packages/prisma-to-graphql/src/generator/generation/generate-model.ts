import {DMMF} from '@prisma/generator-helper';
import pluralize from 'pluralize';
import {
    GraphqlBlockByType,
    TopLevelNamedGraphqlBlock,
} from '../../builders/graphql-builder/graphql-block';
import {generateModelGraphqlResolvers} from './generate-resolvers';
import {GeneratedGraphql} from './generated-graphql';
import {GenerationOptions} from './generation-options';
import {generateExtraScalarBlocks, matchExtraGraphqlScalars} from './graphql-scalars';
import {PrismaModel, combineFields} from './prisma-model';

/**
 * Generates all the GraphQL blocks needed for the given model.
 *
 * @category Prisma Generator
 */
export function generateGraphqlModel(
    dmmfModel: Readonly<DMMF.Model>,
    options: Readonly<GenerationOptions>,
): GeneratedGraphql {
    const prismaModel: Readonly<PrismaModel> = {
        dmmfModel: dmmfModel,
        fields: combineFields(dmmfModel, options),
        pluralName: pluralize(dmmfModel.name),
    };

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
    prismaModel: Readonly<Pick<PrismaModel, 'fields' | 'dmmfModel'>>,
): GraphqlBlockByType<'type' | 'scalar'>[] {
    const neededScalars: string[] = [];

    const propertyBlocks = Object.values(prismaModel.fields).map(
        (field): GraphqlBlockByType<'property'> => {
            const propType = field.type;
            neededScalars.push(matchExtraGraphqlScalars(propType));
            return {
                type: 'property',
                name: field.name,
                value: propType,
                required: field.isRequired,
            };
        },
    );

    const modelBlock: GraphqlBlockByType<'type'> = {
        type: 'type',
        name: prismaModel.dmmfModel.name,
        props: propertyBlocks,
    };

    return [
        ...generateExtraScalarBlocks(neededScalars),
        modelBlock,
    ];
}
