const Prism = require('prismjs');
const {isDev} = require('../views/_data/env');

const highlight = (str, lang) => {
  try {
    lang = lang || 'text';
    if (!Prism.languages[lang]) return `<!-- Error: Unsupported language '${lang}' -->`;
    return Prism.highlight(str, Prism.languages[lang], lang);
  } catch (e) {
    return `<!-- Error while processing code block ${e.toString()} -->`;
  }
};

const markdownIt = require("markdown-it")({
  html: true,
  highlight: highlight,
  replaceLink: function (link) {
    const domain = isDev ? 'http://localhost:3005/ui-playground' : 'https://exadel-inc.github.io/ui-playground';
    // if link isn't external, then we replace it
    return !link.search(/^https?:\/\//) ? link :
      domain + link.replace(/(src)|(README.md)/g, '')
  }
}).use(require('markdown-it-replace-link'));

module.exports = markdownIt;
