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

export interface ESLintReplacementMethodCfg {
  replacement?: string;
  message: string;
}

export interface ESLintDeprecationStaticMethodCfg {
  /** Class name */
  className: string;
  /** Deprecated static method name */
  deprecatedMethod: string;
  /** Function that returns recommended method */
  getReplacementMethod: (expression: ESTree.CallExpression) => ESLintReplacementMethodCfg | string;
}

type StaticMethodNode = ESTree.MemberExpression & Rule.NodeParentExtension;

/** Builds deprecation rule from {@link ESLintDeprecationStaticMethodCfg} object */
export function buildRule(config: ESLintDeprecationStaticMethodCfg): Rule.RuleModule {
  const create = (context: Rule.RuleContext): Rule.RuleListener => {
    return {
      MemberExpression(node: StaticMethodNode): null {
        if (isDeprecatedMethod(node, config)) handleCallExpression(node, context, config);
        return null;
      }
    };
  };

  return {meta, create};
}

function isDeprecatedMethod(node: StaticMethodNode, config: ESLintDeprecationStaticMethodCfg): boolean {
  const {object, property} = node;
  return object.type === 'Identifier' && property.type === 'Identifier' && object.name === config.className && property.name === config.deprecatedMethod;
}

function handleCallExpression(node: StaticMethodNode, context: Rule.RuleContext, config: ESLintDeprecationStaticMethodCfg): void {
  const replCfg = config.getReplacementMethod(node.parent as ESTree.CallExpression);
  const message = typeof replCfg === 'string' ? `${config.className}.${replCfg}` : replCfg.message;
  const replacement = typeof replCfg === 'string' ? replCfg : replCfg.replacement;

  context.report({
    node,
    message: `[ESL Lint]: Deprecated static method ${config.className}.${config.deprecatedMethod}, use ${message} instead`,
    fix: replacement ? (fixer): Rule.Fix => fixer.replaceText(node.property, replacement) : undefined
  });
}
