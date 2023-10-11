const {buildRule} = require('../../core/deprecated-alias');

/**
 * Rule for deprecated `ToggleableActionParams` alias for {@link ESLToggleableActionParams}
 */
module.exports = buildRule({
  alias: 'ESLToggleableActionParams',
  deprecation: 'ToggleableActionParams',
});
