import {and, defineShape} from 'object-shape-tester';
import {resolverBuilderOptionsShape} from '../../builders/resolver-builder/resolver-builder-options';

/**
 * `prisma-to-graphql` Prisma generator options shape. Used to verify option validity and set
 * default values.
 *
 * @category Prisma Generator
 */
export const generationOptionsShape = defineShape(
    and(resolverBuilderOptionsShape, {
        /** Remove fields from tables that are relation id fields. */
        removeRelationFromFields: true,
        /** Automatically generate query operations. */
        generateQuery: true,
        /** Automatically generate mutation operations. */
        generateMutation: true,
        /** Generate TypeScript types for the generated GraphQL schema. */
        generateSchemaTs: true,
        /** Generate TypeScript run-time variables for model and field names. */
        generateModelsTs: true,
    }),
);

/**
 * `prisma-to-graphql` Prisma generator options.
 *
 * @category Prisma Generator
 */
export type GenerationOptions = typeof generationOptionsShape.runTimeType;
