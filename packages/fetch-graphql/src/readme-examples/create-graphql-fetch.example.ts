import {createGraphqlFetcher} from '..';
/** Both `Resolvers` and `operationParams` are generated from the `prisma-to-graphql` package. */
import {Resolvers, operationParams} from '../my-generated-schema-outputs';

const fetchGraphql = createGraphqlFetcher<Resolvers>(operationParams);
export type FetchGraphql = typeof fetchGraphql;

async function getUsers(fetchGraphql: FetchGraphql) {
    const users = await fetchGraphql(
        {
            operationType: 'Query',
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

getUsers(fetchGraphql);
