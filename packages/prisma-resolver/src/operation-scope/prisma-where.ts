import {filterObject, mapObjectValues, omitObjectKeys} from '@augment-vir/common';
import {assertDefined} from 'run-time-assertions';
import {
    FieldScope,
    ListOperation,
    ModelMap,
    WhereScope,
    customFieldScopeProps,
} from './resolver-context';

/**
 * A direct-to-prisma `where` for a single model.
 *
 * @category Internals
 */
export type SingleModelPrismaWhere<
    Models extends ModelMap,
    ModelName extends keyof Models,
> = Partial<{
    [FieldName in keyof Models[ModelName]]: PrismaWhereField<Models, ModelName, FieldName>;
}>;

/**
 * A single field for {@link SingleModelPrismaWhere}.
 *
 * @category Internals
 */
export type PrismaWhereField<
    Models extends ModelMap,
    ModelName extends keyof Models,
    FieldName extends keyof Models[ModelName],
> = Models[ModelName][FieldName]['isList'] extends true
    ? PrismaWhereFieldList<Models, ModelName, FieldName>
    : PrismaWhereCondition<Models, Models[ModelName][FieldName]['type']>;

/**
 * A single list field for {@link PrismaWhereField}.
 *
 * @category Internals
 */
export type PrismaWhereFieldList<
    Models extends ModelMap,
    ModelName extends keyof Models,
    FieldName extends keyof Models[ModelName],
> = Partial<{
    [Operation in ListOperation]: PrismaWhereCondition<
        Models,
        Models[ModelName][FieldName]['type']
    >;
}>;

/**
 * Allowed equality conditions for a single field in {@link PrismaWhereField}.
 *
 * @category Internals
 */
export type PrismaWhereCondition<
    Models extends ModelMap,
    FieldType extends string,
> = FieldType extends keyof Models
    ? SingleModelPrismaWhere<Models, FieldType>
    : Omit<FieldScope<FieldType>, 'listOperation'>;

/**
 * Expand an operations scope's "where" into a Prisma client compatible "where" input, based on the
 * current model which is being queried.
 *
 * @category Internals
 */
export function generatePrismaWhere<
    const Models extends ModelMap,
    const ModelName extends keyof Models,
>(
    modelUnderQuery: ModelName,
    models: Readonly<Models>,
    whereScope: Readonly<WhereScope<Models>>,
): SingleModelPrismaWhere<Models, ModelName> | undefined {
    return recursivelyBuildWhere(modelUnderQuery, models, whereScope, new Set());
}

function recursivelyBuildWhere<const Models extends ModelMap, const ModelName extends keyof Models>(
    modelName: ModelName,
    models: Readonly<Models>,
    whereScope: Readonly<WhereScope<Models>>,
    visitedModels: Set<keyof Models>,
): SingleModelPrismaWhere<Models, ModelName> | undefined {
    if (visitedModels.has(modelName)) {
        return undefined;
    }

    type Model = Models[ModelName];

    visitedModels.add(modelName);

    const originalModelWhereScope = whereScope[modelName];
    const originalPrismaWhere: SingleModelPrismaWhere<Models, ModelName> = originalModelWhereScope
        ? (filterObject(
              mapObjectValues(
                  originalModelWhereScope,
                  (fieldName, fieldScope): FieldScope<string> | undefined => {
                      if (!fieldScope) {
                          return undefined;
                      }
                      return omitObjectKeys(fieldScope, customFieldScopeProps);
                  },
              ),
              (key, value): value is NonNullable<typeof value> => !!value,
          ) as {
              [FieldName in keyof Model]: PrismaWhereField<Models, ModelName, FieldName>;
          } as SingleModelPrismaWhere<Models, ModelName>)
        : {};

    const modelDefinition = models[modelName];
    assertDefined(
        modelDefinition,
        `Failed to find model map entry by model name '${String(modelName)}'`,
    );

    const builtPrismaWhere = filterObject(
        mapObjectValues(
            modelDefinition,
            (
                fieldName,
                field,
            ):
                | PrismaWhereFieldList<Models, ModelName, string>
                | SingleModelPrismaWhere<Models, Model[string]['type']>
                | undefined => {
                /**
                 * If the field is not a relation, all `where` conditions will already be contained
                 * within the original where scope.
                 */
                if (!field.isRelation) {
                    return undefined;
                }

                const relationWhere:
                    | SingleModelPrismaWhere<Models, Model[typeof fieldName]['type']>
                    | undefined = recursivelyBuildWhere(
                    field.type,
                    models,
                    whereScope,
                    visitedModels,
                );

                if (!relationWhere) {
                    return undefined;
                }

                /**
                 * This is actually {@link PrismaWhereField} but at this point, we know the field is
                 * definitely a relation so we can ignore the non-relation part of
                 * {@link PrismaWhereField}.
                 */
                const maybeListWhere:
                    | PrismaWhereFieldList<Models, ModelName, typeof fieldName>
                    | SingleModelPrismaWhere<Models, Model[typeof fieldName]['type']> = field.isList
                    ? createListFieldScope(
                          (originalModelWhereScope &&
                              fieldName in originalModelWhereScope &&
                              originalModelWhereScope?.[fieldName]) ||
                              {},
                          relationWhere,
                      )
                    : relationWhere;

                return maybeListWhere;
            },
        ),
        (fieldName, fieldWhere) => !!fieldWhere,
    );

    const mergedPrismaWhere = {
        ...originalPrismaWhere,
        ...builtPrismaWhere,
    };

    if (Object.keys(mergedPrismaWhere).length) {
        return mergedPrismaWhere;
    } else {
        return undefined;
    }
}

function createListFieldScope<
    const Models extends ModelMap,
    const ModelName extends keyof Models,
    const FieldName extends keyof Models[ModelName],
>(
    whereDefinition: FieldScope<string>,
    originalWhere: FieldScope<string>,
): PrismaWhereFieldList<Models, ModelName, FieldName> {
    const listOperation = whereDefinition.listOperation || 'some';

    return {
        [listOperation]: originalWhere,
    };
}
