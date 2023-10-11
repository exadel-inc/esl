import {buildRule} from '../../core/deprecated-alias';

/**
 * Rule for deprecated `TraversingQuery` alias for {@link ESLTraversingQuery}
 */
// eslint-disable-next-line import/no-default-export
export default buildRule({
  alias: 'ESLTraversingQuery',
  deprecation: 'TraversingQuery',
});
