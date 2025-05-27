import {JSDOM} from 'jsdom';

/** filter to extract text content from HTML */
const extractTextContent = (content) => {
  const {window} = new JSDOM(content);
  return window.document.body.textContent;
};

export default (config) => {
  config.addFilter('text', extractTextContent);
};
