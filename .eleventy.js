module.exports = config => {
  config.setUseGitIgnore(false);
  config.addWatchTarget('pages/static/bundles');
  config.addPassthroughCopy({
    'pages/static/bundles': 'bundles',
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
