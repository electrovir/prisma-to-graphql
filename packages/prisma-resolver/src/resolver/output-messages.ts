import {
    Overwrite,
    PropertyValueType,
    TypedFunction,
    arrayToObject,
    mapObjectValues,
} from '@augment-vir/common';
import {isRunTimeType} from 'run-time-assertions';
import {IsNever} from 'type-fest';

/**
 * A message definition.
 *
 * @category Internals
 */
export type MessageDefinition = Readonly<{
    code: string;
    message: string | TypedFunction<any, string>;
    description: string;
}>;

/**
 * A function that determines which args to accept when creating a message.
 *
 * @category Internals
 */
export type MessageCreator<Args, Output> =
    IsNever<Args> extends true ? () => Output : TypedFunction<Args, Output>;

/**
 * Adds a create method to a message definition and also converts the message property to a method.
 *
 * @category Internals
 */
export type WrapWithCreate<Definition extends MessageDefinition> = Overwrite<
    Definition,
    {
        /** Creates the final message string. */
        message: MessageCreator<
            Definition['message'] extends (...args: infer Args) => string ? Args : never,
            string
        >;
        /** Creates a full message object for reporting to GraphQL. */
        create: MessageCreator<
            Definition['message'] extends (...args: infer Args) => string ? Args : never,
            OutputMessage
        >;
    }
>;
type GenericDefinitionWithCreate = MessageDefinition & {create(...args: any[]): OutputMessage};

/**
 * A message returned from an operation resolver.
 *
 * @category Types
 */
export type OutputMessage = Readonly<Record<keyof MessageDefinition, string>>;

const messageDefinitions = {
    'ptg-0': {
        description: 'example',
        message: 'example message',
    },
    'ptg-1': {
        message: ({max}: {max: number}) =>
            `Create data was truncated to the first ${max} entries. You can only create ${max} entries at once. Please split up your creation query.`,
        description: 'create data truncated',
    },
    'ptg-2': {
        message: ({max}: {max: number}) =>
            `Query results were truncated to the first ${max} entries. Please use pagination to split your query up.`,
        description: 'query results truncated',
    },
    'ptg-3': {
        message: ({max, count}: {max: number; count: number}) =>
            `Update failed. The given query would update ${count} rows but the max is ${max}. Please provide a tighter "where" argument.`,
        description: 'update too big',
    },
} as const satisfies {
    /** `ptg` stands for prisma-to-graphql. */
    [MessageCode in `ptg-${number}`]: Omit<MessageDefinition, 'code'>;
};

/**
 * All supported message codes.
 *
 * @category Types
 */
export type OutputMessageCode = keyof typeof messageDefinitions;
/**
 * All supported message descriptions.
 *
 * @category Internals
 */
export type OutputMessageDescription = PropertyValueType<OutputMessagesByCode>['description'];

/**
 * Messages keyed by their code.
 *
 * @category Internals
 */
export type OutputMessagesByCode = Readonly<{
    [MessageCode in OutputMessageCode]: WrapWithCreate<
        Readonly<
            {
                code: MessageCode;
            } & (typeof messageDefinitions)[MessageCode]
        >
    >;
}>;

/**
 * Messages keyed by their description for more legible usage.
 *
 * @category Internals
 */
export type OutputMessagesByDescription = Readonly<{
    [MessageDescription in OutputMessageDescription]: Readonly<
        Extract<PropertyValueType<OutputMessagesByCode>, {description: MessageDescription}>
    >;
}>;

/**
 * All output messages grouped by how they are keyed.
 *
 * @category Types
 */
export type OutputMessages = {
    byCode: OutputMessagesByCode;
    byDescription: OutputMessagesByDescription;
};

const outputMessagesByCode: OutputMessagesByCode = mapObjectValues(
    messageDefinitions,
    (messageCode, contents): GenericDefinitionWithCreate => {
        const outputContents = {
            ...contents,
            code: messageCode,
        };

        function createMessage(...args: [any]) {
            const message = isRunTimeType(contents.message, 'string')
                ? contents.message
                : contents.message(...args);

            return [
                messageCode,
                message,
            ].join(': ');
        }

        return {
            ...outputContents,
            message: createMessage,
            create(...args: [any]) {
                const message = createMessage(...args);

                return {
                    ...outputContents,
                    message,
                };
            },
        };
    },
) as Record<OutputMessageCode, GenericDefinitionWithCreate> as OutputMessagesByCode;

const outputMessagesByDescription: OutputMessagesByDescription = arrayToObject(
    Object.values(outputMessagesByCode),
    (entry) => {
        return entry.description;
    },
) as OutputMessagesByDescription;

/**
 * All output messages
 *
 * @category Internals
 */
export const outputMessages: Readonly<OutputMessages> = {
    byCode: outputMessagesByCode,
    byDescription: outputMessagesByDescription,
};
