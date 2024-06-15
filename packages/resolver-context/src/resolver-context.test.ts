import {generatedModels} from './generated-models.mock';
import {definePrismaToGraphqlResolverContext} from './resolver-context';

describe(definePrismaToGraphqlResolverContext.name, () => {
    it('enforces correct type', () => {
        definePrismaToGraphqlResolverContext(generatedModels, {
            prismaClient: {},
            fieldRequirements: {
                User: {
                    addresses: {
                        create() {
                            return false;
                        },
                    },
                },
                Region: {},
            },
            operationScope: {
                where: {
                    Region: {
                        regionName: {
                            equals: 'hi',
                        },
                    },
                    User: {},
                },
            },
        });
        definePrismaToGraphqlResolverContext(generatedModels, {
            prismaClient: {},
            fieldRequirements: {
                // @ts-expect-error: intentionally not a valid model name
                'fake-model': {},
            },
            operationScope: {
                where: {
                    // @ts-expect-error: intentionally not a valid model name
                    'fake-model': {},
                },
            },
        });
    });
});
