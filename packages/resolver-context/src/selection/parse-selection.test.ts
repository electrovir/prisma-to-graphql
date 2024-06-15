import {itCases} from '@augment-vir/chai';
import {Kind} from 'graphql';
import {parseItemSelection} from './parse-selection';

describe(parseItemSelection.name, () => {
    itCases(parseItemSelection, [
        {
            it: 'returns nothing for missing selection',
            inputs: [
                undefined,
                'my query',
            ],
            expect: {select: {}},
        },
        {
            it: 'reads basic field selections',
            inputs: [
                {
                    selections: [
                        {
                            kind: Kind.FIELD,
                            name: {
                                kind: Kind.NAME,
                                value: 'myField',
                            },
                        },
                        {
                            kind: Kind.FIELD,
                            name: {
                                kind: Kind.NAME,
                                value: 'myField2',
                            },
                        },
                    ],
                },
                'my query',
            ],
            expect: {
                select: {
                    myField: true,
                    myField2: true,
                },
            },
        },
        {
            it: 'reads nested field selections',
            inputs: [
                {
                    selections: [
                        {
                            kind: Kind.FIELD,
                            name: {
                                kind: Kind.NAME,
                                value: 'myField',
                            },
                        },
                        {
                            kind: Kind.FIELD,
                            name: {
                                kind: Kind.NAME,
                                value: 'myField2',
                            },
                            selectionSet: {
                                kind: Kind.SELECTION_SET,
                                selections: [
                                    {
                                        kind: Kind.FIELD,
                                        name: {
                                            kind: Kind.NAME,
                                            value: 'myNested',
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
                'my query',
            ],
            expect: {
                select: {
                    myField: true,
                    myField2: {
                        select: {
                            myNested: true,
                        },
                    },
                },
            },
        },
        {
            it: 'reads an inline fragment',
            inputs: [
                {
                    selections: [
                        {
                            kind: Kind.INLINE_FRAGMENT,
                            selectionSet: {
                                kind: Kind.SELECTION_SET,
                                selections: [
                                    {
                                        kind: Kind.FIELD,
                                        name: {
                                            kind: Kind.NAME,
                                            value: 'myField',
                                        },
                                    },
                                    {
                                        kind: Kind.FIELD,
                                        name: {
                                            kind: Kind.NAME,
                                            value: 'myField2',
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            kind: Kind.FIELD,
                            name: {
                                kind: Kind.NAME,
                                value: 'myField3',
                            },
                            selectionSet: {
                                kind: Kind.SELECTION_SET,
                                selections: [
                                    {
                                        kind: Kind.FIELD,
                                        name: {
                                            kind: Kind.NAME,
                                            value: 'myNested',
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
                'my query',
            ],
            expect: {
                select: {
                    myField: true,
                    myField2: true,
                    myField3: {
                        select: {
                            myNested: true,
                        },
                    },
                },
            },
        },
        {
            it: 'errors on spread fragment cause idk how to handle its selection',
            inputs: [
                {
                    selections: [
                        {
                            kind: Kind.FRAGMENT_SPREAD,
                            name: {
                                kind: Kind.NAME,
                                value: 'myField',
                            },
                        },
                        {
                            kind: Kind.FIELD,
                            name: {
                                kind: Kind.NAME,
                                value: 'myField2',
                            },
                        },
                    ],
                },
                'my query',
            ],
            throws: "Unexpected selection kind 'FragmentSpread' in operation 'my query'",
        },
    ]);
});
