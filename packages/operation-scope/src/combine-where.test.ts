import {itCases} from '@augment-vir/chai';
import {combineWhere} from './combine-where';
import {generatedModels} from './generated-models.mock';

describe(combineWhere.name, () => {
    itCases(combineWhere, [
        {
            it: 'ignores empty operation scope',
            inputs: [
                {
                    firstName: {equals: 'some name'},
                },
                'User',
                generatedModels,
                undefined,
            ],
            expect: {
                firstName: {equals: 'some name'},
            },
        },
        {
            it: 'ignores empty everything',
            inputs: [
                undefined,
                'User',
                generatedModels,
                undefined,
            ],
            expect: {},
        },
        {
            it: 'combines operation scope',
            inputs: [
                {
                    firstName: {equals: 'some name'},
                },
                'User',
                generatedModels,
                {
                    where: {
                        User: {
                            lastName: {equals: 'some last name'},
                        },
                    },
                },
            ],
            expect: {
                AND: [
                    {
                        firstName: {equals: 'some name'},
                    },
                    {
                        lastName: {equals: 'some last name'},
                    },
                ],
            },
        },
        {
            it: 'combines a nested where',
            inputs: [
                {
                    firstName: {equals: 'some name'},
                },
                'User',
                generatedModels,
                {
                    where: {
                        Region: {
                            regionName: {equals: 'some region name'},
                        },
                    },
                },
            ],
            expect: {
                AND: [
                    {
                        firstName: {
                            equals: 'some name',
                        },
                    },
                    {
                        regions: {
                            some: {
                                regionName: {
                                    equals: 'some region name',
                                },
                            },
                        },
                    },
                ],
            },
        },
        {
            it: 'combines a very nested where',
            inputs: [
                {
                    likes: {gt: 4},
                },
                'UserStats',
                generatedModels,
                {
                    where: {
                        Region: {
                            regionName: {equals: 'some region name'},
                        },
                    },
                },
            ],
            expect: {
                AND: [
                    {
                        likes: {gt: 4},
                    },
                    {
                        settings: {
                            user: {
                                regions: {
                                    some: {
                                        regionName: {
                                            equals: 'some region name',
                                        },
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        },
        {
            it: 'inserts where',
            inputs: [
                undefined,
                'User',
                generatedModels,
                {
                    where: {
                        User: {
                            lastName: {equals: 'some last name'},
                        },
                    },
                },
            ],
            expect: {
                lastName: {equals: 'some last name'},
            },
        },
    ]);
});
