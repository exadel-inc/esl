module.exports = config => {
  config.addPassthroughCopy({
    'pages/static/assets': 'assets',
    'pages/static/tools': '.',
  });

  config.addFilter("sortByName", (values) => {
    if (!values || !Array.isArray(values)) {
      console.error(`Unexpected values in "sortByName" filter: ${values}`);
      return values;
    }
    return [...values].sort((a, b) => a.data.name.localeCompare(b.data.name))
  });

  config.setBrowserSyncConfig({
    files: [
      'pages/dist/bundles/*.js',
      'pages/dist/bundles/*.css',
      'pages/dist/bundles/*.map',
    ],
    // TODO(abarmina): update with addGlobalData function when v1.0.0 is available
    // we have the same function in pages/views/_data/env.js
    open: process.argv.find(arg => arg.startsWith('--env='))?.split('=')[1] === 'development',
  });

  return {
    dir: {
      input: 'pages/views',
      output: 'pages/dist',
      layouts: "_layouts",
    },
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,
    templateFormats: ['md', 'njk'],
    pathPrefix: "/esl/",
  };
};
