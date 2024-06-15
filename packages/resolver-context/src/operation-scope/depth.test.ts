import {itCases} from '@augment-vir/chai';
import {assertTypeOf} from 'run-time-assertions';
import {outputMessages} from '../output-messages';
import {MaxDepthOperation, assertValidMaxDepth, calculateMaxObjectDepth} from './depth';

describe('MaxDepthOperation', () => {
    it('matches expectation', () => {
        assertTypeOf<'write' | 'read'>().toEqualTypeOf<MaxDepthOperation>();
    });
});

describe(calculateMaxObjectDepth.name, () => {
    itCases(calculateMaxObjectDepth, [
        {
            it: 'works on a flat selection',
            input: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            expect: 2,
        },
        {
            it: 'works on a single nested select',
            input: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    regions: {
                        select: {
                            regionName: true,
                            id: true,
                        },
                    },
                },
            },
            expect: 4,
        },
        {
            it: 'grabs the deepest select',
            input: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    regions: {
                        select: {
                            regionName: true,
                            id: true,
                        },
                    },
                    regions2: {
                        select: {
                            regionName: true,
                            id: true,
                            users: {
                                select: {
                                    firstName: true,
                                    regions: {
                                        select: {
                                            regionName: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    regions3: {
                        select: {
                            regionName: true,
                            id: true,
                            users: {
                                select: {
                                    firstName: true,
                                },
                            },
                        },
                    },
                },
            },
            expect: 8,
        },
        {
            it: 'works on creation data',
            input: {
                posts: {
                    create: [
                        {
                            body: 'my body',
                            title: 'my title',
                        },
                        {
                            body: 'my body 2',
                            title: 'my title 2',
                        },
                    ],
                },
            },
            expect: 4,
        },
    ]);
});

describe(assertValidMaxDepth.name, () => {
    itCases(assertValidMaxDepth, [
        {
            it: 'ignores missing scope',
            input: {
                data: {},
                scope: undefined,
                operation: 'read',
                capitalizedDataName: 'test data',
            },
            throws: undefined,
        },
        {
            it: 'accepts data within bounds',
            input: {
                data: {},
                scope: {
                    maxDepth: 4,
                },
                operation: 'read',
                capitalizedDataName: 'test data',
            },
            throws: undefined,
        },
        {
            it: 'rejects data outside bounds',
            input: {
                data: {
                    nested: {
                        hi: 'there',
                    },
                },
                scope: {
                    maxDepth: 1,
                },
                operation: 'read',
                capitalizedDataName: 'test data',
            },
            throws: outputMessages.byDescription['max depth violated'].message({
                depth: 2,
                maxDepth: 1,
                capitalizedName: 'test data',
            }),
        },
    ]);
});
