import type * as ESTree from 'estree';
import type {Rule} from 'eslint';

const meta: Rule.RuleModule['meta'] = {
  type: 'suggestion',
  docs: {
    description: 'replace deprecated class static methods with recommended ones',
    recommended: true
  },
  fixable: 'code'
};

export interface ESLintDeprecationStaticMethodCfg {
  /** Class name */
  className: string;
  /** Deprecated static method name */
  deprecatedMethod: string;
  /** Function that returns recommended method */
  recommendedMethod: (args?: ESTree.CallExpression['arguments']) => string;
}

type StaticMethodNode = ESTree.MemberExpression & Rule.NodeParentExtension;

/** Builds deprecation rule from {@link ESLintDeprecationStaticMethodCfg} object */
export function buildRule(configs: ESLintDeprecationStaticMethodCfg | ESLintDeprecationStaticMethodCfg[]): Rule.RuleModule {
  configs = Array.isArray(configs) ? configs : [configs];
  const create = (context: Rule.RuleContext): Rule.RuleListener => ({
    MemberExpression(node: StaticMethodNode): null {
      const {object, property} = node;

      if (!(object.type === 'Identifier' && property.type === 'Identifier')) return null;
      const className = object.name;
      const methodName = property.name;

      for (const cfg of configs) {
        if (!(className === cfg.className && methodName === cfg.deprecatedMethod)) continue;
        const {parent} = node;
        const {type} = parent;
        if (type === 'ExpressionStatement' || type === 'VariableDeclarator') {
          context.report({
            node,
            message: `[ESL Lint]: Deprecated static method ${cfg.className}.${cfg.deprecatedMethod}, 
use ${cfg.className}'s ${cfg.recommendedMethod()} methods instead`.replace(/\n|\r/g, ''),
          });
        }

        if (type === 'CallExpression') {
          const args = parent.arguments;
          const recommendedMethod = cfg.recommendedMethod(args);

          context.report({
            node,
            message: `[ESL Lint]: Deprecated static method ${cfg.className}.${cfg.deprecatedMethod}, use ${cfg.className}.${recommendedMethod} instead`,
            fix: (fixer) => fixer.replaceText(property, recommendedMethod)
          });
        }
      }
      return null;
    }
  });
  return {meta, create};
}
