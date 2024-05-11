import {AnyObject, PartialAndUndefined} from '@augment-vir/common';
import {
    AvailableOperationTypes,
    AvailableResolverNames,
    BaseResolvers,
    ResolverOutput,
} from './resolvers';

/**
 * Base version of the `AvailableSelectionSet` type which doesn't require any type parameters. This
 * is thus less strict, but provides a suitable base for functions that don't care about the
 * specific type requirements.
 *
 * @category Internal Type Transforms
 */
export type BaseSelection = boolean | Partial<{[key in string]: BaseSelection}>;

/**
 * Base version of the `GraphqlOperation` type which doesn't require any type parameters. This is
 * thus less strict, but provides a suitable base for functions that don't care about the specific
 * type requirements.
 *
 * @category Internal Type Transforms
 */
export type BaseGraphqlOperation = PartialAndUndefined<{
    alias: string;
    args: AnyObject;
    select: AnyObject;
}>;

/**
 * A base operation type that includes resolver name and output key so that they can be used to map
 * the operation into its output type.
 *
 * @category Internal Type Transforms
 */
export type BaseOperationWithKey = {
    resolverName: PropertyKey;
    outputKey: PropertyKey;
} & BaseGraphqlOperation;

/**
 * Extracts an operation's allowed `select` input based on the given `Output` type.
 *
 * @category Internal Type Transforms
 */
export type AvailableSelectionSet<Output, IsTopLevel extends boolean> =
    NonNullable<Output> extends ReadonlyArray<infer OutputElement>
        ? AvailableSelectionSet<NonNullable<OutputElement>, false>
        : NonNullable<Output> extends AnyObject
          ? PartialAndUndefined<{
                [Key in keyof NonNullable<Output>]: AvailableSelectionSet<
                    NonNullable<Output>[Key],
                    false
                >;
            }>
          : IsTopLevel extends true
            ? never
            : boolean;

/**
 * Masks an operation's output with its given select.
 *
 * @category Internal Type Transforms
 */
export type SelectedOutputFromOperation<
    Resolvers extends Readonly<BaseResolvers>,
    OperationType extends AvailableOperationTypes<Resolvers>,
    Operation extends BaseOperationWithKey,
> = 'select' extends keyof Operation
    ? Operation['resolverName'] extends AvailableResolverNames<Resolvers, OperationType>
        ? Operation['select'] extends AnyObject
            ? SelectedOutput<
                  ResolverOutput<Resolvers, OperationType, Operation['resolverName']>,
                  Operation['select']
              >
            : ResolverOutput<Resolvers, OperationType, Operation['resolverName']>
        : never
    : {};

/**
 * Masks the given `Output` with the given `Select` object.
 *
 * @category Internal Type Transforms
 */
export type SelectedOutput<Output, Select extends BaseSelection> =
    Output extends ReadonlyArray<infer OutputEntry>
        ? ReadonlyArray<SelectedOutput<OutputEntry, Select>>
        : Output extends AnyObject
          ? Select extends AnyObject
              ? Readonly<{
                    [Key in keyof Required<Output> as Key extends keyof Select
                        ? Select[Key] extends true
                            ? Key
                            : Select[Key] extends AnyObject
                              ? Key
                              : never
                        : never]: SelectedOutput<Output[Key], Select[Key]>;
                }>
              : never
          : Output;
