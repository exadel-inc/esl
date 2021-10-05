const { isDev } = require('./pages/views/_data/env');
const markdownIt = require("markdown-it")({
  html: true
});

module.exports = config => {
  config.addWatchTarget('src/**/*.md');
  config.addPassthroughCopy({
    'pages/static/assets': 'assets',
  });

  config.addPairedShortcode(
    'markdown', (content) => markdownIt.render(content)
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
  };
};
