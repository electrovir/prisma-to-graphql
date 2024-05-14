import type { UtcIsoString } from 'date-vir';
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<T extends {
    [key: string]: unknown;
}, K extends keyof T> = {
    [_ in K]?: never;
};
export type Incremental<T> = T | {
    [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
    [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: {
        input: string;
        output: string;
    };
    String: {
        input: string;
        output: string;
    };
    Boolean: {
        input: boolean;
        output: boolean;
    };
    Int: {
        input: number;
        output: number;
    };
    Float: {
        input: number;
        output: number;
    };
    DateTime: {
        input: string | Date;
        output: UtcIsoString;
    };
};
export type Mutation = {
    readonly Users: User_QueryOutput;
    readonly UserSettings: UserSettings_QueryOutput;
};
export type Mutation_UsersArgs = {
    create?: InputMaybe<User_CreateInput>;
    update?: InputMaybe<User_UpdateInput>;
    upsert?: InputMaybe<User_UpsertInput>;
};
export type Mutation_UserSettingsArgs = {
    create?: InputMaybe<UserSettings_CreateInput>;
    update?: InputMaybe<UserSettings_UpdateInput>;
    upsert?: InputMaybe<UserSettings_UpsertInput>;
};
export type Query = {
    readonly Users: User_QueryOutput;
    readonly UserSettings: UserSettings_QueryOutput;
};
export type Query_UsersArgs = {
    where: User_WhereInput;
    orderBy?: InputMaybe<ReadonlyArray<User_OrderByInput>>;
    cursor?: InputMaybe<User_WhereUnfilteredUniqueInput>;
    distinct?: InputMaybe<ReadonlyArray<User_DistinctInput>>;
    take?: InputMaybe<Scalars['Int']['input']>;
    skip?: InputMaybe<Scalars['Int']['input']>;
};
export type Query_UserSettingsArgs = {
    where: UserSettings_WhereInput;
    orderBy?: InputMaybe<ReadonlyArray<UserSettings_OrderByInput>>;
    cursor?: InputMaybe<UserSettings_WhereUnfilteredUniqueInput>;
    distinct?: InputMaybe<ReadonlyArray<UserSettings_DistinctInput>>;
    take?: InputMaybe<Scalars['Int']['input']>;
    skip?: InputMaybe<Scalars['Int']['input']>;
};
export declare enum SortOrder {
    asc = "asc",
    desc = "desc"
}
export declare enum NullsOrder {
    first = "first",
    last = "last"
}
export declare enum User_DistinctInput {
    id = "id",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    email = "email",
    password = "password",
    firstName = "firstName",
    lastName = "lastName",
    role = "role",
    phoneNumber = "phoneNumber"
}
export declare enum UserSettings_DistinctInput {
    id = "id",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}
export type _AllModels = {
    readonly User?: Maybe<User>;
    readonly UserSettings?: Maybe<UserSettings>;
};
export type User = {
    readonly id: Scalars['String']['output'];
    readonly createdAt: Scalars['DateTime']['output'];
    readonly updatedAt: Scalars['DateTime']['output'];
    readonly email: Scalars['String']['output'];
    readonly password: Scalars['String']['output'];
    readonly firstName?: Maybe<Scalars['String']['output']>;
    readonly lastName?: Maybe<Scalars['String']['output']>;
    readonly role?: Maybe<Scalars['String']['output']>;
    readonly phoneNumber?: Maybe<Scalars['String']['output']>;
    readonly settings?: Maybe<UserSettings>;
};
export type SortOrderWithNulls = {
    readonly sort: SortOrder | `${SortOrder}`;
    readonly nulls?: InputMaybe<NullsOrder | `${NullsOrder}`>;
};
export type User_QueryOutput = {
    readonly total: Scalars['Int']['output'];
    readonly items: ReadonlyArray<User>;
};
export type User_WhereInput = {
    readonly AND?: InputMaybe<ReadonlyArray<User_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<User_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<User_WhereInput>>;
    readonly id?: InputMaybe<StringFilterInput>;
    readonly createdAt?: InputMaybe<DateTimeFilterInput>;
    readonly updatedAt?: InputMaybe<DateTimeFilterInput>;
    readonly email?: InputMaybe<StringFilterInput>;
    readonly password?: InputMaybe<StringFilterInput>;
    readonly firstName?: InputMaybe<StringFilterInput>;
    readonly lastName?: InputMaybe<StringFilterInput>;
    readonly role?: InputMaybe<StringFilterInput>;
    readonly phoneNumber?: InputMaybe<StringFilterInput>;
    readonly settings?: InputMaybe<UserSettings_WhereInput>;
};
export type User_OrderByInput = {
    readonly id?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly createdAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly updatedAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly email?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly password?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly firstName?: InputMaybe<SortOrderWithNulls>;
    readonly lastName?: InputMaybe<SortOrderWithNulls>;
    readonly role?: InputMaybe<SortOrderWithNulls>;
    readonly phoneNumber?: InputMaybe<SortOrderWithNulls>;
    readonly settings?: InputMaybe<UserSettings_OrderByInput>;
};
export type User_WhereUnfilteredUniqueInput = {
    readonly AND?: InputMaybe<ReadonlyArray<User_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<User_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<User_WhereInput>>;
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<DateTimeFilterInput>;
    readonly updatedAt?: InputMaybe<DateTimeFilterInput>;
    readonly email?: InputMaybe<StringFilterInput>;
    readonly password?: InputMaybe<StringFilterInput>;
    readonly firstName?: InputMaybe<StringFilterInput>;
    readonly lastName?: InputMaybe<StringFilterInput>;
    readonly role?: InputMaybe<StringFilterInput>;
    readonly phoneNumber?: InputMaybe<StringFilterInput>;
    readonly settings?: InputMaybe<UserSettings_WhereInput>;
};
export type StringFilterInput = {
    readonly equals?: InputMaybe<Scalars['String']['input']>;
    readonly in?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
    readonly notIn?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
    readonly lt?: InputMaybe<Scalars['String']['input']>;
    readonly lte?: InputMaybe<Scalars['String']['input']>;
    readonly gt?: InputMaybe<Scalars['String']['input']>;
    readonly gte?: InputMaybe<Scalars['String']['input']>;
    readonly not?: InputMaybe<StringFilterInput>;
    readonly contains?: InputMaybe<Scalars['String']['input']>;
    readonly startsWith?: InputMaybe<Scalars['String']['input']>;
    readonly endsWith?: InputMaybe<Scalars['String']['input']>;
};
export type DateTimeFilterInput = {
    readonly equals?: InputMaybe<Scalars['DateTime']['input']>;
    readonly in?: InputMaybe<ReadonlyArray<Scalars['DateTime']['input']>>;
    readonly notIn?: InputMaybe<ReadonlyArray<Scalars['DateTime']['input']>>;
    readonly lt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly lte?: InputMaybe<Scalars['DateTime']['input']>;
    readonly gt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly gte?: InputMaybe<Scalars['DateTime']['input']>;
    readonly not?: InputMaybe<DateTimeFilterInput>;
};
export type User_CreateInput = {
    readonly data: ReadonlyArray<User_CreateDataInput>;
};
export type User_UpdateInput = {
    readonly data: User_UpdateDataInput;
    readonly where: User_WhereUnfilteredUniqueInput;
};
export type User_UpsertInput = {
    readonly data: User_UpdateDataInput;
    readonly where: User_WhereRequiredProvidedUniqueInput;
};
export type User_WhereRequiredProvidedUniqueInput = {
    readonly id: Scalars['String']['input'];
    readonly createdAt?: InputMaybe<DateTimeFilterInput>;
    readonly updatedAt?: InputMaybe<DateTimeFilterInput>;
    readonly email?: InputMaybe<StringFilterInput>;
    readonly password?: InputMaybe<StringFilterInput>;
    readonly firstName?: InputMaybe<StringFilterInput>;
    readonly lastName?: InputMaybe<StringFilterInput>;
    readonly role?: InputMaybe<StringFilterInput>;
    readonly phoneNumber?: InputMaybe<StringFilterInput>;
    readonly settings?: InputMaybe<UserSettings_WhereInput>;
};
export type User_CreateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly email: Scalars['String']['input'];
    readonly password: Scalars['String']['input'];
    readonly firstName?: InputMaybe<Scalars['String']['input']>;
    readonly lastName?: InputMaybe<Scalars['String']['input']>;
    readonly role?: InputMaybe<Scalars['String']['input']>;
    readonly phoneNumber?: InputMaybe<Scalars['String']['input']>;
    readonly settings?: InputMaybe<UserSettings_Without_User_ConnectionInput>;
};
export type User_UpdateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly email?: InputMaybe<Scalars['String']['input']>;
    readonly password?: InputMaybe<Scalars['String']['input']>;
    readonly firstName?: InputMaybe<Scalars['String']['input']>;
    readonly lastName?: InputMaybe<Scalars['String']['input']>;
    readonly role?: InputMaybe<Scalars['String']['input']>;
    readonly phoneNumber?: InputMaybe<Scalars['String']['input']>;
    readonly settings?: InputMaybe<UserSettings_Without_User_ConnectionInput>;
};
export type User_Without_UserSettings_CreateOrConnectInput = {
    readonly connect: ReadonlyArray<InputMaybe<User_WhereUnfilteredUniqueInput>>;
    readonly create: ReadonlyArray<InputMaybe<User_Without_UserSettings_CreateInput>>;
};
export type User_Without_UserSettings_CreateInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly email: Scalars['String']['input'];
    readonly password: Scalars['String']['input'];
    readonly firstName?: InputMaybe<Scalars['String']['input']>;
    readonly lastName?: InputMaybe<Scalars['String']['input']>;
    readonly role?: InputMaybe<Scalars['String']['input']>;
    readonly phoneNumber?: InputMaybe<Scalars['String']['input']>;
};
export type User_Without_UserSettings_ConnectionManyInput = {
    readonly create?: InputMaybe<ReadonlyArray<InputMaybe<User_Without_UserSettings_CreateInput>>>;
    readonly connectOrCreate?: InputMaybe<User_Without_UserSettings_CreateOrConnectInput>;
    readonly connect?: InputMaybe<ReadonlyArray<InputMaybe<User_WhereUnfilteredUniqueInput>>>;
};
export type User_Without_UserSettings_ConnectionInput = {
    readonly create?: InputMaybe<User_Without_UserSettings_CreateInput>;
    readonly connectOrCreate?: InputMaybe<User_Without_UserSettings_CreateOrConnectInput>;
    readonly connect?: InputMaybe<User_WhereUnfilteredUniqueInput>;
};
export type UserSettings = {
    readonly id: Scalars['String']['output'];
    readonly createdAt: Scalars['DateTime']['output'];
    readonly updatedAt: Scalars['DateTime']['output'];
    readonly user: User;
};
export type UserSettings_QueryOutput = {
    readonly total: Scalars['Int']['output'];
    readonly items: ReadonlyArray<UserSettings>;
};
export type UserSettings_WhereInput = {
    readonly AND?: InputMaybe<ReadonlyArray<UserSettings_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<UserSettings_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<UserSettings_WhereInput>>;
    readonly id?: InputMaybe<StringFilterInput>;
    readonly createdAt?: InputMaybe<DateTimeFilterInput>;
    readonly updatedAt?: InputMaybe<DateTimeFilterInput>;
    readonly user?: InputMaybe<User_WhereInput>;
};
export type UserSettings_OrderByInput = {
    readonly id?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly createdAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly updatedAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly user?: InputMaybe<User_OrderByInput>;
};
export type UserSettings_WhereUnfilteredUniqueInput = {
    readonly AND?: InputMaybe<ReadonlyArray<UserSettings_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<UserSettings_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<UserSettings_WhereInput>>;
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<DateTimeFilterInput>;
    readonly updatedAt?: InputMaybe<DateTimeFilterInput>;
    readonly user?: InputMaybe<User_WhereInput>;
};
export type UserSettings_CreateInput = {
    readonly data: ReadonlyArray<UserSettings_CreateDataInput>;
};
export type UserSettings_UpdateInput = {
    readonly data: UserSettings_UpdateDataInput;
    readonly where: UserSettings_WhereUnfilteredUniqueInput;
};
export type UserSettings_UpsertInput = {
    readonly data: UserSettings_UpdateDataInput;
    readonly where: UserSettings_WhereRequiredProvidedUniqueInput;
};
export type UserSettings_WhereRequiredProvidedUniqueInput = {
    readonly id: Scalars['String']['input'];
    readonly createdAt?: InputMaybe<DateTimeFilterInput>;
    readonly updatedAt?: InputMaybe<DateTimeFilterInput>;
    readonly user?: InputMaybe<User_WhereInput>;
};
export type UserSettings_CreateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly user: User_Without_UserSettings_ConnectionInput;
};
export type UserSettings_UpdateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly user?: InputMaybe<User_Without_UserSettings_ConnectionInput>;
};
export type UserSettings_Without_User_CreateOrConnectInput = {
    readonly connect: ReadonlyArray<InputMaybe<UserSettings_WhereUnfilteredUniqueInput>>;
    readonly create: ReadonlyArray<InputMaybe<UserSettings_Without_User_CreateInput>>;
};
export type UserSettings_Without_User_CreateInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};
export type UserSettings_Without_User_ConnectionManyInput = {
    readonly create?: InputMaybe<ReadonlyArray<InputMaybe<UserSettings_Without_User_CreateInput>>>;
    readonly connectOrCreate?: InputMaybe<UserSettings_Without_User_CreateOrConnectInput>;
    readonly connect?: InputMaybe<ReadonlyArray<InputMaybe<UserSettings_WhereUnfilteredUniqueInput>>>;
};
export type UserSettings_Without_User_ConnectionInput = {
    readonly create?: InputMaybe<UserSettings_Without_User_CreateInput>;
    readonly connectOrCreate?: InputMaybe<UserSettings_Without_User_CreateOrConnectInput>;
    readonly connect?: InputMaybe<UserSettings_WhereUnfilteredUniqueInput>;
};
export type ResolverTypeWrapper<T> = Promise<T> | T;
export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;
export type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult;
export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;
export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<{
        [key in TKey]: TResult;
    }, TParent, TContext, TArgs>;
    resolve?: SubscriptionResolveFn<TResult, {
        [key in TKey]: TResult;
    }, TContext, TArgs>;
}
export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
    resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}
