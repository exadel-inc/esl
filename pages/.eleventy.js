const fs = require('fs');
const color = require('kleur');

module.exports = (config) => {
  // Init all 11ty config modules
  const cfgFiles = fs.readdirSync('./11ty');
  for (const file of cfgFiles) {
    if (file.startsWith('_')) continue;
    try {
      console.info(color.blue(`Initializing module: ${file}`));
      require('./11ty/' + file)(config);
      console.info(color.green(`Module ${file} initialized.`));
    } catch (e) {
      console.error(color.red(`Module ${file} initialization failed`));
      throw e;
    }
  }

  // Add MD files from the library sources
  config.addWatchTarget('../**/*.md');

  // Setup simple copy operations
  config.addPassthroughCopy({
    'static/assets': 'assets',
    'static/tools': '.'
  });

  config.setServerOptions({
    domDiff: true,
    watch: [
      'dist/bundles/*.js',
      'dist/bundles/*.css',
      'dist/bundles/*.map'
    ],
  });

  return {
    dir: {
      input: 'views',
      output: 'dist',
      layouts: '_layouts'
    },
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,
    templateFormats: ['md', 'njk']
  };
};
