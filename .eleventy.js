module.exports = config => {
  config.addPassthroughCopy({
    'pages/static/bundles': '/bundles',
    'pages/static/assets': '/assets',
  });

  const environment = process.env.ELEVENTY_ENV;

  return {
    dir: {
      input: 'pages/views-11ty',
      output: 'pages/dist',
      includes: 'includes',
      layouts: 'layouts',
    },
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,
    templateFormats: ['md', 'njk'],
  };
};
