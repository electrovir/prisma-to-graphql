import {defineShape} from 'object-shape-tester';

/**
 * Options shape for GraphQL block building.
 *
 * @category Builders
 */
export const graphqlBuilderOptionsShape = defineShape({
    /** A string used for indentation of the GraphQL schema. */
    indent: '    ',
    /** A string used for separation of each block in the schema. */
    blockSeparation: '\n\n',
});

/**
 * Options type for GraphQL block building.
 *
 * @category Builders
 */
export type GraphqlBuilderOptions = typeof graphqlBuilderOptionsShape.runTimeType;
/**
 * The default GraphQL block building options.
 *
 * @category Builders
 */
export const defaultGraphqlBuilderOptions = graphqlBuilderOptionsShape.defaultValue;
