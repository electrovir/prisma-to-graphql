import {AnyObject} from '@augment-vir/common';
import {UtcIsoString} from 'date-vir';
import {defineShape} from 'object-shape-tester';

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

type RawPrismaTypeMap = typeof prismaTypeMapShape.runTimeType;
export const prismaTypeMapShape = defineShape({
    BigInt: 0n,
    Boolean: false,
    Bytes: Buffer.from('') as Buffer,
    DateTime: {
        input: '' as string | Date,
        output: '' as UtcIsoString,
    },
    Decimal: 0,
    Float: 0,
    ID: '',
    Int: 0,
    /**
     * Json uses `AnyObject` rather than `JsonValue` (from 'test-fest') because `JsonValue` is
     * possibly infinite.
     */
    Json: {} as AnyObject,
    Long: 0,
    String: '',
    UUID: '',
});
