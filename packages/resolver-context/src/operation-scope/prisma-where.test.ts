import {itCases} from '@augment-vir/chai';
import {omitObjectKeys} from '@augment-vir/common';
import {getNowInIsoString} from 'date-vir';
import {assertThrows, assertTypeOf} from 'run-time-assertions';
import {generatedModels} from '../generated-models.mock';
import {PrismaWhereField, SingleModelPrismaWhere, generatePrismaWhere} from './prisma-where';

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
        assertTypeOf({
            settings: {
                stats: {
                    likes: {
                        equals: 1,
                    },
                },
            },
        }).toBeAssignableTo<SingleModelPrismaWhere<typeof generatedModels, 'User'>>();
        assertTypeOf({
            settings: {
                stats: {
                    likes: {
                        equals: 'five',
                    },
                },
            },
        }).not.toBeAssignableTo<SingleModelPrismaWhere<typeof generatedModels, 'User'>>();
    });
});

describe(generatePrismaWhere.name, () => {
    it('allows defining list operations for relations', () => {
        generatePrismaWhere('User', generatedModels, {
            User: {},
        });
    });

    it('errors on an invalid relation type', () => {
        assertThrows(() =>
            generatePrismaWhere<typeof generatedModels, 'User'>(
                'User',
                omitObjectKeys(generatedModels, ['UserPost']) as typeof generatedModels,
                {
                    UserPost: {
                        body: {
                            contains: 'hi',
                        },
                    },
                },
            ),
        );
    });

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
            it: 'ignores an undefined scope',
            inputs: [
                'User',
                generatedModels,
                {
                    // @ts-expect-error: `undefined` is not actually allowed in the types
                    User: {
                        createdAt: undefined,
                    },
                },
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
            it: 'generates list where',
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
            it: 'supports custom non-relation list operation',
            inputs: [
                'User',
                generatedModels,
                {
                    User: {
                        addresses: {
                            contains: 'unique',
                            listOperation: 'every',
                        },
                    },
                },
            ],
            expect: {
                addresses: {
                    every: {
                        contains: 'unique',
                    },
                },
            },
        },
        {
            it: 'uses default list operation',
            inputs: [
                'User',
                generatedModels,
                {
                    User: {
                        addresses: {
                            contains: 'unique',
                        },
                    },
                },
            ],
            expect: {
                addresses: {
                    some: {
                        contains: 'unique',
                    },
                },
            },
        },
        {
            it: 'supports custom relation list operation',
            inputs: [
                'User',
                generatedModels,
                {
                    User: {
                        posts: {
                            listOperation: 'every',
                        },
                    },
                    UserPost: {
                        title: {
                            contains: 'unique',
                        },
                    },
                },
            ],
            expect: {
                posts: {
                    every: {
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
