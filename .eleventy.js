const htmlmin = require('html-minifier');

const { isDev } = require('./pages/views/_data/env');
const { markdown } = require('./pages/views/_data/markdown');
const { MDRenderer } = require('./pages/views/_data/md-render');
const { createTapeParam, checkObj, createSignature, createParam, getSignature, checkSignature, createParamAcces} = require('./pages/views/_data/utils-render-function');

module.exports = (config) => {
  config.addWatchTarget('src/**/*.md');

  config.addPassthroughCopy({
    'pages/static/assets': 'assets',
    'pages/static/tools': '.',
  });

  config.setLibrary('md', markdown);

  config.addNunjucksAsyncShortcode('mdRender', MDRenderer.render);

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

  config.addTransform('htmlmin', function (content, outputPath) {
    if (outputPath && outputPath.endsWith('.html') && !isDev) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
      });
    }
    return content;
  });

  config.addNunjucksFilter('getSignature', getSignature);
  config.addShortcode('createTapeParam', createTapeParam);
  config.addShortcode('createSignature', createSignature);
  config.addShortcode('createParam', createParam);
  config.addFilter('checkSignature', checkSignature);
  config.addFilter('checkObj', checkObj);
  config.addFilter('checkFlags', (item) =>  Object.keys(item).length !== 0);
  config.addShortcode('createParamAcces', createParamAcces);

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
