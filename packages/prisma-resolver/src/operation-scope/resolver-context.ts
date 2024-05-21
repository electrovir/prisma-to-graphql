/**
 * Note: this file is symlinked to from the scripts package so it can be used when setting up test
 * GraphQL servers.
 */

import {PartialAndUndefined} from '@augment-vir/common';
import {JsonPrimitive} from 'type-fest';

export type ResolverContext<PrismaClient = any> = {
    prismaClient: PrismaClient;
    models?: ModelMap | undefined;
    operationScope?: OperationScope | undefined;
};

/** Defines extra scopes where */
export type OperationScope = PartialAndUndefined<{
    where: WhereScope;
}>;

export type WhereEquality = {
    AND?: FieldScope[];
    equals?: JsonPrimitive;
    in?: JsonPrimitive[];
};

export type FieldScope = {
    [FieldName in string]: WhereEquality | FieldScope;
};

export type WhereScope = {
    [ModelName in string]: FieldScope;
};

export type ModelMap = {
    [ModelName in string]: {
        [FieldName in string]: {
            type: string;
            isRelation: boolean;
        };
    };
};
