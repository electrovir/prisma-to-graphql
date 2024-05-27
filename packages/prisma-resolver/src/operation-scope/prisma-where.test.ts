import {itCases} from '@augment-vir/chai';
import {getNowInIsoString} from 'date-vir';
import {assertTypeOf} from 'run-time-assertions';
import {generatedModels} from './generated-models.mock';
import {generatePrismaWhere, PrismaWhereField, SingleModelPrismaWhere} from './prisma-where';

const nowIsoString = getNowInIsoString();

describe('PrismaFieldWhere', () => {
    it('supports list conditions', () => {
        assertTypeOf({
            some: {
                body: {
                    equals: 'hi',
                },
                updatedAt: {
                    equals: nowIsoString,
                },
            },
        } as const).toBeAssignableTo<PrismaWhereField<typeof generatedModels, 'User', 'posts'>>();
    });

    it('supports nested conditions', () => {
        assertTypeOf({
            some: {
                body: {
                    equals: 'hi',
                },
                updatedAt: {
                    equals: nowIsoString,
                },
                user: {
                    id: {
                        equals: 'hi',
                    },
                },
            },
        } as const).toBeAssignableTo<PrismaWhereField<typeof generatedModels, 'User', 'posts'>>();
    });
});

describe('SingleModelPrismaWhere', () => {
    it('allows nested conditions', () => {
        const kljfsdla: SingleModelPrismaWhere<typeof generatedModels, 'User'> = {
            settings: {
                stats: {
                    likes: {
                        equals: 1,
                    },
                },
            },
        };
    });
});

describe(generatePrismaWhere.name, () => {
    itCases(generatePrismaWhere<typeof generatedModels, 'User'>, [
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
                    },
                    UserStats: {
                        likes: {
                            equals: 1,
                        },
                    },
                    UserSettings: {
                        id: {
                            equals: 'fake settings id',
                        },
                    },
                },
            ],
            expect: {
                id: {
                    equals: 'fake user id',
                },
                settings: {
                    id: {
                        equals: 'fake settings id',
                    },
                    stats: {
                        likes: {
                            equals: 1,
                        },
                    },
                },
            },
        },
    ]);
});
