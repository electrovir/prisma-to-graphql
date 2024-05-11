import type {SchemaOperationParams} from '..';

export const operationFields: Readonly<SchemaOperationParams> = {
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
