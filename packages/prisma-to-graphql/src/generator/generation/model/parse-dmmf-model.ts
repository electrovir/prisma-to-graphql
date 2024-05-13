import {omitObjectKeys, pickObjectKeys, typedObjectFromEntries} from '@augment-vir/common';
import {DMMF} from '@prisma/generator-helper';
import pluralize from 'pluralize';
import {parseComment} from '../comments/parse-comments';
import {GenerationOptions} from '../generation-options';
import {PrismaField, PrismaModel} from './prisma-model';

/**
 * Convert Prisma's DMMF representation of a model in an internal representation.
 *
 * @category Prisma Generator
 */
export function parseDmmfModel(
    dmmfModel: Readonly<DMMF.Model>,
    options: Readonly<GenerationOptions>,
): PrismaModel | undefined {
    const prismaModel: Readonly<PrismaModel> = {
        modelName: dmmfModel.name,
        fields: extractFields(dmmfModel, options),
        pluralModelName: pluralize(dmmfModel.name),
    };

    const parsedCommentOutput = parseComment(dmmfModel.documentation, {model: prismaModel});

    const finalModel: PrismaModel = {
        ...prismaModel,
        ...parsedCommentOutput?.model,
    };

    if (finalModel.hide) {
        return undefined;
    }

    return finalModel;
}

/**
 * Extract and filter the fields from a raw Prisma DMMF model into a fields object.
 *
 * @category Prisma Generator
 */
export function extractFields(
    model: Readonly<DMMF.Model>,
    options: Readonly<Pick<GenerationOptions, 'removeRelationFromFields'>>,
): PrismaModel['fields'] {
    const rawFields = typedObjectFromEntries(
        model.fields.map((dmmfField): [string, PrismaField] => {
            const pickedField = pickObjectKeys(dmmfField, [
                'relationName',
                'type',
                'relationFromFields',
                'isGenerated',
                'isRequired',
                'hasDefaultValue',
                'isUpdatedAt',
                'name',
                'isUnique',
                'isId',
                'documentation',
                'isList',
            ]);

            const parsedCommentOutput = parseComment(pickedField.documentation, {field: dmmfField});

            return [
                dmmfField.name,
                {
                    ...pickedField,
                    ...parsedCommentOutput?.field,
                },
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
