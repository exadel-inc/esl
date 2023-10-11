import {buildRule} from '../../core/deprecated-alias';

/**
 * Rule for deprecated `generateUId` alias for {@link randUID}
 */
// eslint-disable-next-line import/no-default-export
export default buildRule({
  alias: 'randUID',
  deprecation: 'generateUId',
});
