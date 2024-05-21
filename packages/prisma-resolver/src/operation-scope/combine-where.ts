import {assertDefined} from 'run-time-assertions';
import {ModelMap, OperationScope} from './resolver-context';
import {expandModelScope} from './where-scope';

export function combineWhere(
    userWhere: unknown,
    modelUnderQuery: string,
    models: Readonly<ModelMap> | undefined,
    operationScope: Readonly<OperationScope> | undefined,
) {
    const whereScope = operationScope?.where;

    if (!whereScope) {
        return userWhere;
    }

    assertDefined(
        models,
        'Missing `models` GraphQL context variable, needed to use the `operationScope` context variable.',
    );

    return {
        AND: [
            userWhere,
            expandModelScope(modelUnderQuery, models, whereScope),
        ],
    };
}
