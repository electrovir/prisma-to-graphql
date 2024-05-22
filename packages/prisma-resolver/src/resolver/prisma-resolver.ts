import {TypedFunction} from '@augment-vir/common';
import {assertDefined} from 'run-time-assertions';
import {OperationScope, ResolverContext} from '../operation-scope/resolver-context';
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
    context: ResolverContext;
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

/**
 * Extracts the resolver context from the given GraphQL context object.
 *
 * @category Internals
 */
export function extractResolverContext(context: any): ResolverContext {
    const prismaClient = context.prismaClient;
    assertDefined(prismaClient, "'prismaClient' is missing from context");

    return {
        prismaClient,
        models: context.models,
        operationScope: context.operationScope as OperationScope,
    };
}
