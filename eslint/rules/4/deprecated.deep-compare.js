const {buildRule} = require('../../core/deprecated-alias');

/**
 * Rule for deprecated `deepCompare` alias for {@link isEqual}
 */
module.exports = buildRule({
  alias: 'isEqual',
  deprecation: 'deepCompare',
});
