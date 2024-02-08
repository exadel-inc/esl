/** @type {import('jest-environment-puppeteer').JestPuppeteerConfig} */
module.exports = {
  launch: {
    headless: 'new',
    product: 'chrome'
  },
  server: {
    command: 'cd ../ & npm run start:test --workspace site',
    port: 3005,
    launchTimeout: 20000,
    debug: true
  }
};
