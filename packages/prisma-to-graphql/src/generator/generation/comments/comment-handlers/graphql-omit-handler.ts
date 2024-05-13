import {wrapInTry} from '@augment-vir/common';
import * as JSON5 from 'json5';
import {assertValidShape, defineShape, or} from 'object-shape-tester';
import {CommentHandlers} from '../comment-handler';

const omitCommentConfigShape = defineShape({
    input: or(false, undefined),
    output: or(false, undefined),
});

export const graphqlOmitHandler: CommentHandlers = {
    '@graphql-omit': {
        field(comment, field, commentKey) {
            const restOfComment = comment.split(commentKey)[1]?.trim();

            const config = restOfComment
                ? wrapInTry(
                      () => {
                          const parsed = JSON5.parse(restOfComment);
                          assertValidShape(parsed, omitCommentConfigShape);
                          return parsed;
                      },
                      {
                          handleError() {
                              throw new Error(
                                  `Invalid '${commentKey}' comment on field '${field.name}': ${comment}`,
                              );
                          },
                      },
                  )
                : undefined;

            if (config) {
                return {
                    hideIn: {
                        inputs: !!config?.input,
                        outputs: !!config?.output,
                    },
                };
            } else {
                return {
                    hideIn: {
                        inputs: true,
                        outputs: true,
                    },
                };
            }
        },
        model() {
            return {
                hide: true,
            };
        },
    },
};
