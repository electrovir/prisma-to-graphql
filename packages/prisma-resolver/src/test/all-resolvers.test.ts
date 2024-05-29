import {awaitedForEach, ensureErrorAndPrependMessage} from '@augment-vir/common';
import {log} from '@augment-vir/node-js';
import {assert} from 'chai';
import {Kind, OperationTypeNode} from 'graphql';
import {assertThrows} from 'run-time-assertions';
import {RequireExactlyOne} from 'type-fest';
import {generatedModels} from '../operation-scope/generated-models.mock';
import {runCreate} from '../resolver/mutations/prisma-create-operation';
import {runPrismaMutationOperation} from '../resolver/mutations/prisma-mutation-operation';
import {runUpdate} from '../resolver/mutations/prisma-update-operation';
import {runUpsert} from '../resolver/mutations/prisma-upsert-operation';
import {PrismaResolverOutput} from '../resolver/prisma-resolver';
import {runPrismaQueryOperations} from '../resolver/queries/prisma-query-operation';
import {runPrismaResolver} from '../resolver/run-prisma-resolver';
import {setupTestEnv} from './setup-test-env.test-helper';

type PrismaClient = Awaited<ReturnType<typeof setupTestEnv>>;
type TestCaseParams = {prismaClient: PrismaClient};
type TestCase = {
    it: string;
    test({prismaClient}: TestCaseParams): Promise<PrismaResolverOutput>;
} & RequireExactlyOne<{
    expect: PrismaResolverOutput;
    throws: string;
}>;
type TestCases = {
    describe: string;
    cases: TestCase[];
}[];

const seedData = {
    basic: {
        email: 'basic@example.com',
        role: 'user',
        firstName: 'Basic',
        lastName: 'McGee',
        phoneNumber: '12345678900',
        settings: {
            create: {
                canViewReports: false,
                receivesMarketingEmails: false,
                stats: {
                    create: {
                        dislikes: 10,
                        likes: 10,
                        views: 100,
                    },
                },
            },
        },
        regions: {
            create: [
                {
                    regionName: 'Fake',
                },
            ],
        },
    },
    withId: {
        email: 'has-id@example.com',
        role: 'admin',
        firstName: 'Has',
        lastName: 'Id',
        phoneNumber: '12345678900',
        id: 'some-uuid',
    },
    superLiked: {
        email: 'super-liked@example.com',
        role: 'user',
        firstName: 'Super',
        lastName: 'Liked',
        phoneNumber: '12345678900',
        settings: {
            create: {
                canViewReports: false,
                receivesMarketingEmails: false,
                stats: {
                    create: {
                        dislikes: 1,
                        likes: 99,
                        views: 100,
                    },
                },
            },
        },
    },
    admin: {
        email: 'admin@example.com',
        role: 'admin',
        firstName: 'Over',
        lastName: 'Lord',
        phoneNumber: '12345678900',
        settings: {
            create: {
                canViewReports: true,
                receivesMarketingEmails: true,
                stats: {
                    create: {
                        dislikes: 0,
                        likes: 0,
                        views: 0,
                    },
                },
            },
        },
    },
    // @ts-ignore: prisma client isn't generated until tests run at least once
} satisfies Readonly<Record<string, Parameters<PrismaClient['user']['create']>[0]['data']>>;

