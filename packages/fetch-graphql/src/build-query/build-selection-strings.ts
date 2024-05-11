import {getObjectTypedEntries, isObject, isTruthy} from '@augment-vir/common';
import {BaseSelection} from '../fetch-graphql/type-transforms/selection';

/**
 * Converts a selection object (with booleans) to bare GraphQL selection strings.
 *
 * @category Internal Query Builders
 */
export function buildSelectionStrings(
    selection: Readonly<BaseSelection> | undefined,
    indent: string,
): string[] {
    if (!selection || !Object.keys(selection).length || !isObject(selection)) {
        return [];
    }

    const keyStrings = getObjectTypedEntries(selection)
        .flatMap(
            ([
                key,
                selectionValue,
            ]) => {
                if (isObject(selectionValue)) {
                    return [
                        `${indent}${key} {`,
                        ...buildSelectionStrings(selectionValue, indent).map((line) =>
                            [
                                indent,
                                line,
                            ].join(''),
                        ),
                        [
                            indent,
                            '}',
                        ].join(''),
                    ];
                } else if (selectionValue) {
                    return [
                        indent,
                        key,
                    ].join('');
                } else {
                    return undefined;
                }
            },
        )
        .filter(isTruthy);

    return keyStrings;
}
