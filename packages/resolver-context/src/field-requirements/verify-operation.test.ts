import {itCases} from '@augment-vir/chai';
import {AnyObject, AtLeastTuple} from '@augment-vir/common';
import {GraphQLError} from 'graphql';
import {AssertionError} from 'run-time-assertions';
import {generatedModels} from '../generated-models.mock';
import {ResolverOperation} from '../resolver-operation-type';
import {FieldRequirementOperation} from './field-requirement-operation';
import {universalFieldRequirement} from './field-requirements';
import {nullOutFields, verifyAllFieldRequirements} from './verify-operation';

describe(nullOutFields.name, () => {
    function testNullOutFields(
        data: AnyObject,
        fieldPathToNull: AtLeastTuple<string, 1>,
    ): AnyObject {
        nullOutFields(data, fieldPathToNull);

        return data;
    }

    itCases(testNullOutFields, [
        {
            it: 'nulls out a top level field',
            inputs: [
                {
                    hi: 'there',
                    hello: 'there',
                    another: 'field',
                },
                [
                    'hi',
                ],
            ],
            expect: {
                hi: null,
                hello: 'there',
                another: 'field',
            },
        },
        {
            it: 'nulls out nested fields',
            inputs: [
                {
                    hi: {
                        nested: '1',
                        more: {
                            nested: '2',
                        },
                    },
                    another: 'field',
                },
                [
                    'hi',
                    'more',
                    'nested',
                ],
            ],
            expect: {
                hi: {
                    nested: '1',
                    more: {
                        nested: null,
                    },
                },
                another: 'field',
            },
        },
        {
            it: 'nulls out an object field',
            inputs: [
                {
                    hi: {
                        nested: '1',
                        more: {
                            nested: '2',
                        },
                    },
                    another: 'field',
                },
                [
                    'hi',
                    'more',
                ],
            ],
            expect: {
                hi: {
                    nested: '1',
                    more: null,
                },
                another: 'field',
            },
        },
        {
            it: 'nulls fields nested in an array',
            inputs: [
                {
                    hi: {
                        nestedArray: [
                            {
                                hello: 'there',
                            },
                            {
                                hello: 'there',
                                something: 'else',
                            },
                            {
                                hello: 'there',
                                more: 'stuff',
                            },
                            {
                                hello: 'there',
                            },
                            {
                                hello: 'there',
                            },
                        ],
                    },
                    another: 'field',
                },
                [
                    'hi',
                    'nestedArray',
                    'hello',
                ],
            ],
            expect: {
                hi: {
                    nestedArray: [
                        {
                            hello: null,
                        },
                        {
                            hello: null,
                            something: 'else',
                        },
                        {
                            hello: null,
                            more: 'stuff',
                        },
                        {
                            hello: null,
                        },
                        {
                            hello: null,
                        },
                    ],
                },
                another: 'field',
            },
        },
        {
            it: 'rejects a non-object data input',
            inputs: [
                // @ts-expect-error: intentionally incorrect data input
                3,
                ['hi'],
            ],
            throws: 'Invalid data received for nulling fields.',
        },
    ]);
});

