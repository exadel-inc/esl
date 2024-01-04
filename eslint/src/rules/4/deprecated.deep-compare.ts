import {buildRule} from '../../core/deprecated-alias';

/**
 * Rule for deprecated `deepCompare` alias for {@link isEqual}
 */
export default buildRule({
  alias: 'isEqual',
  deprecation: 'deepCompare'
});
