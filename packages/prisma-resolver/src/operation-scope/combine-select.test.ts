import {itCases} from '@augment-vir/chai';
import {combineSelect} from './combine-select';
import {generatedModels} from './generated-models.mock';

describe(combineSelect.name, () => {
    itCases(combineSelect, [
        {
            it: 'ignores missing query select',
            inputs: [
                undefined,
                'User',
                generatedModels,
                {where: {User: {firstName: {equals: 'Zebra'}}}},
            ],
            expect: {},
        },
        {
            it: 'ignores empty query select',
            inputs: [
                {},
                'User',
                generatedModels,
                {where: {User: {firstName: {equals: 'Zebra'}}}},
            ],
            expect: {},
        },
        {
            it: 'does not append an irrelevant scope',
            inputs: [
                {
                    regionName: true,
                    users: {
                        select: {
                            firstName: {equals: 'Zebra'},
                        },
                    },
                },
                'Region',
                generatedModels,
                {
                    where: {
                        User: {},
                    },
                },
            ],
            expect: {
                regionName: true,
                users: {
                    select: {
                        firstName: {equals: 'Zebra'},
                    },
                },
            },
        },
        {
            it: 'inserts where into select',
            inputs: [
                {
                    firstName: true,
                    lastName: true,
                    regions: {
                        select: {
                            regionName: true,
                            users: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                },
                'User',
                generatedModels,
                {where: {User: {firstName: {equals: 'Zebra'}}}},
            ],
            expect: {
                firstName: true,
                lastName: true,
                regions: {
                    select: {
                        regionName: true,
                        users: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                            where: {
                                firstName: {
                                    equals: 'Zebra',
                                },
                            },
                        },
                    },
                    where: {
                        users: {
                            some: {
                                firstName: {
                                    equals: 'Zebra',
                                },
                            },
                        },
                    },
                },
            },
        },
        {
            it: 'inserts where into select',
            inputs: [
                {
                    id: true,
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                'UserSettings',
                generatedModels,
                {where: {User: {id: {equals: 'some id'}}}},
            ],
            expect: {
                id: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        },
    ]);
});
