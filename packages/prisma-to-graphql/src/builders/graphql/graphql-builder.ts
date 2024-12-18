import {check} from '@augment-vir/assert';
import {
    addPrefix,
    addSuffix,
    arrayToObject,
    filterMap,
    groupArrayBy,
    mergePropertyArrays,
    removeSuffix,
} from '@augment-vir/common';
import {OperationType} from '@prisma-to-graphql/core';
import {
    GraphqlBlock,
    GraphqlBlockByType,
    GraphqlBlockType,
    NamedGraphqlBlock,
    TopLevelNamedGraphqlBlock,
} from './graphql-block.js';
import {GraphqlBuildError} from './graphql-build.error.js';

const indent = '    ';

/**
 * Converts a line of strings into a GraphQL comment.
 *
 * @category GraphQL Builders
 */
export function buildGraphqlComment(lines: string[] | undefined, indent: string): string {
    if (!lines?.length) {
        return '';
    }

    const truthyLines = filterMap(lines, (line) => line.trim(), check.isTruthy);

    if (!truthyLines.length) {
        return '';
    }
    const commentLines = truthyLines.map((line) => {
        if (line.startsWith('#')) {
            return line;
        } else {
            return [
                '#',
                line,
            ].join(' ');
        }
    });

    return commentLines.map((line) => addPrefix({value: line, prefix: indent})).join('\n');
}

/**
 * Builds a GraphQL `union`.
 *
 * @category GraphQL Builders
 */
export function buildGraphqlUnionBlock(
    block: Readonly<GraphqlBlockByType[GraphqlBlockType.Union]>,
) {
    if (!block.values.length) {
        return {
            indent: '',
            value: '',
        };
    }

    const joinedUnion = block.values.join(' | ');

    return {
        indent: '',
        value: `union ${block.name} = ${joinedUnion}`,
    };
}

/**
 * Builds a GraphQL `enum`.
 *
 * @category GraphQL Builders
 */
export function buildGraphqlEnumBlock(
    block: Readonly<GraphqlBlockByType[GraphqlBlockType.Enum]>,
): GraphqlBuilderOutput {
    if (!block.values.length) {
        return {
            indent: '',
            value: '',
        };
    }

    const lines: string[] = [
        `enum ${block.name} {`,
        ...block.values.map((value) =>
            [
                indent,
                value,
            ].join(''),
        ),
        '}',
    ];

    return {
        indent: '',
        value: lines.join('\n'),
    };
}

/**
 * Builds a GraphQL `type`.
 *
 * @category GraphQL Builders
 */
export function buildGraphqlTypeBlock(
    block: Readonly<GraphqlBlockByType['input' | GraphqlBlockType.Type]>,
): GraphqlBuilderOutput {
    const lines: string[] = [
        `${block.type} ${block.name} {`,
        ...block.props.map((prop) => buildGraphqlBlock(prop)),
        '}',
    ].filter(check.isTruthy);
    const value = lines.join(block.props.length ? '\n' : '');
    return {
        indent: '',
        value,
    };
}

/**
 * Builds a GraphQL operation, meaning a field that has arguments.
 *
 * @category GraphQL Builders
 */
export function buildGraphqlOperationBlock(
    block: Readonly<GraphqlBlockByType['operation']>,
): GraphqlBuilderOutput {
    const args: string[] = block.args.flatMap((arg) => buildGraphqlBlock(arg).split('\n'));

    const hasArgs = !!args.length;

    const name = [
        block.name,
        hasArgs ? '(' : '',
    ].join('');

    const output = [
        hasArgs ? ')' : '',
        ': ',
        block.output.value,
        block.output.required ? '!' : '',
    ].join('');

    const lines = hasArgs
        ? [
              name,
              ...args,
              output,
          ]
        : [
              [
                  name,
                  output,
              ].join(''),
          ];

    const indentedLines: string[] = lines.map((line) =>
        [
            indent,
            line,
        ].join(''),
    );

    const value = indentedLines.join(hasArgs ? '\n' : '');

    return {
        indent: indent,
        value,
    };
}

/**
 * Creates a builder for a block of operations (like query or mutation). This actually just builds a
 * `type` block, but includes special hardcoded considerations.
 *
 * @category GraphQL Builders
 */
export function makeOperationsBlockBuilder<Type extends OperationType>(operationsBlockType: Type) {
    return (
        block: Type extends OperationType.Mutation
            ? Readonly<GraphqlBlockByType[OperationType.Mutation]>
            : Readonly<GraphqlBlockByType[OperationType.Query]>,
    ): GraphqlBuilderOutput => {
        if (!block.blocks.length) {
            return {
                indent: '',
                value: '',
            };
        }

        const value = buildGraphqlBlock({
            type: GraphqlBlockType.Type,
            name: operationsBlockType,
            props: block.blocks,
        });

        return {
            indent: '',
            value,
        };
    };
}

