import {describe, itCases} from '@augment-vir/test';
import {
    getFieldGraphqlScalar,
    GraphqlBuiltinScalar,
    GraphqlExtraScalar,
    PrismaBuiltinScalar,
} from './scalar-type-map.js';

describe(getFieldGraphqlScalar.name, () => {
    itCases(getFieldGraphqlScalar, [
        {
            it: 'maps a built-in GraphQL type',
            input: {
                isId: false,
                type: PrismaBuiltinScalar.String,
            },
            expect: GraphqlBuiltinScalar.String,
        },
        {
            it: 'maps an id',
            input: {
                isId: true,
                type: PrismaBuiltinScalar.String,
            },
            expect: GraphqlBuiltinScalar.Id,
        },
        {
            it: 'maps an extra GraphQL type',
            input: {
                isId: false,
                type: PrismaBuiltinScalar.BigInt,
            },
            expect: GraphqlExtraScalar.BigInt,
        },
        {
            it: 'rejects an unknown prisma type',
            input: {
                isId: false,
                type: 'FakeType',
            },
            expect: undefined,
        },
        {
            it: 'rejects an unsupported prisma type',
            input: {
                isId: false,
                type: PrismaBuiltinScalar.Json,
            },
            expect: undefined,
        },
    ]);
});
