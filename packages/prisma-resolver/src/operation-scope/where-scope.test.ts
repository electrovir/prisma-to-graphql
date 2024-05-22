import {itCases} from '@augment-vir/chai';
import {generatedModels} from './generated-models.mock';
import {expandModelScope} from './where-scope';

describe(expandModelScope.name, () => {
    itCases(expandModelScope, [
        {
            it: 'generates nothing if there is no model scope',
            inputs: [
                'User',
                generatedModels,
                {},
            ],
            expect: undefined,
        },
        {
            it: 'generates nested where',
            inputs: [
                'User',
                generatedModels,
                {
                    UserStats: {
                        likes: {
                            equals: 1,
                        },
                    },
                },
            ],
            expect: {
                settings: {
                    stats: {
                        likes: {
                            equals: 1,
                        },
                    },
                },
            },
        },
        {
            it: 'generates nested where',
            inputs: [
                'User',
                generatedModels,
                {
                    UserPost: {
                        title: {
                            contains: 'unique',
                        },
                    },
                },
            ],
            expect: {
                posts: {
                    some: {
                        title: {
                            contains: 'unique',
                        },
                    },
                },
            },
        },
        {
            it: 'fails on a field named AND',
            inputs: [
                'User',
                {
                    User: {
                        AND: {
                            isList: false,
                            type: 'String',
                            isRelation: true,
                        },
                    },
                },
                {},
            ],
            throws: Error,
        },
        {
            it: 'generates multiple wheres',
            inputs: [
                'User',
                generatedModels,
                {
                    User: {
                        id: {
                            equals: 'fake user id',
                        },
                    },
                    UserSettings: {
                        canViewReports: {
                            equals: true,
                        },
                    },
                    UserStats: {
                        likes: {
                            equals: 1,
                        },
                    },
                },
            ],
            expect: {
                id: {
                    equals: 'fake user id',
                },
                settings: {
                    canViewReports: {
                        equals: true,
                    },
                    stats: {
                        likes: {
                            equals: 1,
                        },
                    },
                },
            },
        },
        {
            it: 'combines duplicate wheres',
            inputs: [
                'User',
                generatedModels,
                {
                    User: {
                        id: {
                            equals: 'fake user id',
                        },
                        settings: {
                            id: {
                                equals: 'fake settings id',
                            },
                        },
                    },
                    UserStats: {
                        likes: {
                            equals: 1,
                        },
                    },
                },
            ],
            expect: {
                id: {
                    equals: 'fake user id',
                },
                settings: {
                    AND: [
                        {
                            id: {
                                equals: 'fake settings id',
                            },
                        },
                        {
                            stats: {
                                likes: {
                                    equals: 1,
                                },
                            },
                        },
                    ],
                },
            },
        },
    ]);
});
