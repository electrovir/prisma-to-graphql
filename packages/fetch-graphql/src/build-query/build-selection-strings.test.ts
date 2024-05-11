import {itCases} from '@augment-vir/chai';
import {buildSelectionStrings} from './build-selection-strings';

describe(buildSelectionStrings.name, () => {
    itCases(buildSelectionStrings, [
        {
            it: 'returns nothing if selection is undefined',
            inputs: [
                undefined,
                '    ',
            ],
            expect: [],
        },
        {
            it: 'returns nothing if selection has no keys',
            inputs: [
                {},
                '    ',
            ],
            expect: [],
        },
        {
            it: 'returns nothing if selection is just a boolean',
            inputs: [
                true,
                '    ',
            ],
            expect: [],
        },
        {
            it: 'creates single level selection strings',
            inputs: [
                {
                    top: true,
                    level: true,
                    only: true,
                },
                '    ',
            ],
            expect: [
                '    top',
                '    level',
                '    only',
            ],
        },
        {
            it: 'creates nested selection strings',
            inputs: [
                {
                    top: true,
                    nested: {
                        level2: true,
                        nestedMore: {
                            level3: true,
                        },
                    },
                },
                '    ',
            ],
            expect: [
                '    top',
                '    nested {',
                '        level2',
                '        nestedMore {',
                '            level3',
                '        }',
                '    }',
            ],
        },
        {
            it: 'omits false selections',
            inputs: [
                {
                    top: false,
                    nested: {
                        level2: false,
                        nestedMore: {
                            level3: true,
                        },
                    },
                },
                '    ',
            ],
            expect: [
                '    nested {',
                '        nestedMore {',
                '            level3',
                '        }',
                '    }',
            ],
        },
    ]);
});
