import {describe, snapshotCases} from '@augment-vir/test';
import {buildModel} from './build-model.js';
import type {PrismaModel} from './dmmf-model.js';

describe(buildModel.name, () => {
    const exampleFields: PrismaModel['fields'] = {
        a: {
            hasDefaultValue: false,
            isId: false,
            isList: false,
            isRequired: false,
            isUnique: false,
            name: 'a',
            type: 'Int',
            isEnumType: false,
        },
    };

    snapshotCases(buildModel, [
        {
            it: 'builds all resolvers',
            inputs: [
                {
                    fields: exampleFields,
                    modelName: 'user',
                    pluralModelName: 'users',
                },
                {
                    generateMutation: true,
                    generateQuery: true,
                },
            ],
        },
        {
            it: 'builds only mutation resolvers',
            inputs: [
                {
                    fields: exampleFields,
                    modelName: 'user',
                    pluralModelName: 'users',
                },
                {
                    generateMutation: true,
                    generateQuery: false,
                },
            ],
        },
        {
            it: 'builds only query resolvers',
            inputs: [
                {
                    fields: exampleFields,
                    modelName: 'user',
                    pluralModelName: 'users',
                },
                {
                    generateMutation: false,
                    generateQuery: true,
                },
            ],
        },
        {
            it: 'builds no resolvers',
            inputs: [
                {
                    fields: exampleFields,
                    modelName: 'user',
                    pluralModelName: 'users',
                },
                {
                    generateMutation: false,
                    generateQuery: false,
                },
            ],
        },
    ]);
});
