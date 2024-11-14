import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {
    createResolverInputName,
    createResolverOutputName,
    createWithoutRelationInputName,
} from './resolver-names.js';

describe(createResolverInputName.name, () => {
    it('creates a name', () => {
        assert.strictEquals(
            createResolverInputName({
                modelName: 'User',
                inputName: 'create',
            }),
            'User_CreateInput',
        );
    });
});

describe(createResolverOutputName.name, () => {
    it('creates an output name', () => {
        assert.strictEquals(createResolverOutputName('User'), 'User_Output');
    });
});

describe(createWithoutRelationInputName.name, () => {
    it('creates an input name', () => {
        assert.strictEquals(
            createWithoutRelationInputName({
                modelNameGettingCreated: 'User',
                modelNameGettingOmitted: 'UserSettings',
                operationName: 'create',
            }),
            'User_Without_UserSettings_CreateInput',
        );
    });
});
