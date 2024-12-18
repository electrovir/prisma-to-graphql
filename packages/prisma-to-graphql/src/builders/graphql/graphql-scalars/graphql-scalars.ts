import {getObjectTypedKeys} from '@augment-vir/common';
import {GraphqlBlockType, type GraphqlBlockByType} from '../graphql-block.js';
import {GraphqlExtraScalar} from './scalar-type-map.js';

/**
 * A map of the current listed GraphQL scalars that are not built in (and thus require their own
 * `scalar` GraphQL line).
 *
 * @category Internal
 */
export type UsedExtraGraphqlScalars = Partial<Record<GraphqlExtraScalar, true>>;

/**
 * Generates GraphQL Scalar blocks by extracting, from the given array of GraphQL types, only the
 * GraphQL types that match our extra supported Scalars.
 *
 * @category Internal
 */
export function generateExtraScalarBlocks(
    usedScalars: Readonly<UsedExtraGraphqlScalars>,
): GraphqlBlockByType['scalar'][] {
    return getObjectTypedKeys(usedScalars).map((scalar): GraphqlBlockByType['scalar'] => {
        return {
            type: GraphqlBlockType.Scalar,
            name: scalar,
        };
    });
}
