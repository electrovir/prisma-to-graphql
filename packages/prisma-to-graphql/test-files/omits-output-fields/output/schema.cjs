"use strict";
// generated by prisma-to-graphql
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationParams = exports.User_DistinctInput = exports.NullsOrder = exports.SortOrder = void 0;
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
})(User_DistinctInput || (exports.User_DistinctInput = User_DistinctInput = {}));
exports.operationParams = {
    Mutation: {
        Users: {
            args: {
                create: 'User_CreateInput',
                update: 'User_UpdateInput',
                upsert: 'User_UpsertInput',
            },
            output: 'User_Output!',
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
    },
};
