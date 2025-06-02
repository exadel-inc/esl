import config from '@exadel/esl/package.json' with {type: 'json'};

const isValidEnv = (env) => ['development', 'production', 'e2e'].includes(String(env).toLowerCase());
const env = isValidEnv(process.env['SITE_ENV']) ? process.env['SITE_ENV'] : 'development';
const isE2E = env === 'e2e';
const isDev = env === 'development' || isE2E;
const date = new Date();

const buildVersion = process.env['BUILD_VERSION'] || 'local';
const packageVersion = config.version;
const version = `${packageVersion}-${buildVersion}`; // e.g. 1.0.0-123

export const context = {isDev, isE2E, version, env, date, buildVersion, packageVersion};

console.info('Environment: \t', env);
console.info('Build version: \t', buildVersion);
console.info('Package version: \t', packageVersion);

export default (config) => {
  config.addGlobalData('env', context);
};
