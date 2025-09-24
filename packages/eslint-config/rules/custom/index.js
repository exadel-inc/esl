import plugin from './plugin/plugin.js';

function forConfig(config) {
  return [{
    plugins: {
      '@exadel/esl': plugin
    },
    rules: {
      '@exadel/esl/deprecated-alias': [1, config.aliases],
      '@exadel/esl/deprecated-paths': [1, config.paths],
      '@exadel/esl/deprecated-static': [1, config.staticMembers]
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

export default {
  plugin,
  configs,
  forConfig,
  get recommended() {
    const config = {};
    Object.values(configs).forEach((cfg) => {
      Object.entries(cfg).forEach(([key, value]) => {
        config[key] = Object.assign(config[key] || {}, value);
      });
    });
    return forConfig(config);
  }
};
