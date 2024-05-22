import {ArrayElement} from '@augment-vir/common';
import {assertTypeOf} from 'run-time-assertions';
import {
    InputMaybe,
    Resolvers,
    UserSettings_WhereUnfilteredUniqueInput,
    UserSettings_Without_User_CreateInput,
    UserSettings_Without_User_CreateOrConnectInput,
} from '../../my-generated-schema-outputs';
import {
    BaseGraphqlOperations,
    FlattenedOperations,
    GraphqlOperation,
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
    it('allows missing args if none are required', () => {
        assertTypeOf({
            select: {
                total: true,
            },
        }).toMatchTypeOf<GraphqlOperation<Resolvers, 'Query', 'Users'>>();
    });

    it('has proper types', () => {
        assertTypeOf<
            NonNullable<
                ArrayElement<
                    NonNullable<
                        NonNullable<
                            Exclude<
                                Required<GraphqlOperations<Resolvers, 'Mutation'>>['Users'],
                                any[]
                            >['args']
                        >['create']
                    >['data']
                >['settings']
            >
        >().toEqualTypeOf<
            Readonly<{
                create?: UserSettings_Without_User_CreateInput | null | undefined;
                connect?: UserSettings_WhereUnfilteredUniqueInput | null | undefined;
                connectOrCreate?: UserSettings_Without_User_CreateOrConnectInput | null | undefined;
            }>
        >();

        assertTypeOf<
            Pick<
                NonNullable<
                    NonNullable<
                        ArrayElement<
                            NonNullable<
                                NonNullable<
                                    Exclude<
                                        Required<GraphqlOperations<Resolvers, 'Mutation'>>['Users'],
                                        any[]
                                    >['args']
                                >['create']
                            >['data']
                        >['settings']
                    >['connectOrCreate']
                >,
                'connect'
            >
        >().toEqualTypeOf<
            Readonly<{
                connect: ReadonlyArray<InputMaybe<UserSettings_WhereUnfilteredUniqueInput>>;
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
