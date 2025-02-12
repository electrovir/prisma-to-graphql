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
    readonly Posts: Post_Output;
};
export type Mutation_UsersArgs = {
    create?: InputMaybe<User_CreateInput>;
    update?: InputMaybe<User_UpdateInput>;
    upsert?: InputMaybe<User_UpsertInput>;
    delete?: InputMaybe<User_DeleteInput>;
};
export type Mutation_PostsArgs = {
    create?: InputMaybe<Post_CreateInput>;
    update?: InputMaybe<Post_UpdateInput>;
    upsert?: InputMaybe<Post_UpsertInput>;
    delete?: InputMaybe<Post_DeleteInput>;
};
export type Query = {
    readonly Users: User_Output;
    readonly Posts: Post_Output;
};
export type Query_UsersArgs = {
    where?: InputMaybe<User_WhereInput>;
    orderBy?: InputMaybe<ReadonlyArray<User_OrderByInput>>;
    cursor?: InputMaybe<User_WhereUnfilteredUniqueInput>;
    distinct?: InputMaybe<ReadonlyArray<User_DistinctInput>>;
    take?: InputMaybe<Scalars['Int']['input']>;
};
export type Query_PostsArgs = {
    where?: InputMaybe<Post_WhereInput>;
    orderBy?: InputMaybe<ReadonlyArray<Post_OrderByInput>>;
    cursor?: InputMaybe<Post_WhereUnfilteredUniqueInput>;
    distinct?: InputMaybe<ReadonlyArray<Post_DistinctInput>>;
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
    updatedAt = "updatedAt"
}
export declare enum Post_DistinctInput {
    id = "id",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}
