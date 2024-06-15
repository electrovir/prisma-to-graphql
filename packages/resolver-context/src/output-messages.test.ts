import {assert} from 'chai';
import {assertRunTimeType, assertTypeOf} from 'run-time-assertions';
import {OutputMessage, WrapWithCreate, outputMessages} from './output-messages';
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
        assert.strictEqual(outputMessages.byCode['ptg-0'].message(), 'ptg-0: example message');
        assert.strictEqual(
            outputMessages.byCode['ptg-1'].message({max: 3}),
            'ptg-1: Create data was truncated to the first 3 entries. You can only create 3 entries at once. Please split up your creation query.',
        );
        assert.strictEqual(
            outputMessages.byCode['ptg-2'].message({max: 4}),
            'ptg-2: Query results were truncated to the first 4 entries. Please use pagination to split your query up.',
        );
        assert.strictEqual(
            outputMessages.byCode['ptg-3'].message({max: 5, count: 6}),
            'ptg-3: Update failed. The given query would update 6 rows but the max is 5. Please provide a tighter "where" argument.',
        );
        assert.strictEqual(
            outputMessages.byCode['ptg-4'].message({
                fieldChain: [
                    'first',
                    'second',
                ],
                max: 4,
            }),
            "ptg-4: Field 'first.second' possibly truncated to max 4 results.",
        );
        assert.strictEqual(
            outputMessages.byCode['ptg-5'].message({
                fieldName: 'MyField',
                modelName: 'MyModel',
                operation: ResolverOperation.Create,
                reason: undefined,
            }),
            "ptg-5: Field requirement failed for 'MyModel.MyField' in create operation.",
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
