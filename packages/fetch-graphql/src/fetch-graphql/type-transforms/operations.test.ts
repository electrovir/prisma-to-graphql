/* eslint-disable @typescript-eslint/no-empty-object-type */
import {assert} from '@augment-vir/assert';
import {ArrayElement} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import type {OperationType} from '@prisma-to-graphql/core';
import {
    InputMaybe,
    Resolvers,
    UserSettings_WhereUnfilteredUniqueInput,
    UserSettings_Without_User_CreateInput,
    UserSettings_Without_User_CreateOrConnectInput,
} from '../../schema-output.mock.js';
import {
    BaseGraphqlOperations,
    FlattenedOperations,
    GraphqlOperation,
    GraphqlOperations,
    OperationWithKey,
    ResolverOutputWithSelection,
} from './operations.js';

describe('BaseGraphqlOperations', () => {
    it('can match an actual operations object', () => {
        assert
            .tsType<BaseGraphqlOperations>()
            .matches<GraphqlOperations<Resolvers, OperationType.Mutation>>();
    });
});

describe('FlattenedOperations', () => {
    it('flattens operations into a union', () => {
        assert
            .tsType<
                FlattenedOperations<
                    Resolvers,
                    OperationType.Query,
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
            >()
            .slowEquals<
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
        assert
            .tsType({
                select: {
                    total: true,
                },
            })
            .matches<GraphqlOperation<Resolvers, OperationType.Query, 'Users'>>();
    });

    it('has proper types', () => {
        assert
            .tsType<
                NonNullable<
                    ArrayElement<
                        NonNullable<
                            NonNullable<
                                Exclude<
                                    Required<
                                        GraphqlOperations<Resolvers, OperationType.Mutation>
                                    >['Users'],
                                    any[]
                                >['args']
                            >['create']
                        >['data']
                    >['settings']
                >
            >()
            .equals<
                Readonly<{
                    create?: UserSettings_Without_User_CreateInput | null | undefined;
                    connect?: UserSettings_WhereUnfilteredUniqueInput | null | undefined;
                    connectOrCreate?:
                        | UserSettings_Without_User_CreateOrConnectInput
                        | null
                        | undefined;
                }>
            >();

        assert
            .tsType<
                Pick<
                    NonNullable<
                        NonNullable<
                            ArrayElement<
                                NonNullable<
                                    NonNullable<
                                        Exclude<
                                            Required<
                                                GraphqlOperations<Resolvers, OperationType.Mutation>
                                            >['Users'],
                                            any[]
                                        >['args']
                                    >['create']
                                >['data']
                            >['settings']
                        >['connectOrCreate']
                    >,
                    'connect'
                >
            >()
            .equals<
                Readonly<{
                    connect: ReadonlyArray<InputMaybe<UserSettings_WhereUnfilteredUniqueInput>>;
                }>
            >();
    });
});

describe('ResolverOutputWithSelection', () => {
    it('resolves to nothing with no operations', () => {
        assert
            .tsType<ResolverOutputWithSelection<Resolvers, OperationType.Query, {}>>()
            .equals<{}>();
    });
    it('works with a single operation', () => {
        assert
            .tsType<
                ResolverOutputWithSelection<
                    Resolvers,
                    OperationType.Query,
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
            >()
            .equals<
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
        assert
            .tsType<
                ResolverOutputWithSelection<
                    Resolvers,
                    OperationType.Query,
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
            >()
            .equals<
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
        assert
            .tsType<
                ResolverOutputWithSelection<
                    Resolvers,
                    OperationType.Query,
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
            >()
            .equals<
                Readonly<{
                    Users: Readonly<{
                        items: ReadonlyArray<
                            Readonly<{
                                firstName: string | undefined | null;
                                settings:
                                    | Readonly<{
                                          receivesMarketingEmails: boolean;
                                          stats: Readonly<{dislikes: number}> | null | undefined;
                                      }>
                                    | null
                                    | undefined;
                            }>
                        >;
                    }>;
                }>
            >();
    });
    it('works with multiple resolver calls', () => {
        assert
            .tsType<
                ResolverOutputWithSelection<
                    Resolvers,
                    OperationType.Query,
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
            >()
            .equals<
                Readonly<{
                    Users: Readonly<{
                        items: ReadonlyArray<
                            Readonly<{
                                firstName: string | undefined | null;
                                settings:
                                    | Readonly<{
                                          receivesMarketingEmails: boolean;
                                          stats: Readonly<{dislikes: number}> | null | undefined;
                                      }>
                                    | null
                                    | undefined;
                            }>
                        >;
                    }>;
                    secondCall: Readonly<{
                        items: ReadonlyArray<
                            Readonly<{
                                firstName: string | undefined | null;
                                settings:
                                    | Readonly<{
                                          receivesMarketingEmails: boolean;
                                          stats: Readonly<{dislikes: number}> | null | undefined;
                                      }>
                                    | null
                                    | undefined;
                            }>
                        >;
                    }>;
                }>
            >();
    });
});

describe('OperationWithKey', () => {
    it('uses the resolver name as key', () => {
        assert
            .tsType<
                OperationWithKey<
                    Resolvers,
                    OperationType.Query,
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
            >()
            .equals<
                {
                    outputKey: 'Users';
                    resolverName: 'Users';
                } & {
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
    it('uses the alias as key', () => {
        assert
            .tsType<
                OperationWithKey<
                    Resolvers,
                    OperationType.Query,
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
            >()
            .equals<
                {
                    outputKey: 'differentName';
                    resolverName: 'Users';
                } & {
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
                }
            >();
    });
    it('ignores an empty string alias', () => {
        assert
            .tsType<
                OperationWithKey<
                    Resolvers,
                    OperationType.Query,
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
            >()
            .equals<
                {
                    outputKey: 'Users';
                    resolverName: 'Users';
                } & {
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
                }
            >();
    });
});
