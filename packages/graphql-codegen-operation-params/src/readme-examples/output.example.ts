import {SchemaOperationTypeNames} from '@prisma-to-graphql/core';

export const operationFields: Readonly<SchemaOperationTypeNames> = {
    Mutation: {
        myMutationResolver: {
            args: {
                where: 'User!',
                data: 'UserInput!',
            },
            output: 'Boolean!',
        },
    },
    Query: {
        getLatestUser: {
            args: {},
            output: 'User!',
        },
        findUser: {
            args: {
                id: 'String',
                settings: 'Settings',
            },
            output: 'User',
        },
    },
};
