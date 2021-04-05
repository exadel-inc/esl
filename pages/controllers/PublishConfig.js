const {join} = require('path');

module.exports = () => ({
  host: SERVER_CONFIG.hostPath || '',
  local: !SERVER_CONFIG.publicMode,
  public: !!SERVER_CONFIG.publicMode,
  resolve: (url) => join(SERVER_CONFIG.hostPath || '', url)
});
