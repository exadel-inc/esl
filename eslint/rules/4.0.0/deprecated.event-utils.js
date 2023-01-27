const {buildRule} = require('../../base-rules/deprecated-alias');

/**
 * Rule for deprecated `EventUtils` alias for {@link ESLEventUtils}
 */
module.exports = buildRule({
  alias: 'ESLEventUtils',
  deprecation: 'EventUtils',
});
