const {baseConfig} = require('virmator/base-configs/base-cspell.js');

module.exports = {
    ...baseConfig,
    ignorePaths: [
        ...baseConfig.ignorePaths,
        'test-files/test-expectations.json',
        'test-expectations.json',
    ],
    words: [
        ...baseConfig.words,
        'codegen',
        'dmmf',
        'portfinder',
        'uncompiled',
        'upsert',
    ],
};
