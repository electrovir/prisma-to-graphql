import {AnyObject, AtLeastTuple, combineErrorMessages, isLengthAtLeast} from '@augment-vir/common';
import {GraphQLError} from 'graphql';
import {AssertionError} from 'run-time-assertions';
import {ModelMap} from '../operation-scope/model-map';
import {FieldRequirementOperation, fieldOperationToDirection} from './field-requirement-operation';
import {ModelFieldVerificationParams, verifyModelFields} from './verify-model';

/**
 * Verifies all field requirements for a single resolver input or output.
 *
 * Errors on invalid failed inputs, nulls out failed outputs.
 *
 * WARNING: This potentially _mutates_ the input {@link data} object.
 *
 * @category Internals
 */
export async function verifyAllFieldRequirements<
    const Models extends Readonly<ModelMap>,
    const Operation extends FieldRequirementOperation,
>({
    models,
    fieldRequirements,
    operation,
    modelName,
    data,
}: Omit<ModelFieldVerificationParams<Models, any, Operation>, 'fieldChain'>): Promise<void> {
    const {messages, outputFieldPathsToNull} = await verifyModelFields({
        data,
        fieldRequirements,
        operation,
        fieldChain: [],
        modelName,
        models,
    });

    const operationDirection = fieldOperationToDirection[operation];

    if (operationDirection === 'write') {
        if (messages.length) {
            throw new GraphQLError(
                combineErrorMessages(messages.map((message) => message.message)),
            );
        }
    } else if (operationDirection === 'read') {
        outputFieldPathsToNull.forEach((fieldPathToNull) => nullOutFields(data, fieldPathToNull));
    } else {
        throw new Error(`Invalid field verification direction: '${operationDirection}'`);
    }
}

/**
 * Nulls out all fields on the given {@link data} input based on the given field paths. This
 * _mutates_ the {@link data} object.
 *
 * @category Internals
 */
export function nullOutFields(data: AnyObject, fieldPathToNull: AtLeastTuple<string, 1>) {
    if (!data || typeof data != 'object') {
        throw new AssertionError('Invalid data received for nulling fields.');
    }

    if (Array.isArray(data)) {
        data.forEach((entry) => nullOutFields(entry, fieldPathToNull));
    } else if (isLengthAtLeast(fieldPathToNull, 2)) {
        const newPathToNull = fieldPathToNull.slice(1) as unknown as AtLeastTuple<string, 1>;

        nullOutFields(data[fieldPathToNull[0]], newPathToNull);
    } else {
        /** Use `null` because that's what GraphQL expects (and JSON). */
        data[fieldPathToNull[0]] = null;
    }
}
