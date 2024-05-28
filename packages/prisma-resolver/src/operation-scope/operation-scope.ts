import {ModelMap, ModelMapField, ModelMapModel} from './model-map';
import {MapPrismaType} from './prisma-type-map';

/**
 * Defines extra scopes, or extra requirements for each query. The defined scope will be merged with
 * all user queries to limit what data they can reach.
 *
 * @category Types
 * @example
 *     // this will limit all user queries or other queries that contain user relations to users
 *     // to only the id `current-user-id`.
 *     const example: OperationScope = {
 *         where: {
 *             User: {
 *                 id: 'current-user-id',
 *             },
 *         },
 *     };
 */
export type OperationScope<Models extends ModelMap> = Partial<{
    where: WhereScope<Models>;
}>;

/**
 * The user defined where scope. Includes entries for every model in the user provided model map.
 *
 * @category Types
 */
export type WhereScope<Models extends ModelMap> = {
    [ModelName in keyof Models]?: undefined | ModelScope<Models[ModelName]>;
};

/**
 * A user defined scope for a Model. Excludes all relation fields as they should be defined as their
 * own separate entry in the operation scope.
 *
 * @category Types
 */
export type ModelScope<Model extends ModelMapModel> = {
    [FieldName in keyof Model]?: Model[FieldName]['isRelation'] extends true
        ? WithCustomListOperation
        : FieldScope<Model[FieldName]>;
};

/**
 * Custom list operation setting. Only allowed in {@link ModelScope} for relation fields or
 * {@link FieldScope} for list fields.
 *
 * @category Types
 */
export type WithCustomListOperation = Partial<{
    /**
     * Set this to override the default list operation (`'some'`) when this field is used within a
     * list.
     */
    listOperation: ListOperation;
}>;

/**
 * Available list operation commands, per Prisma's JS client. When specified within
 * {@link FieldScope}, this operation will be used whenever the defined field scope happens to be
 * used inside a list (an array). By default, `'some'` is used.
 *
 * @category Types
 */
export type ListOperation = 'some' | 'none' | 'every';

/**
 * The default {@link ListOperation} is none are provided.
 *
 * @category Internals
 */
export const defaultListOperation: ListOperation = 'some' as const;

/**
 * Field scope for an individual field within a model within an {@link OperationScope}.
 *
 * @category Types
 */
export type FieldScope<ModelField extends ModelMapField> = {
    equals?: MapPrismaType<ModelField['type'], 'input'>;
    in?: MapPrismaType<ModelField['type'], 'input'>[];
} & (ModelField['isList'] extends true ? WithCustomListOperation : {}) &
    (ModelField['type'] extends 'String'
        ? {
              contains?: MapPrismaType<ModelField['type'], 'input'>;
          }
        : {});

/**
 * All props from `WhereEquality` which should be removed from the where clause before being passed
 * to Prisma.
 *
 * @category Internals
 */
export const customFieldScopeProps = ['listOperation'] as const satisfies (keyof Required<
    FieldScope<{
        isList: true;
        isRelation: boolean;
        type: '';
    }>
>)[];
