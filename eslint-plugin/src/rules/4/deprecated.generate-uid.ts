import {buildRule} from '../../core/deprecated-alias';

/**
 * Rule for deprecated `generateUId` alias for {@link randUID}
 */
export default buildRule({
  alias: 'randUID',
  deprecation: 'generateUId'
});
