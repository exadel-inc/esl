const path = require('path');
const axios = require('axios');

const replaceAll = require('string.prototype.replaceall');

const {writeFile} = require('fs/promises')

const server = require('@exadel/server-sketch/localdev');
const serverConfig = Object.assign({}, require('./config'), {
  browserSync: false,
  openAfterStart: false
});

const {port} = serverConfig;

const {pages, folder} = require('./pages.json');
const domain = `http://localhost:${port}/`;

/** @type {Array} */
const CONTENT_PROCESSORS = [
  (data) => replaceAll(data, domain, './'),
  (data) => replaceAll(data, /(href|src)\s*=\s*"\//g, '$1 = "./'),
];

async function exec() {
  server.start(serverConfig);

  for (const url of pages) {
    console.log(`Requesting: "${url}"`);
    const res = await axios.get(domain + url);
    console.log(`Responded on "${url}" received`);
    const file = path.resolve(folder, url);
    console.log(`Processing "${url}" ...`);
    const processedData = CONTENT_PROCESSORS.reduce(
      (lastResult, processor) => processor(lastResult),
      res.data
    );
    console.log(`Writing "${file}" ...`);
    await writeFile(file, processedData);
    console.log(`File "${file}" written successfully`);
  }
}

exec()
  .then(() => {
    console.log('All pages are rendered');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Rendering failed', err);
    process.exit(1);
  })
