import {describe, snapshotCases} from '@augment-vir/test';
import {parseDmmfModel} from './dmmf-model.js';

describe(parseDmmfModel.name, () => {
    snapshotCases(parseDmmfModel, [
        {
            it: 'handles a model without fields',
            inputs: [
                {
                    fields: [],
                    name: 'TestNoFields',
                },
                [],
            ],
        },
        {
            it: 'handles an id field',
            inputs: [
                {
                    fields: [
                        {
                            hasDefaultValue: true,
                            isId: true,
                            isList: false,
                            isReadOnly: true,
                            isRequired: true,
                            isUnique: true,
                            kind: 'scalar',
                            name: 'id',
                            type: 'Int',
                        },
                    ],
                    name: 'TestFields',
                },
                [],
            ],
        },
        {
            it: 'handles an enum field',
            inputs: [
                {
                    fields: [
                        {
                            hasDefaultValue: true,
                            isId: true,
                            isList: false,
                            isReadOnly: true,
                            isRequired: true,
                            isUnique: true,
                            kind: 'scalar',
                            name: 'id',
                            type: 'MyEnum',
                        },
                    ],
                    name: 'TestFields',
                },
                [
                    'MyEnum',
                ],
            ],
        },
        {
            it: 'handles relations',
            inputs: [
                {
                    fields: [
                        {
                            name: 'userId',
                            kind: 'scalar',
                            isList: false,
                            isRequired: true,
                            isUnique: true,
                            isId: false,
                            isReadOnly: true,
                            hasDefaultValue: false,
                            type: 'String',
                            isGenerated: false,
                            isUpdatedAt: false,
                        },
                        {
                            name: 'user',
                            kind: 'object',
                            isList: false,
                            isRequired: true,
                            isUnique: false,
                            isId: false,
                            isReadOnly: false,
                            hasDefaultValue: false,
                            type: 'User',
                            relationName: 'UserToUserSettings',
                            relationFromFields: ['userId'],
                            relationToFields: ['id'],
                            isGenerated: false,
                            isUpdatedAt: false,
                        },
                    ],
                    name: 'TestFields',
                },
                [],
            ],
        },
    ]);
});
