/**
 * Wraps a given string on both sides of the string with the given wrapper.
 *
 * @category Builders
 */
export function wrapString({value, wrapper}: {value: string; wrapper: string}): string {
    return [
        wrapper,
        wrapper,
    ].join(value);
}
