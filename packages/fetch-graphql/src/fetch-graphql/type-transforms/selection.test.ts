import {assert} from '@augment-vir/assert';
import {PartialWithUndefined, RequiredAndNotNull} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import type {OperationType} from '@prisma-to-graphql/core';
import {createMockVir} from 'mock-vir';
import {Maybe, Resolvers} from '../../example-outputs.mock.js';
import {ResolverOutput} from './resolvers.js';
import {AvailableSelectionSet, SelectedOutput, SelectedOutputFromOperation} from './selection.js';

describe('SelectedOutput', () => {
    it('narrows a model', () => {
        assert
            .tsType<
                SelectedOutput<
                    {
                        total: number;
                        items: {hello: string; goodbye: string; likes: number}[];
                    },
                    {
                        total: true;
                        items: {
                            goodbye: true;
                        };
                    }
                >
            >()
            .matches<
                Readonly<{
                    total: number;
                    items: ReadonlyArray<Readonly<{goodbye: string}>>;
                }>
            >();
        assert
            .tsType<
                SelectedOutput<
                    {
                        total: number;
                        items: {hello: string; goodbye: string; likes: number}[];
                    },
                    {
                        total: true;
                        items: {
                            goodbye: true;
                        };
                    }
                >
            >()
            .notMatches<
                Readonly<{
                    total: number;
                    items: ReadonlyArray<Readonly<{hello: string}>>;
                }>
            >();
    });
    it('preserves possibly null properties', () => {
        const value: SelectedOutput<
            {
                total: number;
                items: {
                    hello?: Maybe<{nestedValue: Maybe<string>}>;
                    goodbye: string;
                    likes: Maybe<number>;
                }[];
            },
            {
                total: true;
                items: {
                    hello: {
                        nestedValue: true;
                    };
                    likes: true;
                };
            }
        > = createMockVir();

        const firstItem = value.items[0];

        assert.tsType<Extract<typeof firstItem, undefined>>().equals<undefined>();
        assert
            .tsType<Extract<NonNullable<typeof firstItem>['hello'], undefined>>()
            .equals<undefined>();
        assert
            .tsType<
                Extract<
                    NonNullable<NonNullable<typeof firstItem>['hello']>['nestedValue'],
                    undefined
                >
            >()
            .equals<undefined>();

        assert
            .tsType<
                SelectedOutput<
                    {
                        total: number;
                        items: {
                            hello?: Maybe<{nestedValue: Maybe<string>}>;
                            goodbye: string;
                            likes: Maybe<number>;
                        }[];
                    },
                    {
                        total: true;
                        items: {
                            hello: {
                                nestedValue: true;
                            };
                            likes: true;
                        };
                    }
                >
            >()
            .equals<
                Readonly<{
                    total: number;
                    items: ReadonlyArray<
                        Readonly<{
                            hello:
                                | Readonly<{
                                      nestedValue: string | null | undefined;
                                  }>
                                | null
                                | undefined;
                            likes: number | null | undefined;
                        }>
                    >;
                }>
            >();
    });
});

describe('SelectedOutputFromOperation', () => {
    it('selects the output', () => {
        assert
            .tsType<
                SelectedOutputFromOperation<
                    Resolvers,
                    OperationType.Query,
                    {
                        outputKey: 'secondUser';
                        resolverName: 'Users';
                        alias: 'secondUser';
                        args: {
                            where: {
                                role: {equals: 'user'};
                            };
                        };
                        select: {
                            items: {
                                firstName: true;
                                settings: {
                                    receivesMarketingEmails: true;
                                    stats: {
                                        dislikes: true;
                                    };
                                };
                            };
                        };
                    }
                >
            >()
            .equals<
                Readonly<{
                    items: ReadonlyArray<
                        Readonly<{
                            firstName: string | null | undefined;
                            settings:
                                | Readonly<{
                                      receivesMarketingEmails: boolean;
                                      stats:
                                          | Readonly<{
                                                dislikes: number;
                                            }>
                                          | null
                                          | undefined;
                                  }>
                                | null
                                | undefined;
                        }>
                    >;
                }>
            >();
    });
});

describe('AvailableSelectionSet', () => {
    it('has correct types', () => {
        assert
            .tsType<
                AvailableSelectionSet<ResolverOutput<Resolvers, OperationType.Query, 'Users'>, true>
            >()
            .equals<
                Readonly<
                    PartialWithUndefined<{
                        total: boolean;
                        items: Readonly<
                            PartialWithUndefined<{
                                id: boolean;
                                createdAt: boolean;
                                email: boolean;
                                firstName: boolean;
                                lastName: boolean;
                                phoneNumber: boolean;
                                role: boolean;
                                settings: Readonly<
                                    NonNullable<
                                        AvailableSelectionSet<
                                            ResolverOutput<Resolvers, OperationType.Query, 'Users'>,
                                            true
                                        >['items']
                                    >['settings']
                                >;
                                updatedAt: boolean;
                                regions: Readonly<
                                    NonNullable<
                                        AvailableSelectionSet<
                                            ResolverOutput<Resolvers, OperationType.Query, 'Users'>,
                                            true
                                        >['items']
                                    >['regions']
                                >;
                                posts: Readonly<
                                    NonNullable<
                                        AvailableSelectionSet<
                                            ResolverOutput<Resolvers, OperationType.Query, 'Users'>,
                                            true
                                        >['items']
                                    >['posts']
                                >;
                            }>
                        >;
                    }>
                >
            >();

        type doesNotHavePassword = keyof RequiredAndNotNull<
            NonNullable<
                AvailableSelectionSet<
                    ResolverOutput<Resolvers, OperationType.Query, 'Users'>,
                    true
                >['items']
            >
            // @ts-expect-error: this should not have a password key
        >['password'];
    });
});
