import {buildRule} from '../../core/deprecated-class-method';
import type {replacementMethodCfg} from '../../core/deprecated-class-method';

/**
 * Rule for deprecated 'parse' method of {@link ESLMediaRuleList}
 */
export default buildRule({
  className: 'ESLMediaRuleList',
  deprecatedMethod: 'parse',
  getReplacemetMethod: (expression): replacementMethodCfg => {
    const args = expression.arguments;
    if (expression.type !== 'CallExpression') return {message: 'parseQuery or parseTuple'};
    const methodName = args.length === 1 || (args[1]?.type !== 'Literal' && args[1]?.type !== 'TemplateLiteral') ? 'parseQuery' : 'parseTuple';
    return {message: methodName, replacement: methodName};
  }
});
