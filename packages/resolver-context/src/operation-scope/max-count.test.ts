import {itCases} from '@augment-vir/chai';
import {ResolverOperation} from '../resolver-operation-type';
import {extractMaxCountScope} from './max-count';

describe(extractMaxCountScope.name, () => {
    itCases(extractMaxCountScope, [
        {
            it: 'extracts nothing when no scope is given',
            inputs: [
                undefined,
                ResolverOperation.Create,
            ],
            expect: undefined,
        },
        {
            it: 'extracts nothing when requested type is missing',
            inputs: [
                {
                    maxCount: {
                        delete: 4,
                    },
                },
                ResolverOperation.Create,
            ],
            expect: undefined,
        },
        {
            it: 'extracts type when no types are defined',
            inputs: [
                {
                    maxCount: 4,
                },
                ResolverOperation.Create,
            ],
            expect: 4,
        },
        {
            it: 'extracts exact max type',
            inputs: [
                {
                    maxCount: {
                        create: 1,
                        delete: 2,
                        query: 3,
                        update: 4,
                    },
                },
                ResolverOperation.Query,
            ],
            expect: 3,
        },
    ]);
});
