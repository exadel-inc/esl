import plugin from './plugin/plugin.js';

function normalizeSeverity(severity) {
  if (severity === undefined || severity === null) return 1; // default warn
  if (typeof severity === 'number') {
    return [0, 1, 2].includes(severity) ? severity : 1;
  }
  const s = String(severity).toLowerCase();
  if (['off', '0'].includes(s)) return 'off';
  if (['warn', '1'].includes(s)) return 'warn';
  if (['error', '2'].includes(s)) return 'error';
  return 1; // fallback warn
}

function forConfig(config, severity) {
  const sev = normalizeSeverity(severity);
  return [{
    plugins: {
      '@exadel/esl': plugin
    },
    rules: {
      '@exadel/esl/deprecated-alias': [sev, config.aliases],
      '@exadel/esl/deprecated-paths': [sev, config.paths],
      '@exadel/esl/deprecated-static': [sev, config.staticMembers]
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

function recommended(severity) {
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
