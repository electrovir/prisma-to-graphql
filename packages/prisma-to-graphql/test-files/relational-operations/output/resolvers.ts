// generated by prisma-to-graphql

import {GraphQLResolveInfo} from 'graphql';
import {runPrismaResolver} from '@prisma-to-graphql/prisma-resolver';

async function Query_Users(parentValue: unknown, graphqlArgs: unknown, context: unknown, resolveInfo: GraphQLResolveInfo) {
    return await runPrismaResolver(context, 'User', graphqlArgs, resolveInfo);
}

async function Mutation_Users(parentValue: unknown, graphqlArgs: unknown, context: unknown, resolveInfo: GraphQLResolveInfo) {
    return await runPrismaResolver(context, 'User', graphqlArgs, resolveInfo);
}

async function Query_UserSettings(parentValue: unknown, graphqlArgs: unknown, context: unknown, resolveInfo: GraphQLResolveInfo) {
    return await runPrismaResolver(context, 'UserSettings', graphqlArgs, resolveInfo);
}

async function Mutation_UserSettings(parentValue: unknown, graphqlArgs: unknown, context: unknown, resolveInfo: GraphQLResolveInfo) {
    return await runPrismaResolver(context, 'UserSettings', graphqlArgs, resolveInfo);
}

export const resolvers = {
    Mutation: {
        Users: Mutation_Users,
        UserSettings: Mutation_UserSettings,
    },
    Query: {
        Users: Query_Users,
        UserSettings: Query_UserSettings,
    },
};
