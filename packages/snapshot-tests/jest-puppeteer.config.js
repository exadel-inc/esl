if (!process.argv.includes('--no-autorun')) {
  if (!process.env.PORT) process.env.PORT = '3007';
  process.env.SITE_ENV = 'e2e';
}

/** @type {puppeteerEnv.JestPuppeteerConfig} */
const config = {
  launch: {
    headless: 'new',
    product: 'chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--high-dpi-support=1',
      '--disable-gpu',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--font-render-hinting=none'
    ]
  },
  server: {
    command: 'npx nx run esl-website:run',
    port: process.env.PORT,
    launchTimeout: 120000,
    debug: true
  }
};

if (process.argv.includes('--no-autorun')) {
  delete config.server;
}

export default config;
