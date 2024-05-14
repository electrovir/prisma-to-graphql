import {hasKey, mapObjectValues, pickObjectKeys} from '@augment-vir/common';
import JSON5 from 'json5';
import {JsonObject} from 'type-fest';
import {prismaTypeMapShape} from '../../../util/prisma-type-map';
import {PrismaModel} from '../model/prisma-model';

export function buildModelsTs(models: ReadonlyArray<Readonly<PrismaModel>>): string {
    const modelJson = buildModelJson(models);

    return `export const models = ${JSON5.stringify(modelJson, null, 4)} as const;`;
}

function buildModelJson(models: ReadonlyArray<Readonly<PrismaModel>>): JsonObject {
    return models.reduce((accum: JsonObject, model) => {
        accum[model.modelName] = buildFieldsJson(model.modelName, model.fields);
        return accum;
    }, {});
}

function buildFieldsJson(modelName: string, fields: Readonly<PrismaModel['fields']>): JsonObject {
    return mapObjectValues(fields, (fieldName, field) => {
        if (!field.isRelation && !hasKey(prismaTypeMapShape.defaultValue, field.type)) {
            throw new Error(
                `Model '${modelName}' has field '${field.name}' with type '${field.type}' which is not represented in the Prisma type map.`,
            );
        }

        return pickObjectKeys(field, [
            'type',

            'hasDefaultValue',
            'isGenerated',
            'isId',
            'isList',
            'isRequired',
            'isUnique',
            'isUpdatedAt',

            'isRelation',
            'relationFromFields',
            'relationToFields',
        ]);
    });
}
