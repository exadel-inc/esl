import {buildRule} from '../../core/deprecated-class-method';

/**
 * Rule for deprecated 'parse' method of {@link ESLMediaRuleList}
 */
export default buildRule({
  className: 'ESLMediaRuleList',
  deprecatedMethod: 'parse',
  getReplacemetMethod: (expression): string => {
    const args = expression.arguments;
    if (expression.type !== 'CallExpression') return 'parseQuery or parseTuple';
    return args.length === 1 || (args[1]?.type !== 'Literal' && args[1]?.type !== 'TemplateLiteral') ? 'parseQuery' : 'parseTuple';
  }
});
