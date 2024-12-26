import {OperationType} from '@prisma-to-graphql/core';
import {createGraphqlFetcher} from '../index.js';

/**
 * Both `Resolvers` and `schemaOperationTypeNames` will be generated from the `prisma-to-graphql`
 * package.
 */
import {Resolvers, schemaOperationTypeNames} from '../schema-output.mock.js';

const fetchGraphql = createGraphqlFetcher<Resolvers>(schemaOperationTypeNames);
export type FetchGraphql = typeof fetchGraphql;

async function getUsers(fetchGraphql: FetchGraphql) {
    const users = await fetchGraphql(
        {
            operationType: OperationType.Query,
            operationName: 'MyOperation',
            url: 'https://example.com/graphql',
        },
        {
            Users: [
                {
                    args: {
                        where: {
                            role: {equals: 'user'},
                        },
                    },
                    select: {
                        items: {
                            firstName: true,
                            lastName: true,
                            role: true,
                        },
                    },
                },
            ],
        },
    );

    console.info(users);
}

await getUsers(fetchGraphql);
