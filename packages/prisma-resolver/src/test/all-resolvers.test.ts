import {defineDmmfProperty} from '.prisma/runtime/library';
import {AnyObject, awaitedForEach, ensureErrorAndPrependMessage} from '@augment-vir/common';
import {log} from '@augment-vir/node-js';
import {assert} from 'chai';
import {assertThrows} from 'run-time-assertions';
import {prismaCreateTests} from './prisma-create.test-helper';
import {prismaDeleteTests} from './prisma-delete.test-helper';
import {prismaMutationTests} from './prisma-mutation.test-helper';
import {prismaQueryTests} from './prisma-query.test-helper';
import {prismaResolverTests} from './prisma-resolver.test-helper';
import {prismaUpdateTests} from './prisma-update.test-helper';
import {prismaUpsertTests} from './prisma-upsert.test-helper';
import {PrismaClient, resolverSeedData} from './resolver-seed-data.mock';
import {ResolverTestCaseParams, ResolverTests} from './resolver-test-case.test-helper';
import {setupTestEnv} from './setup-test-env.test-helper';

type RuntimeDataModel = Parameters<typeof defineDmmfProperty>[1];

/** Note: these tests are executed sequentially and their results depend on their order. */
const testCases: ReadonlyArray<Readonly<ResolverTests>> = [
    prismaCreateTests,
    prismaMutationTests,
    prismaQueryTests,
    prismaResolverTests,
    prismaUpdateTests,
    prismaUpsertTests,
    prismaDeleteTests,
];

async function truncateAllTables(prismaClient: PrismaClient) {
    const dataModel = (prismaClient as AnyObject)._runtimeDataModel as RuntimeDataModel;

    await awaitedForEach(
        Object.entries(dataModel.models),
        async ([
            modelName,
            model,
        ]) => {
            const tableName = model.dbName || modelName;
            await prismaClient.$executeRawUnsafe(`DELETE FROM ${tableName};`);
        },
    );
}

async function addSeedData(prismaClient: PrismaClient) {
    await awaitedForEach(Object.values(resolverSeedData), async (seedEntry) => {
        await prismaClient.user.create({
            data: seedEntry,
        });
    });
}

describe('all resolvers', () => {
    it('pass all tests', async () => {
        const prismaClient = await setupTestEnv();

        const testCaseParams: ResolverTestCaseParams = {prismaClient};

        await awaitedForEach(testCases, async (tester) => {
            log.faint(`testing '${tester.describe}'`);

            await awaitedForEach(tester.cases, async (testCase) => {
                log.faint(`testing '${tester.describe} -> ${testCase.it}'`);
                try {
                    await truncateAllTables(prismaClient);
                    if (!testCase.skipSeeding) {
                        await addSeedData(prismaClient);
                    }

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
