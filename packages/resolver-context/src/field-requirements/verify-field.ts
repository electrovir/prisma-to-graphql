import {AnyObject, extractErrorMessage} from '@augment-vir/common';
import {GraphQLError} from 'graphql';
import {ModelMap} from '../operation-scope/model-map';
import {OutputMessage, outputMessages} from '../output-messages';
import {
    FieldOperationToDirection,
    FieldRequirementOperation,
    fieldOperationToDirection,
} from './field-requirement-operation';
import {
    FieldRequirementCallback,
    FieldRequirementCallbackContext,
    FieldRequirementFieldMap,
    FieldRequirements,
    universalFieldRequirement,
} from './field-requirements';

function findFieldRequirementCallback<
    const Models extends ModelMap,
    const ModelName extends keyof Models,
    const FieldName extends keyof Models[ModelName],
    const Operation extends FieldRequirementOperation,
>({
    fieldRequirements,
    modelName,
    fieldName,
    operation,
}: {
    fieldRequirements: FieldRequirements<Models> | undefined;
    modelName: ModelName;
    fieldName: keyof Models[ModelName];
    operation: Operation;
}):
    | FieldRequirementCallback<FieldOperationToDirection<Operation>, Models[ModelName][FieldName]>
    | undefined {
    const fieldRequirementEntry:
        | FieldRequirementFieldMap<Models, ModelName, FieldName>
        | undefined = (fieldRequirements as AnyObject)?.[modelName]?.[fieldName];

    const fieldRequirementCallback: FieldRequirementCallback<any, any> | undefined =
        fieldRequirementEntry?.[operation] ||
        fieldRequirementEntry?.[fieldOperationToDirection[operation]];

    return fieldRequirementCallback;
}

function findUniversalFieldRequirementCallback<
    const Models extends ModelMap,
    const ModelName extends keyof Models,
    const FieldName extends keyof Models[ModelName],
    const Operation extends FieldRequirementOperation,
>({
    fieldRequirements,
    operation,
}: {
    fieldRequirements: FieldRequirements<Models> | undefined;
    operation: Operation;
}):
    | FieldRequirementCallback<FieldOperationToDirection<Operation>, Models[ModelName][FieldName]>
    | undefined {
    const fieldRequirementEntry = fieldRequirements?.[universalFieldRequirement];

    const universalFieldRequirementCallback: FieldRequirementCallback<any, any> | undefined =
        fieldRequirementEntry?.[operation] ||
        fieldRequirementEntry?.[fieldOperationToDirection[operation]];

    return universalFieldRequirementCallback;
}

/**
 * Parameters used for verifying an individual field's field requirements.
 *
 * @category Internals
 */
export type FieldVerificationOnFieldParams<
    Models extends ModelMap,
    ModelName extends keyof Models,
    FieldName extends keyof Models[ModelName],
    Operation extends FieldRequirementOperation,
> = {
    operation: Operation;

    fieldRequirements: FieldRequirements<Models> | undefined;

    modelName: ModelName;
    fieldName: FieldName;
    fieldValue: unknown;
};

/**
 * Verifies field requirements against an individual field.
 *
 * @category Internals
 * @returns A list of error messages. If the list is empty, that means that verification passed
 *   without any issues.
 */
export async function verifyFieldRequirementsOnField<
    const Models extends ModelMap,
    const ModelName extends keyof Models,
    const FieldName extends keyof Models[ModelName],
    const Operation extends FieldRequirementOperation,
>({
    fieldRequirements,
    modelName,
    fieldName,
    fieldValue,
    operation,
}: FieldVerificationOnFieldParams<Models, ModelName, FieldName, Operation>): Promise<
    OutputMessage[]
> {
    const fieldRequirementCallback = findFieldRequirementCallback({
        fieldName,
        fieldRequirements,
        modelName,
        operation,
    });
    const universalFieldRequirementCallback = findUniversalFieldRequirementCallback({
        fieldRequirements,
        operation,
    });

    if (!fieldRequirementCallback && !universalFieldRequirementCallback) {
        return [];
    }

    const context: FieldRequirementCallbackContext<any> = {
        fieldName,
        modelName,
        operation,
        value: fieldValue,
    };

    const blankReasonFailureMessage = outputMessages.byDescription[
        'field requirement failed'
    ].create({
        operation,
        fieldName,
        modelName,
        reason: undefined,
    });

    try {
        const universalResult =
            (await universalFieldRequirementCallback?.(context)) ??
            /** A result of `undefined` is considered a success. */
            true;

        const result =
            (await fieldRequirementCallback?.(context)) ??
            /** A result of `undefined` is considered a success. */
            true;

        if (result && universalResult) {
            return [];
        } else {
            return [blankReasonFailureMessage];
        }
    } catch (error) {
        if (error instanceof GraphQLError) {
            return [
                outputMessages.byDescription['field requirement failed'].create({
                    operation,
                    fieldName,
                    modelName,
                    reason: extractErrorMessage(error),
                }),
            ];
        } else {
            return [
                blankReasonFailureMessage,
            ];
        }
    }
}
