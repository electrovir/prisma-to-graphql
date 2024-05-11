import {TypedFunction} from '@augment-vir/common';
import {Selection} from '../util/parse-selection';

/**
 * All of the `prisma-resolver` package's resolvers return this output;
 *
 * @category Types
 */
export type PrismaResolverOutput = {total: number; items: unknown[]};

/**
 * The required internal inputs required for each resolver in the `prisma-resolver` package.
 *
 * @category Types
 */
export type PrismaResolverInputs = {
    prismaClient: any;
    prismaModelName: string;
    graphqlArgs: any;
    selection: Selection;
};
/**
 * The internal type for all resolvers within the `prisma-resolver` package.
 *
 * @category Types
 */
export type PrismaResolver = TypedFunction<
    Readonly<PrismaResolverInputs>,
    Promise<PrismaResolverOutput>
>;
