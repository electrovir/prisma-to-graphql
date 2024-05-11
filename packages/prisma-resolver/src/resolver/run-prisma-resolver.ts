import {PickDeep, capitalizeFirstLetter, typedArrayIncludes} from '@augment-vir/common';
import {
    OperationType,
    allValidOperationTypes,
} from '@prisma-to-graphql/graphql-codegen-operation-params';
import {
    FieldNode,
    GraphQLResolveInfo,
    Kind,
    OperationDefinitionNode,
    SelectionSetNode,
} from 'graphql';
import {parseItemSelection} from '../util/parse-selection';
import {runPrismaMutationOperation} from './mutations/prisma-mutation-operation';
import {PrismaResolver, PrismaResolverInputs, PrismaResolverOutput} from './prisma-resolver';
import {runPrismaQueryOperations} from './queries/prisma-query-operation';

const resolvers: Readonly<Record<OperationType, PrismaResolver>> = {
    Mutation: runPrismaMutationOperation,
    Query: runPrismaQueryOperations,
};

/**
 * Generated GraphQL resolvers from the `prisma-to-graphql` package execute this to run CRUD
 * operations using a Prisma client.
 *
 * @category Main
 */
export async function runPrismaResolver(
    prismaClient: any,
    prismaModelName: string,
    graphqlArgs: any,
    resolveInfo: Readonly<Pick<GraphQLResolveInfo, 'fieldNodes' | 'fieldName' | 'operation'>>,
): Promise<PrismaResolverOutput> {
    try {
        const selection = parseItemSelection(
            findCurrentSelectionSet(resolveInfo),
            resolveInfo.operation.name?.value || resolveInfo.fieldName,
        );

        const operationType = readOperationType(resolveInfo.operation);

        const resolver = resolvers[operationType];

        const resolverInputs: Readonly<PrismaResolverInputs> = {
            graphqlArgs,
            prismaClient,
            prismaModelName,
            selection,
        };

        return await resolver(resolverInputs);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function findCurrentSelectionSet(
    resolveInfo: Readonly<
        PickDeep<GraphQLResolveInfo, ['fieldName' | 'operation', 'selectionSet']>
    >,
): SelectionSetNode | undefined {
    const currentSelection = resolveInfo.operation.selectionSet.selections.find(
        (selection): selection is FieldNode => {
            return selection.kind === Kind.FIELD && selection.name.value === resolveInfo.fieldName;
        },
    );

    return currentSelection?.selectionSet;
}

function readOperationType(operation: Readonly<OperationDefinitionNode>): OperationType {
    const operationType = capitalizeFirstLetter(operation.operation);

    if (typedArrayIncludes(allValidOperationTypes, operationType)) {
        return operationType;
    } else {
        throw new Error(`Unsupported operation: '${operation.operation}'.`);
    }
}
