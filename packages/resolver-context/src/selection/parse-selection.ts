import {FieldNode, Kind, SelectionSetNode} from 'graphql';

/**
 * A prisma compatible `select` object.
 *
 * @category Internals
 */
export type Selection = {select: {[field in string]: boolean | Selection}};

/**
 * Parse a GraphQL `SelectionSetNode` into a Prisma compatible `select` object.
 *
 * @category Internals
 */
export function parseItemSelection(
    selectionSet: Readonly<Pick<SelectionSetNode, 'selections'>> | undefined,
    queryName: string,
): Selection {
    if (!selectionSet) {
        return {select: {}};
    }

    const fieldSelections = flattenSelectionFieldNodes(selectionSet, queryName);

    const selectionObject = fieldSelections.reduce((accum: Selection['select'], field) => {
        if (field.selectionSet) {
            accum[field.name.value] = parseItemSelection(field.selectionSet, queryName);
        } else {
            accum[field.name.value] = true;
        }

        return accum;
    }, {});

    return {select: selectionObject};
}

function flattenSelectionFieldNodes(
    selectionSet: Readonly<Pick<SelectionSetNode, 'selections'>>,
    queryName: string,
): FieldNode[] {
    return selectionSet.selections.flatMap((selection) => {
        if (selection.kind === Kind.FIELD) {
            return selection;
        } else if (selection.kind === Kind.INLINE_FRAGMENT) {
            return flattenSelectionFieldNodes(selection.selectionSet, queryName);
        } else {
            throw new Error(
                `Unexpected selection kind '${selection.kind}' in operation '${queryName}'`,
            );
        }
    });
}
