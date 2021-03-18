const path = require('path');
const axios = require('axios');
const {existsSync, mkdirSync} = require('fs');
const {writeFile} = require('fs/promises');

const settings = require('./settings.json');
const {pages, folder} = settings['github-pages'];

const server = require('@exadel/server-sketch/localdev');

const serverConfig = Object.assign({}, settings.server.config, {
  browserSync: false,
  openAfterStart: false
});

const {port} = serverConfig;
const domain = `http://localhost:${port}/`;

/** @type {Array} */
const CONTENT_PROCESSORS = [
  (data) => data.replace(new RegExp(domain, 'gi'), './'),
  (data) => data.replace(/(href|src)\s*=\s*"\//gi, '$1 = "./'),
];

/** Write file and create directories */
const write = async (file, content) => {
  const dir = path.dirname(file);
  if (!existsSync(dir)) {
    mkdirSync(dir, {recursive: true});
  }
  return await writeFile(file, content);
};

(async () => {
  console.log('Start server to render public pages');
  server.start(serverConfig);

  for (const url of pages) {
    console.log(`Rendering: "${url}"`);
    const res = await axios.get(domain + url);
    console.log(`Page "${url}" received`);
    const file = path.resolve(folder, url);
    console.log(`Post processing "${url}" ...`);
    const processedData = CONTENT_PROCESSORS.reduce(
      (lastResult, processor) => processor(lastResult),
      res.data
    );
    console.log(`Writing "${file}" ...`);
    await write(file, processedData);
    console.log(`File "${file}" written successfully`);
  }

})().then(() => {
  console.log('All pages are rendered');
  process.exit(0);
}).catch((err) => {
  console.error('Rendering failed', err);
  process.exit(1);
});

