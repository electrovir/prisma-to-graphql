// generated by prisma-to-graphql

import {GraphQLResolveInfo} from 'graphql';
import {runPrismaResolver} from '@prisma-to-graphql/prisma-resolver';

async function Query_Users(parentValue: unknown, graphqlArgs: unknown, context: {prismaClient: unknown}, resolveInfo: GraphQLResolveInfo) {
    return await runPrismaResolver(context.prismaClient, 'User', graphqlArgs, resolveInfo);
}

async function Mutation_Users(parentValue: unknown, graphqlArgs: unknown, context: {prismaClient: unknown}, resolveInfo: GraphQLResolveInfo) {
    return await runPrismaResolver(context.prismaClient, 'User', graphqlArgs, resolveInfo);
}

async function Query_Companies(parentValue: unknown, graphqlArgs: unknown, context: {prismaClient: unknown}, resolveInfo: GraphQLResolveInfo) {
    return await runPrismaResolver(context.prismaClient, 'Company', graphqlArgs, resolveInfo);
}

async function Mutation_Companies(parentValue: unknown, graphqlArgs: unknown, context: {prismaClient: unknown}, resolveInfo: GraphQLResolveInfo) {
    return await runPrismaResolver(context.prismaClient, 'Company', graphqlArgs, resolveInfo);
}

export const resolvers = {
    Mutation: {
        Users: Mutation_Users,
        Companies: Mutation_Companies,
    },
    Query: {
        Users: Query_Users,
        Companies: Query_Companies,
    },
};
