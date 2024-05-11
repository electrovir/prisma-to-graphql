import {itCases} from '@augment-vir/chai';
import {sanitizeQueryString} from './sanitize-query-string';

describe(sanitizeQueryString.name, () => {
    itCases(sanitizeQueryString, [
        {
            it: 'returns an empty string',
            input: '',
            expect: '',
        },
        {
            it: 'does not alter a clean input',
            input: 'myResolver',
            expect: 'myResolver',
        },
        {
            it: 'sanitizes input',
            input: 'My Name',
            expect: 'My_Name',
        },
    ]);
});
