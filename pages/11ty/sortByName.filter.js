module.exports = (config) => {
  config.addFilter('sortByName', (values) => {
    if (!values || !Array.isArray(values)) {
      console.error(`Unexpected values in 'sortByName' filter: ${values}`);
      return values;
    }
    return [...values].sort((a, b) => a.data.name.localeCompare(b.data.name));
  });
};
