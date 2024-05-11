import {omitObjectKeys, typedObjectFromEntries} from '@augment-vir/common';
import {DMMF} from '@prisma/generator-helper';
import {GenerationOptions} from './generation-options';

/**
 * A model field generated from Prisma.
 *
 * @category Prisma Generator
 */
export type PrismaField = DMMF.Field;

/**
 * A Prisma model with properties describing it that are needed for generation.
 *
 * @category Prisma Generator
 */
export type PrismaModel = {
    fields: Record<string, PrismaField>;
    dmmfModel: DMMF.Model;
    pluralName: string;
};

/**
 * Extract and filter the fields from a raw Prisma DMMF model into a fields object.
 *
 * @category Prisma Generator
 */
export function combineFields(
    model: Readonly<DMMF.Model>,
    options: Readonly<Pick<GenerationOptions, 'removeRelationFromFields'>>,
): PrismaModel['fields'] {
    const rawFields = typedObjectFromEntries(
        model.fields.map((field): [string, PrismaField] => {
            return [
                field.name,
                field,
            ];
        }),
    );

    return options.removeRelationFromFields ? filterOutRelationIdFields(rawFields) : rawFields;
}

function filterOutRelationIdFields(fields: Readonly<PrismaModel['fields']>): PrismaModel['fields'] {
    const relationIdFields: string[] = Object.values(fields).flatMap((intermediateField) => {
        return intermediateField.relationFromFields || [];
    });

    return omitObjectKeys(fields, relationIdFields);
}
