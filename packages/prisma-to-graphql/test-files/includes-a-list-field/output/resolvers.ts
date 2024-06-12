// generated by prisma-to-graphql

import {GraphQLResolveInfo} from 'graphql';
import {runPrismaResolver} from '@prisma-to-graphql/prisma-resolver';

async function Query_Users(parentValue: unknown, graphqlArgs: unknown, context: any, resolveInfo: GraphQLResolveInfo) {
    return await runPrismaResolver(context, 'User', graphqlArgs, resolveInfo);
}

async function Mutation_Users(parentValue: unknown, graphqlArgs: unknown, context: any, resolveInfo: GraphQLResolveInfo) {
    return await runPrismaResolver(context, 'User', graphqlArgs, resolveInfo);
}

async function Query_Posts(parentValue: unknown, graphqlArgs: unknown, context: any, resolveInfo: GraphQLResolveInfo) {
    return await runPrismaResolver(context, 'Post', graphqlArgs, resolveInfo);
}

async function Mutation_Posts(parentValue: unknown, graphqlArgs: unknown, context: any, resolveInfo: GraphQLResolveInfo) {
    return await runPrismaResolver(context, 'Post', graphqlArgs, resolveInfo);
}

export const resolvers = {
    Mutation: {
        Users: Mutation_Users,
        Posts: Mutation_Posts,
    },
    Query: {
        Users: Query_Users,
        Posts: Query_Posts,
    },
};
