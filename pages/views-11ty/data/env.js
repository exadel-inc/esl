module.exports = {
  environment: process.argv.find(arg => arg.startsWith('--env='))?.split('=')[1],
  version: process.env.npm_package_version
};
