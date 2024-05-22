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
    await prismaClient.userSettings.upsert({
        update: {},
        create: {
            id: '',
            user: {
                connect: {
                    id: '',
                },
            },
        },
        where: {id: ''},
    });

    prismaClient.user.findMany({
        where: {
            firstName: 'Zebra',
        },
        select: {
            regions: {
                select: {
                    users: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            },
        },
    });

    prismaClient.region.findMany({
        select: {
            users: {
                select: {
                    firstName: true,
                    lastName: true,
                },
                where: {
                    role: 'user',
                },
            },
        },
    });

    await prismaClient.userSettings.findMany({
        where: {
            user: {
                role: 'user',
            },
        },
        select: {
            id: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });

    await prismaClient.user.create({
        data: {
            email: '',
            password: '',
            posts: {
                // createMany,
            },
            settings: {
                connect: {
                    id: 'yo',
                    receivesMarketingEmails: {},
                    stats: {},
                    user: {},
                },
            },
        },
    });
}

main(new PrismaClient());

Object.values;
