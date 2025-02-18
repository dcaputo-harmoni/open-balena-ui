const { merge } = require('webpack-merge');
const common = require('./webpack.common');


const prodConfigOverwrite = {
  mode: 'production',
};

const prodConfig = merge(common, prodConfigOverwrite);

module.exports = prodConfig;