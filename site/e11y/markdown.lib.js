const {isDev} = require('../views/_data/env');
const highlight = require('./prismjs.lib');

const MarkdownIt = require('markdown-it');
const replaceLink = require('markdown-it-replace-link');

const markdown = MarkdownIt({
  html: true,
  highlight: highlight,
  replaceLink: function (link) {
    const domain = isDev ? 'http://localhost:3005/ui-playground' : 'https://exadel-inc.github.io/ui-playground';
    // if link isn't external, then we replace it
    return !link.search(/^https?:\/\//) ? link :
      domain + link.replace(/(src)|(README.md)/g, '')
  }
}).use(replaceLink);

module.exports = (config) => {
  config.setLibrary('md', markdown);
};
module.exports.markdown = markdown;
