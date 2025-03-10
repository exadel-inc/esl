import config from '@exadel/esl/package.json' with {type: 'json'};

const env = process.argv.find((arg) => arg.startsWith('--env='))?.split('=')[1];
const isE2E = env === 'e2e';
const isDev = env === 'development' || isE2E;
const date = new Date();

const buildVersion = process.env['BUILD_VERSION'] || 'local';
const packageVersion = config.version;
const version = `${packageVersion}-${buildVersion}`; // e.g. 1.0.0-123

export const context = {isDev, isE2E, version, env, date, buildVersion, packageVersion};

export default (config) => {
  config.addGlobalData('env', context);
};
