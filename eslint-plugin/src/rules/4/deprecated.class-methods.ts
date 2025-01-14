import {lte} from 'semver';
import {buildLoggingRule} from '../../core/log';
import {ESL_PACKAGE_VERSION} from '../../core/check-version';
import {buildRule} from '../../core/deprecated-class-method';

import type * as ESTree from 'estree';
import type {ESLintReplacementMethodCfg} from '../../core/deprecated-class-method';

const AVAILABLE_SINCE = '5.0.0-beta.24';
const isActual = lte(ESL_PACKAGE_VERSION, AVAILABLE_SINCE);

/** Rule for deprecated methods */
export default isActual ?
  buildRule({
    className: 'ESLMediaRuleList',
    deprecatedMethod: 'parse',
    getReplacementMethod: (expression): ESLintReplacementMethodCfg | string => {
      const args = expression.arguments;
      const isLiteral = (node: ESTree.Expression | ESTree.SpreadElement): boolean => node?.type === 'Literal' || node?.type === 'TemplateLiteral';
      if (expression.type === 'CallExpression' && args.length === 1) return 'parseQuery';
      if (expression.type === 'CallExpression' && args.length === 2 && isLiteral(args[1])) return 'parseTuple';
      if (expression.type === 'CallExpression' && args.length === 3) return 'parseTuple';
      return {message: 'ESLMediaRuleList.parseQuery or ESLMediaRuleList.parseTuple'};
    }
  }) :
  buildLoggingRule(
    `'ESLMediaRuleList.parse' was updated in v${AVAILABLE_SINCE}. Rule 'deprecated-4/media-rule-list-parse' is skipped.`
  );
