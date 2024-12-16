import {OperationType} from '@prisma-to-graphql/core';

/**
 * All supported GraphQL block types.
 *
 * @category GraphQL Blocks
 */
export enum GraphqlBlockType {
    Schema = 'schema',
    Type = 'type',
    Input = 'input',
    Scalar = 'scalar',
    Property = 'property',
    Operation = 'operation',
    Union = 'union',
    Enum = 'enum',
}

/**
 * All supported GraphQL block types.
 *
 * @category GraphQL Blocks
 */
export type GraphqlBlock =
    | {
          type: GraphqlBlockType.Schema;
          comment?: string[] | undefined;
          blocks: GraphqlBlockByType[TopLevelBlockType][];
      }
    | {
          type: GraphqlBlockType.Input | GraphqlBlockType.Type;
          comment?: string[] | undefined;
          name: string;
          props: GraphqlBlockByType[GraphqlBlockType.Property | GraphqlBlockType.Operation][];
      }
    | {
          type: GraphqlBlockType.Scalar;
          comment?: string[] | undefined;
          name: string;
      }
    | {
          type: GraphqlBlockType.Property;
          comment?: string[] | undefined;
          name: string;
          /** Meaning the GraphQL value type. */
          value: string;
          required: boolean;
      }
    | {
          type: OperationType;
          comment?: string[] | undefined;
          blocks: GraphqlBlockByType[GraphqlBlockType.Property | GraphqlBlockType.Operation][];
      }
    | {
          type: GraphqlBlockType.Operation;
          comment?: string[] | undefined;
          name: string;
          args: GraphqlBlockByType[GraphqlBlockType.Property][];
          output: {
              value: string;
              required: boolean;
          };
      }
    | {
          type: GraphqlBlockType.Union;
          comment?: string[] | undefined;
          name: string;
          values: string[];
      }
    | {
          type: GraphqlBlockType.Enum;
          comment?: string[] | undefined;
          name: string;
          values: string[];
      };

/**
 * All top level GraphQL block types. These blocks are allowed at the top level of a schema. All
 * other blocks must be nested within another non-schema block.
 *
 * @category Internal
 */
export type TopLevelBlockType =
    | GraphqlBlockType.Scalar
    | OperationType
    | GraphqlBlockType.Input
    | GraphqlBlockType.Type
    | GraphqlBlockType.Schema
    | GraphqlBlockType.Enum
    | GraphqlBlockType.Union;

/**
 * Extracts the full GraphQL block type by the given block type.
 *
 * @category Internal
 */
export type GraphqlBlockByType = {
    [BlockType in GraphqlBlockType | OperationType]: Exclude<
        GraphqlBlock,
        {type: Exclude<GraphqlBlockType | OperationType, BlockType>}
    >;
};

/**
 * All named GraphQL blocks.
 *
 * @category Internal
 */
export type NamedGraphqlBlock = Extract<GraphqlBlock, {name: string}>;
/**
 * All named GraphQL blocks that are also top level blocks.
 *
 * @category Internal
 */
export type TopLevelNamedGraphqlBlock = Extract<NamedGraphqlBlock, {type: TopLevelBlockType}>;
