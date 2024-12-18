import {check} from '@augment-vir/assert';
import type {PrismaField} from '../../prisma/dmmf-model.js';

/**
 * Built-in GraphQL scalar types.
 *
 * @category Scalars
 */
export enum GraphqlBuiltinScalar {
    String = 'String',
    Int = 'Int',
    Float = 'Float',
    Boolean = 'Boolean',
    Id = 'ID',
}

/**
 * All GraphQL scalars that are not built-in to GraphQL but that `prisma-to-graphql` supports.
 *
 * @category Scalars
 */
export enum GraphqlExtraScalar {
    BigInt = 'BigInt',
    DateTime = 'DateTime',
    Decimal = 'Decimal',
}

/**
 * All scalar types supported for GraphQL by `prisma-to-graphql`.
 *
 * @category Scalars
 */
export type SupportedGraphqlScalar = GraphqlExtraScalar | GraphqlBuiltinScalar;

/**
 * Built-in Prisma scalar types.
 *
 * @category Scalars
 * @category Prisma Parsers
 */
export enum PrismaBuiltinScalar {
    BigInt = 'BigInt',
    Boolean = 'Boolean',
    Bytes = 'Bytes',
    DateTime = 'DateTime',
    Decimal = 'Decimal',
    Float = 'Float',
    Int = 'Int',
    Json = 'Json',
    String = 'String',
}

const prismaToGraphqlScalarMap: Partial<Record<PrismaBuiltinScalar, SupportedGraphqlScalar>> = {
    [PrismaBuiltinScalar.BigInt]: GraphqlExtraScalar.BigInt,
    [PrismaBuiltinScalar.Boolean]: GraphqlBuiltinScalar.Boolean,
    // not supported
    // [PrismaBuiltinScalar.Bytes]
    [PrismaBuiltinScalar.DateTime]: GraphqlExtraScalar.DateTime,
    [PrismaBuiltinScalar.Decimal]: GraphqlExtraScalar.Decimal,
    [PrismaBuiltinScalar.Float]: GraphqlBuiltinScalar.Float,
    [PrismaBuiltinScalar.Int]: GraphqlBuiltinScalar.Int,
    // not supported
    // [PrismaBuiltinScalar.Json]
    [PrismaBuiltinScalar.String]: GraphqlBuiltinScalar.String,
};

/**
 * Retrieves, if possible, a Prisma field's type for GraphQL. If the field uses an unexpected Prisma
 * scalar then this will return `undefined`.
 *
 * @category Scalars
 */
export function getFieldGraphqlScalar(
    field: Readonly<Pick<PrismaField, 'type' | 'isId'>>,
): SupportedGraphqlScalar | undefined {
    if (field.type === PrismaBuiltinScalar.String && field.isId) {
        return GraphqlBuiltinScalar.Id;
    } else if (!check.isEnumValue(field.type, PrismaBuiltinScalar)) {
        return undefined;
    }
    const mappedType = prismaToGraphqlScalarMap[field.type];
    if (!mappedType) {
        return undefined;
    }

    return mappedType;
}
