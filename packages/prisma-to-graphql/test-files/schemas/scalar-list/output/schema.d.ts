import type { GraphQLResolveInfo } from 'graphql';
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
};
export type Mutation = {
    readonly SomeModels: SomeModel_Output;
};
export type Mutation_SomeModelsArgs = {
    create?: InputMaybe<SomeModel_CreateInput>;
    update?: InputMaybe<SomeModel_UpdateInput>;
    upsert?: InputMaybe<SomeModel_UpsertInput>;
    delete?: InputMaybe<SomeModel_DeleteInput>;
};
export type Query = {
    readonly SomeModels: SomeModel_Output;
};
export type Query_SomeModelsArgs = {
    where?: InputMaybe<SomeModel_WhereInput>;
    orderBy?: InputMaybe<ReadonlyArray<SomeModel_OrderByInput>>;
    cursor?: InputMaybe<SomeModel_WhereUnfilteredUniqueInput>;
    distinct?: InputMaybe<ReadonlyArray<SomeModel_DistinctInput>>;
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
export declare enum SomeModel_DistinctInput {
    id = "id",
    multiScalar = "multiScalar"
}
export type _AllModels = {
    readonly SomeModel?: Maybe<SomeModel>;
};
export type SomeModel = {
    readonly id: Scalars['ID']['output'];
    readonly multiScalar: ReadonlyArray<Maybe<Scalars['String']['output']>>;
};
export type SortOrderWithNulls = {
    readonly sort: SortOrder | `${SortOrder}`;
    readonly nulls?: InputMaybe<NullsOrder | `${NullsOrder}`>;
};
export type SomeModel_Output = {
    readonly total: Scalars['Int']['output'];
    readonly items: ReadonlyArray<SomeModel>;
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
export type SomeModel_WhereInput = {
    readonly AND?: InputMaybe<ReadonlyArray<SomeModel_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<SomeModel_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<SomeModel_WhereInput>>;
    readonly id?: InputMaybe<ID_WhereInput>;
    readonly multiScalar?: InputMaybe<String_WhereManyInput>;
};
export type SomeModel_OrderByInput = {
    readonly id?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly multiScalar?: InputMaybe<OrderByCount>;
};
export type SomeModel_WhereUnfilteredUniqueInput = {
    readonly AND?: InputMaybe<ReadonlyArray<SomeModel_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<SomeModel_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<SomeModel_WhereInput>>;
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly multiScalar?: InputMaybe<String_WhereManyInput>;
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
export type String_WhereManyInput = {
    readonly equals?: InputMaybe<ReadonlyArray<InputMaybe<Scalars['String']['input']>>>;
    readonly has?: InputMaybe<Scalars['String']['input']>;
    readonly hasEvery?: InputMaybe<ReadonlyArray<InputMaybe<Scalars['String']['input']>>>;
    readonly hasSome?: InputMaybe<ReadonlyArray<InputMaybe<Scalars['String']['input']>>>;
    readonly isEmpty?: InputMaybe<Scalars['Boolean']['input']>;
};
export type SomeModel_WhereManyInput = {
    readonly every?: InputMaybe<SomeModel_WhereInput>;
    readonly none?: InputMaybe<SomeModel_WhereInput>;
    readonly some?: InputMaybe<SomeModel_WhereInput>;
};
export type SomeModel_CreateInput = {
    readonly data: ReadonlyArray<SomeModel_CreateDataInput>;
};
export type SomeModel_UpdateInput = {
    readonly data: SomeModel_UpdateDataInput;
    readonly where: SomeModel_WhereUnfilteredUniqueInput;
};
export type SomeModel_UpsertInput = {
    readonly data: SomeModel_UpdateDataInput;
    readonly where: SomeModel_WhereRequiredProvidedUniqueInput;
};
export type SomeModel_DeleteInput = {
    readonly where: SomeModel_WhereInput;
};
export type SomeModel_WhereRequiredProvidedUniqueInput = {
    readonly id: Scalars['String']['input'];
    readonly multiScalar?: InputMaybe<String_WhereManyInput>;
};
export type SomeModel_CreateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly multiScalar: Scalars['String']['input'];
};
export type SomeModel_UpdateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly multiScalar?: InputMaybe<Scalars['String']['input']>;
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
    SortOrder: SortOrder;
    NullsOrder: NullsOrder;
    SomeModel_DistinctInput: SomeModel_DistinctInput;
    _AllModels: ResolverTypeWrapper<_AllModels>;
    SomeModel: ResolverTypeWrapper<SomeModel>;
    ID: ResolverTypeWrapper<Scalars['ID']['output']>;
    String: ResolverTypeWrapper<Scalars['String']['output']>;
    SortOrderWithNulls: SortOrderWithNulls;
    SomeModel_Output: ResolverTypeWrapper<SomeModel_Output>;
    OutputMessage: ResolverTypeWrapper<OutputMessage>;
    OrderByCount: OrderByCount;
    SomeModel_WhereInput: SomeModel_WhereInput;
    SomeModel_OrderByInput: SomeModel_OrderByInput;
    SomeModel_WhereUnfilteredUniqueInput: SomeModel_WhereUnfilteredUniqueInput;
    ID_WhereInput: ID_WhereInput;
    String_WhereManyInput: String_WhereManyInput;
    Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
    SomeModel_WhereManyInput: SomeModel_WhereManyInput;
    SomeModel_CreateInput: SomeModel_CreateInput;
    SomeModel_UpdateInput: SomeModel_UpdateInput;
    SomeModel_UpsertInput: SomeModel_UpsertInput;
    SomeModel_DeleteInput: SomeModel_DeleteInput;
    SomeModel_WhereRequiredProvidedUniqueInput: SomeModel_WhereRequiredProvidedUniqueInput;
    SomeModel_CreateDataInput: SomeModel_CreateDataInput;
    SomeModel_UpdateDataInput: SomeModel_UpdateDataInput;
};
/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
    Mutation: {};
    Query: {};
    Int: Scalars['Int']['output'];
    _AllModels: _AllModels;
    SomeModel: SomeModel;
    ID: Scalars['ID']['output'];
    String: Scalars['String']['output'];
    SortOrderWithNulls: SortOrderWithNulls;
    SomeModel_Output: SomeModel_Output;
    OutputMessage: OutputMessage;
    OrderByCount: OrderByCount;
    SomeModel_WhereInput: SomeModel_WhereInput;
    SomeModel_OrderByInput: SomeModel_OrderByInput;
    SomeModel_WhereUnfilteredUniqueInput: SomeModel_WhereUnfilteredUniqueInput;
    ID_WhereInput: ID_WhereInput;
    String_WhereManyInput: String_WhereManyInput;
    Boolean: Scalars['Boolean']['output'];
    SomeModel_WhereManyInput: SomeModel_WhereManyInput;
    SomeModel_CreateInput: SomeModel_CreateInput;
    SomeModel_UpdateInput: SomeModel_UpdateInput;
    SomeModel_UpsertInput: SomeModel_UpsertInput;
    SomeModel_DeleteInput: SomeModel_DeleteInput;
    SomeModel_WhereRequiredProvidedUniqueInput: SomeModel_WhereRequiredProvidedUniqueInput;
    SomeModel_CreateDataInput: SomeModel_CreateDataInput;
    SomeModel_UpdateDataInput: SomeModel_UpdateDataInput;
};
export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
    SomeModels?: Resolver<ResolversTypes['SomeModel_Output'], ParentType, ContextType, Partial<Mutation_SomeModelsArgs>>;
};
export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
    SomeModels?: Resolver<ResolversTypes['SomeModel_Output'], ParentType, ContextType, Partial<Query_SomeModelsArgs>>;
};
export type _AllModelsResolvers<ContextType = any, ParentType extends ResolversParentTypes['_AllModels'] = ResolversParentTypes['_AllModels']> = {
    SomeModel?: Resolver<Maybe<ResolversTypes['SomeModel']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type SomeModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['SomeModel'] = ResolversParentTypes['SomeModel']> = {
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    multiScalar?: Resolver<ReadonlyArray<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type SomeModel_OutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['SomeModel_Output'] = ResolversParentTypes['SomeModel_Output']> = {
    total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    items?: Resolver<ReadonlyArray<ResolversTypes['SomeModel']>, ParentType, ContextType>;
    messages?: Resolver<ReadonlyArray<Maybe<ResolversTypes['OutputMessage']>>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type OutputMessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['OutputMessage'] = ResolversParentTypes['OutputMessage']> = {
    code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type Resolvers<ContextType = any> = {
    Mutation?: MutationResolvers<ContextType>;
    Query?: QueryResolvers<ContextType>;
    _AllModels?: _AllModelsResolvers<ContextType>;
    SomeModel?: SomeModelResolvers<ContextType>;
    SomeModel_Output?: SomeModel_OutputResolvers<ContextType>;
    OutputMessage?: OutputMessageResolvers<ContextType>;
};
import type { SchemaOperationTypeNames } from '@prisma-to-graphql/core';
export declare const schemaOperationTypeNames: Readonly<SchemaOperationTypeNames>;
