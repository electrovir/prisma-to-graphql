import {check} from '@augment-vir/assert';
import {ArrayElement, arrayToObject, filterObject, pickObjectKeys} from '@augment-vir/common';
import {type DMMF} from '@prisma/generator-helper';
import pluralize from 'pluralize';

/**
 * Convert Prisma's DMMF representation of a model in an internal representation.
 *
 * @category Prisma Parsers
 */
export function parseDmmfModel(
    dmmfModel: Readonly<Pick<DMMF.Model, 'name' | 'fields'>>,
    enumNames: ReadonlyArray<string>,
): PrismaModel {
    const relationFromFields: string[] = [];

    const rawFields = arrayToObject(dmmfModel.fields, (dmmfField) => {
        const currentField: PrismaField = {
            ...pickObjectKeys(dmmfField, dmmfFieldKeys),
            isEnumType: enumNames.includes(dmmfField.type),
        };

        if (currentField.relationName) {
            /**
             * If `relationName` is set, `currentField.relationFromFields` is also set, but the
             * `DMMF.Field` doesn't know that.
             */
            /* node:coverage ignore next 1 */
            const fromFields = currentField.relationFromFields || [];

            relationFromFields.push(...fromFields);
        }

        return {
            key: dmmfField.name,
            value: currentField,
        };
    });

    /** Remove relation id fields. */
    const fields = filterObject(rawFields, (key) => {
        return !check.isIn(key, relationFromFields);
    }) as PrismaModel['fields'];

    return {
        modelName: dmmfModel.name,
        fields,
        pluralModelName: pluralize(dmmfModel.name),
    };
}

/**
 * The keys from DMMF.Field to extract.
 *
 * @category Internal
 */
export const dmmfFieldKeys = [
    'documentation',
    'hasDefaultValue',
    'isGenerated',
    'isId',
    'isList',
    'isRequired',
    'isUnique',
    'isUpdatedAt',
    'name',
    'relationFromFields',
    'relationName',
    'relationToFields',
    'type',
] as const satisfies (keyof DMMF.Field)[];

/**
 * A model field generated from Prisma.
 *
 * @category Prisma Parsers
 */
export type PrismaField = Pick<DMMF.Field, ArrayElement<typeof dmmfFieldKeys>> & {
    isEnumType: boolean;
};

/**
 * A Prisma model with properties describing it that are needed for generation.
 *
 * @category Prisma Parsers
 */
export type PrismaModel = {
    modelName: string;
    fields: Record<string, PrismaField>;
    pluralModelName: string;
};
