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
        readonly posts: {
            readonly isList: true;
            readonly type: "Post";
            readonly isRelation: true;
        };
    };
    readonly Post: {
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
