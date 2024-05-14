export declare const models: {
    readonly User: {
        readonly id: {
            readonly isList: false;
            readonly isRequired: true;
            readonly isUnique: false;
            readonly isId: true;
            readonly hasDefaultValue: true;
            readonly type: "String";
            readonly isGenerated: false;
            readonly isUpdatedAt: false;
            readonly isRelation: false;
        };
        readonly createdAt: {
            readonly isList: false;
            readonly isRequired: true;
            readonly isUnique: false;
            readonly isId: false;
            readonly hasDefaultValue: true;
            readonly type: "DateTime";
            readonly isGenerated: false;
            readonly isUpdatedAt: false;
            readonly isRelation: false;
        };
        readonly updatedAt: {
            readonly isList: false;
            readonly isRequired: true;
            readonly isUnique: false;
            readonly isId: false;
            readonly hasDefaultValue: false;
            readonly type: "DateTime";
            readonly isGenerated: false;
            readonly isUpdatedAt: true;
            readonly isRelation: false;
        };
        readonly posts: {
            readonly isList: true;
            readonly isRequired: true;
            readonly isUnique: false;
            readonly isId: false;
            readonly hasDefaultValue: false;
            readonly type: "Post";
            readonly relationFromFields: readonly [];
            readonly relationToFields: readonly [];
            readonly isGenerated: false;
            readonly isUpdatedAt: false;
            readonly isRelation: true;
        };
    };
    readonly Post: {
        readonly id: {
            readonly isList: false;
            readonly isRequired: true;
            readonly isUnique: false;
            readonly isId: true;
            readonly hasDefaultValue: true;
            readonly type: "String";
            readonly isGenerated: false;
            readonly isUpdatedAt: false;
            readonly isRelation: false;
        };
        readonly createdAt: {
            readonly isList: false;
            readonly isRequired: true;
            readonly isUnique: false;
            readonly isId: false;
            readonly hasDefaultValue: true;
            readonly type: "DateTime";
            readonly isGenerated: false;
            readonly isUpdatedAt: false;
            readonly isRelation: false;
        };
        readonly updatedAt: {
            readonly isList: false;
            readonly isRequired: true;
            readonly isUnique: false;
            readonly isId: false;
            readonly hasDefaultValue: false;
            readonly type: "DateTime";
            readonly isGenerated: false;
            readonly isUpdatedAt: true;
            readonly isRelation: false;
        };
        readonly user: {
            readonly isList: false;
            readonly isRequired: true;
            readonly isUnique: false;
            readonly isId: false;
            readonly hasDefaultValue: false;
            readonly type: "User";
            readonly relationFromFields: readonly ["userId"];
            readonly relationToFields: readonly ["id"];
            readonly isGenerated: false;
            readonly isUpdatedAt: false;
            readonly isRelation: true;
        };
    };
};
