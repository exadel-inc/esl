/** filter to limit collection */
const limit = (collection, count, start = 0) => collection ? collection.slice(start, start + count) : [];

module.exports = (config) => {
  config.addFilter('limit', limit);
};
