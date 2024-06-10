import {setupTestEnv} from './setup-test-env.test-helper';

export type PrismaClient = Awaited<ReturnType<typeof setupTestEnv>>;

export const resolverSeedData = {
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
