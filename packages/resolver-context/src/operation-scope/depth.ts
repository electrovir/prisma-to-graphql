import {AnyObject, PartialAndUndefined, isObject} from '@augment-vir/common';
import {GraphQLError} from 'graphql';
import {isRunTimeType} from 'run-time-assertions';
import {outputMessages} from '../output-messages';

/**
 * Used for defining a max depth for either all operations or specific operation types. To be used
 * in `OperationScope`.
 *
 * @category Operation Scope
 */
export type MaxDepthScope = PartialAndUndefined<{
    maxDepth:
        | number
        | Partial<{
              write: number;
              read: number;
          }>;
}>;

/**
 * The supported operations for {@link MaxDepthScope}.
 *
 * @category Internals
 */
export type MaxDepthOperation = keyof Readonly<
    Required<Extract<MaxDepthScope['maxDepth'], AnyObject>>
>;

/**
 * Calculates any given object's depth by simply recursively counting property depth.
 *
 * @category Internals
 */
export function calculateMaxObjectDepth(data: AnyObject): number {
    const depths = Object.values(data).map((value): number => {
        if (Array.isArray(value)) {
            return 1 + Math.max(...value.map((innerValue) => calculateMaxObjectDepth(innerValue)));
        } else if (isObject(value)) {
            return calculateMaxObjectDepth(value);
        } else {
            return 0;
        }
    });

    return 1 + Math.max(...depths);
}

/**
 * Asserts that the given {@link data} input is within the defined max depth bounds.
 *
 * @category Internals
 */
export function assertValidMaxDepth({
    data,
    scope,
    operation,
    capitalizedDataName: capitalizedName,
}: {
    data: AnyObject;
    scope: Readonly<MaxDepthScope> | undefined;
    operation: MaxDepthOperation;
    /** This is capitalized because it's at the beginning of a sentence. */
    capitalizedDataName: string;
}) {
    const maxDepth = extractMaxDepth(scope, operation);
    if (maxDepth === undefined) {
        return;
    }

    const depth = calculateMaxObjectDepth(data);

    if (depth > maxDepth) {
        throw new GraphQLError(
            outputMessages.byDescription['max depth violated'].message({
                depth,
                maxDepth,
                capitalizedName,
            }),
        );
    }
}

function extractMaxDepth(
    scope: Readonly<MaxDepthScope> | undefined,
    operation: MaxDepthOperation,
): number | undefined {
    if (isRunTimeType(scope?.maxDepth, 'number')) {
        return scope.maxDepth;
    }

    return scope?.maxDepth?.[operation];
}
