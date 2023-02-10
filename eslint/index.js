const DEPRECATED_4_RULES = {
  'deprecated-4/generate-uid': require('./rules/4/deprecated.generate-uid'),
  'deprecated-4/deep-compare': require('./rules/4/deprecated.deep-compare'),

  'deprecated-4/event-utils': require('./rules/4/deprecated.event-utils'),
  'deprecated-4/traversing-query': require('./rules/4/deprecated.traversing-query'),
  'deprecated-4/toggleable-action-params': require('./rules/4/deprecated.toggleable-action-params')
};

const buildDefault = (definition, level) => {
  const config = {};
  for (const name of Object.keys(definition)) {
    const rule = `@exadel/esl/${name}`;
    config[rule] = level;
  }
  return config;
};

exports.rules = Object.assign({}, DEPRECATED_4_RULES);

exports.configs = {
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
