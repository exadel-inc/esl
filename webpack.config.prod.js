import baseCfg from './webpack.config.js';

module.exports = Object.assign({}, baseCfg, {
  mode: 'production',
  devtool: false
});
