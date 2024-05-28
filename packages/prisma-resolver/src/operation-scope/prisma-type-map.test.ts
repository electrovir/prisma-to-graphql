import {AnyObject} from '@augment-vir/common';
import {assert} from 'chai';
import {UtcIsoString} from 'date-vir';
import {assertTypeOf} from 'run-time-assertions';
import {
    MapPrismaType,
    PrismaTypeMap,
    mappedPrismaTypes,
    rawPrismaTypeMapShape,
} from './prisma-type-map';

describe('PrismaTypeMap', () => {
    it('has proper type', () => {
        assertTypeOf<PrismaTypeMap>().toEqualTypeOf<{
            BigInt: {
                input: bigint;
                output: bigint;
            };
            Boolean: {
                input: boolean;
                output: boolean;
            };
            Bytes: {
                input: Buffer;
                output: Buffer;
            };
            DateTime: {
                input: UtcIsoString | Date;
                output: UtcIsoString;
            };
            Decimal: {
                input: number;
                output: number;
            };
            Float: {
                input: number;
                output: number;
            };
            ID: {
                input: string;
                output: string;
            };
            Int: {
                input: number;
                output: number;
            };
            Json: {
                input: AnyObject;
                output: AnyObject;
            };
            Long: {
                input: number;
                output: number;
            };
            String: {
                input: string;
                output: string;
            };
            UUID: {
                input: string;
                output: string;
            };
        }>();
    });
});

describe('MapPrismaType', () => {
    it('maps types properly', () => {
        assertTypeOf<MapPrismaType<'String', 'input'>>().toEqualTypeOf<string>();
        assertTypeOf<MapPrismaType<'DateTime', 'input'>>().toEqualTypeOf<UtcIsoString | Date>();
    });
});

describe('mappedPrismaTypes', () => {
    it('has all mapped Prisma type keys', () => {
        assert.includeMembers(
            mappedPrismaTypes as string[],
            Object.keys(rawPrismaTypeMapShape.defaultValue),
        );
    });
});
