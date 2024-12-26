/* eslint-disable @typescript-eslint/no-empty-object-type */

import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type OperationType, type SchemaOperationTypeNames} from './index.js';

describe('SchemaOperationTypeNames', () => {
    it('matches an example value', () => {
        assert
            .tsType<{
                [OperationType.Mutation]: {
                    myOperation: {
                        args: {
                            arg1: 'User';
                        };
                        output: 'Settings';
                    };
                };
                [OperationType.Query]: {};
            }>()
            .matches<SchemaOperationTypeNames>();
    });
});