/**
 * Builds a GraphQL property, or field.
 *
 * @category GraphQL Builders
 */
export function buildGraphqlPropertyBlock(
    block: Readonly<GraphqlBlockByType[GraphqlBlockType.Property]>,
): GraphqlBuilderOutput {
    const prop = [
        block.name,
        block.required
            ? addSuffix({value: block.value, suffix: '!'})
            : removeSuffix({value: block.value, suffix: '!'}),
    ].join(': ');

    const value = [
        indent,
        prop,
    ].join('');

    return {
        indent: indent,
        value,
    };
}

/**
 * Builds a GraphQL `scalar`.
 *
 * @category GraphQL Builders
 */
export function buildGraphqlScalarBlock(
    block: Readonly<GraphqlBlockByType[GraphqlBlockType.Scalar]>,
): GraphqlBuilderOutput {
    const value = [
        GraphqlBlockType.Scalar,
        block.name,
    ].join(' ');

    return {
        indent: '',
        value,
    };
}

/**
 * Builds an entire GraphQL schema.
 *
 * @category GraphQL Builders
 */
export function buildGraphqlSchemaBlock(
    block: Readonly<GraphqlBlockByType[GraphqlBlockType.Schema]>,
): GraphqlBuilderOutput {
    const {blocks: flattenedChildren, comments: schemaComments} = flattenAllSchemaBlocks(block);

    /**
     * Only accept the following, and this this order:
     *
     * - Mutation
     * - Query
     * - Scalar
     * - Union
     * - Enum
     * - Inputs / Types (combined)
     */

    const groupedChildren = groupArrayBy(flattenedChildren, (block) => {
        if (block.type === 'input') {
            return GraphqlBlockType.Type;
        }

        return block.type;
    }) as Partial<{
        [BlockType in GraphqlBlockType | OperationType]: GraphqlBlockByType[BlockType][];
    }>;

    const flattenedMutations = flattenOperationBlocks(groupedChildren.Mutation);
    const flattenedQueries = flattenOperationBlocks(groupedChildren.Query);

    if (groupedChildren.property) {
        throw new GraphqlBuildError('top level properties cannot exist');
    } else if (groupedChildren.operation) {
        throw new GraphqlBuildError('top level operations cannot exist');
    }

    /** Covering edge cases that shouldn't actually happen. */
    /* node:coverage ignore next 7 */
    if (groupedChildren.input) {
        throw new GraphqlBuildError(
            'top level inputs should have been collapsed with top level types',
        );
    } else if (groupedChildren.schema) {
        throw new GraphqlBuildError('nested schemas were not flattened');
    }

    const mutationsBlock: GraphqlBlockByType[OperationType.Mutation] | undefined =
        flattenedMutations
            ? {
                  type: OperationType.Mutation,
                  comment: flattenedMutations.comments,
                  blocks: flattenedMutations.blocks,
              }
            : undefined;

    const queriesBlock: GraphqlBlockByType[OperationType.Query] | undefined = flattenedQueries
        ? {
              type: OperationType.Query,
              comment: flattenedQueries.comments,
              blocks: flattenedQueries.blocks,
          }
        : undefined;

    /** Blocks of blocks that should only be separated by a single line. */
    const builtBlockBlocks = [
        groupedChildren.scalar,
        groupedChildren.union,
    ]
        .filter(check.isTruthy)
        .map((blocks: TopLevelNamedGraphqlBlock[]) =>
            deduplicateNamedBlocks<TopLevelNamedGraphqlBlock>(blocks).map((block) =>
                buildGraphqlBlock(block),
            ),
        );

    const schemaLines: string[] = [
        buildGraphqlComment(schemaComments, ''),
        mutationsBlock,
        queriesBlock,
        /** These lists should only be separated by a single new line. */
        ...builtBlockBlocks.map((innerArray) => innerArray.join('\n')),
        ...(groupedChildren.enum || []),
        ...(groupedChildren.type || []),
    ]
        .filter(check.isTruthy)
        .map((entry: string | GraphqlBlock) => {
            if (check.isString(entry)) {
                return entry;
            } else {
                return buildGraphqlBlock(entry);
            }
        });

    const finalSchema = schemaLines.length
        ? [
              '# generated by prisma-to-graphql',
              ...schemaLines,
          ].join('\n\n')
        : '';

    return {
        indent: '',
        value: finalSchema,
        omitComment: true,
    };
}

/**
 * Flattens an array of operation blocks into single operations for each defined operation. Used,
 * for example, to combine multiple `Query {}` blocks into a single `Query {}` block to prevent
 * erroneous schemas.
 *
 * @category Internal
 */
