import plugin from './plugin/plugin.js';

/**
 * Builds flat ruleset from passed plugin configuration.
 * @param {object} config
 * @param {0|1|2|'off'|'warn'|'error'} severity
 */
function forConfig(config, severity = 1) {
  return [{
    plugins: {
      '@exadel/esl': plugin
    },
    rules: {
      '@exadel/esl/deprecated-alias': [severity, config.aliases],
      '@exadel/esl/deprecated-paths': [severity, config.paths],
      '@exadel/esl/deprecated-static': [severity, config.staticMembers]
    }
  }];
}

export const configs = {
  '6.0.0' : {
    aliases: {
      ESLAlertShape: 'ESLAlertTagShape',
      ESLAnimateShape: 'ESLAnimateTagShape',
      ESLCarouselShape: 'ESLCarouselTagShape',
      ESLCarouselNavDotsShape: 'ESLCarouselNavDotsTagShape',
      ESLRandomTextShape: 'ESLRandomTextTagShape'
    },
    paths: {},
    staticMembers: {}
  }
};

/**
 * Returns recommended config based on detected ESL version
 * @param {0|1|2|'off'|'warn'|'error'} severity
 */
function recommended(severity = 1) {
  const config = {};
  Object.values(configs).forEach((cfg) => {
    Object.entries(cfg).forEach(([key, value]) => {
      config[key] = Object.assign(config[key] || {}, value);
    });
  });
  return forConfig(config, severity);
}

export default {
  plugin,
  configs,
  forConfig,
  recommended
};
