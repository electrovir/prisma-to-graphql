import {MaybePromise} from '@augment-vir/common';
import type {GraphQLError} from 'graphql';
import {ModelMap, ModelMapField} from '../operation-scope/model-map';
import {MapPrismaType} from '../prisma-type-map';
import {
    FieldOperationToDirection,
    FieldRequirementDirection,
    FieldRequirementDirectionToPrismaDirection,
    FieldRequirementOperation,
} from './field-requirement-operation';

/**
 * Use this to set a field requirement which will be applied to _all_ fields on _all_ models.
 *
 * @category Field Requirements
 */
export const universalFieldRequirement = Symbol('universal-field-requirement');

/**
 * The data passed to an individual model's field's field requirement callback (or
 * {@link FieldRequirementCallback}).
 *
 * @category Field Requirements
 */
export type FieldRequirementCallbackContext<ValueType> = Readonly<{
    modelName: PropertyKey;
    fieldName: PropertyKey;
    operation: FieldRequirementOperation;
    value: ValueType;
}>;

/**
 * An individual model's field's field requirement callback. Used to determine if a field has passed
 * requirements or not.
 *
 * To pass a field: return `true` or return nothing (`undefined`).
 *
 * To fail a field: throw an error or return `false`. Throw a {@link GraphQLError} to report the
 * error message back to the user.
 *
 * @category Field Requirements
 */
export type FieldRequirementCallback<
    Direction extends FieldRequirementDirection,
    Field extends Readonly<ModelMapField>,
> = (
    context: FieldRequirementCallbackContext<
        MapPrismaType<Field['type'], FieldRequirementDirectionToPrismaDirection<Direction>>
    >,
) => MaybePromise<boolean | void | undefined>;

/**
 * An individual model field's field requirement type.
 *
 * @category Field Requirements
 */
export type FieldRequirementFieldMap<
    Models extends Readonly<ModelMap>,
    ModelName extends keyof Models,
    FieldName extends keyof Models[ModelName],
> =
    | (Partial<
          Readonly<{
              [Direction in FieldRequirementDirection]: FieldRequirementCallback<
                  Direction,
                  Models[ModelName][FieldName]
              >;
          }>
      > &
          Partial<{
              [Operation in FieldRequirementOperation]: FieldRequirementCallback<
                  FieldOperationToDirection<Operation>,
                  Models[ModelName][FieldName]
              >;
          }>)
    | undefined;

/**
 * The type used to define field requirements based on a generated {@link ModelMap} to ensure type
 * safety.
 *
 * @category Field Requirements
 */
export type FieldRequirements<Models extends Readonly<ModelMap>> = Partial<
    Readonly<{
        [ModelName in keyof Models]: Partial<
            Readonly<{
                [FieldName in keyof Models[ModelName]]: FieldRequirementFieldMap<
                    Models,
                    ModelName,
                    FieldName
                >;
            }>
        >;
    }> &
        Readonly<{[universalFieldRequirement]: FieldRequirementFieldMap<any, any, any>}>
>;

/**
 * A helper function that makes it easier to write type safe field requirements. This function does
 * not _need_ to be used in order to write field requirements: it's just here to make them a little
 * more user friendly.
 *
 * @category Field Requirements
 */
export function defineFieldRequirements<const Models extends Readonly<ModelMap>>(
    models: Models,
    requirements: FieldRequirements<Models>,
): FieldRequirements<Models> {
    return requirements;
}
