const Prism = require('prismjs');

// Register highlighted languages
require('prismjs/components/prism-bash');
require('prismjs/components/prism-css');
require('prismjs/components/prism-less');
require('prismjs/components/prism-javascript');
require('prismjs/components/prism-typescript');

const highlight = (str, lang) => {
  try {
    lang = lang || 'text';
    if (!Prism.languages[lang]) return `<!-- Error: Unsupported language '${lang}' -->`;
    return Prism.highlight(str, Prism.languages[lang], lang);
  } catch (e) {
    return `<!-- Error while processing code block ${e.toString()} -->`;
  }
};

module.exports = highlight;
