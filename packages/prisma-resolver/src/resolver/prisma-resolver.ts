import {TypedFunction} from '@augment-vir/common';
import {assertDefined} from 'run-time-assertions';
import {ModelMap, OperationScope, ResolverContext} from '../operation-scope/resolver-context';
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
export type PrismaResolverInputs<PrismaClient, Models extends ModelMap> = {
    context: ResolverContext<PrismaClient, Models>;
    prismaModelName: string;
    graphqlArgs: any;
    selection: Selection;
};
/**
 * The internal type for all resolvers within the `prisma-resolver` package.
 *
 * @category Types
 */
export type PrismaResolver<PrismaClient, Models extends ModelMap> = TypedFunction<
    Readonly<PrismaResolverInputs<PrismaClient, Models>>,
    Promise<PrismaResolverOutput>
>;

/**
 * Extracts the resolver context from the given GraphQL context object.
 *
 * @category Internals
 */
export function extractResolverContext<PrismaClient, Models extends ModelMap>(
    context: any,
): ResolverContext<PrismaClient, Models> {
    const prismaClient = context.prismaClient;
    assertDefined(prismaClient, "'prismaClient' is missing from context");

    return {
        prismaClient,
        models: context.models,
        operationScope: context.operationScope as OperationScope<Models>,
    };
}
