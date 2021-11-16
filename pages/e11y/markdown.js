const Prism = require('prismjs');

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
  highlight: highlight
});

module.exports = markdownIt;
