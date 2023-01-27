const {buildRule} = require('../../base-rules/deprecated-alias');

/**
 * Rule for deprecated `TraversingQuery` alias for {@link ESLTraversingQuery}
 */
module.exports = buildRule({
  alias: 'ESLTraversingQuery',
  deprecation: 'TraversingQuery',
});