export type _AllModels = {
    readonly User?: Maybe<User>;
    readonly Post?: Maybe<Post>;
};
export type User = {
    readonly id: Scalars['ID']['output'];
    readonly createdAt: Scalars['DateTime']['output'];
    readonly updatedAt: Scalars['DateTime']['output'];
    readonly posts: ReadonlyArray<Maybe<Post>>;
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
    readonly posts?: InputMaybe<Post_WhereManyInput>;
};
export type User_OrderByInput = {
    readonly id?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly createdAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly updatedAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly posts?: InputMaybe<OrderByCount>;
};
export type User_WhereUnfilteredUniqueInput = {
    readonly AND?: InputMaybe<ReadonlyArray<User_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<User_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<User_WhereInput>>;
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<DateTime_WhereInput>;
    readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
    readonly posts?: InputMaybe<Post_WhereManyInput>;
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
    readonly posts?: InputMaybe<Post_WhereInput>;
};
export type User_CreateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly posts?: InputMaybe<Post_Without_User_ConnectionManyInput>;
};
export type User_UpdateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly posts?: InputMaybe<Post_Without_User_ConnectionInput>;
};
export type User_Without_Post_CreateOrConnectInput = {
    readonly connect: ReadonlyArray<InputMaybe<User_WhereUnfilteredUniqueInput>>;
    readonly create: ReadonlyArray<InputMaybe<User_Without_Post_CreateInput>>;
};
export type User_Without_Post_CreateInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};
export type User_Without_Post_ConnectionManyInput = {
    readonly create?: InputMaybe<ReadonlyArray<InputMaybe<User_Without_Post_CreateInput>>>;
    readonly connectOrCreate?: InputMaybe<User_Without_Post_CreateOrConnectInput>;
    readonly connect?: InputMaybe<ReadonlyArray<InputMaybe<User_WhereUnfilteredUniqueInput>>>;
};
export type User_Without_Post_ConnectionInput = {
    readonly create?: InputMaybe<User_Without_Post_CreateInput>;
    readonly connectOrCreate?: InputMaybe<User_Without_Post_CreateOrConnectInput>;
    readonly connect?: InputMaybe<User_WhereUnfilteredUniqueInput>;
};
export type Post = {
    readonly id: Scalars['ID']['output'];
    readonly createdAt: Scalars['DateTime']['output'];
    readonly updatedAt: Scalars['DateTime']['output'];
    readonly user: User;
};
export type Post_Output = {
    readonly total: Scalars['Int']['output'];
    readonly items: ReadonlyArray<Post>;
    readonly messages: ReadonlyArray<Maybe<OutputMessage>>;
};
export type Post_WhereInput = {
    readonly AND?: InputMaybe<ReadonlyArray<Post_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<Post_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<Post_WhereInput>>;
    readonly id?: InputMaybe<ID_WhereInput>;
    readonly createdAt?: InputMaybe<DateTime_WhereInput>;
    readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
    readonly user?: InputMaybe<User_WhereInput>;
};
export type Post_OrderByInput = {
    readonly id?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly createdAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly updatedAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly user?: InputMaybe<User_OrderByInput>;
};
export type Post_WhereUnfilteredUniqueInput = {
    readonly AND?: InputMaybe<ReadonlyArray<Post_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<Post_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<Post_WhereInput>>;
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<DateTime_WhereInput>;
    readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
    readonly user?: InputMaybe<User_WhereInput>;
};
export type Post_WhereManyInput = {
    readonly every?: InputMaybe<Post_WhereInput>;
    readonly none?: InputMaybe<Post_WhereInput>;
    readonly some?: InputMaybe<Post_WhereInput>;
};
export type Post_CreateInput = {
    readonly data: ReadonlyArray<Post_CreateDataInput>;
};
export type Post_UpdateInput = {
    readonly data: Post_UpdateDataInput;
    readonly where: Post_WhereUnfilteredUniqueInput;
};
export type Post_UpsertInput = {
    readonly data: Post_UpdateDataInput;
    readonly where: Post_WhereRequiredProvidedUniqueInput;
};
export type Post_DeleteInput = {
    readonly where: Post_WhereInput;
};
export type Post_WhereRequiredProvidedUniqueInput = {
    readonly id: Scalars['String']['input'];
    readonly createdAt?: InputMaybe<DateTime_WhereInput>;
    readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
    readonly user?: InputMaybe<User_WhereInput>;
};
export type Post_CreateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly user: User_Without_Post_ConnectionInput;
};
export type Post_UpdateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly user?: InputMaybe<User_Without_Post_ConnectionInput>;
};
export type Post_Without_User_CreateOrConnectInput = {
    readonly connect: ReadonlyArray<InputMaybe<Post_WhereUnfilteredUniqueInput>>;
    readonly create: ReadonlyArray<InputMaybe<Post_Without_User_CreateInput>>;
};
export type Post_Without_User_CreateInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};
export type Post_Without_User_ConnectionManyInput = {
    readonly create?: InputMaybe<ReadonlyArray<InputMaybe<Post_Without_User_CreateInput>>>;
    readonly connectOrCreate?: InputMaybe<Post_Without_User_CreateOrConnectInput>;
    readonly connect?: InputMaybe<ReadonlyArray<InputMaybe<Post_WhereUnfilteredUniqueInput>>>;
};
export type Post_Without_User_ConnectionInput = {
    readonly create?: InputMaybe<Post_Without_User_CreateInput>;
    readonly connectOrCreate?: InputMaybe<Post_Without_User_CreateOrConnectInput>;
    readonly connect?: InputMaybe<Post_WhereUnfilteredUniqueInput>;
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
    Post_DistinctInput: Post_DistinctInput;
    _AllModels: ResolverTypeWrapper<_AllModels>;
    User: ResolverTypeWrapper<User>;
    ID: ResolverTypeWrapper<Scalars['ID']['output']>;
    SortOrderWithNulls: SortOrderWithNulls;
    User_Output: ResolverTypeWrapper<User_Output>;
    OutputMessage: ResolverTypeWrapper<OutputMessage>;
    String: ResolverTypeWrapper<Scalars['String']['output']>;
    OrderByCount: OrderByCount;
    User_WhereInput: User_WhereInput;
    User_OrderByInput: User_OrderByInput;
    User_WhereUnfilteredUniqueInput: User_WhereUnfilteredUniqueInput;
    ID_WhereInput: ID_WhereInput;
    DateTime_WhereInput: DateTime_WhereInput;
    User_WhereManyInput: User_WhereManyInput;
    User_CreateInput: User_CreateInput;
    User_UpdateInput: User_UpdateInput;
    User_UpsertInput: User_UpsertInput;
    User_DeleteInput: User_DeleteInput;
    User_WhereRequiredProvidedUniqueInput: User_WhereRequiredProvidedUniqueInput;
    User_CreateDataInput: User_CreateDataInput;
    User_UpdateDataInput: User_UpdateDataInput;
    User_Without_Post_CreateOrConnectInput: User_Without_Post_CreateOrConnectInput;
    User_Without_Post_CreateInput: User_Without_Post_CreateInput;
    User_Without_Post_ConnectionManyInput: User_Without_Post_ConnectionManyInput;
    User_Without_Post_ConnectionInput: User_Without_Post_ConnectionInput;
    Post: ResolverTypeWrapper<Post>;
    Post_Output: ResolverTypeWrapper<Post_Output>;
    Post_WhereInput: Post_WhereInput;
    Post_OrderByInput: Post_OrderByInput;
    Post_WhereUnfilteredUniqueInput: Post_WhereUnfilteredUniqueInput;
    Post_WhereManyInput: Post_WhereManyInput;
    Post_CreateInput: Post_CreateInput;
    Post_UpdateInput: Post_UpdateInput;
    Post_UpsertInput: Post_UpsertInput;
    Post_DeleteInput: Post_DeleteInput;
    Post_WhereRequiredProvidedUniqueInput: Post_WhereRequiredProvidedUniqueInput;
    Post_CreateDataInput: Post_CreateDataInput;
    Post_UpdateDataInput: Post_UpdateDataInput;
    Post_Without_User_CreateOrConnectInput: Post_Without_User_CreateOrConnectInput;
    Post_Without_User_CreateInput: Post_Without_User_CreateInput;
    Post_Without_User_ConnectionManyInput: Post_Without_User_ConnectionManyInput;
    Post_Without_User_ConnectionInput: Post_Without_User_ConnectionInput;
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
    SortOrderWithNulls: SortOrderWithNulls;
    User_Output: User_Output;
    OutputMessage: OutputMessage;
    String: Scalars['String']['output'];
    OrderByCount: OrderByCount;
    User_WhereInput: User_WhereInput;
    User_OrderByInput: User_OrderByInput;
    User_WhereUnfilteredUniqueInput: User_WhereUnfilteredUniqueInput;
    ID_WhereInput: ID_WhereInput;
    DateTime_WhereInput: DateTime_WhereInput;
    User_WhereManyInput: User_WhereManyInput;
    User_CreateInput: User_CreateInput;
    User_UpdateInput: User_UpdateInput;
    User_UpsertInput: User_UpsertInput;
    User_DeleteInput: User_DeleteInput;
    User_WhereRequiredProvidedUniqueInput: User_WhereRequiredProvidedUniqueInput;
    User_CreateDataInput: User_CreateDataInput;
    User_UpdateDataInput: User_UpdateDataInput;
    User_Without_Post_CreateOrConnectInput: User_Without_Post_CreateOrConnectInput;
    User_Without_Post_CreateInput: User_Without_Post_CreateInput;
    User_Without_Post_ConnectionManyInput: User_Without_Post_ConnectionManyInput;
    User_Without_Post_ConnectionInput: User_Without_Post_ConnectionInput;
    Post: Post;
    Post_Output: Post_Output;
    Post_WhereInput: Post_WhereInput;
    Post_OrderByInput: Post_OrderByInput;
    Post_WhereUnfilteredUniqueInput: Post_WhereUnfilteredUniqueInput;
    Post_WhereManyInput: Post_WhereManyInput;
    Post_CreateInput: Post_CreateInput;
    Post_UpdateInput: Post_UpdateInput;
    Post_UpsertInput: Post_UpsertInput;
    Post_DeleteInput: Post_DeleteInput;
    Post_WhereRequiredProvidedUniqueInput: Post_WhereRequiredProvidedUniqueInput;
    Post_CreateDataInput: Post_CreateDataInput;
    Post_UpdateDataInput: Post_UpdateDataInput;
    Post_Without_User_CreateOrConnectInput: Post_Without_User_CreateOrConnectInput;
    Post_Without_User_CreateInput: Post_Without_User_CreateInput;
    Post_Without_User_ConnectionManyInput: Post_Without_User_ConnectionManyInput;
    Post_Without_User_ConnectionInput: Post_Without_User_ConnectionInput;
    Boolean: Scalars['Boolean']['output'];
};
export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
    Users?: Resolver<ResolversTypes['User_Output'], ParentType, ContextType, Partial<Mutation_UsersArgs>>;
    Posts?: Resolver<ResolversTypes['Post_Output'], ParentType, ContextType, Partial<Mutation_PostsArgs>>;
};
export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
    Users?: Resolver<ResolversTypes['User_Output'], ParentType, ContextType, Partial<Query_UsersArgs>>;
    Posts?: Resolver<ResolversTypes['Post_Output'], ParentType, ContextType, Partial<Query_PostsArgs>>;
};
export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
    name: 'DateTime';
}
export type _AllModelsResolvers<ContextType = any, ParentType extends ResolversParentTypes['_AllModels'] = ResolversParentTypes['_AllModels']> = {
    User?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
    Post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    posts?: Resolver<ReadonlyArray<Maybe<ResolversTypes['Post']>>, ParentType, ContextType>;
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
export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type Post_OutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post_Output'] = ResolversParentTypes['Post_Output']> = {
    total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    items?: Resolver<ReadonlyArray<ResolversTypes['Post']>, ParentType, ContextType>;
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
    Post?: PostResolvers<ContextType>;
    Post_Output?: Post_OutputResolvers<ContextType>;
};
import { type SchemaOperationTypeNames } from 'prisma-to-graphql';
export declare const schemaOperationTypeNames: Readonly<SchemaOperationTypeNames>;
