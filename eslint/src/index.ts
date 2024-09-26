import './core/check-version';

import DEPRECATED_4_RULES from './rules/4/all.rules';
import DEPRECATED_5_RULES from './rules/5/all.rules';

import type {Rule} from 'eslint';

export type logLevel = 'warn' | 'error';

const buildDefault = (definition: Record<string, Rule.RuleModule>, level: logLevel, prefix = '@exadel/esl'): Record<string, logLevel> => {
  const config: Record<string, logLevel> = {};
  for (const name of Object.keys(definition)) {
    config[`${prefix}/${name}`] = level;
  }
  return config;
};

export const rules = Object.assign({}, DEPRECATED_4_RULES, DEPRECATED_5_RULES);

export const configs = {
  'default-4': {
    rules: {
      ...buildDefault(DEPRECATED_4_RULES, 'warn')
    }
  },
  'default-5': {
    rules: {
      ...buildDefault(DEPRECATED_5_RULES, 'warn')
    }
  },
  'default': {
    rules: {
      ...buildDefault(DEPRECATED_4_RULES, 'error'),
      ...buildDefault(DEPRECATED_5_RULES, 'warn')
    }
  }
};

const plugin = {
  rules,
  configs
};

// ESLint 9 compatibility
Object.assign(plugin.configs, {
  'recommended': [{
    plugins: {
      '@exadel/esl': plugin
    },
    rules: {
      ...buildDefault(DEPRECATED_4_RULES, 'error'),
      ...buildDefault(DEPRECATED_5_RULES, 'warn')
    }
  }]
});

export default plugin;
