/* eslint-disable no-undef */

if (!process.argv.includes('--no-autorun') && !process.env.PORT) {
  process.env.PORT = '3007';
}

/** @type {import('jest-environment-puppeteer').JestPuppeteerConfig} */
module.exports = {
  launch: {
    headless: 'new',
    product: 'chrome',
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--disable-setuid-sandbox',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--font-render-hinting=none'
    ]
  },
  server: {
    command: 'npm run run:server',
    port: process.env.PORT,
    launchTimeout: 120000,
    debug: true
  }
};

if (process.argv.includes('--no-autorun')) {
  delete module.exports.server;
}
