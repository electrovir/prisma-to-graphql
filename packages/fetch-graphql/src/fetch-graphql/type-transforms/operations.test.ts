import {ArrayElement} from '@augment-vir/common';
import {assertTypeOf} from 'run-time-assertions';
import {
    BooleanFilterInput,
    DateTimeFilterInput,
    Resolvers,
    UserSettings_WhereInput,
    UserSettings_WhereUnfilteredUniqueInput,
    UserStats_WhereInput,
    User_WhereInput,
} from '../../my-generated-schema-outputs';
import {
    BaseGraphqlOperations,
    FlattenedOperations,
    GraphqlOperations,
    OperationWithKey,
    ResolverOutputWithSelection,
} from './operations';

describe('BaseGraphqlOperations', () => {
    it('can match an actual operations object', () => {
        assertTypeOf<BaseGraphqlOperations>().toMatchTypeOf<
            GraphqlOperations<Resolvers, 'Mutation'>
        >();
    });
});

describe('FlattenedOperations', () => {
    it('flattens operations into a union', () => {
        assertTypeOf<
            FlattenedOperations<
                Resolvers,
                'Query',
                {
                    Users: [
                        {
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
                        },
                        {
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
                        },
                    ];
                    UserSettings: {
                        args: {
                            where: {
                                receivesMarketingEmails: {equals: true};
                            };
                        };
                        select: {
                            items: {
                                receivesMarketingEmails: true;
                            };
                        };
                    };
                }
            >
        >().toEqualTypeOf<
            | {
                  outputKey: 'UserSettings';
                  resolverName: 'UserSettings';
                  args: {
                      where: {
                          receivesMarketingEmails: {equals: true};
                      };
                  };
                  select: {
                      items: {
                          receivesMarketingEmails: true;
                      };
                  };
              }
            | {
                  outputKey: 'Users';
                  resolverName: 'Users';
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
            | {
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
        >();
    });
});

describe('GraphqlOperations', () => {
    it('has proper types', () => {
        assertTypeOf<
            NonNullable<
                ArrayElement<
                    NonNullable<
                        Exclude<
                            Required<GraphqlOperations<Resolvers, 'Mutation'>>['Users'],
                            any[]
                        >['args']['create']
                    >['data']
                >['settings']
            >
        >().toEqualTypeOf<
            Readonly<{
                create?:
                    | Readonly<{
                          stats?:
                              | Readonly<{
                                    id?: string | null | undefined;
                                    createdAt?: string | Date | null | undefined;
                                    updatedAt?: string | Date | null | undefined;

                                    dislikes: number;
                                    likes: number;
                                    views: number;
                                }>
                              | null
                              | undefined;

                          id?: string | null | undefined;
                          createdAt?: string | Date | null | undefined;
                          updatedAt?: string | Date | null | undefined;

                          canViewReports?: boolean | null | undefined;
                          receivesMarketingEmails?: boolean | null | undefined;
                      }>
                    | null
                    | undefined;
                connect?:
                    | Readonly<{
                          AND?: ReadonlyArray<UserSettings_WhereInput> | undefined | null;
                          OR?: ReadonlyArray<UserSettings_WhereInput> | undefined | null;
                          NOT?: ReadonlyArray<UserSettings_WhereInput> | undefined | null;
                          canViewReports?: BooleanFilterInput | undefined | null;
                          receivesMarketingEmails?: BooleanFilterInput | undefined | null;
                          createdAt?: DateTimeFilterInput | null | undefined;
                          updatedAt?: DateTimeFilterInput | null | undefined;
                          id?: string | null | undefined;
                          stats?: UserStats_WhereInput | null | undefined;
                          user?: User_WhereInput | null | undefined;
                      }>
                    | null
                    | undefined;
                connectOrCreate?:
                    | Readonly<{
                          connect: UserSettings_WhereUnfilteredUniqueInput;
                          create: Readonly<{
                              id?: string | null | undefined;
                              createdAt?: string | Date | null | undefined;
                              updatedAt?: string | Date | null | undefined;
                              receivesMarketingEmails?: boolean | null | undefined;
                              canViewReports?: boolean | null | undefined;
                              stats?:
                                  | Readonly<{
                                        id?: string | null | undefined;
                                        createdAt?: string | Date | null | undefined;
                                        updatedAt?: string | Date | null | undefined;
                                        likes: number | null | undefined;
                                        dislikes: number | null | undefined;
                                        views: number | null | undefined;
                                    }>
                                  | null
                                  | undefined;
                          }>;
                      }>
                    | null
                    | undefined;
            }>
        >();
        assertTypeOf<
            Pick<
                NonNullable<
                    NonNullable<
                        ArrayElement<
                            NonNullable<
                                Exclude<
                                    Required<GraphqlOperations<Resolvers, 'Mutation'>>['Users'],
                                    any[]
                                >['args']['create']
                            >['data']
                        >['settings']
                    >['connectOrCreate']
                >,
                'connect'
            >
        >().toEqualTypeOf<
            Readonly<{
                connect: UserSettings_WhereUnfilteredUniqueInput;
            }>
        >();
    });
});

describe('ResolverOutputWithSelection', () => {
    it('resolves to nothing with no operations', () => {
        assertTypeOf<ResolverOutputWithSelection<Resolvers, 'Query', {}>>().toEqualTypeOf<{}>();
    });
    it('works with a single operation', () => {
        assertTypeOf<
            ResolverOutputWithSelection<
                Resolvers,
                'Query',
                {
                    Users: {
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
                    };
                }
            >
        >().toEqualTypeOf<
            Readonly<{
                Users: Readonly<{
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
                }>;
            }>
        >();
    });
    it('works with an alias', () => {
        assertTypeOf<
            ResolverOutputWithSelection<
                Resolvers,
                'Query',
                {
                    Users: {
                        alias: 'aliasKey';
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
                    };
                }
            >
        >().toEqualTypeOf<
            Readonly<{
                aliasKey: Readonly<{
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
                }>;
            }>
        >();
    });
    it('works with an array of operations', () => {
        assertTypeOf<
            ResolverOutputWithSelection<
                Resolvers,
                'Query',
                {
                    Users: [
                        {
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
                        },
                    ];
                }
            >
        >().toEqualTypeOf<
            Readonly<{
                Users: Readonly<{
                    items: ReadonlyArray<
                        Readonly<{
                            firstName: string;
                            settings: Readonly<{
                                receiveMarketingEmails: boolean;
                                stats: {dislikes: number};
                            }>;
                        }>
                    >;
                }>;
            }>
        >();
    });
    it('works with multiple resolver calls', () => {
        assertTypeOf<
            ResolverOutputWithSelection<
                Resolvers,
                'Query',
                {
                    Users: [
                        {
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
                        },
                        {
                            alias: 'secondCall';
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
                        },
                    ];
                }
            >
        >().toEqualTypeOf<
            Readonly<{
                Users: Readonly<{
                    items: ReadonlyArray<
                        Readonly<{
                            firstName: string;
                            settings: Readonly<{
                                receiveMarketingEmails: boolean;
                                stats: {dislikes: number};
                            }>;
                        }>
                    >;
                }>;
                secondCall: Readonly<{
                    items: ReadonlyArray<
                        Readonly<{
                            firstName: string;
                            settings: Readonly<{
                                receiveMarketingEmails: boolean;
                                stats: {dislikes: number};
                            }>;
                        }>
                    >;
                }>;
            }>
        >();
    });
});

describe('OperationWithKey', () => {
    it('uses the resolver name as key', () => {
        assertTypeOf<
            OperationWithKey<
                Resolvers,
                'Query',
                'Users',
                {
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
                },
                undefined
            >
        >().toEqualTypeOf<{
            outputKey: 'Users';
            resolverName: 'Users';
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
        }>();
    });
    it('uses the alias as key', () => {
        assertTypeOf<
            OperationWithKey<
                Resolvers,
                'Query',
                'Users',
                {
                    alias: 'differentName';
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
                },
                'differentName'
            >
        >().toEqualTypeOf<{
            outputKey: 'differentName';
            resolverName: 'Users';
            alias: 'differentName';
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
        }>();
    });
    it('ignores an empty string alias', () => {
        assertTypeOf<
            OperationWithKey<
                Resolvers,
                'Query',
                'Users',
                {
                    alias: '';
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
                },
                ''
            >
        >().toEqualTypeOf<{
            outputKey: 'Users';
            resolverName: 'Users';
            alias: '';
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
        }>();
    });
});
