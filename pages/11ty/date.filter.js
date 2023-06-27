module.exports = (config) => {
  const date = (timestamp) => 
    new Intl.DateTimeFormat('UTC', { month: 'long', day: '2-digit', year: 'numeric' }).format(new Date(timestamp));

  config.addFilter('date', date);
};
