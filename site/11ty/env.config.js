const env = process.argv.find(arg => arg.startsWith('--env='))?.split('=')[1];
const isE2E = env === 'e2e';
const isDev = env === 'development' || isE2E;
const date = new Date();

const buildVersion = process.env['BUILD_VERSION'] || 'local';
const packageVersion = process.env.npm_package_version;
const version = `${packageVersion}-${buildVersion}`; // e.g. 1.0.0-123

const context = {isDev, isE2E, version, env, date, buildVersion, packageVersion};

module.exports = (config) => {
  config.addGlobalData('env', context);
};
Object.assign(module.exports, context);