describe(verifyAllFieldRequirements.name, () => {
    async function testVerifyAllFieldRequirements<
        const Operation extends FieldRequirementOperation,
    >(
        args: Omit<
            Parameters<typeof verifyAllFieldRequirements<typeof generatedModels, Operation>>[0],
            'models'
        >,
    ) {
        await verifyAllFieldRequirements<typeof generatedModels, Operation>({
            ...args,
            models: generatedModels,
        });

        return args.data;
    }

    itCases(testVerifyAllFieldRequirements, [
        {
            it: 'nulls outputs',
            input: {
                fieldRequirements: {
                    User: {
                        id: {
                            create() {
                                return false;
                            },
                        },
                        email: {
                            delete() {
                                return false;
                            },
                        },
                        addresses: {
                            write() {
                                return false;
                            },
                        },
                        password: {
                            read() {
                                return false;
                            },
                        },
                        firstName: {
                            query() {
                                return false;
                            },
                        },
                        lastName: {
                            update() {
                                return false;
                            },
                        },
                    },
                },
                operation: ResolverOperation.Query,
                modelName: 'User',
                data: {
                    id: '1',
                    email: 'something@example.com',
                    addresses: [
                        '1',
                        '2',
                        '3',
                    ],
                    password: 'something',
                    firstName: 'Fred',
                    lastName: 'George',
                },
            },
            expect: {
                id: '1',
                email: 'something@example.com',
                addresses: [
                    '1',
                    '2',
                    '3',
                ],
                password: null,
                firstName: null,
                lastName: 'George',
            },
        },
        {
            it: 'rejects failed inputs',
            input: {
                fieldRequirements: {
                    User: {
                        id: {
                            create() {
                                return false;
                            },
                        },
                        email: {
                            delete() {
                                return false;
                            },
                        },
                        addresses: {
                            write() {
                                throw new GraphQLError('Invalid input.');
                            },
                        },
                        password: {
                            read() {
                                return false;
                            },
                        },
                        firstName: {
                            query() {
                                return false;
                            },
                        },
                        lastName: {
                            update() {
                                return false;
                            },
                        },
                        role: {
                            write() {
                                throw new AssertionError('error that should not show up');
                            },
                        },
                    },
                },
                operation: ResolverOperation.Create,
                modelName: 'User',
                data: {
                    id: '1',
                    email: 'something@example.com',
                    addresses: [
                        '1',
                        '2',
                        '3',
                    ],
                    password: 'something',
                    firstName: 'Fred',
                    lastName: 'George',
                    role: 'user',
                },
            },
            throws: "ptg-5: Field requirement failed for 'User.id' in create operation.\nptg-5: Field requirement failed for 'User.addresses' in create operation: Invalid input.\nptg-5: Field requirement failed for 'User.role' in create operation.",
        },
        {
            it: 'passes accepted inputs',
            input: {
                fieldRequirements: {
                    User: {
                        email: {
                            delete() {
                                return false;
                            },
                        },
                        password: {
                            read() {
                                return false;
                            },
                        },
                        firstName: {
                            query() {
                                return false;
                            },
                        },
                        lastName: {
                            update() {
                                return false;
                            },
                        },
                    },
                },
                operation: ResolverOperation.Create,
                modelName: 'User',
                data: {
                    id: '1',
                    email: 'something@example.com',
                    addresses: [
                        '1',
                        '2',
                        '3',
                    ],
                    password: 'something',
                    firstName: 'Fred',
                    lastName: 'George',
                    role: 'user',
                },
            },
            expect: {
                id: '1',
                email: 'something@example.com',
                addresses: [
                    '1',
                    '2',
                    '3',
                ],
                password: 'something',
                firstName: 'Fred',
                lastName: 'George',
                role: 'user',
            },
        },
        {
            it: 'passes a field with undefined',
            input: {
                fieldRequirements: {
                    User: {
                        id: {
                            create() {
                                return false;
                            },
                        },
                        email: {
                            delete() {
                                return false;
                            },
                        },
                        addresses: {
                            write() {
                                throw new GraphQLError('Invalid input.');
                            },
                        },
                        password: {
                            read() {
                                // do nothing
                            },
                        },
                        firstName: {
                            query() {
                                return false;
                            },
                        },
                        lastName: {
                            update() {
                                return false;
                            },
                        },
                        role: {
                            write() {
                                throw new AssertionError('error that should not show up');
                            },
                        },
                    },
                },
                operation: ResolverOperation.Query,
                modelName: 'User',
                data: {
                    id: '1',
                    email: 'something@example.com',
                    addresses: [
                        '1',
                        '2',
                        '3',
                    ],
                    password: 'something',
                    firstName: 'Fred',
                    lastName: 'George',
                    role: 'user',
                },
            },
            expect: {
                id: '1',
                email: 'something@example.com',
                addresses: [
                    '1',
                    '2',
                    '3',
                ],
                password: 'something',
                firstName: null,
                lastName: 'George',
                role: 'user',
            },
        },
        {
            it: 'nulls nested output',
            input: {
                fieldRequirements: {
                    User: {
                        password: {
                            read() {
                                return false;
                            },
                        },
                    },
                    Region: {
                        regionName: {
                            read() {
                                return false;
                            },
                        },
                    },
                },
                operation: ResolverOperation.Query,
                modelName: 'User',
                data: {
                    id: '1',
                    password: 'something',
                    firstName: 'Fred',
                    lastName: 'George',
                    regions: [
                        {
                            regionName: 'USA',
                        },
                        {
                            regionName: 'Europe',
                        },
                    ],
                },
            },
            expect: {
                id: '1',
                password: null,
                firstName: 'Fred',
                lastName: 'George',
                regions: [
                    {
                        regionName: null,
                    },
                    {
                        regionName: null,
                    },
                ],
            },
        },
        {
            it: 'nulls output with universal field requirement',
            input: {
                fieldRequirements: {
                    [universalFieldRequirement]: {
                        read({fieldName}) {
                            return fieldName === 'firstName' || fieldName === 'password';
                        },
                    },
                    User: {
                        password: {
                            read() {
                                return false;
                            },
                        },
                    },
                },
                operation: ResolverOperation.Query,
                modelName: 'User',
                data: {
                    id: '1',
                    password: 'something',
                    firstName: 'Fred',
                    lastName: 'George',
                    regions: [
                        {
                            regionName: 'USA',
                        },
                        {
                            regionName: 'Europe',
                        },
                    ],
                },
            },
            expect: {
                id: null,
                password: null,
                firstName: 'Fred',
                lastName: null,
                regions: null,
            },
        },
        {
            it: 'rejects nested create input',
            input: {
                fieldRequirements: {
                    Region: {
                        regionName: {
                            write() {
                                return false;
                            },
                        },
                    },
                },
                operation: ResolverOperation.Create,
                modelName: 'User',
                data: {
                    id: '1',
                    email: 'something@example.com',
                    password: 'something',
                    firstName: 'Fred',
                    lastName: 'George',
                    regions: {
                        create: {
                            regionName: 'USA',
                        },
                    },
                },
            },
            throws: "ptg-5: Field requirement failed for 'Region.regionName' in create operation.",
        },
        {
            it: 'rejects nested connectOrCreate input',
            input: {
                fieldRequirements: {
                    Region: {
                        regionName: {
                            write() {
                                return false;
                            },
                        },
                    },
                },
                operation: ResolverOperation.Create,
                modelName: 'User',
                data: {
                    id: '1',
                    email: 'something@example.com',
                    password: 'something',
                    firstName: 'Fred',
                    lastName: 'George',
                    regions: {
                        connectOrCreate: {
                            create: {
                                regionName: 'USA',
                            },
                        },
                    },
                },
            },
            throws: "ptg-5: Field requirement failed for 'Region.regionName' in create operation.",
        },
        {
            it: 'rejects array of creation',
            input: {
                fieldRequirements: {
                    Region: {
                        regionName: {
                            write() {
                                return false;
                            },
                        },
                    },
                },
                operation: ResolverOperation.Create,
                modelName: 'User',
                data: {
                    id: '1',
                    email: 'something@example.com',
                    password: 'something',
                    firstName: 'Fred',
                    lastName: 'George',
                    regions: {
                        create: [
                            {
                                regionName: 'USA',
                            },
                            {
                                regionName: 'Europe',
                            },
                        ],
                    },
                },
            },
            throws: "ptg-5: Field requirement failed for 'Region.regionName' in create operation.",
        },
        {
            it: 'rejections connect input',
            input: {
                fieldRequirements: {
                    User: {
                        regions: {
                            connect() {
                                return false;
                            },
                        },
                    },
                },
                operation: ResolverOperation.Create,
                modelName: 'User',
                data: {
                    id: '1',
                    email: 'something@example.com',
                    password: 'something',
                    firstName: 'Fred',
                    lastName: 'George',
                    regions: {
                        connect: {
                            regionName: 'USA',
                        },
                    },
                },
            },
            throws: "ptg-5: Field requirement failed for 'User.regions' in connect operation.",
        },
        {
            it: 'rejections nested connect input',
            input: {
                fieldRequirements: {
                    Region: {
                        regionName: {
                            connect() {
                                return false;
                            },
                        },
                    },
                },
                operation: ResolverOperation.Create,
                modelName: 'User',
                data: {
                    id: '1',
                    email: 'something@example.com',
                    password: 'something',
                    firstName: 'Fred',
                    lastName: 'George',
                    regions: {
                        connect: {
                            regionName: 'USA',
                        },
                    },
                },
            },
            throws: "ptg-5: Field requirement failed for 'Region.regionName' in connect operation.",
        },
        {
            it: 'rejects an invalid operation',
            input: {
                models: generatedModels,
                fieldRequirements: {},
                // @ts-expect-error: intentionally incorrect operation
                operation: 'invalid operation',
                modelName: 'User',
                data: {
                    id: '1',
                },
            },
            throws: 'Invalid field verification direction',
        },
    ]);
});
