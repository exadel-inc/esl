const {isDev} = require('../views/_data/env');
/**
 * Auto-open development server
 * Should be replaced with OOTB solution when https://github.com/11ty/eleventy-dev-server/issues/28 will be resolved
 */
module.exports = (config) => {
  if (!isDev) return;
  config.on('eleventy.after', async () => {
    const {port} = config.serverOptions;
    if (!port) return;
    require('out-url').open(`http://localhost:${port}`);
  });
};
