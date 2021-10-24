const fs = require('fs');
const chalk = require('chalk');
const {isDev} = require('./pages/11ty/env.config');

module.exports = (config) => {
  // Init all 11ty config modules
  const cfgFiles = fs.readdirSync('./pages/11ty');
  for (const file of cfgFiles) {
    if (file.startsWith('_')) return;
    try {
      console.info(chalk.blue(`Initializing module: ${file}`));
      require('./pages/11ty/' + file)(config);
      console.info(chalk.green(`Module ${file} initialized.`));
    } catch (e) {
      console.error(chalk.red(`Module ${file} initialization failed`));
      throw e;
    }
  }

  config.addWatchTarget('src/**/*.md');

  config.addPassthroughCopy({
    'pages/static/assets': 'assets',
    'pages/static/tools': '.',
  });

  config.setBrowserSyncConfig({
    files: [
      'pages/dist/bundles/*.js',
      'pages/dist/bundles/*.css',
      'pages/dist/bundles/*.map',
    ],
    open: isDev,
  });

  return {
    dir: {
      input: 'pages/views',
      output: 'pages/dist',
      layouts: '_layouts',
    },
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,
    templateFormats: ['md', 'njk'],
    pathPrefix: '/esl/',
  };
};
