const { isDev } = require('./pages/views/_data/env');
const htmlmin = require('html-minifier');

const hljs = require('highlight.js');
const markdown = require('markdown-it')({
  html: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) { }
    }
    return '';
  }
});

module.exports = (config) => {
  config.addWatchTarget('src/**/*.md');

  config.addPassthroughCopy({
    'pages/static/assets': 'assets',
    'pages/static/tools': '.',
  });

  config.setLibrary('md', markdown);

  config.addPairedShortcode('markdown', (content) => {
    return `<div class="markdown-container">${markdown.render(content)}</div>`;
  });

  config.addFilter('sortByName', (values) => {
    if (!values || !Array.isArray(values)) {
      console.error(`Unexpected values in 'sortByName' filter: ${values}`);
      return values;
    }
    return [...values].sort((a, b) => a.data.name.localeCompare(b.data.name));
  });

  config.setBrowserSyncConfig({
    files: [
      'pages/dist/bundles/*.js',
      'pages/dist/bundles/*.css',
      'pages/dist/bundles/*.map',
    ],
    open: isDev,
  });

  config.addTransform('htmlmin', function (content, outputPath) {
    if (outputPath && outputPath.endsWith('.html') && !isDev) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
      });
      return minified;
    }
    return content;
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
