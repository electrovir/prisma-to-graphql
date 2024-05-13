import {DMMF} from '@prisma/generator-helper';

/**
 * A model field generated from Prisma.
 *
 * @category Prisma Generator
 */
export type PrismaField = Pick<
    DMMF.Field,
    | 'relationName'
    | 'type'
    | 'relationFromFields'
    | 'isGenerated'
    | 'isRequired'
    | 'hasDefaultValue'
    | 'isUpdatedAt'
    | 'name'
    | 'isUnique'
    | 'isId'
    | 'documentation'
> & {
    hideIn?: Partial<{
        inputs: boolean;
        outputs: boolean;
    }>;
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
