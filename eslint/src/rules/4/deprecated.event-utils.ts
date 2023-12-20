import {buildRule} from '../../core/deprecated-alias';

/**
 * Rule for deprecated `EventUtils` alias for {@link ESLEventUtils}
 */
export default buildRule({
  alias: 'ESLEventUtils',
  deprecation: 'EventUtils'
});
