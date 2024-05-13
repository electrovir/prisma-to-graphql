import {PropertyValueType, capitalizeFirstLetter} from '@augment-vir/common';

/**
 * Creates a resolver's input name based on the model name.
 *
 * @category Prisma Generator
 */
export function createResolverInputName({
    modelName,
    inputName,
}: {
    modelName: string;
    inputName: PropertyValueType<ResolverInputNames>;
}): string {
    return [
        modelName,
        `${capitalizeFirstLetter(inputName)}Input`,
    ].join('_');
}

/**
 * All supported resolver input names.
 *
 * @category Prisma Generator
 */
export type ResolverInputNames = {
    Query: 'where' | 'orderBy' | 'distinct';
    Mutation:
        | 'create'
        | 'createData'
        | 'whereUnfilteredUnique'
        | 'whereRequiredProvidedUnique'
        | 'update'
        | 'updateData'
        | 'upsert';
};

/**
 * Creates a resolver's output type name.
 *
 * @category Prisma Generator
 */
export function createQueryOutputName(modelName: string): string {
    return [
        modelName,
        'QueryOutput',
    ].join('_');
}

/**
 * Create the name for resolver inputs that match `create` input blocks but omit a specific
 * relation's creation input.
 *
 * @category Prisma Generator
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
