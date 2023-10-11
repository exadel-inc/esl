import {buildRule} from '../../core/deprecated-alias';

/**
 * Rule for deprecated `EventUtils` alias for {@link ESLEventUtils}
 */
// eslint-disable-next-line import/no-default-export
export default buildRule({
  alias: 'ESLEventUtils',
  deprecation: 'EventUtils',
});