export function flattenOperationBlocks(
    blocks:
        | ReadonlyArray<Readonly<GraphqlBlockByType[OperationType.Query | OperationType.Mutation]>>
        | undefined,
):
    | {
          comments: string[];
          blocks: GraphqlBlockByType[OperationType.Query | OperationType.Mutation]['blocks'];
      }
    | undefined {
    if (!blocks?.length) {
        return undefined;
    }

    const merged = mergePropertyArrays(
        ...blocks.map((block) => {
            return {
                comments: block.comment || [],
                blocks: block.blocks,
            };
        }),
    );

    if (merged.blocks.length) {
        return merged;
    } else {
        return undefined;
    }
}

/**
 * Flattens an array of schemas blocks into a single schema block.
 *
 * @category Internal
 */
export function flattenAllSchemaBlocks(
    parent: Readonly<GraphqlBlockByType[GraphqlBlockType.Schema]>,
): {
    blocks: Exclude<GraphqlBlock, {type: GraphqlBlockType.Schema}>[];
    comments: string[];
} {
    let foundSchema = false as boolean;
    const comments: string[] = parent.comment || [];
    const blocks: GraphqlBlock[] = parent.blocks.flatMap((child) => {
        if (child.type === GraphqlBlockType.Schema) {
            foundSchema = true;
            comments.push(...(child.comment || []));
            return child.blocks;
        } else {
            return child;
        }
    });

    if (foundSchema) {
        return flattenAllSchemaBlocks({
            type: GraphqlBlockType.Schema,
            comment: comments,
            blocks: blocks as GraphqlBlockByType[GraphqlBlockType.Schema]['blocks'],
        });
    } else {
        return {
            blocks: blocks as Exclude<GraphqlBlock, {type: GraphqlBlockType.Schema}>[],
            comments,
        };
    }
}

/**
 * The output of the GraphQL block builders.
 *
 * @category Internal
 */
export type GraphqlBuilderOutput = {
    value: string;
    indent: string;
    /**
     * Set to true if the builder already handled comment printed. Currently, only the schema
     * builder does this.
     */
    omitComment?: boolean | undefined;
};

/**
 * The expected function shape for a GraphQL block builder.
 *
 * @category GraphQL Builders
 */
export type GraphqlBuilder<BlockType extends GraphqlBlockType | OperationType> = (
    block: Readonly<GraphqlBlockByType[BlockType]>,
) => GraphqlBuilderOutput;

/**
 * All GraphQL builders by their block type.
 *
 * @category GraphQL Builders
 */
export const graphqlBuilders: {
    [BlockType in GraphqlBlockType | OperationType]: GraphqlBuilder<BlockType>;
} = {
    enum: buildGraphqlEnumBlock,
    input: buildGraphqlTypeBlock,
    Mutation: makeOperationsBlockBuilder(OperationType.Mutation),
    operation: buildGraphqlOperationBlock,
    [OperationType.Query]: makeOperationsBlockBuilder(OperationType.Query),
    type: buildGraphqlTypeBlock,
    property: buildGraphqlPropertyBlock,
    scalar: buildGraphqlScalarBlock,
    schema: buildGraphqlSchemaBlock,
    union: buildGraphqlUnionBlock,
};

/**
 * Builds any GraphQL block by automatically determining the type of the block and the builder for
 * it.
 *
 * @category GraphQL Builders
 */
export function buildGraphqlBlock<const BlockType extends GraphqlBlockType | OperationType>(
    block: Readonly<GraphqlBlockByType[BlockType]>,
): string {
    const builder: GraphqlBuilder<any> = graphqlBuilders[block.type];

    if (!(builder as typeof builder | undefined)) {
        throw new GraphqlBuildError(`Cannot build unsupported GraphQL block type '${block.type}'`);
    }
    const {indent, value, omitComment} = builder(block);

    return [
        omitComment ? '' : buildGraphqlComment(block.comment, indent),
        value,
    ]
        .filter(check.isTruthy)
        .join('\n');
}

/**
 * Converts an entire schema block into a string GraphQL schema.
 *
 * @category GraphQL Builders
 */
export function buildGraphqlSchemaString(
    block: Readonly<GraphqlBlockByType[GraphqlBlockType.Schema]>,
) {
    return buildGraphqlBlock(block);
}

/**
 * Removes all blocks that have already been defined by their name. This does not combine the
 * duplicate blocks, it removes the duplicates entirely.
 *
 * @category Internal
 */
export function deduplicateNamedBlocks<const Block extends NamedGraphqlBlock>(
    blocks: ReadonlyArray<Readonly<Block>>,
): Block[] {
    const deduplicated = arrayToObject(blocks, (block) => {
        return {
            key: block.name,
            value: block,
        };
    });

    return Object.values(deduplicated);
}
