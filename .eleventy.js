const htmlmin = require('html-minifier');

const { isDev } = require('./pages/views/_data/env');
const { markdown } = require('./pages/views/_data/markdown');
const { MDRenderer } = require('./pages/views/_data/md-render');
const { transform } = require('./pages/views/_controllers/transform') 

module.exports = (config) => {
  config.addWatchTarget('src/**/*.md');

  config.addPassthroughCopy({
    'pages/static/assets': 'assets',
    'pages/static/tools': '.',
  });

  config.setLibrary('md', markdown);

  config.addNunjucksAsyncShortcode('mdRender', MDRenderer.render);

  config.addTransform('transform', transform)

  config.addFilter('sortByName', (values) => {
    if (!values || !Array.isArray(values)) {
      console.error(`Unexpected values in 'sortByName' filter: ${values}`);
      return values;
    }
    return [...values].sort((a, b) => a.data.name.localeCompare(b.data.name));
  });

  config.addFilter('released', (values) => {
    return values.filter((item) => {
      const tags = [].concat(item.data.tags);
      return isDev || !tags.includes('draft');
    });
  });
  config.addFilter('released-strict', (values) => {
    return values.filter((item) => {
      const tags = [].concat(item.data.tags);
      return !tags.includes('draft');
    });
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
