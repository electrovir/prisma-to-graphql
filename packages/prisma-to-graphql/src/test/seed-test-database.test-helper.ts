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
            posts: {
                create: [
                    {
                        body: 'this is my post',
                        title: 'this is my title',
                    },
                    {
                        body: 'this is my post 2',
                        title: 'this is my title 2',
                    },
                    {
                        body: 'this is my post 3',
                        title: 'this is my title 3',
                    },
                ],
            },
            regions: {
                create: [
                    {
                        regionName: 'West Coast',
                    },
                ],
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
            posts: {
                create: [
                    {
                        body: 'this is my post',
                        title: 'this is my title',
                    },
                    {
                        body: 'this is my post 2',
                        title: 'this is my title 2',
                    },
                    {
                        body: 'this is my post 3',
                        title: 'this is my title 3',
                    },
                ],
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
            posts: {
                create: [
                    {
                        body: 'this is my post',
                        title: 'this is my title',
                    },
                    {
                        body: 'this is my post 2',
                        title: 'this is my title 2',
                    },
                    {
                        body: 'this is my post 3',
                        title: 'this is my title 3',
                    },
                    {
                        body: 'this is my post 4',
                        title: 'unique title name',
                    },
                ],
            },
            regions: {
                create: [
                    {
                        regionName: 'USA',
                    },
                    {
                        regionName: 'East Coast',
                    },
                ],
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
            posts: {
                create: [
                    {
                        body: 'this is my post',
                        title: 'this is my title',
                    },
                    {
                        body: 'this is my post 2',
                        title: 'this is my title 2',
                    },
                    {
                        body: 'this is my post 3',
                        title: 'this is my title 3',
                    },
                ],
            },
            regions: {
                connect: [
                    {
                        regionName: 'USA',
                    },
                    {
                        regionName: 'West Coast',
                    },
                ],
            },
        },
        {
            email: 'test3@example.com',
            password: randomString(),
            firstName: 'No',
            lastName: 'Settings',
            phoneNumber: '1234567890',
            role: 'user',
            posts: {
                create: [
                    {
                        body: 'this is my post',
                        title: 'this is my title',
                    },
                    {
                        body: 'this is my post 2',
                        title: 'this is my title 2',
                    },
                    {
                        body: 'this is my post 3',
                        title: 'this is my title 3',
                    },
                    {
                        body: 'this is my post 4',
                        title: 'unique title name',
                    },
                ],
            },
            regions: {
                connect: [
                    {
                        regionName: 'USA',
                    },
                ],
            },
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
