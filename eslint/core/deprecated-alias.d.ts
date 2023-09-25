import type {Rule} from 'eslint';

export interface ESLintDeprecationCfg {
  /** Current alias name */
  alias: string;
  /** Deprecated name */
  deprecation: string;
}

/** Builds deprecation rule */
export declare function buildRule(option: ESLintDeprecationCfg): Rule.RuleModule;
