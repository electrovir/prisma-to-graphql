"use strict";
// generated by prisma-to-graphql
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaOperationTypeNames = exports.UserSettings_DistinctInput = exports.User_DistinctInput = exports.NullsOrder = exports.SortOrder = void 0;
var SortOrder;
(function (SortOrder) {
    SortOrder["asc"] = "asc";
    SortOrder["desc"] = "desc";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
var NullsOrder;
(function (NullsOrder) {
    NullsOrder["first"] = "first";
    NullsOrder["last"] = "last";
})(NullsOrder || (exports.NullsOrder = NullsOrder = {}));
var User_DistinctInput;
(function (User_DistinctInput) {
    User_DistinctInput["id"] = "id";
    User_DistinctInput["createdAt"] = "createdAt";
    User_DistinctInput["updatedAt"] = "updatedAt";
    User_DistinctInput["email"] = "email";
    User_DistinctInput["password"] = "password";
    User_DistinctInput["firstName"] = "firstName";
    User_DistinctInput["lastName"] = "lastName";
    User_DistinctInput["role"] = "role";
    User_DistinctInput["phoneNumber"] = "phoneNumber";
})(User_DistinctInput || (exports.User_DistinctInput = User_DistinctInput = {}));
var UserSettings_DistinctInput;
(function (UserSettings_DistinctInput) {
    UserSettings_DistinctInput["id"] = "id";
    UserSettings_DistinctInput["createdAt"] = "createdAt";
    UserSettings_DistinctInput["updatedAt"] = "updatedAt";
})(UserSettings_DistinctInput || (exports.UserSettings_DistinctInput = UserSettings_DistinctInput = {}));
exports.schemaOperationTypeNames = {
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
