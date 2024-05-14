import { GraphQLResolveInfo } from 'graphql';
declare function Query_Users(parentValue: unknown, graphqlArgs: unknown, context: {
    prismaClient: unknown;
}, resolveInfo: GraphQLResolveInfo): Promise<import("@prisma-to-graphql/prisma-resolver").PrismaResolverOutput>;
declare function Mutation_Users(parentValue: unknown, graphqlArgs: unknown, context: {
    prismaClient: unknown;
}, resolveInfo: GraphQLResolveInfo): Promise<import("@prisma-to-graphql/prisma-resolver").PrismaResolverOutput>;
declare function Query_Posts(parentValue: unknown, graphqlArgs: unknown, context: {
    prismaClient: unknown;
}, resolveInfo: GraphQLResolveInfo): Promise<import("@prisma-to-graphql/prisma-resolver").PrismaResolverOutput>;
declare function Mutation_Posts(parentValue: unknown, graphqlArgs: unknown, context: {
    prismaClient: unknown;
}, resolveInfo: GraphQLResolveInfo): Promise<import("@prisma-to-graphql/prisma-resolver").PrismaResolverOutput>;
export declare const resolvers: {
    Mutation: {
        Users: typeof Mutation_Users;
        Posts: typeof Mutation_Posts;
    };
    Query: {
        Users: typeof Query_Users;
        Posts: typeof Query_Posts;
    };
};
export {};
