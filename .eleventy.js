const markdown = require('./pages/e11y/markdown');
const {isDev} = require('./pages/views/_data/env');


module.exports = config => {
  config.addWatchTarget('src/**/*.md');
  config.addPassthroughCopy({
    'pages/static/assets': 'assets'
  });
  config.addPassthroughCopy('static');

  config.addPairedShortcode(
    'markdown', (content) => markdown.render(content)
  );

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
    templateFormats: ['md', 'njk'],
    pathPrefix: '/ui-playground/',
  };
};
