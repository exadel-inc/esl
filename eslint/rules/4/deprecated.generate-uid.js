const {buildRule} = require('../../base-rules/deprecated-alias');

/**
 * Rule for deprecated `generateUId` alias for {@link randUID}
 */
module.exports = buildRule({
  alias: 'randUID',
  deprecation: 'generateUId',
});
