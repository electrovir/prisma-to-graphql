import {PartialAndUndefined} from '@augment-vir/common';
import {PrismaField, PrismaModel} from '../model/prisma-model';

export type CommentHandlers = Readonly<
    Record<
        string,
        PartialAndUndefined<{
            field(
                comment: string,
                field: Readonly<PrismaField>,
                /** The comment key itself which triggered this parser. */
                commentKey: string,
            ): Partial<PrismaField> | undefined;
            model(
                comment: string,
                model: Readonly<PrismaModel>,
                /** The comment key itself which triggered this parser. */
                commentKey: string,
            ): Partial<PrismaModel> | undefined;
        }>
    >
>;
