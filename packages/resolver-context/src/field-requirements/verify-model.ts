import {
    AnyObject,
    AtLeastTuple,
    Overwrite,
    isTruthy,
    mergePropertyArrays,
} from '@augment-vir/common';
import {assertDefined} from 'run-time-assertions';
import {ModelMap, ModelMapField} from '../operation-scope/model-map';
import {OutputMessage} from '../output-messages';
import {FieldRequirementOperation, fieldOperationToDirection} from './field-requirement-operation';
import {FieldVerificationOnFieldParams, verifyFieldRequirementsOnField} from './verify-field';

/**
 * The output from verifying field requirements on an entire model.
 *
 * @category Internals
 */
export type ModelFieldVerificationOutput = {
    messages: OutputMessage[];
    /**
     * An array of property paths paths to null out.
     *
     * @example
     *     [
     *         // this will null out the `name` field on all the current results
     *         [
     *             'name',
     *         ],
     *         // this will null out the `regionName` field for all regions on the current output object
     *         [
     *             'regions',
     *             'regionName',
     *         ],
     *     ];
     */
    outputFieldPathsToNull: AtLeastTuple<string, 1>[];
};

/**
 * The parameters needed for verifying field requirements on an entire model.
 *
 * @category Internals
 */
export type ModelFieldVerificationParams<
    Models extends Readonly<ModelMap>,
    ModelName extends keyof Models,
    Operation extends FieldRequirementOperation,
> = {
    models: Readonly<Models>;
    /** The chain from resolver name to fieldName. */
    fieldChain: ReadonlyArray<string>;
    /**
     * For inputs, data will have objects like `{create: AnyObject, connect: AnyObject}` for
     * relations.
     *
     * For outputs, data will simply have nested objects for relations
     */
    data: Readonly<AnyObject>;
} & Omit<
    FieldVerificationOnFieldParams<Models, ModelName, any, Operation>,
    'fieldName' | 'fieldValue'
>;

/**
 * Verifies field requirements for all fields on a given model.
 *
 * @category Internals
 * @returns A list of errors and paths to any fields that should be nulled on an output
 */
export async function verifyModelFields<
    const Models extends Readonly<ModelMap>,
    const ModelName extends keyof Models,
    const Operation extends FieldRequirementOperation,
>(
    params: ModelFieldVerificationParams<Models, ModelName, Operation>,
): Promise<ModelFieldVerificationOutput> {
    /** This needs to be split out for type guarding purposes. */
    const data = params.data;

    const verificationOutputs: ModelFieldVerificationOutput[] = Array.isArray(data)
        ? await verifyModelArrayFields({
              ...params,
              data,
          })
        : (await verifyModelObjectFields(params)).flat();

    return mergePropertyArrays(...verificationOutputs);
}

async function verifyModelArrayFields<
    const Models extends Readonly<ModelMap>,
    const ModelName extends keyof Models,
    const Operation extends FieldRequirementOperation,
>({
    data,
    fieldRequirements,
    modelName,
    models,
    operation,
    fieldChain,
}: Overwrite<
    ModelFieldVerificationParams<Models, ModelName, Operation>,
    {data: ReadonlyArray<Readonly<AnyObject>>}
>): Promise<ModelFieldVerificationOutput[]> {
    return await Promise.all(
        data.map(async (dataEntry) => {
            return verifyModelFields({
                data: dataEntry,
                fieldChain,
                fieldRequirements,
                modelName,
                models,
                operation,
            });
        }),
    );
}

async function verifyModelObjectFields<
    const Models extends Readonly<ModelMap>,
    const ModelName extends keyof Models,
    const Operation extends FieldRequirementOperation,
>(
    params: ModelFieldVerificationParams<Models, ModelName, Operation>,
): Promise<ModelFieldVerificationOutput[]> {
    const modelDefinition = params.models[params.modelName];

    assertDefined(modelDefinition, `Missing model definition for '${String(params.modelName)}'`);

    const fields = Object.entries(params.data).map(
        async ([
            fieldName,
            fieldValue,
        ]): Promise<ModelFieldVerificationOutput> => {
            return await verifyField({
                ...params,
                fieldName,
                fieldValue,
                modelDefinition,
            });
        },
    );

    return Promise.all(fields);
}

async function verifyField<
    const Models extends Readonly<ModelMap>,
    const ModelName extends keyof Models,
    const Operation extends FieldRequirementOperation,
