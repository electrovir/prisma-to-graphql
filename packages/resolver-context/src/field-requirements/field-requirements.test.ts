import {assertTypeOf} from 'run-time-assertions';
import {generatedModels} from '../generated-models.mock';
import {
    FieldRequirements,
    defineFieldRequirements,
    universalFieldRequirement,
} from './field-requirements';

describe('FieldRequirements', () => {
    it('allows expected type', () => {
        const testValue = {
            User: {
                addresses: {
                    write() {
                        console.info('hi');
                    },
                },
                firstName: {
                    connect() {
                        console.info('hi');
                    },
                },
                email: {
                    create() {
                        return false;
                    },
                },
            },
        } satisfies FieldRequirements<typeof generatedModels>;

        assertTypeOf(testValue).toBeAssignableTo<FieldRequirements<typeof generatedModels>>();
    });

    it('allow universal requirement', () => {
        const testValue = {
            [universalFieldRequirement]: {
                write() {
                    console.info('hi');
                },
            },
            User: {
                addresses: {
                    write() {
                        console.info('hi');
                    },
                },
                email: {
                    create() {
                        return false;
                    },
                },
            },
        } satisfies FieldRequirements<typeof generatedModels>;

        assertTypeOf(testValue).toBeAssignableTo<FieldRequirements<typeof generatedModels>>();
    });
});

describe(defineFieldRequirements.name, () => {
    it('also enforces FieldRequirements type', () => {
        defineFieldRequirements(generatedModels, {
            User: {
                addresses: {
                    create() {
                        return true;
                    },
                },
            },
        });
    });
});
