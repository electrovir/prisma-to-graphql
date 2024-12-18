import {Values, capitalizeFirstLetter} from '@augment-vir/common';

/**
 * Creates a resolver's input name based on the model name.
 *
 * @category Internal
 */
export function createResolverInputName({
    modelName,
    inputName,
}: {
    /** Name of the model this resolver is for. */
    modelName: string;
    /** Name of the resolver input argument. */
    inputName: Values<ResolverInputNames>;
}): string {
    return [
        modelName,
        `${capitalizeFirstLetter(inputName)}Input`,
    ].join('_');
}

/**
 * All supported resolver input names.
 *
 * @category Internal
 */
export type ResolverInputNames = {
    Query: 'where' | 'orderBy' | 'distinct' | 'whereMany';
    Mutation:
        | 'create'
        | 'createData'
        | 'delete'
        | 'update'
        | 'updateData'
        | 'upsert'
        | 'whereRequiredProvidedUnique'
        | 'whereUnfilteredUnique';
};

/**
 * Creates a resolver's output type name.
 *
 * @category Internal
 */
export function createResolverOutputName(modelName: string): string {
    return [
        modelName,
        'Output',
    ].join('_');
}

/**
 * Create the name for resolver inputs that match `create` input blocks but omit a specific
 * relation's creation input.
 *
 * @category Internal
 */
export function createWithoutRelationInputName({
    modelNameGettingCreated,
    modelNameGettingOmitted,
    operationName,
}: {
    modelNameGettingCreated: string;
    modelNameGettingOmitted: string;
    operationName:
        | 'createOrConnect'
        | 'createOrConnectMany'
        | 'create'
        | 'connection'
        | 'connectionMany';
}): string {
    return [
        modelNameGettingCreated,
        'Without',
        modelNameGettingOmitted,
        `${capitalizeFirstLetter(operationName)}Input`,
    ].join('_');
}
