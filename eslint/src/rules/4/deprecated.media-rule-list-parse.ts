import {buildRule} from '../../core/deprecated-class-method';

/**
 * Rule for deprecated 'parse' method of {@link ESLMediaRuleList}
 */
export default buildRule({
  className: 'ESLMediaRuleList',
  deprecatedMethod: 'parse',
  recommendedMethod: (args): string => {
    if (!args) return 'parseQuery or parseTuple';
    return args.length === 1 || (args[1]?.type !== 'Literal' && args[1]?.type !== 'TemplateLiteral') ? 'parseQuery' : 'parseTuple';
  }
});
