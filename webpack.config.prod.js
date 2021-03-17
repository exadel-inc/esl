import baseCfg from './webpack.config.js';

export default Object.assign({}, baseCfg, {
  mode: 'production',
  devtool: false
});
