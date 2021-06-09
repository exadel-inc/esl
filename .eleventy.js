module.exports = config => {
  config.setUseGitIgnore(false);
  config.addWatchTarget("pages/static/bundles");
  config.addPassthroughCopy({
    'pages/static/bundles': 'bundles',
    'pages/static/assets': 'assets',
  });

  return {
    dir: {
      input: 'pages/views-11ty',
      output: 'pages/dist',
      includes: 'includes',
      layouts: 'layouts',
      data: 'data',
    },
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,
    templateFormats: ['md', 'njk'],
  };
};
