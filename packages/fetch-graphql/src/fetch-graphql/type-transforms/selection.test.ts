import {PartialAndUndefined, RequiredAndNotNull} from '@augment-vir/common';
import {createMockVir} from 'mock-vir';
import {assertTypeOf} from 'run-time-assertions';
import {Maybe, Resolvers} from '../../my-generated-schema-outputs';
import {ResolverOutput} from './resolvers';
import {AvailableSelectionSet, SelectedOutput, SelectedOutputFromOperation} from './selection';

describe('SelectedOutput', () => {
    it('narrows a model', () => {
        assertTypeOf<
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
        >().toMatchTypeOf<
            Readonly<{
                total: number;
                items: ReadonlyArray<Readonly<{goodbye: string}>>;
            }>
        >();
        assertTypeOf<
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
        >().not.toMatchTypeOf<
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

        assertTypeOf(firstItem).toBeNullable();
        assertTypeOf(firstItem!).not.toBeUndefined();
        assertTypeOf(firstItem!.hello).toBeNullable();
        assertTypeOf(firstItem!.hello!).not.toBeUndefined();
        assertTypeOf(firstItem!.hello!.nestedValue).toBeNullable();
        assertTypeOf(firstItem!.hello!.nestedValue!).not.toBeUndefined();

        assertTypeOf<
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
        >().toEqualTypeOf<
            Readonly<{
                total: number;
                items: ReadonlyArray<
                    Readonly<{
                        hello?:
                            | {
                                  nestedValue: string | null | undefined;
                              }
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
        assertTypeOf<
            SelectedOutputFromOperation<
                Resolvers,
                'Query',
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
        >().toEqualTypeOf<
            Readonly<{
                items: ReadonlyArray<
                    Readonly<{
                        firstName?: string | null | undefined;
                        settings?:
                            | (Readonly<{
                                  receivesMarketingEmails: boolean;
                              }> &
                                  Readonly<{
                                      stats?:
                                          | Readonly<{
                                                dislikes: number;
                                            }>
                                          | null
                                          | undefined;
                                  }>)
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
        assertTypeOf<
            AvailableSelectionSet<ResolverOutput<Resolvers, 'Query', 'Users'>, true>
        >().toEqualTypeOf<
            Readonly<
                PartialAndUndefined<{
                    total: boolean;
                    items: Readonly<
                        PartialAndUndefined<{
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
                                        ResolverOutput<Resolvers, 'Query', 'Users'>,
                                        true
                                    >['items']
                                >['settings']
                            >;
                            updatedAt: boolean;
                            regions: Readonly<
                                NonNullable<
                                    AvailableSelectionSet<
                                        ResolverOutput<Resolvers, 'Query', 'Users'>,
                                        true
                                    >['items']
                                >['regions']
                            >;
                            posts: Readonly<
                                NonNullable<
                                    AvailableSelectionSet<
                                        ResolverOutput<Resolvers, 'Query', 'Users'>,
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
                AvailableSelectionSet<ResolverOutput<Resolvers, 'Query', 'Users'>, true>['items']
            >
            // @ts-expect-error: this should not have a password key
        >['password'];
    });
});