>({
    fieldChain,
    fieldRequirements,
    modelDefinition,
    modelName,
    models,
    operation,
    fieldName,
    fieldValue,
}: Omit<ModelFieldVerificationParams<Models, ModelName, Operation>, 'data'> & {
    modelDefinition: Readonly<Models>[ModelName];
    fieldName: string;
    fieldValue: any;
}): Promise<ModelFieldVerificationOutput> {
    if (operation === 'connect') {
        console.log({
            fieldChain,
            fieldRequirements,
            modelName,
            operation,
            fieldName,
            fieldValue,
        });
    }

    const fieldDefinition = modelDefinition[fieldName];
    assertDefined(
        fieldDefinition,
        `Missing field definition for '${String(modelName)}.${fieldName}'`,
    );

    const newFieldChain: AtLeastTuple<string, 1> = [
        ...fieldChain,
        fieldName,
    ] as unknown as AtLeastTuple<string, 1>;

    const currentFieldMessages: OutputMessage[] = [
        ...(await verifyFieldRequirementsOnField({
            fieldName,
            fieldRequirements,
            fieldValue,
            modelName,
            operation,
        })),
        ...(fieldDefinition.isRelation && extractConnectData(fieldValue)
            ? await verifyFieldRequirementsOnField({
                  fieldName,
                  fieldRequirements,
                  fieldValue,
                  modelName,
                  operation: 'connect',
              })
            : []),
    ];

    const relationVerificationOutputs: ModelFieldVerificationOutput | undefined =
        !currentFieldMessages.length && fieldDefinition.isRelation
            ? await verifyRelationalField({
                  fieldDefinition,
                  fieldChain: newFieldChain,
                  fieldRequirements,
                  fieldValue,
                  fieldName,
                  modelName,
                  models,
                  operation,
              })
            : undefined;

    return {
        messages: [
            ...(relationVerificationOutputs?.messages || []),
            ...currentFieldMessages,
        ].filter(isTruthy),
        outputFieldPathsToNull: [
            currentFieldMessages.length ? newFieldChain : undefined,
            ...(relationVerificationOutputs?.outputFieldPathsToNull || []),
        ].filter(isTruthy),
    };
}

type RelationalFieldRequirementParams<
    Models extends Readonly<ModelMap>,
    ModelName extends keyof Models,
    Operation extends FieldRequirementOperation,
> = Omit<ModelFieldVerificationParams<Models, ModelName, Operation>, 'data'> & {
    fieldValue: Readonly<AnyObject>;
    fieldName: keyof Models[ModelName];
    fieldDefinition: Readonly<ModelMapField>;
};

async function verifyRelationalField<
    const Models extends Readonly<ModelMap>,
    const ModelName extends keyof Models,
    const Operation extends FieldRequirementOperation,
>(
    params: Readonly<Omit<RelationalFieldRequirementParams<Models, ModelName, Operation>, 'data'>>,
): Promise<ModelFieldVerificationOutput> {
    const operationDirection = fieldOperationToDirection[params.operation];

    const callback =
        operationDirection === 'write' ? verifyRelationWriteField : verifyRelationReadField;

    const results = await callback(params);

    return mergePropertyArrays(...results);
}

function extractCreationData(data: AnyObject): AnyObject | AnyObject[] | undefined {
    if ('create' in data) {
        return data.create;
    } else if ('connectOrCreate' in data) {
        return extractCreationData(data.connectOrCreate);
    } else {
        /** Ignore connections. */
        return undefined;
    }
}
function extractConnectData(data: AnyObject): AnyObject | AnyObject[] | undefined {
    if ('connect' in data) {
        return data.connect;
    } else if ('connectOrCreate' in data) {
        return extractConnectData(data.connectOrCreate);
    } else {
        /** Ignore connections. */
        return undefined;
    }
}

async function verifyRelationWriteField<
    const Models extends Readonly<ModelMap>,
    const Operation extends FieldRequirementOperation,
>(
    params: RelationalFieldRequirementParams<Models, any, Operation>,
): Promise<ModelFieldVerificationOutput[]> {
    const creationData = extractCreationData(params.fieldValue);
    const connectData = extractConnectData(params.fieldValue);

    return [
        ...(await verifyRelationWriteFieldFromOperation({
            ...params,
            data: creationData,
        })),
        ...(await verifyRelationWriteFieldFromOperation({
            ...params,
            data: connectData,
            operation: 'connect',
        })),
    ];
}

async function verifyRelationWriteFieldFromOperation<
    const Models extends Readonly<ModelMap>,
    const Operation extends FieldRequirementOperation,
>({
    fieldRequirements,
    data,
    fieldDefinition,
    models,
    operation,
    fieldChain,
}: Omit<RelationalFieldRequirementParams<Models, any, Operation>, 'modelName' | 'fieldValue'> & {
    data: AnyObject | AnyObject[] | undefined;
}): Promise<ModelFieldVerificationOutput[]> {
    const standardVerifyParams: Omit<
        ModelFieldVerificationParams<Models, any, Operation>,
        'data'
    > = {
        fieldRequirements,
        modelName: fieldDefinition.type,
        operation,
        models,
        fieldChain,
    } as const;

    if (Array.isArray(data)) {
        return (
            await Promise.all(
                data.map(async (dataEntry) => {
                    return await verifyModelFields({
                        data: dataEntry,
                        ...standardVerifyParams,
                    });
                }),
            )
        ).flat();
    } else if (data == undefined) {
        return [];
    } else {
        return [
            await verifyModelFields({
                data,
                ...standardVerifyParams,
            }),
        ];
    }
}

async function verifyRelationReadField<
    const Models extends Readonly<ModelMap>,
    const Operation extends FieldRequirementOperation,
>({
    fieldRequirements,
    fieldDefinition,
    models,
    operation,
    fieldValue,
    fieldChain,
}: Omit<RelationalFieldRequirementParams<Models, any, Operation>, 'modelName'>): Promise<
    ModelFieldVerificationOutput[]
> {
    return [
        await verifyModelFields({
            fieldRequirements,
            modelName: fieldDefinition.type,
            operation,
            models,
            data: fieldValue,
            fieldChain,
        }),
    ];
}
