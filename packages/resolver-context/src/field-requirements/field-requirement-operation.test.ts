import {assertTypeOf} from 'run-time-assertions';
import {FieldRequirementDirectionToPrismaDirection} from './field-requirement-operation';

describe('FieldRequirementDirectionToPrismaDirection', () => {
    it('correctly maps to a prism direction', () => {
        assertTypeOf<
            FieldRequirementDirectionToPrismaDirection<'read'>
        >().toEqualTypeOf<'output'>();
        assertTypeOf<
            FieldRequirementDirectionToPrismaDirection<'write'>
        >().toEqualTypeOf<'input'>();
        assertTypeOf<
            // @ts-expect-error: intentionally incorrect input
            FieldRequirementDirectionToPrismaDirection<'invalid'>
        >().toEqualTypeOf<'ERROR: invalid field requirement direction input'>();
    });
});
