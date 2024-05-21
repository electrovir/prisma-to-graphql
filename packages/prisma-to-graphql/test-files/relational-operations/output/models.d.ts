export declare const models: {
    readonly User: {
        readonly id: {
            readonly isList: false;
            readonly type: "String";
            readonly isRelation: false;
        };
        readonly createdAt: {
            readonly isList: false;
            readonly type: "DateTime";
            readonly isRelation: false;
        };
        readonly updatedAt: {
            readonly isList: false;
            readonly type: "DateTime";
            readonly isRelation: false;
        };
        readonly email: {
            readonly isList: false;
            readonly type: "String";
            readonly isRelation: false;
        };
        readonly password: {
            readonly isList: false;
            readonly type: "String";
            readonly isRelation: false;
        };
        readonly firstName: {
            readonly isList: false;
            readonly type: "String";
            readonly isRelation: false;
        };
        readonly lastName: {
            readonly isList: false;
            readonly type: "String";
            readonly isRelation: false;
        };
        readonly role: {
            readonly isList: false;
            readonly type: "String";
            readonly isRelation: false;
        };
        readonly phoneNumber: {
            readonly isList: false;
            readonly type: "String";
            readonly isRelation: false;
        };
        readonly settings: {
            readonly isList: false;
            readonly type: "UserSettings";
            readonly isRelation: true;
        };
    };
    readonly UserSettings: {
        readonly id: {
            readonly isList: false;
            readonly type: "String";
            readonly isRelation: false;
        };
        readonly createdAt: {
            readonly isList: false;
            readonly type: "DateTime";
            readonly isRelation: false;
        };
        readonly updatedAt: {
            readonly isList: false;
            readonly type: "DateTime";
            readonly isRelation: false;
        };
        readonly user: {
            readonly isList: false;
            readonly type: "User";
            readonly isRelation: true;
        };
    };
};
