import {itCases} from '@augment-vir/chai';
import {wrapString} from './wrap-string';

describe(wrapString.name, () => {
    itCases(wrapString, [
        {
            it: 'wraps in quotes',
            input: {
                value: 'value',
                wrapper: "'",
            },
            expect: "'value'",
        },
    ]);
});
