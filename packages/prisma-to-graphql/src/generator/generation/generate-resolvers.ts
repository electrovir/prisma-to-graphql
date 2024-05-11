import {capitalizeFirstLetter, mergePropertyArrays} from '@augment-vir/common';
import {GeneratedGraphql} from './generated-graphql';
import {GenerationOptions} from './generation-options';
import {PrismaModel} from './prisma-model';
import {ResolverGenerator} from './resolver-generator';
import {modelFindManyOperation} from './resolver-generators/model-find-many-resolver';
import {modelMutationOperation} from './resolver-generators/model-mutation-resolver';

/**
 * All current resolver generators.
 *
 * @category Prisma Generator
 */
export const allResolverGenerators: ReadonlyArray<Readonly<ResolverGenerator>> = [
    modelFindManyOperation,
    modelMutationOperation,
];

/**
 * Generate all of a Prisma model's GraphQL resolvers.
 *
 * @category Prisma Generator
 */
export function generateModelGraphqlResolvers(
    prismaModel: Readonly<PrismaModel>,
    options: Readonly<GenerationOptions>,
): GeneratedGraphql | undefined {
    const filteredOperationGenerators = allResolverGenerators.filter((resolverGenerator) => {
        const optionsKey = capitalizeFirstLetter(resolverGenerator.type);
        return options[`generate${optionsKey}`];
    });

    if (!filteredOperationGenerators.length) {
        return undefined;
    }

    const generatedOperations: GeneratedGraphql[] = filteredOperationGenerators.map(
        (resolverGenerator) => {
            return resolverGenerator.generate(prismaModel, options);
        },
    );

    return mergePropertyArrays(...generatedOperations);
}
