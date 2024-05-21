import {collapseWhiteSpace, groupArrayBy} from '@augment-vir/common';
import {assertValidShape} from 'object-shape-tester';
import {wrapString} from '../../augments/wrap-string';
import {OperationType} from '../operation-type';
import {
    ResolverBlock,
    ResolverBlockByType,
    ResolverBlockType,
    ResolverBodyVarNames,
    orderedResolverInputVars,
    resolverInputVarTypes,
} from './resolver-block';
import {ResolverBuildError} from './resolver-build.error';
import {ResolverBuilderOptions, resolverBuilderOptionsShape} from './resolver-builder-options';

/**
 * Build a generic resolver block type.
 *
 * @category Builders
 */
export function buildGenericResolverBlock(
    block: Readonly<ResolverBlockByType<'generic'>>,
): ResolverBuilderOutput {
    return {
        body: block.body,
    };
}

/**
 * Build a prisma typed resolver block.
 *
 * @category Builders
 */
export function buildPrismaResolverBlock(
    block: Readonly<ResolverBlockByType<'prisma'>>,
    options: Readonly<ResolverBuilderOptions>,
): ResolverBuilderOutput {
    const args = [
        ResolverBodyVarNames.context,
        wrapString({value: block.prismaModelName, wrapper: options.quote}),
        ResolverBodyVarNames.graphqlArgs,
        ResolverBodyVarNames.resolveInfo,
    ].join(', ');

    const body = `return await ${ResolverBodyVarNames.runPrismaResolver}(${args});`;

    return {
        body,
    };
}

/**
 * Expected resolver builder function output;
 *
 * @category Builders
 */
export type ResolverBuilderOutput = {
    body: string;
};

/**
 * Expected function shape for resolver builder functions.
 *
 * @category Builders
 */
export type ResolverBuilder<BlockType extends ResolverBlockType> = (
    block: Readonly<ResolverBlockByType<BlockType>>,
    options: Readonly<ResolverBuilderOptions>,
) => ResolverBuilderOutput;

/**
 * All resolver builder functions mapped by the type of resolver block that they build.
 *
 * @category Builders
 */
export const resolverBuilders: {
    [BlockType in ResolverBlockType]: ResolverBuilder<BlockType>;
} = {
    generic: buildGenericResolverBlock,
    prisma: buildPrismaResolverBlock,
};

function createResolverFunctionName({
    operationType,
    resolverName,
}: Pick<ResolverBlock, 'resolverName' | 'operationType'>): string {
    return [
        operationType,
        resolverName,
    ].join('_');
}

/**
 * Builds a resolver's function signature.
 *
 * @category Builders
 */
export function buildResolverFunctionSignature(
    block: Pick<ResolverBlock, 'resolverName' | 'operationType'>,
): string {
    const functionName = createResolverFunctionName(block);
    return `async function ${functionName}(${orderedResolverInputVars
        .map((varName) => {
            return [
                varName,
                resolverInputVarTypes[varName],
            ].join(': ');
        })
        .join(', ')}) {`;
}

/**
 * A built resolver block.
 *
 * @category Builders
 */
export type BuiltResolverBlock = {
    /** The resolver's TypeScript code string. */
    resolver: string;
    /** The type of operation that this resolver belongs to. */
    operationType: OperationType;
};

/**
 * Builds any resolver block by automatically determining the type of block given and the
 * corresponding block builder function.
 *
 * @category Builders
 */
export function buildResolverBlock<const BlockType extends ResolverBlockType>(
    block: Readonly<ResolverBlockByType<BlockType>>,
    options: Readonly<ResolverBuilderOptions>,
): BuiltResolverBlock {
    const builder: ResolverBuilder<any> = resolverBuilders[block.type];
    assertValidShape(options, resolverBuilderOptionsShape, {allowExtraKeys: true});

    if (!builder) {
        throw new ResolverBuildError(
            `Cannot build unsupported resolver block type '${block.type}'`,
        );
    }

    const {body} = builder(block, options);

    const hasABody = collapseWhiteSpace(body);

    const indentedBody = hasABody
        ? body
              .trim()
              .split('\n')
              .map((line) =>
                  [
                      options.indent,
                      line,
                  ].join(''),
              )
              .join('\n')
        : '';

    const lines: string[] = [
        buildResolverFunctionSignature(block),
        indentedBody,
        '}',
    ];

    const resolver = hasABody ? lines.join('\n') : lines.join('');

    return {
        operationType: block.operationType,
        resolver,
    };
}

/**
 * Builds all given resolver blocks.
 *
 * @category Builders
 */
export function buildAllResolverBlocks(
    blocks: ReadonlyArray<Readonly<ResolverBlock>>,
    options: Readonly<ResolverBuilderOptions>,
): string {
    if (!blocks.length) {
        return '';
    }

    const builtResolvers = blocks.map((block) => buildResolverBlock(block, options));

    const blocksByOperationType = groupArrayBy(blocks, (block) => block.operationType);

    const resolversTs = buildResolversTs(builtResolvers, blocksByOperationType, options);

    return resolversTs;
}

function buildResolversTs(
    builtResolvers: ReadonlyArray<Readonly<BuiltResolverBlock>>,
    blocksByOperationType: Readonly<Partial<Record<OperationType, Readonly<ResolverBlock>[]>>>,
    options: Readonly<ResolverBuilderOptions>,
): string {
    const jsExportLines: string[] = [
        'export const resolvers = {',
        ...mapOperationsToExportLines(blocksByOperationType.Mutation, 'Mutation', options),
        ...mapOperationsToExportLines(blocksByOperationType.Query, 'Query', options),
        '};',
    ];

    const importLines: string = [
        "import {GraphQLResolveInfo} from 'graphql';",
        `import {${ResolverBodyVarNames.runPrismaResolver}} from '@prisma-to-graphql/prisma-resolver';`,
    ].join('\n');

    const jsLines: string[] = [
        '// generated by prisma-to-graphql',
        importLines,
        ...builtResolvers.map((builtResolver) => builtResolver.resolver),
        jsExportLines.join('\n'),
    ];

    const resolversJs = jsLines.join(options.blockSeparation) + '\n';

    return resolversJs;
}

function mapOperationsToExportLines(
    blocks: ReadonlyArray<Readonly<ResolverBlock>> | undefined,
    parentType: string,
    options: Readonly<Pick<ResolverBuilderOptions, 'indent'>>,
): string[] {
    if (!blocks?.length) {
        return [];
    }

    const resolverNameLines = blocks.map((block) =>
        [
            options.indent,
            block.resolverName,
            `: ${createResolverFunctionName(block)}`,
            ',',
        ].join(''),
    );

    const allLines = [
        `${parentType}: {`,
        ...resolverNameLines,
        '},',
    ];

    return allLines.map((line) =>
        [
            options.indent,
            line,
        ].join(''),
    );
}
