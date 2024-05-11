import {
    addPrefix,
    addSuffix,
    arrayToObject,
    filterMap,
    groupArrayBy,
    isTruthy,
    mergePropertyArrays,
    removeSuffix,
} from '@augment-vir/common';
import {assertValidShape} from 'object-shape-tester';
import {isRunTimeType} from 'run-time-assertions';
import {OperationType} from '../operation-type';
import {
    GraphqlBlock,
    GraphqlBlockByType,
    GraphqlBlockType,
    NamedGraphqlBlock,
    TopLevelNamedGraphqlBlock,
} from './graphql-block';
import {GraphqlBuildError} from './graphql-build.error';
import {GraphqlBuilderOptions, graphqlBuilderOptionsShape} from './graphql-builder-options';

/**
 * Converts a line of strings into a GraphQL comment.
 *
 * @category Builders
 */
export function buildGraphqlComment(lines: string[] | undefined, indent: string): string {
    if (!lines || !lines.length) {
        return '';
    }

    const truthyLines = filterMap(lines, (line) => line.trim(), isTruthy);

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
 * @category Builders
 */
export function buildGraphqlUnionBlock(block: Readonly<GraphqlBlockByType<'union'>>) {
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
 * @category Builders
 */
export function buildGraphqlEnumBlock(
    block: Readonly<GraphqlBlockByType<'enum'>>,
    options: Readonly<GraphqlBuilderOptions>,
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
                options.indent,
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
 * @category Builders
 */
export function buildGraphqlTypeBlock(
    block: Readonly<GraphqlBlockByType<'input' | 'type'>>,
    options: Readonly<GraphqlBuilderOptions>,
): GraphqlBuilderOutput {
    const lines: string[] = [
        `${block.type} ${block.name} {`,
        ...block.props.map((prop) => buildGraphqlBlock(prop, options)),
        '}',
    ].filter(isTruthy);
    const value = lines.join(block.props.length ? '\n' : '');
    return {
        indent: '',
        value,
    };
}

/**
 * Builds a GraphQL operation, meaning a field that has arguments.
 *
 * @category Builders
 */
export function buildGraphqlOperationBlock(
    block: Readonly<GraphqlBlockByType<'operation'>>,
    options: Readonly<GraphqlBuilderOptions>,
): GraphqlBuilderOutput {
    const args: string[] = block.args.flatMap((arg) => buildGraphqlBlock(arg, options).split('\n'));

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
            options.indent,
            line,
        ].join(''),
    );

    const value = indentedLines.join(hasArgs ? '\n' : '');

    return {
        indent: options.indent,
        value,
    };
}

/**
 * Creates a builder for a block of operations (like query or mutation). This actually just builds a
 * `type` block, but includes special hardcoded considerations.
 *
 * @category Builders
 */
export function makeOperationsBlockBuilder<Type extends OperationType>(operationsBlockType: Type) {
    return (
        block: Type extends 'Mutation'
            ? Readonly<GraphqlBlockByType<'Mutation'>>
            : Readonly<GraphqlBlockByType<'Query'>>,
        options: Readonly<GraphqlBuilderOptions>,
    ): GraphqlBuilderOutput => {
        if (!block.blocks.length) {
            return {
                indent: '',
                value: '',
            };
        }

        const value = buildGraphqlBlock(
            {
                type: 'type',
                name: operationsBlockType,
                props: block.blocks,
            },
            options,
        );

        return {
            indent: '',
            value,
        };
    };
}

/**
 * Builds a GraphQL property, or field.
 *
 * @category Builders
 */
export function buildGraphqlPropertyBlock(
    block: Readonly<GraphqlBlockByType<'property'>>,
    options: Readonly<GraphqlBuilderOptions>,
): GraphqlBuilderOutput {
    const prop = [
        block.name,
        block.required
            ? addSuffix({value: block.value, suffix: '!'})
            : removeSuffix({value: block.value, suffix: '!'}),
    ].join(': ');

    const value = [
        options.indent,
        prop,
    ].join('');

    return {
        indent: options.indent,
        value,
    };
}

/**
 * Builds a GraphQL `scalar`.
 *
 * @category Builders
 */
export function buildGraphqlScalarBlock(
    block: Readonly<GraphqlBlockByType<'scalar'>>,
    options: Readonly<GraphqlBuilderOptions>,
): GraphqlBuilderOutput {
    const value = [
        'scalar',
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
 * @category Builders
 */
export function buildGraphqlSchemaBlock(
    block: Readonly<GraphqlBlockByType<'schema'>>,
    options: Readonly<GraphqlBuilderOptions>,
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
            return 'type';
        }

        return block.type;
    }) as Partial<{
        [BlockType in GraphqlBlockType]: GraphqlBlockByType<BlockType>[];
    }>;

    const flattenedMutations = flattenOperationBlocks(groupedChildren.Mutation);
    const flattenedQueries = flattenOperationBlocks(groupedChildren.Query);

    if (groupedChildren.property) {
        throw new GraphqlBuildError('top level properties cannot exist');
    } else if (groupedChildren.operation) {
        throw new GraphqlBuildError('top level operations cannot exist');
    }

    /* istanbul ignore next: covering edge cases that shouldn't actually happen. */
    if (groupedChildren.input) {
        throw new GraphqlBuildError(
            'top level inputs should have been collapsed with top level types',
        );
    } else if (groupedChildren.schema) {
        throw new GraphqlBuildError('nested schemas were not flattened');
    }

    const mutationsBlock: GraphqlBlockByType<'Mutation'> | undefined = flattenedMutations
        ? {
              type: 'Mutation',
              comment: flattenedMutations.comments,
              blocks: flattenedMutations.blocks,
          }
        : undefined;

    const queriesBlock: GraphqlBlockByType<'Query'> | undefined = flattenedQueries
        ? {
              type: 'Query',
              comment: flattenedQueries.comments,
              blocks: flattenedQueries.blocks,
          }
        : undefined;

    /** Blocks of blocks that should only be separated by a single line. */
    const builtBlockBlocks = [
        groupedChildren.scalar,
        groupedChildren.union,
    ]
        .filter(isTruthy)
        .map((blocks: TopLevelNamedGraphqlBlock[]) =>
            deduplicateNamedBlocks<TopLevelNamedGraphqlBlock>(blocks).map((block) =>
                buildGraphqlBlock(block, options),
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
        .filter(isTruthy)
        .map((entry: string | GraphqlBlock) => {
            if (isRunTimeType(entry, 'string')) {
                return entry;
            } else {
                return buildGraphqlBlock(entry, options);
            }
        });

    const finalSchema = schemaLines.length
        ? [
              '# generated by prisma-to-graphql',
              ...schemaLines,
          ].join(options.blockSeparation)
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
 * @category Builders
 */
export function flattenOperationBlocks(
    blocks: ReadonlyArray<Readonly<GraphqlBlockByType<'Query' | 'Mutation'>>> | undefined,
):
    | {
          comments: string[];
          blocks: GraphqlBlockByType<'Query' | 'Mutation'>['blocks'];
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
 * @category Builders
 */
export function flattenAllSchemaBlocks(parent: Readonly<GraphqlBlockByType<'schema'>>): {
    blocks: Exclude<GraphqlBlock, {type: 'schema'}>[];
    comments: string[];
} {
    let foundSchema = false;
    const comments: string[] = parent.comment || [];
    const blocks: GraphqlBlock[] = parent.blocks.flatMap((child) => {
        if (child.type === 'schema') {
            foundSchema = true;
            comments.push(...(child.comment || []));
            return child.blocks;
        } else {
            return child;
        }
    });

    if (foundSchema) {
        return flattenAllSchemaBlocks({
            type: 'schema',
            comment: comments,
            blocks: blocks as GraphqlBlockByType<'schema'>['blocks'],
        });
    } else {
        return {
            blocks: blocks as Exclude<GraphqlBlock, {type: 'schema'}>[],
            comments,
        };
    }
}

/**
 * The output of the GraphQL block builders.
 *
 * @category Builders
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
 * @category Builders
 */
export type GraphqlBuilder<BlockType extends GraphqlBlockType> = (
    block: Readonly<GraphqlBlockByType<BlockType>>,
    options: Readonly<GraphqlBuilderOptions>,
) => GraphqlBuilderOutput;

/**
 * All GraphQL builders by their block type.
 *
 * @category Builders
 */
export const graphqlBuilders: {
    [BlockType in GraphqlBlockType]: GraphqlBuilder<BlockType>;
} = {
    enum: buildGraphqlEnumBlock,
    input: buildGraphqlTypeBlock,
    Mutation: makeOperationsBlockBuilder('Mutation'),
    operation: buildGraphqlOperationBlock,
    ['Query']: makeOperationsBlockBuilder('Query'),
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
 * @category Builders
 */
export function buildGraphqlBlock<const BlockType extends GraphqlBlockType>(
    block: Readonly<GraphqlBlockByType<BlockType>>,
    options: Readonly<GraphqlBuilderOptions>,
): string {
    const builder: GraphqlBuilder<any> = graphqlBuilders[block.type];
    assertValidShape(options, graphqlBuilderOptionsShape, {allowExtraKeys: true});

    if (!builder) {
        throw new GraphqlBuildError(`Cannot build unsupported GraphQL block type '${block.type}'`);
    }
    const {indent, value, omitComment} = builder(block, options);

    return [
        omitComment ? '' : buildGraphqlComment(block.comment, indent),
        value,
    ]
        .filter(isTruthy)
        .join('\n');
}

/**
 * Converts an entire schema block into a string GraphQL schema.
 *
 * @category Builders
 */
export function buildGraphqlSchemaString(
    block: Readonly<GraphqlBlockByType<'schema'>>,
    options: Readonly<GraphqlBuilderOptions>,
) {
    return buildGraphqlBlock(block, options);
}

/**
 * Removes all blocks that have already been defined by their name. This does not combine the
 * duplicate blocks, it removes the duplicates entirely.
 *
 * @category Builders
 */
export function deduplicateNamedBlocks<const Block extends NamedGraphqlBlock>(
    blocks: ReadonlyArray<Readonly<Block>>,
): Block[] {
    const deduplicated = arrayToObject(blocks, (block) => block.name);

    return Object.values(deduplicated);
}
