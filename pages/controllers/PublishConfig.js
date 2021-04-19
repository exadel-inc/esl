const {join} = require('path');
const {version} = require('../../package.json');

module.exports = () => ({
  version,
  host: SERVER_CONFIG.hostPath || '',
  local: !SERVER_CONFIG.publicMode,
  public: !!SERVER_CONFIG.publicMode,
  resolve: (url) => join(SERVER_CONFIG.hostPath || '', url)
});
