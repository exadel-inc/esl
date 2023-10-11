const {buildRule} = require('../../core/deprecated-alias');

/**
 * Rule for deprecated `generateUId` alias for {@link randUID}
 */
module.exports = buildRule({
  alias: 'randUID',
  deprecation: 'generateUId',
});
