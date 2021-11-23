module.exports = (config) => {
  /** Filter items by ignore marker */
  const notIgnoredFilter = (collection) => collection.filter( item => !item.data.ignore );

  config.addFilter('notIgnored', notIgnoredFilter);
};
