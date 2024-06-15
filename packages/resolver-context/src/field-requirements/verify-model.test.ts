import {itCases} from '@augment-vir/chai';
import {generatedModels} from '../generated-models.mock';
import {ResolverOperation} from '../resolver-operation-type';
import {verifyModelFields} from './verify-model';

describe(verifyModelFields.name, () => {
    itCases(verifyModelFields, [
        {
            it: 'nulls a relational field',
            input: {
                data: {
                    id: 'hi',
                    regions: [
                        {
                            regionName: 'USA',
                        },
                    ],
                },
                fieldRequirements: {
                    Region: {
                        regionName: {
                            read() {
                                return false;
                            },
                        },
                    },
                },
                modelName: 'User',
                models: generatedModels,
                operation: ResolverOperation.Query,
                fieldChain: [],
            },
            expect: {
                messages: [
                    {
                        code: 'ptg-5',
                        description: 'field requirement failed',
                        message:
                            "ptg-5: Field requirement failed for 'Region.regionName' in query operation.",
                    },
                ],
                outputFieldPathsToNull: [
                    [
                        'regions',
                        'regionName',
                    ],
                ],
            },
        },
    ]);
});
