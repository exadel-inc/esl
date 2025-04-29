const fs = require('fs');
const color = require('kleur');

module.exports = config => {
  // Init all 11ty config modules
  const cfgFiles = fs.readdirSync('./e11y/');
  for (const file of cfgFiles) {
    if (file.startsWith('_')) continue;
    try {
      console.info(color.blue(`Initializing module: ${file}`));
      require('./e11y/' + file)(config);
      console.info(color.green(`Module ${file} initialized.`));
    } catch (e) {
      console.error(color.red(`Module ${file} initialization failed`));
      throw e;
    }
  }

  config.setServerOptions({
    port: 3005,
    domDiff: true,
    liveReload: true,
    watch: [
      'dist/bundles/*.js',
      'dist/bundles/*.css',
      'dist/bundles/*.map',
    ]
  })

  config.addWatchTarget('../src/**/*.md');
  config.addPassthroughCopy({
    'static/assets': 'assets',
    '../static': '.'
  });

  return {
    dir: {
      input: 'views',
      output: 'dist',
      layouts: '_layouts',
    },
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,
    templateFormats: ['md', 'njk'],
    pathPrefix: '/ui-playground/'
  };
};
