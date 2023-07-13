const MarkdownIt = require('markdown-it');
const {highlight} = require('./prismjs.lib');

const markdown = MarkdownIt({html: true, highlight});

module.exports = (config) => {
  config.setLibrary('md', markdown);
  config.addPairedShortcode('markdown', (content) => markdown.render(content));
};
module.exports.markdown = markdown;
