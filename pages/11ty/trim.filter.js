/** filter to trim text */

const trimFilter = (content, limit) => (content.length <= limit) ? content : `${content.substring(0, limit)}...`;

module.exports = (config) => {
  config.addFilter('trim', trimFilter);
};
