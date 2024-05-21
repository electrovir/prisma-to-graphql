import { GraphQLResolveInfo } from 'graphql';
declare function Query_Users(parentValue: unknown, graphqlArgs: unknown, context: unknown, resolveInfo: GraphQLResolveInfo): Promise<import("@prisma-to-graphql/prisma-resolver").PrismaResolverOutput>;
declare function Mutation_Users(parentValue: unknown, graphqlArgs: unknown, context: unknown, resolveInfo: GraphQLResolveInfo): Promise<import("@prisma-to-graphql/prisma-resolver").PrismaResolverOutput>;
declare function Query_Companies(parentValue: unknown, graphqlArgs: unknown, context: unknown, resolveInfo: GraphQLResolveInfo): Promise<import("@prisma-to-graphql/prisma-resolver").PrismaResolverOutput>;
declare function Mutation_Companies(parentValue: unknown, graphqlArgs: unknown, context: unknown, resolveInfo: GraphQLResolveInfo): Promise<import("@prisma-to-graphql/prisma-resolver").PrismaResolverOutput>;
export declare const resolvers: {
    Mutation: {
        Users: typeof Mutation_Users;
        Companies: typeof Mutation_Companies;
    };
    Query: {
        Users: typeof Query_Users;
        Companies: typeof Query_Companies;
    };
};
export {};
