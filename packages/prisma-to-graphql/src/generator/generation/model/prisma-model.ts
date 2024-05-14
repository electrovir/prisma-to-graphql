import {ArrayElement} from '@augment-vir/common';
import {DMMF} from '@prisma/generator-helper';

/**
 * The keys from DMMF.Field to extract.
 *
 * @category Prisma Generator
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
    'type',
    'relationToFields',
] as const satisfies (keyof DMMF.Field)[];

/**
 * A model field generated from Prisma.
 *
 * @category Prisma Generator
 */
export type PrismaField = Pick<DMMF.Field, ArrayElement<typeof dmmfFieldKeys>> & {
    hideIn?: Partial<{
        inputs: boolean;
        outputs: boolean;
    }>;
    isRelation: boolean;
};

/**
 * A Prisma model with properties describing it that are needed for generation.
 *
 * @category Prisma Generator
 */
export type PrismaModel = {
    modelName: string;
    fields: Record<string, PrismaField>;
    pluralModelName: string;
    hide?: boolean;
};
