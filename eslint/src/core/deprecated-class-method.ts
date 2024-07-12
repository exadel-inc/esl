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
export function buildRule(config: ESLintDeprecationStaticMethodCfg): Rule.RuleModule {
  const create = (context: Rule.RuleContext): Rule.RuleListener => {
    return {
      MemberExpression(node: StaticMethodNode): null {
        if (!isDeprecatedMethod(node, config)) return null;
        const {type} = node.parent;
        if (type === 'CallExpression') handleCallExpression(node, context, config);
        else if (type === 'ExpressionStatement' || type === 'VariableDeclarator') handleAssignmentExpression(node, context, config);
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
  const callExpression = node.parent as ESTree.CallExpression;
  const args = callExpression.arguments;
  const recommendedMethod = config.recommendedMethod(args);

  context.report({
    node,
    message: `[ESL Lint]: Deprecated static method ${config.className}.${config.deprecatedMethod}, use ${config.className}.${recommendedMethod} instead`,
    fix: (fixer) => fixer.replaceText(node.property, recommendedMethod)
  });
}

function handleAssignmentExpression(node: StaticMethodNode, context: Rule.RuleContext, config: ESLintDeprecationStaticMethodCfg): void {
  context.report({
    node,
    message: `[ESL Lint]: Deprecated static method ${config.className}.${config.deprecatedMethod}, 
use ${config.className}'s ${config.recommendedMethod()} methods instead`.replace(/\n|\r/g, ''),
  });
}
