// generated by prisma-to-graphql

import type { UtcIsoString } from 'date-vir';
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string | Date; output: UtcIsoString; }
};

export type Mutation = {
  readonly Users: User_Output;
  readonly UserSettings: UserSettings_Output;
};


export type Mutation_UsersArgs = {
  create?: InputMaybe<User_CreateInput>;
  update?: InputMaybe<User_UpdateInput>;
  upsert?: InputMaybe<User_UpsertInput>;
  delete?: InputMaybe<User_DeleteInput>;
};


export type Mutation_UserSettingsArgs = {
  create?: InputMaybe<UserSettings_CreateInput>;
  update?: InputMaybe<UserSettings_UpdateInput>;
  upsert?: InputMaybe<UserSettings_UpsertInput>;
  delete?: InputMaybe<UserSettings_DeleteInput>;
};

export type Query = {
  readonly Users: User_Output;
  readonly UserSettings: UserSettings_Output;
};


export type Query_UsersArgs = {
  where?: InputMaybe<User_WhereInput>;
  orderBy?: InputMaybe<ReadonlyArray<User_OrderByInput>>;
  cursor?: InputMaybe<User_WhereUnfilteredUniqueInput>;
  distinct?: InputMaybe<ReadonlyArray<User_DistinctInput>>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type Query_UserSettingsArgs = {
  where?: InputMaybe<UserSettings_WhereInput>;
  orderBy?: InputMaybe<ReadonlyArray<UserSettings_OrderByInput>>;
  cursor?: InputMaybe<UserSettings_WhereUnfilteredUniqueInput>;
  distinct?: InputMaybe<ReadonlyArray<UserSettings_DistinctInput>>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export enum SortOrder {
  asc = 'asc',
  desc = 'desc'
}

export enum NullsOrder {
  first = 'first',
  last = 'last'
}

export enum User_DistinctInput {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  email = 'email',
  password = 'password',
  firstName = 'firstName',
  lastName = 'lastName',
  role = 'role',
  phoneNumber = 'phoneNumber'
}

export enum UserSettings_DistinctInput {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt'
}

export type _AllModels = {
  readonly User?: Maybe<User>;
  readonly UserSettings?: Maybe<UserSettings>;
};

export type User = {
  readonly id: Scalars['ID']['output'];
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

export type User_Output = {
  readonly total: Scalars['Int']['output'];
  readonly items: ReadonlyArray<User>;
  readonly messages: ReadonlyArray<Maybe<OutputMessage>>;
};

export type OutputMessage = {
  readonly code: Scalars['String']['output'];
  readonly message: Scalars['String']['output'];
  readonly description: Scalars['String']['output'];
};

export type OrderByCount = {
  readonly _count?: InputMaybe<SortOrder | `${SortOrder}`>;
};

export type User_WhereInput = {
  readonly AND?: InputMaybe<ReadonlyArray<User_WhereInput>>;
  readonly OR?: InputMaybe<ReadonlyArray<User_WhereInput>>;
  readonly NOT?: InputMaybe<ReadonlyArray<User_WhereInput>>;
  readonly id?: InputMaybe<ID_WhereInput>;
  readonly createdAt?: InputMaybe<DateTime_WhereInput>;
  readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
  readonly email?: InputMaybe<String_WhereInput>;
  readonly password?: InputMaybe<String_WhereInput>;
  readonly firstName?: InputMaybe<String_WhereInput>;
  readonly lastName?: InputMaybe<String_WhereInput>;
  readonly role?: InputMaybe<String_WhereInput>;
  readonly phoneNumber?: InputMaybe<String_WhereInput>;
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
  readonly createdAt?: InputMaybe<DateTime_WhereInput>;
  readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
  readonly email?: InputMaybe<String_WhereInput>;
  readonly password?: InputMaybe<String_WhereInput>;
  readonly firstName?: InputMaybe<String_WhereInput>;
  readonly lastName?: InputMaybe<String_WhereInput>;
  readonly role?: InputMaybe<String_WhereInput>;
  readonly phoneNumber?: InputMaybe<String_WhereInput>;
  readonly settings?: InputMaybe<UserSettings_WhereInput>;
};

export type ID_WhereInput = {
  readonly equals?: InputMaybe<Scalars['ID']['input']>;
  readonly in?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly notIn?: InputMaybe<ReadonlyArray<Scalars['ID']['input']>>;
  readonly lt?: InputMaybe<Scalars['ID']['input']>;
  readonly lte?: InputMaybe<Scalars['ID']['input']>;
  readonly gt?: InputMaybe<Scalars['ID']['input']>;
  readonly gte?: InputMaybe<Scalars['ID']['input']>;
  readonly not?: InputMaybe<ID_WhereInput>;
  readonly contains?: InputMaybe<Scalars['ID']['input']>;
  readonly startsWith?: InputMaybe<Scalars['ID']['input']>;
  readonly endsWith?: InputMaybe<Scalars['ID']['input']>;
};

export type DateTime_WhereInput = {
  readonly equals?: InputMaybe<Scalars['DateTime']['input']>;
  readonly in?: InputMaybe<ReadonlyArray<Scalars['DateTime']['input']>>;
  readonly notIn?: InputMaybe<ReadonlyArray<Scalars['DateTime']['input']>>;
  readonly lt?: InputMaybe<Scalars['DateTime']['input']>;
  readonly lte?: InputMaybe<Scalars['DateTime']['input']>;
  readonly gt?: InputMaybe<Scalars['DateTime']['input']>;
  readonly gte?: InputMaybe<Scalars['DateTime']['input']>;
  readonly not?: InputMaybe<DateTime_WhereInput>;
};

export type String_WhereInput = {
  readonly equals?: InputMaybe<Scalars['String']['input']>;
  readonly in?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly notIn?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly lt?: InputMaybe<Scalars['String']['input']>;
  readonly lte?: InputMaybe<Scalars['String']['input']>;
  readonly gt?: InputMaybe<Scalars['String']['input']>;
  readonly gte?: InputMaybe<Scalars['String']['input']>;
  readonly not?: InputMaybe<String_WhereInput>;
  readonly contains?: InputMaybe<Scalars['String']['input']>;
  readonly startsWith?: InputMaybe<Scalars['String']['input']>;
  readonly endsWith?: InputMaybe<Scalars['String']['input']>;
};

export type User_WhereManyInput = {
  readonly every?: InputMaybe<User_WhereInput>;
  readonly none?: InputMaybe<User_WhereInput>;
  readonly some?: InputMaybe<User_WhereInput>;
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

export type User_DeleteInput = {
  readonly where: User_WhereInput;
};

export type User_WhereRequiredProvidedUniqueInput = {
  readonly id: Scalars['String']['input'];
  readonly createdAt?: InputMaybe<DateTime_WhereInput>;
  readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
  readonly email?: InputMaybe<String_WhereInput>;
  readonly password?: InputMaybe<String_WhereInput>;
  readonly firstName?: InputMaybe<String_WhereInput>;
  readonly lastName?: InputMaybe<String_WhereInput>;
  readonly role?: InputMaybe<String_WhereInput>;
  readonly phoneNumber?: InputMaybe<String_WhereInput>;
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
  readonly id: Scalars['ID']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
  readonly user: User;
};

export type UserSettings_Output = {
  readonly total: Scalars['Int']['output'];
  readonly items: ReadonlyArray<UserSettings>;
  readonly messages: ReadonlyArray<Maybe<OutputMessage>>;
};

export type UserSettings_WhereInput = {
  readonly AND?: InputMaybe<ReadonlyArray<UserSettings_WhereInput>>;
  readonly OR?: InputMaybe<ReadonlyArray<UserSettings_WhereInput>>;
  readonly NOT?: InputMaybe<ReadonlyArray<UserSettings_WhereInput>>;
  readonly id?: InputMaybe<ID_WhereInput>;
  readonly createdAt?: InputMaybe<DateTime_WhereInput>;
  readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
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
  readonly createdAt?: InputMaybe<DateTime_WhereInput>;
  readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
  readonly user?: InputMaybe<User_WhereInput>;
};

export type UserSettings_WhereManyInput = {
  readonly every?: InputMaybe<UserSettings_WhereInput>;
  readonly none?: InputMaybe<UserSettings_WhereInput>;
  readonly some?: InputMaybe<UserSettings_WhereInput>;
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

export type UserSettings_DeleteInput = {
  readonly where: UserSettings_WhereInput;
};

export type UserSettings_WhereRequiredProvidedUniqueInput = {
  readonly id: Scalars['String']['input'];
  readonly createdAt?: InputMaybe<DateTime_WhereInput>;
  readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
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

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



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
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SortOrderWithNulls: SortOrderWithNulls;
  User_Output: ResolverTypeWrapper<User_Output>;
  OutputMessage: ResolverTypeWrapper<OutputMessage>;
  OrderByCount: OrderByCount;
  User_WhereInput: User_WhereInput;
  User_OrderByInput: User_OrderByInput;
  User_WhereUnfilteredUniqueInput: User_WhereUnfilteredUniqueInput;
  ID_WhereInput: ID_WhereInput;
  DateTime_WhereInput: DateTime_WhereInput;
  String_WhereInput: String_WhereInput;
  User_WhereManyInput: User_WhereManyInput;
  User_CreateInput: User_CreateInput;
  User_UpdateInput: User_UpdateInput;
  User_UpsertInput: User_UpsertInput;
  User_DeleteInput: User_DeleteInput;
  User_WhereRequiredProvidedUniqueInput: User_WhereRequiredProvidedUniqueInput;
  User_CreateDataInput: User_CreateDataInput;
  User_UpdateDataInput: User_UpdateDataInput;
  User_Without_UserSettings_CreateOrConnectInput: User_Without_UserSettings_CreateOrConnectInput;
  User_Without_UserSettings_CreateInput: User_Without_UserSettings_CreateInput;
  User_Without_UserSettings_ConnectionManyInput: User_Without_UserSettings_ConnectionManyInput;
  User_Without_UserSettings_ConnectionInput: User_Without_UserSettings_ConnectionInput;
  UserSettings: ResolverTypeWrapper<UserSettings>;
  UserSettings_Output: ResolverTypeWrapper<UserSettings_Output>;
  UserSettings_WhereInput: UserSettings_WhereInput;
  UserSettings_OrderByInput: UserSettings_OrderByInput;
  UserSettings_WhereUnfilteredUniqueInput: UserSettings_WhereUnfilteredUniqueInput;
  UserSettings_WhereManyInput: UserSettings_WhereManyInput;
  UserSettings_CreateInput: UserSettings_CreateInput;
  UserSettings_UpdateInput: UserSettings_UpdateInput;
  UserSettings_UpsertInput: UserSettings_UpsertInput;
  UserSettings_DeleteInput: UserSettings_DeleteInput;
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
  ID: Scalars['ID']['output'];
  String: Scalars['String']['output'];
  SortOrderWithNulls: SortOrderWithNulls;
  User_Output: User_Output;
  OutputMessage: OutputMessage;
  OrderByCount: OrderByCount;
  User_WhereInput: User_WhereInput;
  User_OrderByInput: User_OrderByInput;
  User_WhereUnfilteredUniqueInput: User_WhereUnfilteredUniqueInput;
  ID_WhereInput: ID_WhereInput;
  DateTime_WhereInput: DateTime_WhereInput;
  String_WhereInput: String_WhereInput;
  User_WhereManyInput: User_WhereManyInput;
  User_CreateInput: User_CreateInput;
  User_UpdateInput: User_UpdateInput;
  User_UpsertInput: User_UpsertInput;
  User_DeleteInput: User_DeleteInput;
  User_WhereRequiredProvidedUniqueInput: User_WhereRequiredProvidedUniqueInput;
  User_CreateDataInput: User_CreateDataInput;
  User_UpdateDataInput: User_UpdateDataInput;
  User_Without_UserSettings_CreateOrConnectInput: User_Without_UserSettings_CreateOrConnectInput;
  User_Without_UserSettings_CreateInput: User_Without_UserSettings_CreateInput;
  User_Without_UserSettings_ConnectionManyInput: User_Without_UserSettings_ConnectionManyInput;
  User_Without_UserSettings_ConnectionInput: User_Without_UserSettings_ConnectionInput;
  UserSettings: UserSettings;
  UserSettings_Output: UserSettings_Output;
  UserSettings_WhereInput: UserSettings_WhereInput;
  UserSettings_OrderByInput: UserSettings_OrderByInput;
  UserSettings_WhereUnfilteredUniqueInput: UserSettings_WhereUnfilteredUniqueInput;
  UserSettings_WhereManyInput: UserSettings_WhereManyInput;
  UserSettings_CreateInput: UserSettings_CreateInput;
  UserSettings_UpdateInput: UserSettings_UpdateInput;
  UserSettings_UpsertInput: UserSettings_UpsertInput;
  UserSettings_DeleteInput: UserSettings_DeleteInput;
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
  Users?: Resolver<ResolversTypes['User_Output'], ParentType, ContextType, Partial<Mutation_UsersArgs>>;
  UserSettings?: Resolver<ResolversTypes['UserSettings_Output'], ParentType, ContextType, Partial<Mutation_UserSettingsArgs>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  Users?: Resolver<ResolversTypes['User_Output'], ParentType, ContextType, Partial<Query_UsersArgs>>;
  UserSettings?: Resolver<ResolversTypes['UserSettings_Output'], ParentType, ContextType, Partial<Query_UserSettingsArgs>>;
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
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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

export type User_OutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['User_Output'] = ResolversParentTypes['User_Output']> = {
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<ReadonlyArray<ResolversTypes['User']>, ParentType, ContextType>;
  messages?: Resolver<ReadonlyArray<Maybe<ResolversTypes['OutputMessage']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OutputMessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['OutputMessage'] = ResolversParentTypes['OutputMessage']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSettings'] = ResolversParentTypes['UserSettings']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSettings_OutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSettings_Output'] = ResolversParentTypes['UserSettings_Output']> = {
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<ReadonlyArray<ResolversTypes['UserSettings']>, ParentType, ContextType>;
  messages?: Resolver<ReadonlyArray<Maybe<ResolversTypes['OutputMessage']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  _AllModels?: _AllModelsResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  User_Output?: User_OutputResolvers<ContextType>;
  OutputMessage?: OutputMessageResolvers<ContextType>;
  UserSettings?: UserSettingsResolvers<ContextType>;
  UserSettings_Output?: UserSettings_OutputResolvers<ContextType>;
};


import {type SchemaOperationTypeNames} from 'prisma-to-graphql';

export const schemaOperationTypeNames: Readonly<SchemaOperationTypeNames> = {
    Mutation: {
        Users: {
            args: {
                create: 'User_CreateInput',
                update: 'User_UpdateInput',
                upsert: 'User_UpsertInput',
                delete: 'User_DeleteInput',
            },
            output: 'User_Output!',
        },
        UserSettings: {
            args: {
                create: 'UserSettings_CreateInput',
                update: 'UserSettings_UpdateInput',
                upsert: 'UserSettings_UpsertInput',
                delete: 'UserSettings_DeleteInput',
            },
            output: 'UserSettings_Output!',
        },
    },
    Query: {
        Users: {
            args: {
                where: 'User_WhereInput',
                orderBy: '[User_OrderByInput!]',
                cursor: 'User_WhereUnfilteredUniqueInput',
                distinct: '[User_DistinctInput!]',
                take: 'Int',
            },
            output: 'User_Output!',
        },
        UserSettings: {
            args: {
                where: 'UserSettings_WhereInput',
                orderBy: '[UserSettings_OrderByInput!]',
                cursor: 'UserSettings_WhereUnfilteredUniqueInput',
                distinct: '[UserSettings_DistinctInput!]',
                take: 'Int',
            },
            output: 'UserSettings_Output!',
        },
    },
};