/** Note: these tests are executed sequentially and their results depend on their order. */
const testCases: Readonly<TestCases> = [
    {
        describe: runCreate.name,
        cases: [
            {
                it: 'creates multiple entries',
                async test({prismaClient}) {
                    return await runCreate({
                        graphqlArgs: {
                            create: {
                                data: Object.values(seedData),
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                items: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                        phoneNumber: true,
                                    },
                                },
                            },
                        },
                    });
                },
                expect: {
                    items: [
                        {
                            email: 'basic@example.com',
                            firstName: 'Basic',
                            lastName: 'McGee',
                            phoneNumber: '12345678900',
                        },
                        {
                            email: 'has-id@example.com',
                            firstName: 'Has',
                            lastName: 'Id',
                            phoneNumber: '12345678900',
                        },
                        {
                            email: 'super-liked@example.com',
                            firstName: 'Super',
                            lastName: 'Liked',
                            phoneNumber: '12345678900',
                        },
                        {
                            email: 'admin@example.com',
                            firstName: 'Over',
                            lastName: 'Lord',
                            phoneNumber: '12345678900',
                        },
                    ],
                    total: 4,
                },
            },
            {
                it: 'fails to create with a duplicate id',
                async test({prismaClient}) {
                    return await runCreate({
                        graphqlArgs: {
                            create: {
                                data: [seedData.withId],
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                items: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                        phoneNumber: true,
                                    },
                                },
                            },
                        },
                    });
                },
                expect: {
                    items: [],
                    total: 0,
                },
            },
            {
                it: 'rejects a non-object data entry',
                async test({prismaClient}) {
                    return await runCreate({
                        graphqlArgs: {
                            create: {
                                data: ['invalid data'],
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                total: true,
                            },
                        },
                    });
                },
                throws: "Invalid data array entry at index '0': expected an object.",
            },
            {
                it: 'selects no items',
                async test({prismaClient}) {
                    return await runCreate({
                        graphqlArgs: {
                            create: {
                                data: [
                                    {
                                        ...seedData.admin,
                                        email: 'another-admin@example.com',
                                    },
                                ],
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                total: true,
                            },
                        },
                    });
                },
                expect: {
                    total: 1,
                    items: [],
                },
            },
            {
                it: 'rejects missing data',
                async test({prismaClient}) {
                    return await runCreate({
                        graphqlArgs: {
                            create: {},
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {},
                        },
                    });
                },
                throws: "Missing valid 'create.data' input",
            },
        ],
    },
    {
        describe: runUpdate.name,
        cases: [
            {
                it: 'updates an existing value',
                async test({prismaClient}) {
                    return await runUpdate({
                        graphqlArgs: {
                            update: {
                                where: {
                                    lastName: {
                                        contains: 'Gee',
                                    },
                                },
                                data: {
                                    phoneNumber: 'invalid number',
                                },
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                    });
                },
                expect: {
                    items: [],
                    total: 1,
                },
            },
            {
                it: 'rejects missing where for update',
                async test({prismaClient}) {
                    return await runUpdate({
                        graphqlArgs: {
                            update: {
                                data: {
                                    phoneNumber: 'invalid number',
                                },
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                    });
                },
                throws: "Missing valid 'update.where' input",
            },
            {
                it: 'rejects missing data',
                async test({prismaClient}) {
                    return await runUpdate({
                        graphqlArgs: {
                            update: {
                                where: {
                                    lastName: {
                                        contains: 'Gee',
                                    },
                                },
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                    });
                },
                throws: "Missing valid 'update.data' input.",
            },
        ],
    },
    {
        describe: runPrismaQueryOperations.name,
        cases: [
            {
                it: 'does not calculate total if not selected',
                async test({prismaClient}) {
                    return await runPrismaQueryOperations({
                        graphqlArgs: {
                            where: {
                                role: {
                                    equals: 'user',
                                },
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                items: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        phoneNumber: true,
                                        email: true,
                                        role: true,
                                    },
                                },
                            },
                        },
                    });
                },
                expect: {
                    total: 0,
                    items: [
                        {
                            email: 'basic@example.com',
                            firstName: 'Basic',
                            lastName: 'McGee',
                            phoneNumber: 'invalid number',
                            role: 'user',
                        },
                        {
                            email: 'super-liked@example.com',
                            firstName: 'Super',
                            lastName: 'Liked',
                            phoneNumber: '12345678900',
                            role: 'user',
                        },
                    ],
                },
            },
            {
                it: 'handles missing where',
                async test({prismaClient}) {
                    return await runPrismaQueryOperations({
                        graphqlArgs: {},
                        context: {
                            prismaClient,
                            models: generatedModels,
                            operationScope: {
                                where: {
                                    User: {
                                        firstName: {equals: 'Basic'},
                                    },
                                },
                            },
                        },
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                items: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        phoneNumber: true,
                                        email: true,
                                        role: true,
                                    },
                                },
                            },
                        },
                    });
                },
                expect: {
                    items: [
                        {
                            email: 'basic@example.com',
                            firstName: 'Basic',
                            lastName: 'McGee',
                            phoneNumber: 'invalid number',
                            role: 'user',
                        },
                    ],
                    total: 0,
                },
            },
            {
                it: 'handles irrelevant operation scope',
                async test({prismaClient}) {
                    return await runPrismaQueryOperations({
                        graphqlArgs: {},
                        context: {
                            prismaClient,
                            models: generatedModels,
                            operationScope: {
                                where: {
                                    User: {},
                                },
                            },
                        },
                        prismaModelName: 'Region',
                        selection: {
                            select: {
                                items: {
                                    select: {
                                        regionName: true,
                                        users: {
                                            select: {
                                                firstName: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    });
                },
                expect: {
                    items: [
                        {
                            regionName: 'Fake',
                            users: [
                                {
                                    firstName: 'Basic',
                                },
                            ],
                        },
                    ],
                    total: 0,
                },
            },
            {
                it: 'handles irrelevant operation scope with a where',
                async test({prismaClient}) {
                    return await runPrismaQueryOperations({
                        graphqlArgs: {
                            where: {
                                regionName: {equals: 'Fake'},
                            },
                        },
                        context: {
                            prismaClient,
                            models: generatedModels,
                            operationScope: {
                                where: {
                                    User: {},
                                },
                            },
                        },
                        prismaModelName: 'Region',
                        selection: {
                            select: {
                                items: {
                                    select: {
                                        regionName: true,
                                        users: {
                                            select: {
                                                firstName: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    });
                },
                expect: {
                    items: [
                        {
                            regionName: 'Fake',
                            users: [
                                {
                                    firstName: 'Basic',
                                },
                            ],
                        },
                    ],
                    total: 0,
                },
            },
            {
                it: 'handles relevant operation scope with a where',
                async test({prismaClient}) {
                    return await runPrismaQueryOperations({
                        graphqlArgs: {
                            where: {
                                regionName: {equals: 'Fake'},
                            },
                        },
                        context: {
                            prismaClient,
                            models: generatedModels,
                            operationScope: {
                                where: {
                                    User: {
                                        firstName: {equals: 'Basic'},
                                    },
                                },
                            },
                        },
                        prismaModelName: 'Region',
                        selection: {
                            select: {
                                items: {
                                    select: {
                                        regionName: true,
                                        users: {
                                            select: {
                                                firstName: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    });
                },
                expect: {
                    items: [
                        {
                            regionName: 'Fake',
                            users: [
                                {
                                    firstName: 'Basic',
                                },
                            ],
                        },
                    ],
                    total: 0,
                },
            },
            {
                it: 'does not return query items if not selected',
                async test({prismaClient}) {
                    return await runPrismaQueryOperations({
                        graphqlArgs: {
                            where: {
                                role: {
                                    equals: 'user',
                                },
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                total: true,
                            },
                        },
                    });
                },
                expect: {
                    total: 2,
                    items: [],
                },
            },
            {
                it: 'calculates total when selected',
                async test({prismaClient}) {
                    return await runPrismaQueryOperations({
                        graphqlArgs: {
                            where: {
                                role: {
                                    equals: 'user',
                                },
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                items: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                        role: true,
                                    },
                                },
                            },
                        },
                    });
                },
                expect: {
                    total: 0,
                    items: [
                        {
                            email: 'basic@example.com',
                            firstName: 'Basic',
                            lastName: 'McGee',
                            role: 'user',
                        },
                        {
                            email: 'super-liked@example.com',
                            firstName: 'Super',
                            lastName: 'Liked',
                            role: 'user',
                        },
                    ],
                },
            },
            {
                it: 'supports a cursor',
                async test({prismaClient}) {
                    const firstUser = await prismaClient.user.findFirstOrThrow({
                        orderBy: {
                            firstName: {
                                sort: 'asc',
                            },
                        },
                        select: {
                            firstName: true,
                            id: true,
                        },
                    });

                    return await runPrismaQueryOperations({
                        graphqlArgs: {
                            orderBy: {
                                firstName: {
                                    sort: 'asc',
                                },
                            },
                            cursor: {
                                id: firstUser.id,
                            },
                            take: 2,
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                total: true,
                                items: {
                                    select: {
                                        firstName: true,
                                    },
                                },
                            },
                        },
                    });
                },
                expect: {
                    total: 5,
                    items: [
                        {
                            firstName: 'Has',
                        },
                        {
                            firstName: 'Over',
                        },
                    ],
                },
            },
            {
                it: 'fails on an invalid cursor',
                async test({prismaClient}) {
                    return await runPrismaQueryOperations({
                        graphqlArgs: {
                            orderBy: {
                                firstName: {
                                    sort: 'asc',
                                },
                            },
                            cursor: 'this should be an object',
                            take: 2,
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                total: true,
                                items: {
                                    select: {
                                        firstName: true,
                                        id: true,
                                    },
                                },
                            },
                        },
                    });
                },
                throws: 'Invalid value provided. Expected UserWhereUniqueInput, provided String.',
            },
        ],
    },
    {
        describe: runUpsert.name,
        cases: [
            {
                it: 'updates an existing entry',
                async test({prismaClient}) {
                    return await runUpsert({
                        graphqlArgs: {
                            upsert: {
                                data: {
                                    firstName: 'updated',
                                },
                                where: {
                                    email: seedData.basic.email,
                                },
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                items: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                    },
                                },
                                count: true,
                            },
                        },
                    });
                },
                expect: {
                    items: [
                        {
                            firstName: 'updated',
                            lastName: 'McGee',
                            email: seedData.basic.email,
                        },
                    ],
                    total: 1,
                },
            },
            {
                it: 'creates a new entry',
                async test({prismaClient}) {
                    return await runUpsert({
                        graphqlArgs: {
                            upsert: {
                                data: {
                                    firstName: 'new user',
                                },
                                where: {
                                    email: 'new-email@example.com',
                                },
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                items: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                        role: true,
                                    },
                                },
                                count: true,
                            },
                        },
                    });
                },
                expect: {
                    items: [
                        {
                            firstName: 'new user',
                            lastName: null,
                            role: null,
                            email: 'new-email@example.com',
                        },
                    ],
                    total: 1,
                },
            },
            {
                it: 'fails creating a new entry without required unique fields',
                async test({prismaClient}) {
                    return await runUpsert({
                        graphqlArgs: {
                            upsert: {
                                data: {
                                    firstName: 'new user',
                                },
                                where: {},
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                items: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                        role: true,
                                    },
                                },
                                count: true,
                            },
                        },
                    });
                },
                throws: 'Argument `where` needs at least one of `id` or `email` arguments.',
            },
            {
                it: 'fails if no data',
                async test({prismaClient}) {
                    return await runUpsert({
                        graphqlArgs: {
                            upsert: {
                                where: {},
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                items: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                        role: true,
                                    },
                                },
                                count: true,
                            },
                        },
                    });
                },
                throws: "Missing valid 'upsert.data' input",
            },
            {
                it: 'fails if no where',
                async test({prismaClient}) {
                    return await runUpsert({
                        graphqlArgs: {
                            upsert: {
                                data: {},
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                items: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                        role: true,
                                    },
                                },
                                count: true,
                            },
                        },
                    });
                },
                throws: "Missing valid 'upsert.where' input",
            },
            {
                it: 'omits items if not selected',
                async test({prismaClient}) {
                    return await runUpsert({
                        graphqlArgs: {
                            upsert: {
                                data: {
                                    firstName: 'updated 2',
                                },
                                where: {
                                    email: seedData.basic.email,
                                },
                            },
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {
                            select: {
                                count: true,
                            },
                        },
                    });
                },
                expect: {
                    total: 1,
                    items: [],
                },
            },
        ],
    },
    {
        describe: runPrismaMutationOperation.name,
        cases: [
            {
                it: 'rejects if all args are missing',
                async test({prismaClient}) {
                    return runPrismaMutationOperation({
                        graphqlArgs: {},
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {select: {}},
                    });
                },
                throws: 'At least one mutation arg must be provided: create, update, or upsert',
            },
            {
                it: 'errors in upsert command',
                async test({prismaClient}) {
                    return runPrismaMutationOperation({
                        graphqlArgs: {
                            upsert: {},
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {select: {}},
                    });
                },
                throws: "Missing valid 'upsert.data' input",
            },
            {
                it: 'errors in create command',
                async test({prismaClient}) {
                    return runPrismaMutationOperation({
                        graphqlArgs: {
                            create: {},
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {select: {}},
                    });
                },
                throws: "Missing valid 'create.data' input.",
            },
            {
                it: 'errors in update command',
                async test({prismaClient}) {
                    return runPrismaMutationOperation({
                        graphqlArgs: {
                            update: {},
                        },
                        context: {prismaClient},
                        prismaModelName: 'User',
                        selection: {select: {}},
                    });
                },
                throws: "Missing valid 'update.data' input.",
            },
        ],
    },
    {
        describe: runPrismaResolver.name,
        cases: [
            {
                it: 'executes a query',
                async test({prismaClient}) {
                    return await runPrismaResolver(
                        {prismaClient},
                        'User',
                        {
                            where: {
                                role: {
                                    equals: 'user',
                                },
                            },
                        },
                        {
                            fieldName: 'Users',
                            fieldNodes: [
                                {
                                    kind: Kind.FIELD,
                                    name: {
                                        kind: Kind.NAME,
                                        value: 'Users',
                                    },
                                },
                            ],
                            operation: {
                                kind: Kind.OPERATION_DEFINITION,
                                operation: OperationTypeNode.QUERY,
                                selectionSet: {
                                    kind: Kind.SELECTION_SET,
                                    selections: [
                                        {
                                            kind: Kind.FIELD,
                                            name: {
                                                kind: Kind.NAME,
                                                value: 'Users',
                                            },
                                            selectionSet: {
                                                kind: Kind.SELECTION_SET,
                                                selections: [
                                                    {
                                                        kind: Kind.FIELD,
                                                        name: {
                                                            kind: Kind.NAME,
                                                            value: 'total',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    );
                },
                expect: {
                    total: 2,
                    items: [],
                },
            },
            {
                it: 'fails on a subscription',
                async test({prismaClient}) {
                    return await runPrismaResolver(
                        {prismaClient},
                        'User',
                        {},
                        {
                            fieldName: 'Users',
                            fieldNodes: [
                                {
                                    kind: Kind.FIELD,
                                    name: {
                                        kind: Kind.NAME,
                                        value: 'Users',
                                    },
                                },
                            ],
                            operation: {
                                kind: Kind.OPERATION_DEFINITION,
                                operation: OperationTypeNode.SUBSCRIPTION,
                                selectionSet: {
                                    kind: Kind.SELECTION_SET,
                                    selections: [
                                        {
                                            kind: Kind.FIELD,
                                            name: {
                                                kind: Kind.NAME,
                                                value: 'Users',
                                            },
                                            selectionSet: {
                                                kind: Kind.SELECTION_SET,
                                                selections: [
                                                    {
                                                        kind: Kind.FIELD,
                                                        name: {
                                                            kind: Kind.NAME,
                                                            value: 'total',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    );
                },
                throws: "Unsupported operation: 'subscription'",
            },
            {
                it: 'rejects empty selection',
                async test({prismaClient}) {
                    return await runPrismaResolver(
                        {prismaClient},
                        'User',
                        {
                            where: {
                                role: {
                                    equals: 'user',
                                },
                            },
                        },
                        {
                            fieldName: 'Users',
                            fieldNodes: [
                                {
                                    kind: Kind.FIELD,
                                    name: {
                                        kind: Kind.NAME,
                                        value: 'Users',
                                    },
                                },
                            ],
                            operation: {
                                kind: Kind.OPERATION_DEFINITION,
                                operation: OperationTypeNode.QUERY,
                                selectionSet: {
                                    kind: Kind.SELECTION_SET,
                                    selections: [
                                        {
                                            kind: Kind.FIELD,
                                            name: {
                                                kind: Kind.NAME,
                                                value: 'total',
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    );
                },
                throws: "Neither 'total' or 'items' where selected: there's nothing to do",
            },
        ],
    },
];

describe('all resolvers', () => {
    it('pass all tests', async () => {
        const prismaClient = await setupTestEnv();

        const testCaseParams: TestCaseParams = {prismaClient};

        await awaitedForEach(testCases, async (tester) => {
            log.faint(`testing '${tester.describe}'`);

            await awaitedForEach(tester.cases, async (testCase) => {
                log.faint(`testing '${tester.describe} -> ${testCase.it}'`);
                try {
                    if (testCase.throws) {
                        await assertThrows(async () => await testCase.test(testCaseParams), {
                            matchMessage: testCase.throws,
                        });
                    } else {
                        assert.deepStrictEqual(
                            await testCase.test(testCaseParams),
                            testCase.expect,
                        );
                    }
                } catch (error) {
                    throw ensureErrorAndPrependMessage(
                        error,
                        `${tester.describe} -> ${testCase.it}`,
                    );
                }
            });
        });
    });
});
