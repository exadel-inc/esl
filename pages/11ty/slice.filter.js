/** filter to limit collection */
const sliceFilter = (collection, count) => collection ? collection.slice(0, count) : [];

module.exports = (config) => {
  config.addFilter('limit', sliceFilter);
};
