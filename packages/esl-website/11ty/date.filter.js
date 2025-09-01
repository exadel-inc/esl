const DATE_FORMAT = {
  timeZone: 'UTC',
  month: 'long',
  day: '2-digit',
  year: 'numeric'
};

const date = (timestamp) =>
  new Intl.DateTimeFormat('en-GB', DATE_FORMAT).format(new Date(timestamp));

export default (config) => {
  config.addFilter('date', date);
};
