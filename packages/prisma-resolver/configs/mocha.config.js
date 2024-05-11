const baseOptions = require('virmator/base-configs/base-mocharc.js');

/** @type {import('mocha').MochaOptions} */
const mochaConfig = {
    ...baseOptions,
    globals: [
        /** These are introduced by Prisma. */
        'DEBUG',
        'DEBUG_COLORS',
        'NODE_CLIENT',
    ],
};

module.exports = mochaConfig;
