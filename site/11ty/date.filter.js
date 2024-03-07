const date = (timestamp) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', month: 'long', day: '2-digit', year: 'numeric' }).format(new Date(timestamp));

const isFresh = (timestamp, days = 30) => {
  if (!timestamp) return false;
  const timeout = days * 24 * 60 * 60 * 1000;
  return Date.now() - timestamp < timeout;
};

module.exports = (config) => {
  config.addFilter('date', date);
  config.addFilter('fresh', isFresh);
};
