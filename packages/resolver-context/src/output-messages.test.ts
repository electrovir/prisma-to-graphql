import {getObjectTypedEntries} from '@augment-vir/common';
import {assert} from 'chai';
import {assertRunTimeType, assertTypeOf} from 'run-time-assertions';
import {
    OutputMessage,
    OutputMessageCode,
    OutputMessagesByCode,
    WrapWithCreate,
    outputMessages,
} from './output-messages';
import {ResolverOperation} from './resolver-operation-type';

describe('outputMessages', () => {
    it('has entries for each code and description', () => {
        assert.lengthOf(
            Object.values(outputMessages.byCode),
            Object.values(outputMessages.byDescription).length,
        );
    });

    it('correctly maps by description', () => {
        assertRunTimeType(
            outputMessages.byDescription['create data truncated'].message({max: 52}),
            'string',
        );

        assert.deepStrictEqual(
            outputMessages.byDescription['create data truncated'],
            outputMessages.byCode[outputMessages.byDescription['create data truncated'].code],
        );
    });

    it('creates an output message', () => {
        assert.deepStrictEqual(
            outputMessages.byDescription['create data truncated'].create({max: 52}),
            {
                code: 'ptg-1',
                description: 'create data truncated',
                message:
                    'ptg-1: Create data was truncated to the first 52 entries. You can only create 52 entries at once. Please split up your creation query.',
            },
        );
        assert.strictEqual(
            outputMessages.byDescription['create data truncated'].message({max: 52}),
            'ptg-1: Create data was truncated to the first 52 entries. You can only create 52 entries at once. Please split up your creation query.',
        );
    });

    it('every message works', () => {
        type MessageTestCases = {
            [MessageCode in OutputMessageCode]: {
                inputs: Parameters<OutputMessagesByCode[MessageCode]['message']>[0];
                expect: string;
            };
        };

        const testCases: MessageTestCases = {
            'ptg-0': {
                inputs: undefined,
                expect: 'ptg-0: example message',
            },
            'ptg-1': {
                inputs: {max: 3},
                expect: 'ptg-1: Create data was truncated to the first 3 entries. You can only create 3 entries at once. Please split up your creation query.',
            },
            'ptg-2': {
                inputs: {max: 4},
                expect: 'ptg-2: Query results were truncated to the first 4 entries. Please use pagination to split your query up.',
            },
            'ptg-3': {
                inputs: {max: 5, count: 6},
                expect: 'ptg-3: Update failed. The given query would update 6 rows but the max is 5. Please provide a tighter "where" argument.',
            },
            'ptg-4': {
                inputs: {
                    fieldChain: [
                        'first',
                        'second',
                    ],
                    max: 4,
                },
                expect: "ptg-4: Field 'first.second' possibly truncated to max 4 results.",
            },
            'ptg-5': {
                inputs: {
                    fieldName: 'MyField',
                    modelName: 'MyModel',
                    operation: ResolverOperation.Create,
                    reason: undefined,
                },
                expect: "ptg-5: Field requirement failed for 'MyModel.MyField' in create operation.",
            },
            'ptg-6': {
                inputs: {
                    create: true,
                    delete: false,
                    update: true,
                    upsert: true,
                },
                expect: "ptg-6: Some mutation arguments were ignored due to multiple mutation arguments: 'create', 'update', and 'upsert'. Please split up your resolver query into multiple resolver queries.",
            },
            'ptg-7': {
                inputs: {depth: 2, maxDepth: 1, capitalizedName: 'input'},
                expect: 'ptg-7: input too deep: 2 surpasses the max of 1. Please simplify your query.',
            },
            'ptg-8': {
                inputs: {inputName: 'test input'},
                expect: "ptg-8: Missing valid 'test input' input.",
            },
            'ptg-9': {
                inputs: {name: 'test'},
                expect: "ptg-9: 'test' is not yet implemented.",
            },
            'ptg-10': {
                inputs: undefined,
                expect: 'ptg-10: At least one mutation arg must be provided: create, update, or upsert.',
            },
            'ptg-11': {
                inputs: undefined,
                expect: "ptg-11: Neither 'total' or 'items' where selected: there's nothing to do.",
            },
        };

        getObjectTypedEntries(testCases).forEach(
            ([
                messageCode,
                testCase,
            ]) => {
                assert.strictEqual(
                    outputMessages.byCode[messageCode].message(testCase.inputs as any),
                    testCase.expect,
                );
            },
        );
    });
});

describe('WrapWithCreate', () => {
    it('adds an empty create callback', () => {
        assertTypeOf<
            WrapWithCreate<{
                code: 'ptg-0';
                description: 'test';
                message: 'test';
            }>
        >().toEqualTypeOf<{
            code: 'ptg-0';
            description: 'test';
            message(): string;
            create(): OutputMessage;
        }>();
    });

    it('adds a create callback with args', () => {
        assertTypeOf<
            WrapWithCreate<{
                code: 'ptg-0';
                description: 'test';
                message(arg: {testArg: string}): string;
            }>
        >().toEqualTypeOf<{
            code: 'ptg-0';
            description: 'test';
            message(args: {testArg: string}): string;
            create(arg: {testArg: string}): OutputMessage;
        }>();
    });
});
