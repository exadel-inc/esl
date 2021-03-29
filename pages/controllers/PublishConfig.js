const config = require('@exadel/server-sketch/config/instance');

module.exports = () => ({
  host: config.hostPath || '',
  local: !config.publicMode,
  public: !!config.publicMode
});
