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
    readonly Users: User_Output;
    readonly Companies: Company_Output;
};
export type Mutation_UsersArgs = {
    create?: InputMaybe<User_CreateInput>;
    update?: InputMaybe<User_UpdateInput>;
    upsert?: InputMaybe<User_UpsertInput>;
    delete?: InputMaybe<User_DeleteInput>;
};
export type Mutation_CompaniesArgs = {
    create?: InputMaybe<Company_CreateInput>;
    update?: InputMaybe<Company_UpdateInput>;
    upsert?: InputMaybe<Company_UpsertInput>;
    delete?: InputMaybe<Company_DeleteInput>;
};
export type Query = {
    readonly Users: User_Output;
    readonly Companies: Company_Output;
};
export type Query_UsersArgs = {
    where?: InputMaybe<User_WhereInput>;
    orderBy?: InputMaybe<ReadonlyArray<User_OrderByInput>>;
    cursor?: InputMaybe<User_WhereUnfilteredUniqueInput>;
    distinct?: InputMaybe<ReadonlyArray<User_DistinctInput>>;
    take?: InputMaybe<Scalars['Int']['input']>;
};
export type Query_CompaniesArgs = {
    where?: InputMaybe<Company_WhereInput>;
    orderBy?: InputMaybe<ReadonlyArray<Company_OrderByInput>>;
    cursor?: InputMaybe<Company_WhereUnfilteredUniqueInput>;
    distinct?: InputMaybe<ReadonlyArray<Company_DistinctInput>>;
    take?: InputMaybe<Scalars['Int']['input']>;
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
export declare enum Company_DistinctInput {
    id = "id",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    name = "name"
}
export type _AllModels = {
    readonly User?: Maybe<User>;
    readonly Company?: Maybe<Company>;
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
    readonly id?: InputMaybe<StringFilterInput>;
    readonly createdAt?: InputMaybe<DateTimeFilterInput>;
    readonly updatedAt?: InputMaybe<DateTimeFilterInput>;
    readonly email?: InputMaybe<StringFilterInput>;
    readonly password?: InputMaybe<StringFilterInput>;
    readonly firstName?: InputMaybe<StringFilterInput>;
    readonly lastName?: InputMaybe<StringFilterInput>;
    readonly role?: InputMaybe<StringFilterInput>;
    readonly phoneNumber?: InputMaybe<StringFilterInput>;
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
    readonly createdAt?: InputMaybe<DateTimeFilterInput>;
    readonly updatedAt?: InputMaybe<DateTimeFilterInput>;
    readonly email?: InputMaybe<StringFilterInput>;
    readonly password?: InputMaybe<StringFilterInput>;
    readonly firstName?: InputMaybe<StringFilterInput>;
    readonly lastName?: InputMaybe<StringFilterInput>;
    readonly role?: InputMaybe<StringFilterInput>;
    readonly phoneNumber?: InputMaybe<StringFilterInput>;
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
};
export type Company = {
    readonly id: Scalars['String']['output'];
    readonly createdAt: Scalars['DateTime']['output'];
    readonly updatedAt: Scalars['DateTime']['output'];
    readonly name: Scalars['String']['output'];
};
export type Company_Output = {
    readonly total: Scalars['Int']['output'];
    readonly items: ReadonlyArray<Company>;
    readonly messages: ReadonlyArray<Maybe<OutputMessage>>;
};
export type Company_WhereInput = {
    readonly AND?: InputMaybe<ReadonlyArray<Company_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<Company_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<Company_WhereInput>>;
    readonly id?: InputMaybe<StringFilterInput>;
    readonly createdAt?: InputMaybe<DateTimeFilterInput>;
    readonly updatedAt?: InputMaybe<DateTimeFilterInput>;
    readonly name?: InputMaybe<StringFilterInput>;
};
export type Company_OrderByInput = {
    readonly id?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly createdAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly updatedAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly name?: InputMaybe<SortOrder | `${SortOrder}`>;
};
export type Company_WhereUnfilteredUniqueInput = {
    readonly AND?: InputMaybe<ReadonlyArray<Company_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<Company_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<Company_WhereInput>>;
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<DateTimeFilterInput>;
    readonly updatedAt?: InputMaybe<DateTimeFilterInput>;
    readonly name?: InputMaybe<StringFilterInput>;
};
export type Company_WhereManyInput = {
    readonly every?: InputMaybe<Company_WhereInput>;
    readonly none?: InputMaybe<Company_WhereInput>;
    readonly some?: InputMaybe<Company_WhereInput>;
};
export type Company_CreateInput = {
    readonly data: ReadonlyArray<Company_CreateDataInput>;
};
export type Company_UpdateInput = {
    readonly data: Company_UpdateDataInput;
    readonly where: Company_WhereUnfilteredUniqueInput;
};
export type Company_UpsertInput = {
    readonly data: Company_UpdateDataInput;
    readonly where: Company_WhereRequiredProvidedUniqueInput;
};
export type Company_DeleteInput = {
    readonly where: Company_WhereInput;
};
export type Company_WhereRequiredProvidedUniqueInput = {
    readonly id: Scalars['String']['input'];
    readonly createdAt?: InputMaybe<DateTimeFilterInput>;
    readonly updatedAt?: InputMaybe<DateTimeFilterInput>;
    readonly name?: InputMaybe<StringFilterInput>;
};
export type Company_CreateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly name: Scalars['String']['input'];
};
export type Company_UpdateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly name?: InputMaybe<Scalars['String']['input']>;
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
    Company_DistinctInput: Company_DistinctInput;
    _AllModels: ResolverTypeWrapper<_AllModels>;
    User: ResolverTypeWrapper<User>;
    String: ResolverTypeWrapper<Scalars['String']['output']>;
    SortOrderWithNulls: SortOrderWithNulls;
    User_Output: ResolverTypeWrapper<User_Output>;
    OutputMessage: ResolverTypeWrapper<OutputMessage>;
    OrderByCount: OrderByCount;
    User_WhereInput: User_WhereInput;
    User_OrderByInput: User_OrderByInput;
    User_WhereUnfilteredUniqueInput: User_WhereUnfilteredUniqueInput;
    StringFilterInput: StringFilterInput;
    DateTimeFilterInput: DateTimeFilterInput;
    User_WhereManyInput: User_WhereManyInput;
    User_CreateInput: User_CreateInput;
    User_UpdateInput: User_UpdateInput;
    User_UpsertInput: User_UpsertInput;
    User_DeleteInput: User_DeleteInput;
    User_WhereRequiredProvidedUniqueInput: User_WhereRequiredProvidedUniqueInput;
    User_CreateDataInput: User_CreateDataInput;
    User_UpdateDataInput: User_UpdateDataInput;
    Company: ResolverTypeWrapper<Company>;
    Company_Output: ResolverTypeWrapper<Company_Output>;
    Company_WhereInput: Company_WhereInput;
    Company_OrderByInput: Company_OrderByInput;
    Company_WhereUnfilteredUniqueInput: Company_WhereUnfilteredUniqueInput;
    Company_WhereManyInput: Company_WhereManyInput;
    Company_CreateInput: Company_CreateInput;
    Company_UpdateInput: Company_UpdateInput;
    Company_UpsertInput: Company_UpsertInput;
    Company_DeleteInput: Company_DeleteInput;
    Company_WhereRequiredProvidedUniqueInput: Company_WhereRequiredProvidedUniqueInput;
    Company_CreateDataInput: Company_CreateDataInput;
    Company_UpdateDataInput: Company_UpdateDataInput;
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
    User_Output: User_Output;
    OutputMessage: OutputMessage;
    OrderByCount: OrderByCount;
    User_WhereInput: User_WhereInput;
    User_OrderByInput: User_OrderByInput;
    User_WhereUnfilteredUniqueInput: User_WhereUnfilteredUniqueInput;
    StringFilterInput: StringFilterInput;
    DateTimeFilterInput: DateTimeFilterInput;
    User_WhereManyInput: User_WhereManyInput;
    User_CreateInput: User_CreateInput;
    User_UpdateInput: User_UpdateInput;
    User_UpsertInput: User_UpsertInput;
    User_DeleteInput: User_DeleteInput;
    User_WhereRequiredProvidedUniqueInput: User_WhereRequiredProvidedUniqueInput;
    User_CreateDataInput: User_CreateDataInput;
    User_UpdateDataInput: User_UpdateDataInput;
    Company: Company;
    Company_Output: Company_Output;
    Company_WhereInput: Company_WhereInput;
    Company_OrderByInput: Company_OrderByInput;
    Company_WhereUnfilteredUniqueInput: Company_WhereUnfilteredUniqueInput;
    Company_WhereManyInput: Company_WhereManyInput;
    Company_CreateInput: Company_CreateInput;
    Company_UpdateInput: Company_UpdateInput;
    Company_UpsertInput: Company_UpsertInput;
    Company_DeleteInput: Company_DeleteInput;
    Company_WhereRequiredProvidedUniqueInput: Company_WhereRequiredProvidedUniqueInput;
    Company_CreateDataInput: Company_CreateDataInput;
    Company_UpdateDataInput: Company_UpdateDataInput;
    Boolean: Scalars['Boolean']['output'];
};
export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
    Users?: Resolver<ResolversTypes['User_Output'], ParentType, ContextType, Partial<Mutation_UsersArgs>>;
    Companies?: Resolver<ResolversTypes['Company_Output'], ParentType, ContextType, Partial<Mutation_CompaniesArgs>>;
};
export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
    Users?: Resolver<ResolversTypes['User_Output'], ParentType, ContextType, Partial<Query_UsersArgs>>;
    Companies?: Resolver<ResolversTypes['Company_Output'], ParentType, ContextType, Partial<Query_CompaniesArgs>>;
};
export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
    name: 'DateTime';
}
export type _AllModelsResolvers<ContextType = any, ParentType extends ResolversParentTypes['_AllModels'] = ResolversParentTypes['_AllModels']> = {
    User?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
    Company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType>;
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
export type CompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = {
    id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type Company_OutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['Company_Output'] = ResolversParentTypes['Company_Output']> = {
    total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    items?: Resolver<ReadonlyArray<ResolversTypes['Company']>, ParentType, ContextType>;
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
    Company?: CompanyResolvers<ContextType>;
    Company_Output?: Company_OutputResolvers<ContextType>;
};
import type { SchemaOperationParams } from '@prisma-to-graphql/graphql-codegen-operation-params';
export declare const operationParams: Readonly<SchemaOperationParams>;
