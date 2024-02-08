/** @type {import('jest-environment-puppeteer').JestPuppeteerConfig} */
module.exports = {
  launch: {
    headless: 'new',
    product: 'chrome'
  },
  server: {
    command: 'npm run run:server',
    port: 3005,
    launchTimeout: 20000,
    debug: true
  }
};
