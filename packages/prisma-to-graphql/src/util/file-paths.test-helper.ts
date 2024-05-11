/** Paths for test-only files. */
import {join} from 'node:path';
import {packageDir} from './file-paths';

export const testFilesDir = join(packageDir, 'test-files');
