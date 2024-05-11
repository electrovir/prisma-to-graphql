const {getBaseConfigWithCoveragePercent} = require('virmator/base-configs/base-nyc.js');

const baseConfig = getBaseConfigWithCoveragePercent(100);

const nycConfig = {
    ...baseConfig,
    exclude: [
        ...baseConfig.exclude,
    ],
};

module.exports = nycConfig;
