import {PrismaTypeDirection} from '../prisma-type-map';
import {ResolverOperation} from '../resolver-operation-type';

/**
 * The direction of a field requirement.
 *
 * - `'read'` means the field requirement will be applied to all operations that are _reading_ from
 *   the respective field.
 * - `'write'` means the field requirement will be applied to all operations that _write_ to the
 *   respective field.
 *
 * @category Field Requirements
 */
export type FieldRequirementDirection = 'read' | 'write';

/**
 * Maps {@link FieldRequirementDirection} to {@link PrismaTypeDirection}.
 *
 * @category Internals
 */
export type FieldRequirementDirectionToPrismaDirection<
    Direction extends FieldRequirementDirection,
> = Direction extends 'read'
    ? 'output'
    : Direction extends 'write'
      ? 'input'
      : 'ERROR: invalid field requirement direction input';

/**
 * All operations that Field Requirements support defining individual requirements for.
 *
 * - `'query'`: when the field is being read
 * - `'create'`: when the field's model is being created
 * - `'updated'`: when the field's model is being updated
 * - `'delete'`: when the field's model is being deleted
 * - `'connect'`: when the field's model is being connected to with a relational creation or update.
 *
 * @category Field Requirements
 */
export type FieldRequirementOperation = `${ResolverOperation}` | 'connect';

/**
 * Maps {@link FieldRequirementOperation} to {@link FieldRequirementDirection}.
 *
 * @category Internals
 */
export const fieldOperationToDirection = {
    connect: 'write',
    create: 'write',
    delete: 'write',
    query: 'read',
    update: 'write',
} as const satisfies Record<FieldRequirementOperation, FieldRequirementDirection>;

/**
 * Maps {@link FieldRequirementOperation} to {@link FieldRequirementDirection}.
 *
 * @category Internals
 */
export type FieldOperationToDirection<OperationType extends FieldRequirementOperation> =
    (typeof fieldOperationToDirection)[OperationType];
