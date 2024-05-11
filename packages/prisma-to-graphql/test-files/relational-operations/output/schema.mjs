// generated by prisma-to-graphql
export var SortOrder;
(function (SortOrder) {
    SortOrder["asc"] = "asc";
    SortOrder["desc"] = "desc";
})(SortOrder || (SortOrder = {}));
export var NullsOrder;
(function (NullsOrder) {
    NullsOrder["first"] = "first";
    NullsOrder["last"] = "last";
})(NullsOrder || (NullsOrder = {}));
export var User_DistinctInput;
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
})(User_DistinctInput || (User_DistinctInput = {}));
export var UserSettings_DistinctInput;
(function (UserSettings_DistinctInput) {
    UserSettings_DistinctInput["id"] = "id";
    UserSettings_DistinctInput["createdAt"] = "createdAt";
    UserSettings_DistinctInput["updatedAt"] = "updatedAt";
})(UserSettings_DistinctInput || (UserSettings_DistinctInput = {}));
export const operationParams = {
    "Mutation": {
        "Users": {
            "args": {
                "create": "User_CreateInput",
                "update": "User_UpdateInput",
                "upsert": "User_UpsertInput"
            },
            "output": "User_QueryOutput!"
        },
        "UserSettings": {
            "args": {
                "create": "UserSettings_CreateInput",
                "update": "UserSettings_UpdateInput",
                "upsert": "UserSettings_UpsertInput"
            },
            "output": "UserSettings_QueryOutput!"
        }
    },
    "Query": {
        "Users": {
            "args": {
                "where": "User_WhereInput!",
                "orderBy": "[User_OrderByInput!]",
                "cursor": "User_WhereUnfilteredUniqueInput",
                "distinct": "[User_DistinctInput!]",
                "take": "Int",
                "skip": "Int"
            },
            "output": "User_QueryOutput!"
        },
        "UserSettings": {
            "args": {
                "where": "UserSettings_WhereInput!",
                "orderBy": "[UserSettings_OrderByInput!]",
                "cursor": "UserSettings_WhereUnfilteredUniqueInput",
                "distinct": "[UserSettings_DistinctInput!]",
                "take": "Int",
                "skip": "Int"
            },
            "output": "UserSettings_QueryOutput!"
        }
    }
};
