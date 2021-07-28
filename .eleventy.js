const { isDev } = require("./pages/views/_data/env");
const htmlmin = require("html-minifier");

module.exports = (config) => {
  config.addPassthroughCopy({
    "pages/static/assets": "assets",
    "pages/static/tools": ".",
  });

  config.addFilter("sortByName", (values) => {
    if (!values || !Array.isArray(values)) {
      console.error(`Unexpected values in "sortByName" filter: ${values}`);
      return values;
    }
    return [...values].sort((a, b) => a.data.name.localeCompare(b.data.name));
  });

  config.setBrowserSyncConfig({
    files: [
      "pages/dist/bundles/*.js",
      "pages/dist/bundles/*.css",
      "pages/dist/bundles/*.map",
    ],
    open: isDev,
  });

  config.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html") && !isDev) {
      return require(`html-minifier`).minify(content, {
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

  return {
    dir: {
      input: "pages/views",
      output: "pages/dist",
      layouts: "_layouts",
    },
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true,
    templateFormats: ["md", "njk"],
    pathPrefix: "/esl/",
  };
};
