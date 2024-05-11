import {OperationType} from '../../builders/operation-type';
import {GeneratedGraphql} from './generated-graphql';
import {GenerationOptions} from './generation-options';
import {PrismaModel} from './prisma-model';

/**
 * A generator used inside of the `prisma-to-graphql` Prisma generator to create resolvers and all
 * their needed types for each model.
 *
 * @category Prisma Generator
 */
export type ResolverGenerator = {
    type: OperationType;
    generate: GenerateCallback;
};

/**
 * The function which resolver generators must export which is called by the Prisma generator to
 * actually generate the desired resolvers.
 *
 * @category Prisma Generator
 */
export type GenerateCallback = (
    prismaModel: Readonly<PrismaModel>,
    options: Readonly<GenerationOptions>,
) => GeneratedGraphql;
