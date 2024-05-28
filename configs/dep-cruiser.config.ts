import type {IConfiguration} from 'dependency-cruiser';
import {generateDepCruiserConfig} from 'virmator/dist/compiled-base-configs/base-dep-cruiser.config';

const baseConfig = generateDepCruiserConfig({
    fileExceptions: {
        // enter file exceptions by rule name here
        'no-orphans': {
            from: [
                'src/index.ts',
                /**
                 * Needed for the `scripts` package which uses a symlink to access this folder and
                 * thus does not necessarily use it all.
                 */
                'src/operation-scope/*',
            ],
        },
        'no-non-package-json': {
            to: ['.prisma'],
        },
    },
    omitRules: [
        // enter rule names here to omit
    ],
});

const depCruiserConfig: IConfiguration = {
    ...baseConfig,
    options: {
        ...baseConfig.options,
        doNotFollow: {
            ...baseConfig.options.doNotFollow,
            path: [
                '.not-committed',
                'node_modules',
            ],
        },
    },
};

module.exports = depCruiserConfig;
