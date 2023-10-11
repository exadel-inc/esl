const {buildRule} = require('../../core/deprecated-alias');

/**
 * Rule for deprecated `EventUtils` alias for {@link ESLEventUtils}
 */
module.exports = buildRule({
  alias: 'ESLEventUtils',
  deprecation: 'EventUtils',
});
