import {describe, itCases} from '@augment-vir/test';
import {GraphqlBlockType} from '../graphql-blocks/graphql-block.js';
import {generateExtraScalarBlocks} from './graphql-scalars.js';
import {GraphqlExtraScalar} from './scalar-type-map.js';

describe(generateExtraScalarBlocks.name, () => {
    itCases(generateExtraScalarBlocks, [
        {
            it: 'generates a supported extra scalar block',
            input: {[GraphqlExtraScalar.DateTime]: true},
            expect: [
                {
                    name: 'DateTime',
                    type: GraphqlBlockType.Scalar,
                },
            ],
        },
    ]);
});
