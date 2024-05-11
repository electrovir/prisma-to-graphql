import {awaitedForEach, getObjectTypedEntries, randomString} from '@augment-vir/common';

// @ts-ignore: this won't be generated until tests run at least once
import {PrismaClient} from '.prisma';

// @ts-ignore: this won't be generated until tests run at least once
const seedData: {user: Parameters<PrismaClient['user']['create']>[0]['data'][]} = {
    user: [
        {
            email: 'test1@example.com',
            password: randomString(),
            firstName: 'Super',
            lastName: 'Mega',
            phoneNumber: '1234567890',
            role: 'user',
            settings: {
                create: {
                    canViewReports: true,
                    receivesMarketingEmails: true,
                    stats: {
                        create: {
                            dislikes: 10,
                            likes: 20,
                            views: 30,
                        },
                    },
                },
            },
        },
        {
            email: 'test2@example.com',
            password: randomString(),
            firstName: 'Nick',
            lastName: 'Jordan',
            phoneNumber: '1234567890',
            role: 'manager',
            settings: {
                create: {
                    canViewReports: false,
                    receivesMarketingEmails: true,
                },
            },
        },
        {
            email: 'test3@example.com',
            password: randomString(),
            firstName: 'Derp',
            lastName: 'Doo',
            phoneNumber: '1234567890',
            role: 'user',
            settings: {
                create: {
                    canViewReports: false,
                    receivesMarketingEmails: false,
                },
            },
        },
        {
            email: 'test3@example.com',
            password: randomString(),
            firstName: 'Zebra',
            lastName: 'Proton',
            phoneNumber: '5',
            role: 'user',
            settings: {
                create: {
                    canViewReports: true,
                    receivesMarketingEmails: false,
                },
            },
        },
        {
            email: 'test3@example.com',
            password: randomString(),
            firstName: 'No',
            lastName: 'Settings',
            phoneNumber: '1234567890',
            role: 'user',
        },
    ],
};

export async function seedDatabase(prismaClient: PrismaClient) {
    await awaitedForEach(
        getObjectTypedEntries(seedData),
        async ([
            modelName,
            dataEntries,
        ]) => {
            await awaitedForEach(dataEntries, async (dataEntry) => {
                await prismaClient[modelName].create({data: dataEntry});
            });
        },
    );
}
