import {dirname, join} from 'node:path';

export const packageDir = dirname(dirname(__dirname));
export const packageJsonFile = join(packageDir, 'package.json');
