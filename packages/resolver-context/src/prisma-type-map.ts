import {AnyObject, getObjectTypedKeys} from '@augment-vir/common';
import {UtcIsoString} from 'date-vir';
import {defineShape} from 'object-shape-tester';
import type {JsonValue} from 'type-fest';

/**
 * A mapping of known Prisma field types to their JS input and output types
 *
 * @category Types
 */
export type PrismaTypeMap = {
    [PrismaType in keyof RawPrismaTypeMap]: RawPrismaTypeMap[PrismaType] extends {
        output: unknown;
        input: unknown;
    }
        ? RawPrismaTypeMap[PrismaType]
        : {
              input: RawPrismaTypeMap[PrismaType];
              output: RawPrismaTypeMap[PrismaType];
          };
};

/**
 * Type of {@link rawPrismaTypeMapShape}.
 *
 * @category Internals
 */
export type RawPrismaTypeMap = typeof rawPrismaTypeMapShape.runTimeType;
/**
 * All known mapped Prisma type strings. As the raw entry, this allows a shorthand definition of
 * mapping without the `input`/`output` fields but also supports those fields when needed.
 *
 * @category Internals
 */
export const rawPrismaTypeMapShape = defineShape({
    BigInt: 0n,
    Boolean: false,
    Bytes: Buffer.from('') as Buffer,
    DateTime: {
        input: '' as UtcIsoString | Date,
        output: '' as UtcIsoString,
    },
    Decimal: 0,
    Float: 0,
    ID: '',
    Int: 0,
    /**
     * Json's mapping uses {@link AnyObject} rather than {@link JsonValue} because it is possibly
     * infinite.
     */
    Json: {} as AnyObject,
    Long: 0,
    String: '',
    UUID: '',
});

/**
 * All known mapped prisma type strings supported in {@link PrismaTypeMap}.
 *
 * @category Internals
 */
export const mappedPrismaTypes: ReadonlyArray<keyof RawPrismaTypeMap> = getObjectTypedKeys(
    rawPrismaTypeMapShape.defaultValue,
);

/**
 * Tries to map a type string to a Prisma type mapping.
 *
 * @category Types
 */
export type MapPrismaType<
    PrismaTypeString,
    Direction extends 'input' | 'output',
> = PrismaTypeString extends keyof PrismaTypeMap
    ? PrismaTypeMap[PrismaTypeString][Direction]
    : unknown;
