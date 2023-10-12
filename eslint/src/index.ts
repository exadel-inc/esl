import generateUID from './rules/4/deprecated.generate-uid';
import deepCompare from './rules/4/deprecated.deep-compare';
import eventUtils from './rules/4/deprecated.event-utils';
import traversingQuery from './rules/4/deprecated.traversing-query';
import toggleableParams from './rules/4/deprecated.toggleable-action-params';

import type {Rule} from 'eslint';

export type logLevel = 'warn' | 'error';

const DEPRECATED_4_RULES = {
  'deprecated-4/generate-uid': generateUID,
  'deprecated-4/deep-compare': deepCompare,
  'deprecated-4/event-utils': eventUtils,
  'deprecated-4/traversing-query': traversingQuery,
  'deprecated-4/toggleable-action-params': toggleableParams
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