export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> = SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs> | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;
export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> = ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>) | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;
export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => Maybe<TTypes> | Promise<Maybe<TTypes>>;
export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;
export type NextResolverFn<T> = () => Promise<T>;
export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (next: NextResolverFn<TResult>, parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
    Mutation: ResolverTypeWrapper<{}>;
    Query: ResolverTypeWrapper<{}>;
    Int: ResolverTypeWrapper<Scalars['Int']['output']>;
    DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
    SortOrder: SortOrder;
    NullsOrder: NullsOrder;
    User_DistinctInput: User_DistinctInput;
    UserSettings_DistinctInput: UserSettings_DistinctInput;
    _AllModels: ResolverTypeWrapper<_AllModels>;
    User: ResolverTypeWrapper<User>;
    String: ResolverTypeWrapper<Scalars['String']['output']>;
    SortOrderWithNulls: SortOrderWithNulls;
    User_QueryOutput: ResolverTypeWrapper<User_QueryOutput>;
    User_WhereInput: User_WhereInput;
    User_OrderByInput: User_OrderByInput;
    User_WhereUnfilteredUniqueInput: User_WhereUnfilteredUniqueInput;
    StringFilterInput: StringFilterInput;
    DateTimeFilterInput: DateTimeFilterInput;
    User_CreateInput: User_CreateInput;
    User_UpdateInput: User_UpdateInput;
    User_UpsertInput: User_UpsertInput;
    User_WhereRequiredProvidedUniqueInput: User_WhereRequiredProvidedUniqueInput;
    User_CreateDataInput: User_CreateDataInput;
    User_UpdateDataInput: User_UpdateDataInput;
    User_Without_UserSettings_CreateOrConnectInput: User_Without_UserSettings_CreateOrConnectInput;
    User_Without_UserSettings_CreateInput: User_Without_UserSettings_CreateInput;
    User_Without_UserSettings_ConnectionManyInput: User_Without_UserSettings_ConnectionManyInput;
    User_Without_UserSettings_ConnectionInput: User_Without_UserSettings_ConnectionInput;
    UserSettings: ResolverTypeWrapper<UserSettings>;
    UserSettings_QueryOutput: ResolverTypeWrapper<UserSettings_QueryOutput>;
    UserSettings_WhereInput: UserSettings_WhereInput;
    UserSettings_OrderByInput: UserSettings_OrderByInput;
    UserSettings_WhereUnfilteredUniqueInput: UserSettings_WhereUnfilteredUniqueInput;
    UserSettings_CreateInput: UserSettings_CreateInput;
    UserSettings_UpdateInput: UserSettings_UpdateInput;
    UserSettings_UpsertInput: UserSettings_UpsertInput;
    UserSettings_WhereRequiredProvidedUniqueInput: UserSettings_WhereRequiredProvidedUniqueInput;
    UserSettings_CreateDataInput: UserSettings_CreateDataInput;
    UserSettings_UpdateDataInput: UserSettings_UpdateDataInput;
    UserSettings_Without_User_CreateOrConnectInput: UserSettings_Without_User_CreateOrConnectInput;
    UserSettings_Without_User_CreateInput: UserSettings_Without_User_CreateInput;
    UserSettings_Without_User_ConnectionManyInput: UserSettings_Without_User_ConnectionManyInput;
    UserSettings_Without_User_ConnectionInput: UserSettings_Without_User_ConnectionInput;
    Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
};
/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
    Mutation: {};
    Query: {};
    Int: Scalars['Int']['output'];
    DateTime: Scalars['DateTime']['output'];
    _AllModels: _AllModels;
    User: User;
    String: Scalars['String']['output'];
    SortOrderWithNulls: SortOrderWithNulls;
    User_QueryOutput: User_QueryOutput;
    User_WhereInput: User_WhereInput;
    User_OrderByInput: User_OrderByInput;
    User_WhereUnfilteredUniqueInput: User_WhereUnfilteredUniqueInput;
    StringFilterInput: StringFilterInput;
    DateTimeFilterInput: DateTimeFilterInput;
    User_CreateInput: User_CreateInput;
    User_UpdateInput: User_UpdateInput;
    User_UpsertInput: User_UpsertInput;
    User_WhereRequiredProvidedUniqueInput: User_WhereRequiredProvidedUniqueInput;
    User_CreateDataInput: User_CreateDataInput;
    User_UpdateDataInput: User_UpdateDataInput;
    User_Without_UserSettings_CreateOrConnectInput: User_Without_UserSettings_CreateOrConnectInput;
    User_Without_UserSettings_CreateInput: User_Without_UserSettings_CreateInput;
    User_Without_UserSettings_ConnectionManyInput: User_Without_UserSettings_ConnectionManyInput;
    User_Without_UserSettings_ConnectionInput: User_Without_UserSettings_ConnectionInput;
    UserSettings: UserSettings;
    UserSettings_QueryOutput: UserSettings_QueryOutput;
    UserSettings_WhereInput: UserSettings_WhereInput;
    UserSettings_OrderByInput: UserSettings_OrderByInput;
    UserSettings_WhereUnfilteredUniqueInput: UserSettings_WhereUnfilteredUniqueInput;
    UserSettings_CreateInput: UserSettings_CreateInput;
    UserSettings_UpdateInput: UserSettings_UpdateInput;
    UserSettings_UpsertInput: UserSettings_UpsertInput;
    UserSettings_WhereRequiredProvidedUniqueInput: UserSettings_WhereRequiredProvidedUniqueInput;
    UserSettings_CreateDataInput: UserSettings_CreateDataInput;
    UserSettings_UpdateDataInput: UserSettings_UpdateDataInput;
    UserSettings_Without_User_CreateOrConnectInput: UserSettings_Without_User_CreateOrConnectInput;
    UserSettings_Without_User_CreateInput: UserSettings_Without_User_CreateInput;
    UserSettings_Without_User_ConnectionManyInput: UserSettings_Without_User_ConnectionManyInput;
    UserSettings_Without_User_ConnectionInput: UserSettings_Without_User_ConnectionInput;
    Boolean: Scalars['Boolean']['output'];
};
export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
    Users?: Resolver<ResolversTypes['User_QueryOutput'], ParentType, ContextType, Partial<Mutation_UsersArgs>>;
    UserSettings?: Resolver<ResolversTypes['UserSettings_QueryOutput'], ParentType, ContextType, Partial<Mutation_UserSettingsArgs>>;
};
export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
    Users?: Resolver<ResolversTypes['User_QueryOutput'], ParentType, ContextType, RequireFields<Query_UsersArgs, 'where'>>;
    UserSettings?: Resolver<ResolversTypes['UserSettings_QueryOutput'], ParentType, ContextType, RequireFields<Query_UserSettingsArgs, 'where'>>;
};
export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
    name: 'DateTime';
}
export type _AllModelsResolvers<ContextType = any, ParentType extends ResolversParentTypes['_AllModels'] = ResolversParentTypes['_AllModels']> = {
    User?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
    UserSettings?: Resolver<Maybe<ResolversTypes['UserSettings']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
    id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    settings?: Resolver<Maybe<ResolversTypes['UserSettings']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type User_QueryOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['User_QueryOutput'] = ResolversParentTypes['User_QueryOutput']> = {
    total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    items?: Resolver<ReadonlyArray<ResolversTypes['User']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type UserSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSettings'] = ResolversParentTypes['UserSettings']> = {
    id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type UserSettings_QueryOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSettings_QueryOutput'] = ResolversParentTypes['UserSettings_QueryOutput']> = {
    total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    items?: Resolver<ReadonlyArray<ResolversTypes['UserSettings']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type Resolvers<ContextType = any> = {
    Mutation?: MutationResolvers<ContextType>;
    Query?: QueryResolvers<ContextType>;
    DateTime?: GraphQLScalarType;
    _AllModels?: _AllModelsResolvers<ContextType>;
    User?: UserResolvers<ContextType>;
    User_QueryOutput?: User_QueryOutputResolvers<ContextType>;
    UserSettings?: UserSettingsResolvers<ContextType>;
    UserSettings_QueryOutput?: UserSettings_QueryOutputResolvers<ContextType>;
};
import type { SchemaOperationParams } from '@prisma-to-graphql/graphql-codegen-operation-params';
export declare const operationParams: Readonly<SchemaOperationParams>;
