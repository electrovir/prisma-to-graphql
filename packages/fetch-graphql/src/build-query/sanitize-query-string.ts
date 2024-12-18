import {collapseWhiteSpace} from '@augment-vir/common';

/**
 * Cleans up a string needed within a GraphQL query. This is only relevant for the few cases where
 * user input is not already part of the GraphQL schema, like for alias names.
 *
 * @category Internal Query Builders
 */
export function sanitizeQueryString(input: string): string {
    return collapseWhiteSpace(input).replace(/[ -]/g, '_');
}
