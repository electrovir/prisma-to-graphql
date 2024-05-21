// generated by prisma-to-graphql
export const models = {
    User: {
        id: {
            isList: false,
            type: 'String',
            isRelation: false,
        },
        createdAt: {
            isList: false,
            type: 'DateTime',
            isRelation: false,
        },
        updatedAt: {
            isList: false,
            type: 'DateTime',
            isRelation: false,
        },
        posts: {
            isList: true,
            type: 'Post',
            isRelation: true,
        },
    },
    Post: {
        id: {
            isList: false,
            type: 'String',
            isRelation: false,
        },
        createdAt: {
            isList: false,
            type: 'DateTime',
            isRelation: false,
        },
        updatedAt: {
            isList: false,
            type: 'DateTime',
            isRelation: false,
        },
        user: {
            isList: false,
            type: 'User',
            isRelation: true,
        },
    },
};
