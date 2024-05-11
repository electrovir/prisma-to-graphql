import {OperationType} from '../operation-type';
/**
 * All supported GraphQL block types.
 *
 * @category Builders
 */
export type GraphqlBlock =
    | {
          type: 'schema';
          comment?: string[];
          blocks: GraphqlBlockByType<TopLevelBlockType>[];
      }
    | {
          type: 'input' | 'type';
          comment?: string[];
          name: string;
          props: GraphqlBlockByType<'property' | 'operation'>[];
      }
    | {
          type: 'scalar';
          comment?: string[];
          name: string;
      }
    | {
          type: 'property';
          comment?: string[];
          name: string;
          value: string;
          required: boolean;
      }
    | {
          type: OperationType;
          comment?: string[];
          blocks: GraphqlBlockByType<'property' | 'operation'>[];
      }
    | {
          type: 'operation';
          comment?: string[];
          name: string;
          args: GraphqlBlockByType<'property'>[];
          output: {
              value: string;
              required: boolean;
          };
      }
    | {
          type: 'union';
          comment?: string[];
          name: string;
          values: string[];
      }
    | {
          type: 'enum';
          comment?: string[];
          name: string;
          values: string[];
      };

/**
 * All supported GraphQL block types.
 *
 * @category Builders
 */
export type GraphqlBlockType = GraphqlBlock['type'];

/**
 * All top level GraphQL block types. These blocks are allowed at the top level of a schema. All
 * other blocks must be nested within another non-schema block.
 *
 * @category Builders
 */
export type TopLevelBlockType =
    | 'scalar'
    | OperationType
    | 'input'
    | 'type'
    | 'schema'
    | 'enum'
    | 'union';

/**
 * Extracts the full GraphQL block type by the given block type.
 *
 * @category Builders
 */
export type GraphqlBlockByType<BlockType extends GraphqlBlockType> = Exclude<
    GraphqlBlock,
    {type: Exclude<GraphqlBlockType, BlockType>}
>;

/**
 * All named GraphQL blocks.
 *
 * @category Builders
 */
export type NamedGraphqlBlock = Extract<GraphqlBlock, {name: string}>;
/**
 * All named GraphQL blocks that are also top level blocks.
 *
 * @category Builders
 */
export type TopLevelNamedGraphqlBlock = Extract<NamedGraphqlBlock, {type: TopLevelBlockType}>;
