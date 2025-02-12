import {
    type PartialWithUndefined,
    type SetRequiredAndNotNull,
    type Values,
} from '@augment-vir/common';
import {
    type EmptyObject,
    type HasRequiredKeys,
    type IsNever,
    type OmitIndexSignature,
} from 'type-fest';
import {
    type AvailableOperationTypes,
    type AvailableResolverNames,
    type BaseResolvers,
    type ResolverInputs,
    type ResolverOutput,
} from './resolvers.js';
import {
    type AvailableSelectionSet,
    type BaseGraphqlOperation,
    type SelectedOutputFromOperation,
} from './selection.js';

/**
 * Extracts the allowed operations object for the given operation type from the given Resolvers
 * type.
 *
 * @category Internal Type Transforms
 */
export type GraphqlOperations<
    Resolvers extends Readonly<BaseResolvers>,
    OperationType extends AvailableOperationTypes<Resolvers>,
> = Readonly<
    Partial<{
        [ResolverName in AvailableResolverNames<
            Resolvers,
            OperationType
        >]: ResolverName extends AvailableResolverNames<Resolvers, OperationType>
            ?
                  | GraphqlOperation<Resolvers, OperationType, ResolverName>
                  | [
                        GraphqlOperation<Resolvers, OperationType, ResolverName>,
                        ...SetRequiredAndNotNull<
                            GraphqlOperation<Resolvers, OperationType, ResolverName>,
                            'alias'
                        >[],
                    ]
            : never;
    }>
>;

/**
 * Base version of the `GraphqlOperations` type which doesn't require any type parameters. This is
 * thus less strict, but provides a suitable base for functions that don't care about the specific
 * type requirements.
 *
 * @category Internal Type Transforms
 */
export type BaseGraphqlOperations = Partial<{
    [ResolverName in string]: BaseGraphqlOperation | BaseGraphqlOperation[];
}>;

/**
 * The `args` portion of a {@link GraphqlOperation}.
 *
 * @category Internal Type Transforms
 */
export type GraphqlOperationArgs<
    Resolvers extends Readonly<BaseResolvers>,
    OperationType extends AvailableOperationTypes<Resolvers>,
    ResolverName extends AvailableResolverNames<Resolvers, OperationType>,
> =
    IsNever<ResolverInputs<Resolvers, OperationType, ResolverName>> extends true
        ? {args?: never}
        : EmptyObject extends ResolverInputs<Resolvers, OperationType, ResolverName>
          ? {args?: never}
          : HasRequiredKeys<ResolverInputs<Resolvers, OperationType, ResolverName>> extends true
            ? {args: ResolverInputs<Resolvers, OperationType, ResolverName>}
            : {args?: ResolverInputs<Resolvers, OperationType, ResolverName>};

/**
 * An individual operation's allowed types with the given Resolvers, Operation type, and resolver
 * name.
 *
 * @category Internal Type Transforms
 */
export type GraphqlOperation<
    Resolvers extends Readonly<BaseResolvers>,
    OperationType extends AvailableOperationTypes<Resolvers>,
    ResolverName extends AvailableResolverNames<Resolvers, OperationType>,
> = PartialWithUndefined<{alias: string}> &
    GraphqlOperationArgs<Resolvers, OperationType, ResolverName> &
    (IsNever<
        AvailableSelectionSet<ResolverOutput<Resolvers, OperationType, ResolverName>, true>
    > extends true
        ? {select?: never}
        : {
              select: Partial<
                  AvailableSelectionSet<
                      ResolverOutput<Resolvers, OperationType, ResolverName>,
                      true
                  >
              >;
          });

/**
 * Maps all given operations to their output type, with resolver or alias names as keys. Each
 * operation output value is masked with the operation's given selection.
 *
 * @category Internal Type Transforms
 */
export type ResolverOutputWithSelection<
    Resolvers extends Readonly<BaseResolvers>,
    OperationType extends AvailableOperationTypes<Resolvers>,
    Operations extends GraphqlOperations<Resolvers, OperationType>,
> = Readonly<{
    [Key in FlattenedOperations<
        Resolvers,
        OperationType,
        Operations
    >['outputKey']]: SelectedOutputFromOperation<
        Resolvers,
        OperationType,
        Extract<FlattenedOperations<Resolvers, OperationType, Operations>, {outputKey: Key}>
    >;
}>;

/**
 * Extracts all given operations into a flattened union of operations. Resolver and alias names are
 * also inserted into each operation so they can be independently used to determine their output
 * types.
 *
 * @category Internal Type Transforms
 */
export type FlattenedOperations<
    Resolvers extends Readonly<BaseResolvers>,
    OperationType extends AvailableOperationTypes<Resolvers>,
    Operations extends GraphqlOperations<Resolvers, OperationType>,
> = Values<
    Readonly<{
        [ResolverName in AvailableResolverNames<
            Resolvers,
            OperationType
        > as ResolverName extends keyof Operations
            ? ResolverName
            : never]: Operations[ResolverName] extends ReadonlyArray<any>
            ? Values<{
                  [Index in keyof OmitIndexSignature<
                      Operations[ResolverName]
                  >]: Operations[ResolverName][Index] extends GraphqlOperation<
                      Resolvers,
                      OperationType,
                      ResolverName
                  >
                      ? OperationWithKey<
                            Resolvers,
                            OperationType,
                            ResolverName,
                            Operations[ResolverName][Index],
                            Operations[ResolverName][Index]['alias']
                        >
                      : never;
              }>
            : Operations[ResolverName] extends GraphqlOperation<
                    Resolvers,
                    OperationType,
                    ResolverName
                >
              ? OperationWithKey<
                    Resolvers,
                    OperationType,
                    ResolverName,
                    Operations[ResolverName],
                    Operations[ResolverName]['alias']
                >
              : never;
    }>
>;

/**
 * An operation with added resolver name and output key so the operation can be independently used
 * to determine its own output type.
 *
 * @category Internal Type Transforms
 */
export type OperationWithKey<
    Resolvers extends Readonly<BaseResolvers>,
    OperationType extends AvailableOperationTypes<Resolvers>,
    ResolverName extends AvailableResolverNames<Resolvers, OperationType>,
    Operation extends GraphqlOperation<Resolvers, OperationType, ResolverName>,
    Alias extends string | undefined,
> = {
    resolverName: ResolverName;
    outputKey: Alias extends string ? ('' extends Alias ? ResolverName : Alias) : ResolverName;
} & Operation;
