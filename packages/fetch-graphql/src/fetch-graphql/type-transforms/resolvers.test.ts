/* eslint-disable @typescript-eslint/no-empty-object-type */
import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import type {OperationType} from '@prisma-to-graphql/core';
import {Resolvers} from '../../example-outputs.mock.js';
import {
    AvailableOperationTypes,
    AvailableResolverNames,
    BaseResolver,
    ResolverInputs,
} from './resolvers.js';

describe('ResolverInputs', () => {
    it('extracts resolver input types', () => {
        assert.tsType<ResolverInputs<{}, never, never>>().equals<never>();
        assert
            .tsType<
                ResolverInputs<
                    {
                        [OperationType.Query]: {
                            Users: (
                                parent: any,
                                args: {
                                    helloThere: string;
                                },
                                context: any,
                                info: any,
                            ) => string;
                        };
                    },
                    OperationType.Query,
                    'Users'
                >
            >()
            .equals<{
                helloThere: string;
            }>();

        assert
            .tsType<
                ResolverInputs<
                    {
                        [OperationType.Query]: {
                            NoArgs: (parent: any, args: {}, context: any, info: any) => string;
                        };
                    },
                    OperationType.Query,
                    'NoArgs'
                >
            >()
            .equals<never>();
    });
});

describe('AvailableResolverNames', () => {
    it('has correct types', () => {
        assert
            .tsType<AvailableResolverNames<Resolvers, OperationType.Mutation>>()
            .equals<'Users' | 'UserSettings' | 'UserStats' | 'Regions' | 'UserPosts'>();
        assert
            .tsType<AvailableResolverNames<Resolvers, OperationType.Query>>()
            .equals<'Users' | 'UserSettings' | 'UserStats' | 'Regions' | 'UserPosts'>();
    });

    it('extracts resolver names', () => {
        assert.tsType<AvailableResolverNames<{}, never>>().equals<never>();
        assert
            .tsType<AvailableResolverNames<{[OperationType.Query]: {}}, OperationType.Query>>()
            .equals<never>();
        assert
            .tsType<
                AvailableResolverNames<
                    {[OperationType.Query]: {Users: BaseResolver}},
                    OperationType.Query
                >
            >()
            .equals<'Users'>();
    });
});

describe('AvailableOperationTypes', () => {
    it('extracts operation types', () => {
        assert.tsType<AvailableOperationTypes<{}>>().equals<never>();
        assert
            .tsType<AvailableOperationTypes<{[OperationType.Query]: any}>>()
            .equals<OperationType.Query>();
        assert
            .tsType<
                AvailableOperationTypes<{[OperationType.Query]: any; [OperationType.Mutation]: any}>
            >()
            .equals<OperationType.Query | OperationType.Mutation>();
    });
});
