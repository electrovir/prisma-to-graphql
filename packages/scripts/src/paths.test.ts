import {typedArrayIncludes} from '@augment-vir/common';
import {existsSync} from 'node:fs';
import {isRunTimeType} from 'run-time-assertions';
import * as allPaths from './paths';

describe('each path', () => {
    it('exists', () => {
        testThatPathsExist(allPaths);
    });
});

const allowedToNotExist: (keyof typeof allPaths)[] = [];

type DefinedPaths = {[key in string]: string | DefinedPaths};

function testThatPathsExist(paths: DefinedPaths): void {
    Object.entries(paths).forEach(
        ([
            pathKey,
            path,
        ]) => {
            if (typedArrayIncludes(allowedToNotExist, pathKey)) {
                /** Skip checking for paths that are expected to maybe not exist. */
                return;
            } else if (isRunTimeType(path, 'string')) {
                existsSync(path);
            } else {
                testThatPathsExist(path);
            }
        },
    );
}
