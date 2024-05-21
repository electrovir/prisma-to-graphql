import {itCases} from '@augment-vir/chai';
import {generatedModelMap} from './generated-models.mock';
import {expandModelScope} from './where-scope';

describe(expandModelScope.name, () => {
    itCases(expandModelScope, [
        {
            it: 'generates nothing if there is no model scope',
            inputs: [
                'User',
                generatedModelMap,
                {},
            ],
            expect: undefined,
        },
        {
            it: 'generates nested where',
            inputs: [
                'User',
                generatedModelMap,
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
            it: 'generates multiple wheres',
            inputs: [
                'User',
                generatedModelMap,
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
                generatedModelMap,
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
