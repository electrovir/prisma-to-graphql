import {describe, itCases} from '@augment-vir/test';
import {findManyBuilder} from './find-many-builder.js';

describe('findManyBuilder', () => {
    itCases(findManyBuilder.build, [
        {
            it: 'rejects an unexpected scalar',
            input: {
                modelName: 'TestModel',
                fields: {
                    normal: {
                        hasDefaultValue: false,
                        isId: false,
                        isList: false,
                        isRequired: false,
                        isUnique: false,
                        name: 'normal',
                        type: 'String',
                        isEnumType: false,
                    },
                    abnormal: {
                        hasDefaultValue: false,
                        isId: false,
                        isList: false,
                        isRequired: false,
                        isUnique: false,
                        name: 'abnormal',
                        type: 'What',
                        isEnumType: false,
                    },
                },
                pluralModelName: 'TestModels',
            },
            throws: {
                matchMessage: 'Unsupported scalar type',
            },
        },
    ]);
});
