import uid from './rules/4/deprecated.generate-uid';
import compare from './rules/4/deprecated.deep-compare';
import event from './rules/4/deprecated.event-utils';
import traversing from './rules/4/deprecated.traversing-query';
import toggleable from './rules/4/deprecated.toggleable-action-params';

import type {Rule} from 'eslint';

export type logLevel = 'warn' | 'error';

const DEPRECATED_4_RULES = {
  'deprecated-4/generate-uid': uid,
  'deprecated-4/deep-compare': compare,
  'deprecated-4/event-utils': event,
  'deprecated-4/traversing-query': traversing,
  'deprecated-4/toggleable-action-params': toggleable
};

const buildDefault = (definition: Record<string, Rule.RuleModule>, level: logLevel): Record<string, logLevel> => {
  const config: Record<string, logLevel> = {};
  for (const name of Object.keys(definition)) {
    const rule = `@exadel/esl/${name}`;
    config[rule] = level;
  }
  return config;
};

export const rules = Object.assign({}, DEPRECATED_4_RULES);

export const configs = {
  'default-4': {
    rules: {
      ...buildDefault(DEPRECATED_4_RULES, 'warn')
    }
  },
  'default-5': {
    rules: {
      ...buildDefault(DEPRECATED_4_RULES, 'error')
    }
  }
};
