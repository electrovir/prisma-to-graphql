/**
 * A test script for testing connections to the database, or whatever else you want to test.
 *
 * Make sure that the database is seeded first, otherwise these commands won't make sense. The
 * easiest way to do that is to simply run `npm test` first (at least once).
 *
 * Run with:
 *
 *     npx tsx src/test/test.script.ts
 */

// @ts-ignore: this won't be generated until tests run at least once
import {PrismaClient} from '.prisma';

async function main(prismaClient: PrismaClient) {
    await prismaClient.user.update({
        where: {
            id: 'b12b86db-36a7-4644-8531-297cbb7b2d87',
        },
        data: {
            email: 'hello@example.com',
        },
    });
}

main(new PrismaClient());
