/** @type {import('jest-environment-puppeteer').JestPuppeteerConfig} */
module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false' ? 'new' : false,
    product: 'chrome'
  },
  server: {
    command: 'cd ../ & npm run start:test --workspace site',
    port: 3005,
    launchTimeout: 10000,
    debug: true
  },
};
