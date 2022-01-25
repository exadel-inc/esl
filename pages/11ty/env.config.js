const env = process.argv.find(arg => arg.startsWith('--env='))?.split('=')[1];
const version = process.env.npm_package_version;
const isDev = env === 'development';

const context = {isDev, version, env};

module.exports = (config) => {
  config.addGlobalData('env', context);
};
Object.assign(module.exports, context);
