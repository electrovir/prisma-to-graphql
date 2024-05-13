import {PartialAndUndefined, filterMap, isTruthy, mergeDeep, safeMatch} from '@augment-vir/common';
import {RequireExactlyOne} from 'type-fest';
import {PrismaField, PrismaModel} from '../model/prisma-model';
import {CommentHandlers} from './comment-handler';
import {graphqlOmitHandler} from './comment-handlers/graphql-omit-handler';

const allCommentHandlers: CommentHandlers = {
    ...graphqlOmitHandler,
};

type FieldOrModel = {
    field: PrismaField;
    model: PrismaModel;
};

type PartialFieldOrModel = PartialAndUndefined<{
    [Key in keyof FieldOrModel]: Partial<FieldOrModel[Key]>;
}>;

export function parseComment(
    comment: undefined | string,
    fieldOrModel: RequireExactlyOne<Readonly<FieldOrModel>>,
): PartialFieldOrModel | undefined {
    if (!comment) {
        return undefined;
    }

    const commentLines = filterMap(comment.trim().split('\n'), (line) => line.trim(), isTruthy);

    if (!commentLines.length) {
        return undefined;
    }

    const output = mergeDeep(
        ...filterMap(
            commentLines,
            (commentLine) => handleCommentLine(commentLine, fieldOrModel),
            isTruthy,
        ),
    );

    return output;
}

function handleCommentLine(
    commentLine: string,
    fieldOrModel: RequireExactlyOne<Readonly<FieldOrModel>>,
): PartialFieldOrModel | undefined {
    const [
        ,
        matchedComment,
    ] = safeMatch(commentLine, /^(@[a-z\-]+)(?:[^a-z\-]|$)/);

    if (!matchedComment) {
        return undefined;
    }

    const handler = allCommentHandlers[matchedComment];

    if (!handler) {
        return undefined;
    }

    if (fieldOrModel.field && handler.field) {
        return {
            field: handler.field(commentLine, fieldOrModel.field, matchedComment),
        };
    } else if (fieldOrModel.model && handler.model) {
        return {
            model: handler.model(commentLine, fieldOrModel.model, matchedComment),
        };
    } else {
        const fieldOrModelUsed = fieldOrModel.field ? 'field' : 'model';

        throw new Error(
            `prisma-to-graphql comment '${matchedComment}' is not supported on Prisma ${fieldOrModelUsed}s.`,
        );
    }
}
