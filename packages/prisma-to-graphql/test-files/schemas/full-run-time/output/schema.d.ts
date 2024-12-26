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
    readonly Regions: Region_Output;
    readonly UserPosts: UserPost_Output;
    readonly UserSettings: UserSettings_Output;
    readonly UserStats: UserStats_Output;
};
export type Mutation_UsersArgs = {
    create?: InputMaybe<User_CreateInput>;
    update?: InputMaybe<User_UpdateInput>;
    upsert?: InputMaybe<User_UpsertInput>;
    delete?: InputMaybe<User_DeleteInput>;
};
export type Mutation_RegionsArgs = {
    create?: InputMaybe<Region_CreateInput>;
    update?: InputMaybe<Region_UpdateInput>;
    upsert?: InputMaybe<Region_UpsertInput>;
    delete?: InputMaybe<Region_DeleteInput>;
};
export type Mutation_UserPostsArgs = {
    create?: InputMaybe<UserPost_CreateInput>;
    update?: InputMaybe<UserPost_UpdateInput>;
    upsert?: InputMaybe<UserPost_UpsertInput>;
    delete?: InputMaybe<UserPost_DeleteInput>;
};
export type Mutation_UserSettingsArgs = {
    create?: InputMaybe<UserSettings_CreateInput>;
    update?: InputMaybe<UserSettings_UpdateInput>;
    upsert?: InputMaybe<UserSettings_UpsertInput>;
    delete?: InputMaybe<UserSettings_DeleteInput>;
};
export type Mutation_UserStatsArgs = {
    create?: InputMaybe<UserStats_CreateInput>;
    update?: InputMaybe<UserStats_UpdateInput>;
    upsert?: InputMaybe<UserStats_UpsertInput>;
    delete?: InputMaybe<UserStats_DeleteInput>;
};
export type Query = {
    readonly Users: User_Output;
    readonly Regions: Region_Output;
    readonly UserPosts: UserPost_Output;
    readonly UserSettings: UserSettings_Output;
    readonly UserStats: UserStats_Output;
};
export type Query_UsersArgs = {
    where?: InputMaybe<User_WhereInput>;
    orderBy?: InputMaybe<ReadonlyArray<User_OrderByInput>>;
    cursor?: InputMaybe<User_WhereUnfilteredUniqueInput>;
    distinct?: InputMaybe<ReadonlyArray<User_DistinctInput>>;
    take?: InputMaybe<Scalars['Int']['input']>;
};
export type Query_RegionsArgs = {
    where?: InputMaybe<Region_WhereInput>;
    orderBy?: InputMaybe<ReadonlyArray<Region_OrderByInput>>;
    cursor?: InputMaybe<Region_WhereUnfilteredUniqueInput>;
    distinct?: InputMaybe<ReadonlyArray<Region_DistinctInput>>;
    take?: InputMaybe<Scalars['Int']['input']>;
};
export type Query_UserPostsArgs = {
    where?: InputMaybe<UserPost_WhereInput>;
    orderBy?: InputMaybe<ReadonlyArray<UserPost_OrderByInput>>;
    cursor?: InputMaybe<UserPost_WhereUnfilteredUniqueInput>;
    distinct?: InputMaybe<ReadonlyArray<UserPost_DistinctInput>>;
    take?: InputMaybe<Scalars['Int']['input']>;
};
export type Query_UserSettingsArgs = {
    where?: InputMaybe<UserSettings_WhereInput>;
    orderBy?: InputMaybe<ReadonlyArray<UserSettings_OrderByInput>>;
    cursor?: InputMaybe<UserSettings_WhereUnfilteredUniqueInput>;
    distinct?: InputMaybe<ReadonlyArray<UserSettings_DistinctInput>>;
    take?: InputMaybe<Scalars['Int']['input']>;
};
export type Query_UserStatsArgs = {
    where?: InputMaybe<UserStats_WhereInput>;
    orderBy?: InputMaybe<ReadonlyArray<UserStats_OrderByInput>>;
    cursor?: InputMaybe<UserStats_WhereUnfilteredUniqueInput>;
    distinct?: InputMaybe<ReadonlyArray<UserStats_DistinctInput>>;
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
export declare enum Region_DistinctInput {
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    regionName = "regionName"
}
export declare enum UserPost_DistinctInput {
    id = "id",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    title = "title",
    body = "body"
}
export declare enum UserSettings_DistinctInput {
    id = "id",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    receivesMarketingEmails = "receivesMarketingEmails",
    canViewReports = "canViewReports"
}
export declare enum UserStats_DistinctInput {
    id = "id",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    likes = "likes",
    dislikes = "dislikes",
    views = "views"
}
export type _AllModels = {
    readonly User?: Maybe<User>;
    readonly Region?: Maybe<Region>;
    readonly UserPost?: Maybe<UserPost>;
    readonly UserSettings?: Maybe<UserSettings>;
    readonly UserStats?: Maybe<UserStats>;
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
    readonly posts: ReadonlyArray<Maybe<UserPost>>;
    readonly regions: ReadonlyArray<Maybe<Region>>;
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
    readonly posts?: InputMaybe<UserPost_WhereManyInput>;
    readonly regions?: InputMaybe<Region_WhereManyInput>;
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
    readonly posts?: InputMaybe<OrderByCount>;
    readonly regions?: InputMaybe<OrderByCount>;
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
    readonly posts?: InputMaybe<UserPost_WhereManyInput>;
    readonly regions?: InputMaybe<Region_WhereManyInput>;
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
    readonly posts?: InputMaybe<UserPost_WhereInput>;
    readonly regions?: InputMaybe<Region_WhereInput>;
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
    readonly posts?: InputMaybe<UserPost_Without_User_ConnectionManyInput>;
    readonly regions?: InputMaybe<Region_Without_User_ConnectionManyInput>;
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
    readonly posts?: InputMaybe<UserPost_Without_User_ConnectionInput>;
    readonly regions?: InputMaybe<Region_Without_User_ConnectionInput>;
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
    readonly posts?: InputMaybe<UserPost_Without_User_ConnectionManyInput>;
    readonly regions?: InputMaybe<Region_Without_User_ConnectionManyInput>;
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
export type User_Without_UserPost_CreateOrConnectInput = {
    readonly connect: ReadonlyArray<InputMaybe<User_WhereUnfilteredUniqueInput>>;
    readonly create: ReadonlyArray<InputMaybe<User_Without_UserPost_CreateInput>>;
};
export type User_Without_UserPost_CreateInput = {
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
    readonly regions?: InputMaybe<Region_Without_User_ConnectionManyInput>;
};
export type User_Without_UserPost_ConnectionManyInput = {
    readonly create?: InputMaybe<ReadonlyArray<InputMaybe<User_Without_UserPost_CreateInput>>>;
    readonly connectOrCreate?: InputMaybe<User_Without_UserPost_CreateOrConnectInput>;
    readonly connect?: InputMaybe<ReadonlyArray<InputMaybe<User_WhereUnfilteredUniqueInput>>>;
};
export type User_Without_UserPost_ConnectionInput = {
    readonly create?: InputMaybe<User_Without_UserPost_CreateInput>;
    readonly connectOrCreate?: InputMaybe<User_Without_UserPost_CreateOrConnectInput>;
    readonly connect?: InputMaybe<User_WhereUnfilteredUniqueInput>;
};
export type User_Without_Region_CreateOrConnectInput = {
    readonly connect: ReadonlyArray<InputMaybe<User_WhereUnfilteredUniqueInput>>;
    readonly create: ReadonlyArray<InputMaybe<User_Without_Region_CreateInput>>;
};
export type User_Without_Region_CreateInput = {
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
    readonly posts?: InputMaybe<UserPost_Without_User_ConnectionManyInput>;
};
export type User_Without_Region_ConnectionManyInput = {
    readonly create?: InputMaybe<ReadonlyArray<InputMaybe<User_Without_Region_CreateInput>>>;
    readonly connectOrCreate?: InputMaybe<User_Without_Region_CreateOrConnectInput>;
    readonly connect?: InputMaybe<ReadonlyArray<InputMaybe<User_WhereUnfilteredUniqueInput>>>;
};
export type User_Without_Region_ConnectionInput = {
    readonly create?: InputMaybe<User_Without_Region_CreateInput>;
    readonly connectOrCreate?: InputMaybe<User_Without_Region_CreateOrConnectInput>;
    readonly connect?: InputMaybe<User_WhereUnfilteredUniqueInput>;
};
export type Region = {
    readonly createdAt: Scalars['DateTime']['output'];
    readonly updatedAt: Scalars['DateTime']['output'];
    readonly regionName: Scalars['ID']['output'];
    readonly users: ReadonlyArray<Maybe<User>>;
};
export type Region_Output = {
    readonly total: Scalars['Int']['output'];
    readonly items: ReadonlyArray<Region>;
    readonly messages: ReadonlyArray<Maybe<OutputMessage>>;
};
export type Region_WhereInput = {
    readonly AND?: InputMaybe<ReadonlyArray<Region_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<Region_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<Region_WhereInput>>;
    readonly createdAt?: InputMaybe<DateTime_WhereInput>;
    readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
    readonly regionName?: InputMaybe<ID_WhereInput>;
    readonly users?: InputMaybe<User_WhereManyInput>;
};
export type Region_OrderByInput = {
    readonly createdAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly updatedAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly regionName?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly users?: InputMaybe<OrderByCount>;
};
export type Region_WhereUnfilteredUniqueInput = {
    readonly AND?: InputMaybe<ReadonlyArray<Region_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<Region_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<Region_WhereInput>>;
    readonly createdAt?: InputMaybe<DateTime_WhereInput>;
    readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
    readonly regionName?: InputMaybe<Scalars['String']['input']>;
    readonly users?: InputMaybe<User_WhereManyInput>;
};
export type Region_WhereManyInput = {
    readonly every?: InputMaybe<Region_WhereInput>;
    readonly none?: InputMaybe<Region_WhereInput>;
    readonly some?: InputMaybe<Region_WhereInput>;
};
export type Region_CreateInput = {
    readonly data: ReadonlyArray<Region_CreateDataInput>;
};
export type Region_UpdateInput = {
    readonly data: Region_UpdateDataInput;
    readonly where: Region_WhereUnfilteredUniqueInput;
};
export type Region_UpsertInput = {
    readonly data: Region_UpdateDataInput;
    readonly where: Region_WhereRequiredProvidedUniqueInput;
};
export type Region_DeleteInput = {
    readonly where: Region_WhereInput;
};
export type Region_WhereRequiredProvidedUniqueInput = {
    readonly createdAt?: InputMaybe<DateTime_WhereInput>;
    readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
    readonly regionName: Scalars['String']['input'];
    readonly users?: InputMaybe<User_WhereInput>;
};
export type Region_CreateDataInput = {
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly regionName: Scalars['String']['input'];
    readonly users?: InputMaybe<User_Without_Region_ConnectionManyInput>;
};
export type Region_UpdateDataInput = {
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly regionName?: InputMaybe<Scalars['String']['input']>;
    readonly users?: InputMaybe<User_Without_Region_ConnectionInput>;
};
export type Region_Without_User_CreateOrConnectInput = {
    readonly connect: ReadonlyArray<InputMaybe<Region_WhereUnfilteredUniqueInput>>;
    readonly create: ReadonlyArray<InputMaybe<Region_Without_User_CreateInput>>;
};
export type Region_Without_User_CreateInput = {
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly regionName: Scalars['String']['input'];
};
export type Region_Without_User_ConnectionManyInput = {
    readonly create?: InputMaybe<ReadonlyArray<InputMaybe<Region_Without_User_CreateInput>>>;
    readonly connectOrCreate?: InputMaybe<Region_Without_User_CreateOrConnectInput>;
    readonly connect?: InputMaybe<ReadonlyArray<InputMaybe<Region_WhereUnfilteredUniqueInput>>>;
};
export type Region_Without_User_ConnectionInput = {
    readonly create?: InputMaybe<Region_Without_User_CreateInput>;
    readonly connectOrCreate?: InputMaybe<Region_Without_User_CreateOrConnectInput>;
    readonly connect?: InputMaybe<Region_WhereUnfilteredUniqueInput>;
};
export type UserPost = {
    readonly id: Scalars['ID']['output'];
    readonly createdAt: Scalars['DateTime']['output'];
    readonly updatedAt: Scalars['DateTime']['output'];
    readonly title: Scalars['String']['output'];
    readonly body: Scalars['String']['output'];
    readonly user: User;
};
export type UserPost_Output = {
    readonly total: Scalars['Int']['output'];
    readonly items: ReadonlyArray<UserPost>;
    readonly messages: ReadonlyArray<Maybe<OutputMessage>>;
};
export type UserPost_WhereInput = {
    readonly AND?: InputMaybe<ReadonlyArray<UserPost_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<UserPost_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<UserPost_WhereInput>>;
    readonly id?: InputMaybe<ID_WhereInput>;
    readonly createdAt?: InputMaybe<DateTime_WhereInput>;
    readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
    readonly title?: InputMaybe<String_WhereInput>;
    readonly body?: InputMaybe<String_WhereInput>;
    readonly user?: InputMaybe<User_WhereInput>;
};
export type UserPost_OrderByInput = {
    readonly id?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly createdAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly updatedAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly title?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly body?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly user?: InputMaybe<User_OrderByInput>;
};
export type UserPost_WhereUnfilteredUniqueInput = {
    readonly AND?: InputMaybe<ReadonlyArray<UserPost_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<UserPost_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<UserPost_WhereInput>>;
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<DateTime_WhereInput>;
    readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
    readonly title?: InputMaybe<String_WhereInput>;
    readonly body?: InputMaybe<String_WhereInput>;
    readonly user?: InputMaybe<User_WhereInput>;
};
export type UserPost_WhereManyInput = {
    readonly every?: InputMaybe<UserPost_WhereInput>;
    readonly none?: InputMaybe<UserPost_WhereInput>;
    readonly some?: InputMaybe<UserPost_WhereInput>;
};
export type UserPost_CreateInput = {
    readonly data: ReadonlyArray<UserPost_CreateDataInput>;
};
export type UserPost_UpdateInput = {
    readonly data: UserPost_UpdateDataInput;
    readonly where: UserPost_WhereUnfilteredUniqueInput;
};
export type UserPost_UpsertInput = {
    readonly data: UserPost_UpdateDataInput;
    readonly where: UserPost_WhereRequiredProvidedUniqueInput;
};
export type UserPost_DeleteInput = {
    readonly where: UserPost_WhereInput;
};
export type UserPost_WhereRequiredProvidedUniqueInput = {
    readonly id: Scalars['String']['input'];
    readonly createdAt?: InputMaybe<DateTime_WhereInput>;
    readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
    readonly title?: InputMaybe<String_WhereInput>;
    readonly body?: InputMaybe<String_WhereInput>;
    readonly user?: InputMaybe<User_WhereInput>;
};
export type UserPost_CreateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly title: Scalars['String']['input'];
    readonly body: Scalars['String']['input'];
    readonly user: User_Without_UserPost_ConnectionInput;
};
export type UserPost_UpdateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly title?: InputMaybe<Scalars['String']['input']>;
    readonly body?: InputMaybe<Scalars['String']['input']>;
    readonly user?: InputMaybe<User_Without_UserPost_ConnectionInput>;
};
export type UserPost_Without_User_CreateOrConnectInput = {
    readonly connect: ReadonlyArray<InputMaybe<UserPost_WhereUnfilteredUniqueInput>>;
    readonly create: ReadonlyArray<InputMaybe<UserPost_Without_User_CreateInput>>;
};
export type UserPost_Without_User_CreateInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly title: Scalars['String']['input'];
    readonly body: Scalars['String']['input'];
};
export type UserPost_Without_User_ConnectionManyInput = {
    readonly create?: InputMaybe<ReadonlyArray<InputMaybe<UserPost_Without_User_CreateInput>>>;
    readonly connectOrCreate?: InputMaybe<UserPost_Without_User_CreateOrConnectInput>;
    readonly connect?: InputMaybe<ReadonlyArray<InputMaybe<UserPost_WhereUnfilteredUniqueInput>>>;
};
export type UserPost_Without_User_ConnectionInput = {
    readonly create?: InputMaybe<UserPost_Without_User_CreateInput>;
    readonly connectOrCreate?: InputMaybe<UserPost_Without_User_CreateOrConnectInput>;
    readonly connect?: InputMaybe<UserPost_WhereUnfilteredUniqueInput>;
};
export type UserSettings = {
    readonly id: Scalars['ID']['output'];
    readonly createdAt: Scalars['DateTime']['output'];
    readonly updatedAt: Scalars['DateTime']['output'];
    readonly receivesMarketingEmails: Scalars['Boolean']['output'];
    readonly canViewReports: Scalars['Boolean']['output'];
    readonly stats?: Maybe<UserStats>;
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
    readonly receivesMarketingEmails?: InputMaybe<Boolean_WhereInput>;
    readonly canViewReports?: InputMaybe<Boolean_WhereInput>;
    readonly stats?: InputMaybe<UserStats_WhereInput>;
    readonly user?: InputMaybe<User_WhereInput>;
};
export type UserSettings_OrderByInput = {
    readonly id?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly createdAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly updatedAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly receivesMarketingEmails?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly canViewReports?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly stats?: InputMaybe<UserStats_OrderByInput>;
    readonly user?: InputMaybe<User_OrderByInput>;
};
export type UserSettings_WhereUnfilteredUniqueInput = {
    readonly AND?: InputMaybe<ReadonlyArray<UserSettings_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<UserSettings_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<UserSettings_WhereInput>>;
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<DateTime_WhereInput>;
    readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
    readonly receivesMarketingEmails?: InputMaybe<Boolean_WhereInput>;
    readonly canViewReports?: InputMaybe<Boolean_WhereInput>;
    readonly stats?: InputMaybe<UserStats_WhereInput>;
    readonly user?: InputMaybe<User_WhereInput>;
};
export type Boolean_WhereInput = {
    readonly not?: InputMaybe<Scalars['Boolean']['input']>;
    readonly equals?: InputMaybe<Scalars['Boolean']['input']>;
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
    readonly receivesMarketingEmails?: InputMaybe<Boolean_WhereInput>;
    readonly canViewReports?: InputMaybe<Boolean_WhereInput>;
    readonly stats?: InputMaybe<UserStats_WhereInput>;
    readonly user?: InputMaybe<User_WhereInput>;
};
export type UserSettings_CreateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly receivesMarketingEmails?: InputMaybe<Scalars['Boolean']['input']>;
    readonly canViewReports?: InputMaybe<Scalars['Boolean']['input']>;
    readonly stats?: InputMaybe<UserStats_Without_UserSettings_ConnectionInput>;
    readonly user: User_Without_UserSettings_ConnectionInput;
};
export type UserSettings_UpdateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly receivesMarketingEmails?: InputMaybe<Scalars['Boolean']['input']>;
    readonly canViewReports?: InputMaybe<Scalars['Boolean']['input']>;
    readonly stats?: InputMaybe<UserStats_Without_UserSettings_ConnectionInput>;
    readonly user?: InputMaybe<User_Without_UserSettings_ConnectionInput>;
};
export type UserSettings_Without_UserStats_CreateOrConnectInput = {
    readonly connect: ReadonlyArray<InputMaybe<UserSettings_WhereUnfilteredUniqueInput>>;
    readonly create: ReadonlyArray<InputMaybe<UserSettings_Without_UserStats_CreateInput>>;
};
export type UserSettings_Without_UserStats_CreateInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly receivesMarketingEmails?: InputMaybe<Scalars['Boolean']['input']>;
    readonly canViewReports?: InputMaybe<Scalars['Boolean']['input']>;
    readonly user: User_Without_UserSettings_ConnectionInput;
};
export type UserSettings_Without_UserStats_ConnectionManyInput = {
    readonly create?: InputMaybe<ReadonlyArray<InputMaybe<UserSettings_Without_UserStats_CreateInput>>>;
    readonly connectOrCreate?: InputMaybe<UserSettings_Without_UserStats_CreateOrConnectInput>;
    readonly connect?: InputMaybe<ReadonlyArray<InputMaybe<UserSettings_WhereUnfilteredUniqueInput>>>;
};
export type UserSettings_Without_UserStats_ConnectionInput = {
    readonly create?: InputMaybe<UserSettings_Without_UserStats_CreateInput>;
    readonly connectOrCreate?: InputMaybe<UserSettings_Without_UserStats_CreateOrConnectInput>;
    readonly connect?: InputMaybe<UserSettings_WhereUnfilteredUniqueInput>;
};
export type UserSettings_Without_User_CreateOrConnectInput = {
    readonly connect: ReadonlyArray<InputMaybe<UserSettings_WhereUnfilteredUniqueInput>>;
    readonly create: ReadonlyArray<InputMaybe<UserSettings_Without_User_CreateInput>>;
};
export type UserSettings_Without_User_CreateInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly receivesMarketingEmails?: InputMaybe<Scalars['Boolean']['input']>;
    readonly canViewReports?: InputMaybe<Scalars['Boolean']['input']>;
    readonly stats?: InputMaybe<UserStats_Without_UserSettings_ConnectionInput>;
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
export type UserStats = {
    readonly id: Scalars['ID']['output'];
    readonly createdAt: Scalars['DateTime']['output'];
    readonly updatedAt: Scalars['DateTime']['output'];
    readonly likes: Scalars['Int']['output'];
    readonly dislikes: Scalars['Int']['output'];
    readonly views: Scalars['Int']['output'];
    readonly settings: UserSettings;
};
export type UserStats_Output = {
    readonly total: Scalars['Int']['output'];
    readonly items: ReadonlyArray<UserStats>;
    readonly messages: ReadonlyArray<Maybe<OutputMessage>>;
};
export type UserStats_WhereInput = {
    readonly AND?: InputMaybe<ReadonlyArray<UserStats_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<UserStats_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<UserStats_WhereInput>>;
    readonly id?: InputMaybe<ID_WhereInput>;
    readonly createdAt?: InputMaybe<DateTime_WhereInput>;
    readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
    readonly likes?: InputMaybe<Int_WhereInput>;
    readonly dislikes?: InputMaybe<Int_WhereInput>;
    readonly views?: InputMaybe<Int_WhereInput>;
    readonly settings?: InputMaybe<UserSettings_WhereInput>;
};
export type UserStats_OrderByInput = {
    readonly id?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly createdAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly updatedAt?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly likes?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly dislikes?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly views?: InputMaybe<SortOrder | `${SortOrder}`>;
    readonly settings?: InputMaybe<UserSettings_OrderByInput>;
};
export type UserStats_WhereUnfilteredUniqueInput = {
    readonly AND?: InputMaybe<ReadonlyArray<UserStats_WhereInput>>;
    readonly OR?: InputMaybe<ReadonlyArray<UserStats_WhereInput>>;
    readonly NOT?: InputMaybe<ReadonlyArray<UserStats_WhereInput>>;
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<DateTime_WhereInput>;
    readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
    readonly likes?: InputMaybe<Int_WhereInput>;
    readonly dislikes?: InputMaybe<Int_WhereInput>;
    readonly views?: InputMaybe<Int_WhereInput>;
    readonly settings?: InputMaybe<UserSettings_WhereInput>;
};
export type Int_WhereInput = {
    readonly equals?: InputMaybe<Scalars['Int']['input']>;
    readonly in?: InputMaybe<ReadonlyArray<Scalars['Int']['input']>>;
    readonly notIn?: InputMaybe<ReadonlyArray<Scalars['Int']['input']>>;
    readonly lt?: InputMaybe<Scalars['Int']['input']>;
    readonly lte?: InputMaybe<Scalars['Int']['input']>;
    readonly gt?: InputMaybe<Scalars['Int']['input']>;
    readonly gte?: InputMaybe<Scalars['Int']['input']>;
    readonly not?: InputMaybe<Int_WhereInput>;
};
export type UserStats_WhereManyInput = {
    readonly every?: InputMaybe<UserStats_WhereInput>;
    readonly none?: InputMaybe<UserStats_WhereInput>;
    readonly some?: InputMaybe<UserStats_WhereInput>;
};
export type UserStats_CreateInput = {
    readonly data: ReadonlyArray<UserStats_CreateDataInput>;
};
export type UserStats_UpdateInput = {
    readonly data: UserStats_UpdateDataInput;
    readonly where: UserStats_WhereUnfilteredUniqueInput;
};
export type UserStats_UpsertInput = {
    readonly data: UserStats_UpdateDataInput;
    readonly where: UserStats_WhereRequiredProvidedUniqueInput;
};
export type UserStats_DeleteInput = {
    readonly where: UserStats_WhereInput;
};
export type UserStats_WhereRequiredProvidedUniqueInput = {
    readonly id: Scalars['String']['input'];
    readonly createdAt?: InputMaybe<DateTime_WhereInput>;
    readonly updatedAt?: InputMaybe<DateTime_WhereInput>;
    readonly likes?: InputMaybe<Int_WhereInput>;
    readonly dislikes?: InputMaybe<Int_WhereInput>;
    readonly views?: InputMaybe<Int_WhereInput>;
    readonly settings?: InputMaybe<UserSettings_WhereInput>;
};
export type UserStats_CreateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly likes: Scalars['Int']['input'];
    readonly dislikes: Scalars['Int']['input'];
    readonly views: Scalars['Int']['input'];
    readonly settings: UserSettings_Without_UserStats_ConnectionInput;
};
export type UserStats_UpdateDataInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly likes?: InputMaybe<Scalars['Int']['input']>;
    readonly dislikes?: InputMaybe<Scalars['Int']['input']>;
    readonly views?: InputMaybe<Scalars['Int']['input']>;
    readonly settings?: InputMaybe<UserSettings_Without_UserStats_ConnectionInput>;
};
export type UserStats_Without_UserSettings_CreateOrConnectInput = {
    readonly connect: ReadonlyArray<InputMaybe<UserStats_WhereUnfilteredUniqueInput>>;
    readonly create: ReadonlyArray<InputMaybe<UserStats_Without_UserSettings_CreateInput>>;
};
export type UserStats_Without_UserSettings_CreateInput = {
    readonly id?: InputMaybe<Scalars['String']['input']>;
    readonly createdAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
    readonly likes: Scalars['Int']['input'];
    readonly dislikes: Scalars['Int']['input'];
    readonly views: Scalars['Int']['input'];
};
export type UserStats_Without_UserSettings_ConnectionManyInput = {
    readonly create?: InputMaybe<ReadonlyArray<InputMaybe<UserStats_Without_UserSettings_CreateInput>>>;
    readonly connectOrCreate?: InputMaybe<UserStats_Without_UserSettings_CreateOrConnectInput>;
    readonly connect?: InputMaybe<ReadonlyArray<InputMaybe<UserStats_WhereUnfilteredUniqueInput>>>;
};
export type UserStats_Without_UserSettings_ConnectionInput = {
    readonly create?: InputMaybe<UserStats_Without_UserSettings_CreateInput>;
    readonly connectOrCreate?: InputMaybe<UserStats_Without_UserSettings_CreateOrConnectInput>;
    readonly connect?: InputMaybe<UserStats_WhereUnfilteredUniqueInput>;
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
    Region_DistinctInput: Region_DistinctInput;
    UserPost_DistinctInput: UserPost_DistinctInput;
    UserSettings_DistinctInput: UserSettings_DistinctInput;
    UserStats_DistinctInput: UserStats_DistinctInput;
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
    User_Without_UserPost_CreateOrConnectInput: User_Without_UserPost_CreateOrConnectInput;
    User_Without_UserPost_CreateInput: User_Without_UserPost_CreateInput;
    User_Without_UserPost_ConnectionManyInput: User_Without_UserPost_ConnectionManyInput;
    User_Without_UserPost_ConnectionInput: User_Without_UserPost_ConnectionInput;
    User_Without_Region_CreateOrConnectInput: User_Without_Region_CreateOrConnectInput;
    User_Without_Region_CreateInput: User_Without_Region_CreateInput;
    User_Without_Region_ConnectionManyInput: User_Without_Region_ConnectionManyInput;
    User_Without_Region_ConnectionInput: User_Without_Region_ConnectionInput;
    Region: ResolverTypeWrapper<Region>;
    Region_Output: ResolverTypeWrapper<Region_Output>;
    Region_WhereInput: Region_WhereInput;
    Region_OrderByInput: Region_OrderByInput;
    Region_WhereUnfilteredUniqueInput: Region_WhereUnfilteredUniqueInput;
    Region_WhereManyInput: Region_WhereManyInput;
    Region_CreateInput: Region_CreateInput;
    Region_UpdateInput: Region_UpdateInput;
    Region_UpsertInput: Region_UpsertInput;
    Region_DeleteInput: Region_DeleteInput;
    Region_WhereRequiredProvidedUniqueInput: Region_WhereRequiredProvidedUniqueInput;
    Region_CreateDataInput: Region_CreateDataInput;
    Region_UpdateDataInput: Region_UpdateDataInput;
    Region_Without_User_CreateOrConnectInput: Region_Without_User_CreateOrConnectInput;
    Region_Without_User_CreateInput: Region_Without_User_CreateInput;
    Region_Without_User_ConnectionManyInput: Region_Without_User_ConnectionManyInput;
    Region_Without_User_ConnectionInput: Region_Without_User_ConnectionInput;
    UserPost: ResolverTypeWrapper<UserPost>;
    UserPost_Output: ResolverTypeWrapper<UserPost_Output>;
    UserPost_WhereInput: UserPost_WhereInput;
    UserPost_OrderByInput: UserPost_OrderByInput;
    UserPost_WhereUnfilteredUniqueInput: UserPost_WhereUnfilteredUniqueInput;
    UserPost_WhereManyInput: UserPost_WhereManyInput;
    UserPost_CreateInput: UserPost_CreateInput;
    UserPost_UpdateInput: UserPost_UpdateInput;
    UserPost_UpsertInput: UserPost_UpsertInput;
    UserPost_DeleteInput: UserPost_DeleteInput;
    UserPost_WhereRequiredProvidedUniqueInput: UserPost_WhereRequiredProvidedUniqueInput;
    UserPost_CreateDataInput: UserPost_CreateDataInput;
    UserPost_UpdateDataInput: UserPost_UpdateDataInput;
    UserPost_Without_User_CreateOrConnectInput: UserPost_Without_User_CreateOrConnectInput;
    UserPost_Without_User_CreateInput: UserPost_Without_User_CreateInput;
    UserPost_Without_User_ConnectionManyInput: UserPost_Without_User_ConnectionManyInput;
    UserPost_Without_User_ConnectionInput: UserPost_Without_User_ConnectionInput;
    UserSettings: ResolverTypeWrapper<UserSettings>;
    Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
    UserSettings_Output: ResolverTypeWrapper<UserSettings_Output>;
    UserSettings_WhereInput: UserSettings_WhereInput;
    UserSettings_OrderByInput: UserSettings_OrderByInput;
    UserSettings_WhereUnfilteredUniqueInput: UserSettings_WhereUnfilteredUniqueInput;
    Boolean_WhereInput: Boolean_WhereInput;
    UserSettings_WhereManyInput: UserSettings_WhereManyInput;
    UserSettings_CreateInput: UserSettings_CreateInput;
    UserSettings_UpdateInput: UserSettings_UpdateInput;
    UserSettings_UpsertInput: UserSettings_UpsertInput;
    UserSettings_DeleteInput: UserSettings_DeleteInput;
    UserSettings_WhereRequiredProvidedUniqueInput: UserSettings_WhereRequiredProvidedUniqueInput;
    UserSettings_CreateDataInput: UserSettings_CreateDataInput;
    UserSettings_UpdateDataInput: UserSettings_UpdateDataInput;
    UserSettings_Without_UserStats_CreateOrConnectInput: UserSettings_Without_UserStats_CreateOrConnectInput;
    UserSettings_Without_UserStats_CreateInput: UserSettings_Without_UserStats_CreateInput;
    UserSettings_Without_UserStats_ConnectionManyInput: UserSettings_Without_UserStats_ConnectionManyInput;
    UserSettings_Without_UserStats_ConnectionInput: UserSettings_Without_UserStats_ConnectionInput;
    UserSettings_Without_User_CreateOrConnectInput: UserSettings_Without_User_CreateOrConnectInput;
    UserSettings_Without_User_CreateInput: UserSettings_Without_User_CreateInput;
    UserSettings_Without_User_ConnectionManyInput: UserSettings_Without_User_ConnectionManyInput;
    UserSettings_Without_User_ConnectionInput: UserSettings_Without_User_ConnectionInput;
    UserStats: ResolverTypeWrapper<UserStats>;
    UserStats_Output: ResolverTypeWrapper<UserStats_Output>;
    UserStats_WhereInput: UserStats_WhereInput;
    UserStats_OrderByInput: UserStats_OrderByInput;
    UserStats_WhereUnfilteredUniqueInput: UserStats_WhereUnfilteredUniqueInput;
    Int_WhereInput: Int_WhereInput;
    UserStats_WhereManyInput: UserStats_WhereManyInput;
    UserStats_CreateInput: UserStats_CreateInput;
    UserStats_UpdateInput: UserStats_UpdateInput;
    UserStats_UpsertInput: UserStats_UpsertInput;
    UserStats_DeleteInput: UserStats_DeleteInput;
    UserStats_WhereRequiredProvidedUniqueInput: UserStats_WhereRequiredProvidedUniqueInput;
    UserStats_CreateDataInput: UserStats_CreateDataInput;
    UserStats_UpdateDataInput: UserStats_UpdateDataInput;
    UserStats_Without_UserSettings_CreateOrConnectInput: UserStats_Without_UserSettings_CreateOrConnectInput;
    UserStats_Without_UserSettings_CreateInput: UserStats_Without_UserSettings_CreateInput;
    UserStats_Without_UserSettings_ConnectionManyInput: UserStats_Without_UserSettings_ConnectionManyInput;
    UserStats_Without_UserSettings_ConnectionInput: UserStats_Without_UserSettings_ConnectionInput;
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
    User_Without_UserPost_CreateOrConnectInput: User_Without_UserPost_CreateOrConnectInput;
    User_Without_UserPost_CreateInput: User_Without_UserPost_CreateInput;
    User_Without_UserPost_ConnectionManyInput: User_Without_UserPost_ConnectionManyInput;
    User_Without_UserPost_ConnectionInput: User_Without_UserPost_ConnectionInput;
    User_Without_Region_CreateOrConnectInput: User_Without_Region_CreateOrConnectInput;
    User_Without_Region_CreateInput: User_Without_Region_CreateInput;
    User_Without_Region_ConnectionManyInput: User_Without_Region_ConnectionManyInput;
    User_Without_Region_ConnectionInput: User_Without_Region_ConnectionInput;
    Region: Region;
    Region_Output: Region_Output;
    Region_WhereInput: Region_WhereInput;
    Region_OrderByInput: Region_OrderByInput;
    Region_WhereUnfilteredUniqueInput: Region_WhereUnfilteredUniqueInput;
    Region_WhereManyInput: Region_WhereManyInput;
    Region_CreateInput: Region_CreateInput;
    Region_UpdateInput: Region_UpdateInput;
    Region_UpsertInput: Region_UpsertInput;
    Region_DeleteInput: Region_DeleteInput;
    Region_WhereRequiredProvidedUniqueInput: Region_WhereRequiredProvidedUniqueInput;
    Region_CreateDataInput: Region_CreateDataInput;
    Region_UpdateDataInput: Region_UpdateDataInput;
    Region_Without_User_CreateOrConnectInput: Region_Without_User_CreateOrConnectInput;
    Region_Without_User_CreateInput: Region_Without_User_CreateInput;
    Region_Without_User_ConnectionManyInput: Region_Without_User_ConnectionManyInput;
    Region_Without_User_ConnectionInput: Region_Without_User_ConnectionInput;
    UserPost: UserPost;
    UserPost_Output: UserPost_Output;
    UserPost_WhereInput: UserPost_WhereInput;
    UserPost_OrderByInput: UserPost_OrderByInput;
    UserPost_WhereUnfilteredUniqueInput: UserPost_WhereUnfilteredUniqueInput;
    UserPost_WhereManyInput: UserPost_WhereManyInput;
    UserPost_CreateInput: UserPost_CreateInput;
    UserPost_UpdateInput: UserPost_UpdateInput;
    UserPost_UpsertInput: UserPost_UpsertInput;
    UserPost_DeleteInput: UserPost_DeleteInput;
    UserPost_WhereRequiredProvidedUniqueInput: UserPost_WhereRequiredProvidedUniqueInput;
    UserPost_CreateDataInput: UserPost_CreateDataInput;
    UserPost_UpdateDataInput: UserPost_UpdateDataInput;
    UserPost_Without_User_CreateOrConnectInput: UserPost_Without_User_CreateOrConnectInput;
    UserPost_Without_User_CreateInput: UserPost_Without_User_CreateInput;
    UserPost_Without_User_ConnectionManyInput: UserPost_Without_User_ConnectionManyInput;
    UserPost_Without_User_ConnectionInput: UserPost_Without_User_ConnectionInput;
    UserSettings: UserSettings;
    Boolean: Scalars['Boolean']['output'];
    UserSettings_Output: UserSettings_Output;
    UserSettings_WhereInput: UserSettings_WhereInput;
    UserSettings_OrderByInput: UserSettings_OrderByInput;
    UserSettings_WhereUnfilteredUniqueInput: UserSettings_WhereUnfilteredUniqueInput;
    Boolean_WhereInput: Boolean_WhereInput;
    UserSettings_WhereManyInput: UserSettings_WhereManyInput;
    UserSettings_CreateInput: UserSettings_CreateInput;
    UserSettings_UpdateInput: UserSettings_UpdateInput;
    UserSettings_UpsertInput: UserSettings_UpsertInput;
    UserSettings_DeleteInput: UserSettings_DeleteInput;
    UserSettings_WhereRequiredProvidedUniqueInput: UserSettings_WhereRequiredProvidedUniqueInput;
    UserSettings_CreateDataInput: UserSettings_CreateDataInput;
    UserSettings_UpdateDataInput: UserSettings_UpdateDataInput;
    UserSettings_Without_UserStats_CreateOrConnectInput: UserSettings_Without_UserStats_CreateOrConnectInput;
    UserSettings_Without_UserStats_CreateInput: UserSettings_Without_UserStats_CreateInput;
    UserSettings_Without_UserStats_ConnectionManyInput: UserSettings_Without_UserStats_ConnectionManyInput;
    UserSettings_Without_UserStats_ConnectionInput: UserSettings_Without_UserStats_ConnectionInput;
    UserSettings_Without_User_CreateOrConnectInput: UserSettings_Without_User_CreateOrConnectInput;
    UserSettings_Without_User_CreateInput: UserSettings_Without_User_CreateInput;
    UserSettings_Without_User_ConnectionManyInput: UserSettings_Without_User_ConnectionManyInput;
    UserSettings_Without_User_ConnectionInput: UserSettings_Without_User_ConnectionInput;
    UserStats: UserStats;
    UserStats_Output: UserStats_Output;
    UserStats_WhereInput: UserStats_WhereInput;
    UserStats_OrderByInput: UserStats_OrderByInput;
    UserStats_WhereUnfilteredUniqueInput: UserStats_WhereUnfilteredUniqueInput;
    Int_WhereInput: Int_WhereInput;
    UserStats_WhereManyInput: UserStats_WhereManyInput;
    UserStats_CreateInput: UserStats_CreateInput;
    UserStats_UpdateInput: UserStats_UpdateInput;
    UserStats_UpsertInput: UserStats_UpsertInput;
    UserStats_DeleteInput: UserStats_DeleteInput;
    UserStats_WhereRequiredProvidedUniqueInput: UserStats_WhereRequiredProvidedUniqueInput;
    UserStats_CreateDataInput: UserStats_CreateDataInput;
    UserStats_UpdateDataInput: UserStats_UpdateDataInput;
    UserStats_Without_UserSettings_CreateOrConnectInput: UserStats_Without_UserSettings_CreateOrConnectInput;
    UserStats_Without_UserSettings_CreateInput: UserStats_Without_UserSettings_CreateInput;
    UserStats_Without_UserSettings_ConnectionManyInput: UserStats_Without_UserSettings_ConnectionManyInput;
    UserStats_Without_UserSettings_ConnectionInput: UserStats_Without_UserSettings_ConnectionInput;
};
export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
    Users?: Resolver<ResolversTypes['User_Output'], ParentType, ContextType, Partial<Mutation_UsersArgs>>;
    Regions?: Resolver<ResolversTypes['Region_Output'], ParentType, ContextType, Partial<Mutation_RegionsArgs>>;
    UserPosts?: Resolver<ResolversTypes['UserPost_Output'], ParentType, ContextType, Partial<Mutation_UserPostsArgs>>;
    UserSettings?: Resolver<ResolversTypes['UserSettings_Output'], ParentType, ContextType, Partial<Mutation_UserSettingsArgs>>;
    UserStats?: Resolver<ResolversTypes['UserStats_Output'], ParentType, ContextType, Partial<Mutation_UserStatsArgs>>;
};
export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
    Users?: Resolver<ResolversTypes['User_Output'], ParentType, ContextType, Partial<Query_UsersArgs>>;
    Regions?: Resolver<ResolversTypes['Region_Output'], ParentType, ContextType, Partial<Query_RegionsArgs>>;
    UserPosts?: Resolver<ResolversTypes['UserPost_Output'], ParentType, ContextType, Partial<Query_UserPostsArgs>>;
    UserSettings?: Resolver<ResolversTypes['UserSettings_Output'], ParentType, ContextType, Partial<Query_UserSettingsArgs>>;
    UserStats?: Resolver<ResolversTypes['UserStats_Output'], ParentType, ContextType, Partial<Query_UserStatsArgs>>;
};
export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
    name: 'DateTime';
}
export type _AllModelsResolvers<ContextType = any, ParentType extends ResolversParentTypes['_AllModels'] = ResolversParentTypes['_AllModels']> = {
    User?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
    Region?: Resolver<Maybe<ResolversTypes['Region']>, ParentType, ContextType>;
    UserPost?: Resolver<Maybe<ResolversTypes['UserPost']>, ParentType, ContextType>;
    UserSettings?: Resolver<Maybe<ResolversTypes['UserSettings']>, ParentType, ContextType>;
    UserStats?: Resolver<Maybe<ResolversTypes['UserStats']>, ParentType, ContextType>;
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
    posts?: Resolver<ReadonlyArray<Maybe<ResolversTypes['UserPost']>>, ParentType, ContextType>;
    regions?: Resolver<ReadonlyArray<Maybe<ResolversTypes['Region']>>, ParentType, ContextType>;
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
export type RegionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Region'] = ResolversParentTypes['Region']> = {
    createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    regionName?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    users?: Resolver<ReadonlyArray<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type Region_OutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['Region_Output'] = ResolversParentTypes['Region_Output']> = {
    total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    items?: Resolver<ReadonlyArray<ResolversTypes['Region']>, ParentType, ContextType>;
    messages?: Resolver<ReadonlyArray<Maybe<ResolversTypes['OutputMessage']>>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type UserPostResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPost'] = ResolversParentTypes['UserPost']> = {
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type UserPost_OutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPost_Output'] = ResolversParentTypes['UserPost_Output']> = {
    total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    items?: Resolver<ReadonlyArray<ResolversTypes['UserPost']>, ParentType, ContextType>;
    messages?: Resolver<ReadonlyArray<Maybe<ResolversTypes['OutputMessage']>>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type UserSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSettings'] = ResolversParentTypes['UserSettings']> = {
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    receivesMarketingEmails?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    canViewReports?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    stats?: Resolver<Maybe<ResolversTypes['UserStats']>, ParentType, ContextType>;
    user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type UserSettings_OutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSettings_Output'] = ResolversParentTypes['UserSettings_Output']> = {
    total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    items?: Resolver<ReadonlyArray<ResolversTypes['UserSettings']>, ParentType, ContextType>;
    messages?: Resolver<ReadonlyArray<Maybe<ResolversTypes['OutputMessage']>>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type UserStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserStats'] = ResolversParentTypes['UserStats']> = {
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    likes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    dislikes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    views?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    settings?: Resolver<ResolversTypes['UserSettings'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type UserStats_OutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserStats_Output'] = ResolversParentTypes['UserStats_Output']> = {
    total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    items?: Resolver<ReadonlyArray<ResolversTypes['UserStats']>, ParentType, ContextType>;
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
    Region?: RegionResolvers<ContextType>;
    Region_Output?: Region_OutputResolvers<ContextType>;
    UserPost?: UserPostResolvers<ContextType>;
    UserPost_Output?: UserPost_OutputResolvers<ContextType>;
    UserSettings?: UserSettingsResolvers<ContextType>;
    UserSettings_Output?: UserSettings_OutputResolvers<ContextType>;
    UserStats?: UserStatsResolvers<ContextType>;
    UserStats_Output?: UserStats_OutputResolvers<ContextType>;
};
import type { SchemaOperationTypeNames } from '@prisma-to-graphql/core';
export declare const schemaOperationTypeNames: Readonly<SchemaOperationTypeNames>;
