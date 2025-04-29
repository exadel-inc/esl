const env = process.argv.find(arg => arg.startsWith('--env='))?.split('=')[1];
module.exports = {
  isDev: env === 'development',
  version: process.env.npm_package_version
};
