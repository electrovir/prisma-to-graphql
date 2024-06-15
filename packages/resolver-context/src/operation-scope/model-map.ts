/**
 * An individual model within a {@link ModelMap}.
 *
 * @category Operation Scope
 */
export type ModelMapModel = {
    [FieldName in string]: {
        type: string;
        isRelation: boolean;
        isList: boolean;
    };
};

/**
 * An individual field within a {@link ModelMapModel}.
 *
 * @category Operation Scope
 */
export type ModelMapField = {
    type: string;
    isRelation: boolean;
    isList: boolean;
};

/**
 * Model information generated from the `prisma-to-graphql` Prisma generator. This is required for
 * `OperationScope` to work.
 *
 * @category Operation Scope
 */
export type ModelMap = {
    [ModelName in string]: ModelMapModel;
};
