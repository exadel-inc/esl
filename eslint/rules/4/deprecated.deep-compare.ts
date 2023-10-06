import {buildRule} from '../../core/deprecated-alias';

/**
 * Rule for deprecated `deepCompare` alias for {@link isEqual}
 */
// eslint-disable-next-line import/no-default-export
export default buildRule({
  alias: 'isEqual',
  deprecation: 'deepCompare',
});
