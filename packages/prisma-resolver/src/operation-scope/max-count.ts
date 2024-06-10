import {AnyObject, isObject} from '@augment-vir/common';

/**
 * Includes a `maxCount` property which will limit operations to that defined max. Operations will
 * either truncate their inputs or throw errors when truncation is not possible.
 *
 * @category Types
 */
export type MaxCountScope = {
    maxCount?:
        | number
        | Partial<{
              query: number;
              create: number;
              update: number;
              delete: number;
          }>
        | undefined;
};

/**
 * Read the `maxCount` property from an operation scope that contains {@link MaxCountScope}. If no
 * `maxCount` is found, this returns `undefined`.
 *
 * @category Internals
 */
export function extractMaxCountScope(
    scope: MaxCountScope | undefined,
    countType: keyof Extract<MaxCountScope['maxCount'], AnyObject>,
): number | undefined {
    const originalValue = isObject(scope?.maxCount) ? scope.maxCount[countType] : scope?.maxCount;

    if (originalValue == undefined || originalValue <= 0) {
        return undefined;
    }

    return Math.round(originalValue);
}
