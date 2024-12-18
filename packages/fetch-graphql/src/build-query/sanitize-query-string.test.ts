import {describe, itCases} from '@augment-vir/test';
import {sanitizeQueryString} from './sanitize-query-string.js';

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
