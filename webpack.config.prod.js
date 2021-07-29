import baseCfg from './webpack.config.js';

export default baseCfg.map((config) => {
  return Object.assign({}, config, {
    mode: 'production',
    devtool: false
  });
});
