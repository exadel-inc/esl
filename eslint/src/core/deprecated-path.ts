import type * as ESTree from 'estree';
import type {Rule} from 'eslint';

const meta: Rule.RuleModule['meta'] = {
  type: 'suggestion',
  docs: {
    description: 'replace deprecated path with a recommended one or use the library root & tree shaking',
    recommended: true
  }
};

export interface ESLintDeprecationImportCfg {
  /** Alias name */
  alias: string;
  /** Deprecated name */
  deprecationPath: string;
  /** Recommended path */
  recommendedPath: string;
}

type ImportNode = ESTree.ImportSpecifier & Rule.NodeParentExtension;

/** Builds deprecation rule from {@link ESLintDeprecationCfg} object */
export function buildRule(configs: ESLintDeprecationImportCfg | ESLintDeprecationImportCfg[]): Rule.RuleModule {
  configs = Array.isArray(configs) ? configs : [configs];
  const create = (context: Rule.RuleContext): Rule.RuleListener => ({
    ImportSpecifier(node: ImportNode): null {
      const importedValue = node.imported;
      const importedSource = (node.parent as ESTree.ImportDeclaration).source.value;

      for (const cfg of configs) {
        if (importedValue.name === cfg.alias && importedSource === cfg.deprecationPath) {
          context.report({
            node,
            message: `[ESL Lint]: Deprecated path for ${cfg.alias}, use ${cfg.recommendedPath} instead`
          });
        }
      }
      return null;
    }
  });
  return {meta, create};
}
