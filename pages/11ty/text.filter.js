const {JSDOM} = require('jsdom');

/** filter to extract text content from HTML */
const extractTextContent = (content) => {
  const {window} = new JSDOM(content);
  return window.document.body.textContent;
};

module.exports = (config) => {
  config.addFilter('text', extractTextContent);
};
