import {AnyObject} from '@augment-vir/common';
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

export type RawPrismaTypeMap = typeof prismaTypeMapShape.runTimeType;
export const prismaTypeMapShape = defineShape({
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

export type MapPrismaType<
    PrismaType,
    Direction extends 'input' | 'output',
> = PrismaType extends keyof PrismaTypeMap ? PrismaTypeMap[PrismaType][Direction] : unknown;
