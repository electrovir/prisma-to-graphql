import {and, defineShape} from 'object-shape-tester';
import {graphqlBuilderOptionsShape} from '../graphql-builder/graphql-builder-options';

/**
 * Options shape for Resolver block building.
 *
 * @category Builders
 */
export const resolverBuilderOptionsShape = defineShape(
    and(graphqlBuilderOptionsShape, {
        /** A string used for in the generates JS/TS. */
        quote: "'",
    }),
);

/**
 * Options type for Resolver block building.
 *
 * @category Builders
 */
export type ResolverBuilderOptions = typeof resolverBuilderOptionsShape.runTimeType;
/**
 * The default Resolver block building options.
 *
 * @category Builders
 */
export const defaultResolverBuilderOptions = resolverBuilderOptionsShape.defaultValue;
