const hljs = require('highlight.js');
const markdownLib = require('markdown-it');

const markdown = markdownLib({
  html: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch { }
    }
    return '';
  }
});

module.exports = { markdown };
