import deprecatedAlertActionParams from './rules/4/deprecated.alert-action-params';
import deprecatedGenerateUid from './rules/4/deprecated.generate-uid';
import deprecatedDeepCompare from './rules/4/deprecated.deep-compare';
import deprecatedEventUtils from './rules/4/deprecated.event-utils';
import deprecatedPanelActionParams from './rules/4/deprecated.panel-action-params';
import deprecatedPopupActionParams from './rules/4/deprecated.popup-action-params';
import deprecatedTraversingQuery from './rules/4/deprecated.traversing-query';
import deprecatedToggleableActionParams from './rules/4/deprecated.toggleable-action-params';
import deprecatedTooltipActionParams from './rules/4/deprecated.tooltip-action-params';

import type {Rule} from 'eslint';

export type logLevel = 'warn' | 'error';

const DEPRECATED_4_RULES = {
  'deprecated-4/alert-action-params': deprecatedAlertActionParams,
  'deprecated-4/generate-uid': deprecatedGenerateUid,
  'deprecated-4/deep-compare': deprecatedDeepCompare,
  'deprecated-4/event-utils': deprecatedEventUtils,
  'deprecated-4/panel-action-params': deprecatedPanelActionParams,
  'deprecated-4/popup-action-params': deprecatedPopupActionParams,
  'deprecated-4/traversing-query': deprecatedTraversingQuery,
  'deprecated-4/toggleable-action-params': deprecatedToggleableActionParams,
  'deprecated-4/tooltip-action-params': deprecatedTooltipActionParams
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
