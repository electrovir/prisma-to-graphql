import {DMMF} from '@prisma/generator-helper';
import {type GraphqlBlockByType, GraphqlBlockType} from '../graphql/graphql-block.js';

/**
 * Build an enum GraphQL block.
 *
 * @category Prisma Generator
 */
export function buildEnum(
    dmmfEnum: Readonly<DMMF.DatamodelEnum>,
): GraphqlBlockByType[GraphqlBlockType.Enum] {
    return {
        name: dmmfEnum.name,
        comment: dmmfEnum.documentation?.split('\n'),
        type: GraphqlBlockType.Enum,
        values: dmmfEnum.values.map((value) => value.name),
    };
}
