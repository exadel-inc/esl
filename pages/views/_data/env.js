module.exports = {
  isDev: process.argv.find(arg => arg.startsWith('--env='))?.split('=')[1] === 'development',
  version: process.env.npm_package_version
};
