const date = (timestamp) => 
  new Intl.DateTimeFormat('UTC', { month: 'long', day: '2-digit', year: 'numeric' }).format(new Date(timestamp));

module.exports = (config) => {
  config.addFilter('date', date);
};
