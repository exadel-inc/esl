module.exports = (config) => {
  const date = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  config.addFilter('date', date);
};
