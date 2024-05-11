import {isTruthy, typedArrayIncludes} from '@augment-vir/common';
import {GraphqlBlockByType} from '../../builders/graphql-builder/graphql-block';

/**
 * All scalars that `prisma-to-graphql` supports but GraphQL does not, by default, support.
 *
 * @category Prisma Generator
 */
export const supportedExtraGraphqlScalars = ['DateTime'] as const;

/**
 * Checks if the given GraphQL type is one of our supported extra (non-GraphQL-built-in) scalars.
 *
 * @category Prisma Generator
 */
export function matchExtraGraphqlScalars(graphqlType: string): string {
    if (typedArrayIncludes(supportedExtraGraphqlScalars, graphqlType)) {
        return graphqlType;
    } else {
        return '';
    }
}

/**
 * Generates GraphQL Scalar blocks by extracting, from the given array of GraphQL types, only the
 * GraphQL types that match our extra supported Scalars.
 *
 * @category Prisma Generator
 */
export function generateExtraScalarBlocks(
    graphqlTypes: ReadonlyArray<string>,
): GraphqlBlockByType<'scalar'>[] {
    const neededScalars = Array.from(new Set(graphqlTypes.filter(isTruthy)));

    return neededScalars.map((scalar) => {
        return {
            type: 'scalar',
            name: scalar,
        };
    });
}
