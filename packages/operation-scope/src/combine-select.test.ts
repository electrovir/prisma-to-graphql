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
            expect: {select: {}, messages: []},
        },
        {
            it: 'ignores empty query select',
            inputs: [
                {},
                'User',
                generatedModels,
                {where: {User: {firstName: {equals: 'Zebra'}}}},
            ],
            expect: {select: {}, messages: []},
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
                select: {
                    regionName: true,
                    users: {
                        select: {
                            firstName: {equals: 'Zebra'},
                        },
                    },
                },
                messages: [],
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
                select: {
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
                messages: [],
            },
        },
        {
            it: 'inserts take into select',
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
                {where: {User: {firstName: {equals: 'Zebra'}}}, maxCount: 3},
            ],
            expect: {
                select: {
                    firstName: true,
                    lastName: true,
                    regions: {
                        take: 3,
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
                                take: 3,
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
                messages: [
                    {
                        code: 'ptg-4',
                        description: 'field possibly truncated',
                        message:
                            "ptg-4: Field 'User > regions' possibly truncated to max 3 results.",
                    },
                    {
                        code: 'ptg-4',
                        description: 'field possibly truncated',
                        message:
                            "ptg-4: Field 'User > regions > users' possibly truncated to max 3 results.",
                    },
                ],
            },
        },
        {
            it: 'preserves smaller user take',
            inputs: [
                {
                    regions: {
                        select: {
                            regionName: true,
                        },
                        take: 2,
                    },
                },
                'User',
                generatedModels,
                {where: {User: {firstName: {equals: 'Zebra'}}}, maxCount: 5},
            ],
            expect: {
                select: {
                    regions: {
                        take: 2,
                        select: {
                            regionName: true,
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
                messages: [],
            },
        },
        {
            it: 'ignores an irrelevant where scope',
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
                select: {
                    id: true,
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                messages: [],
            },
        },
    ]);
});
