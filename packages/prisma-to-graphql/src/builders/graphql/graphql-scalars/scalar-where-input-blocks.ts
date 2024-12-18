import {check} from '@augment-vir/assert';
import {ArrayElement, arrayToObject, MaybeArray} from '@augment-vir/common';
import {GraphqlBlockByType, GraphqlBlockType} from '../graphql-block.js';
import type {PrismaField} from '../prisma-builders/dmmf-model.js';
import {
    getFieldGraphqlScalar,
    GraphqlBuiltinScalar,
    GraphqlExtraScalar,
    SupportedGraphqlScalar,
} from './scalar-type-map.js';

const graphqlScalarWhereBlockBuilders = [
    defineScalarWhereBlock(GraphqlExtraScalar.DateTime, createCommonScalarWhereBlockProps),
    defineScalarWhereBlock(GraphqlExtraScalar.BigInt, createCommonScalarWhereBlockProps),
    defineScalarWhereBlock(GraphqlBuiltinScalar.Int, createCommonScalarWhereBlockProps),
    defineScalarWhereBlock(GraphqlBuiltinScalar.Float, createCommonScalarWhereBlockProps),
    defineScalarWhereBlock(GraphqlExtraScalar.Decimal, createCommonScalarWhereBlockProps),
    defineScalarWhereBlock(GraphqlBuiltinScalar.String, [
        createCommonScalarWhereBlockProps,
        createIterableScalarWhereBlockProps,
    ]),
    /** Same as string. */
    defineScalarWhereBlock(GraphqlBuiltinScalar.Id, [
        createCommonScalarWhereBlockProps,
        createIterableScalarWhereBlockProps,
    ]),
    defineScalarWhereBlock(GraphqlBuiltinScalar.Boolean, [
        'not',
        'equals',
    ]),
] as const;

/**
 * All already-generated `where` clause input types for supported GraphQL scalars.
 *
 * @category GraphQL Blocks
 */
export const graphqlScalarWhereInputBlocks = arrayToObject(
    graphqlScalarWhereBlockBuilders,
    ({scalar, block}) => {
        return {
            key: scalar,
            value: block,
        };
    },
) as Record<
    ArrayElement<typeof graphqlScalarWhereBlockBuilders>['scalar'],
    GraphqlBlockByType[GraphqlBlockType.Input]
>;

function defineScalarWhereBlock<const Scalar extends SupportedGraphqlScalar>(
    scalar: Scalar,
    props: MaybeArray<
        | ((
              scalar: SupportedGraphqlScalar,
              blockName: string,
          ) => GraphqlBlockByType[GraphqlBlockType.Property][])
        | string[]
    >,
): {scalar: Scalar; block: GraphqlBlockByType[GraphqlBlockType.Input]} {
    const blockName = createScalarWhereInputName({
        type: scalar,
        isList: false,
        isId: false,
        isEnumType: false,
    });

    const propsDefiners = check.isArray(props) ? props : [props];

    const finalizedProps = propsDefiners.flatMap(
        (propsDefiner): GraphqlBlockByType[GraphqlBlockType.Property][] => {
            if (check.isFunction(propsDefiner)) {
                return propsDefiner(scalar, blockName);
            } else {
                /**
                 * Not using the part where `propsDefiner` is an array but we still want to support
                 * that for the future.
                 */
                /* node:coverage ignore next 3 */
                const propsDefinerArray = check.isArray(propsDefiner)
                    ? propsDefiner
                    : [propsDefiner];

                return propsDefinerArray.map((propName) => {
                    return {
                        type: GraphqlBlockType.Property,
                        name: propName,
                        value: scalar,
                        required: false,
                    };
                });
            }
        },
    );

    return {
        scalar,
        block: {
            type: GraphqlBlockType.Input,
            name: blockName,
            props: finalizedProps,
        },
    };
}

/**
 * Creates the GraphQL type name for a scalar type's where input type.
 *
 * @category Internal
 */
export function createScalarWhereInputName(
    field: Readonly<Pick<PrismaField, 'isList' | 'type' | 'isId' | 'isEnumType'>>,
): string {
    return [
        getFieldGraphqlScalar(field) || field.type,
        field.isEnumType ? '_Enum' : '',
        '_',
        'Where',
        field.isList ? 'Many' : '',
        'Input',
    ].join('');
}

/**
 * Creates common property GraphQL blocks for filter GraphQL input blocks.
 *
 * @category Internal
 */
export function createCommonScalarWhereBlockProps(
    scalar: SupportedGraphqlScalar,
    blockName: string,
): GraphqlBlockByType[GraphqlBlockType.Property][] {
    return [
        {
            type: GraphqlBlockType.Property,
            name: 'equals',
            value: scalar,
            required: false,
        },
        {
            type: GraphqlBlockType.Property,
            name: 'in',
            value: `[${scalar}!]`,
            required: false,
        },
        {
            type: GraphqlBlockType.Property,
            name: 'notIn',
            value: `[${scalar}!]`,
            required: false,
        },
        {
            type: GraphqlBlockType.Property,
            name: 'lt',
            value: scalar,
            required: false,
        },
        {
            type: GraphqlBlockType.Property,
            name: 'lte',
            value: scalar,
            required: false,
        },
        {
            type: GraphqlBlockType.Property,
            name: 'gt',
            value: scalar,
            required: false,
        },
        {
            type: GraphqlBlockType.Property,
            name: 'gte',
            value: scalar,
            required: false,
        },
        {
            type: GraphqlBlockType.Property,
            name: 'not',
            value: blockName,
            required: false,
        },
    ];
}

/**
 * Creates property GraphQL blocks for filter GraphQL input blocks for filters for types that are
 * iterable.
 *
 * @category Internal
 */
export function createIterableScalarWhereBlockProps(
    scalar: SupportedGraphqlScalar,
): GraphqlBlockByType[GraphqlBlockType.Property][] {
    return [
        {
            type: GraphqlBlockType.Property,
            name: 'contains',
            value: scalar,
            required: false,
        },
        {
            type: GraphqlBlockType.Property,
            name: 'startsWith',
            value: scalar,
            required: false,
        },
        {
            type: GraphqlBlockType.Property,
            name: 'endsWith',
            value: scalar,
            required: false,
        },
    ];
}
