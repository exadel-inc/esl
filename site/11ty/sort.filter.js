module.exports = (config) => {
  /** Resolve date from item */
  const resolveDate = (item) => new Date(item.date).getTime();
  /** Resolve date from item without fileUpdateDate fallback */
  const resolveMetaDate = (item) => item.data.date ? new Date(item.date).getTime() : Number.POSITIVE_INFINITY;

  /** Date metadata comparer */
  const dateComparer = (a, b) => resolveDate(a) - resolveDate(b);
  /** Date metadata comparer (will not use file creation date) */
  const metaDateComparer = (a, b) => resolveMetaDate(a) - resolveMetaDate(b);

  /** Order metadata comparer */
  const orderComparer = (a, b) => (a.data.order ?? 0) - (b.data.order ?? 0);

  /** Page path comparer */
  const pathComparer = (a, b) => (a.inputPath || '').localeCompare(b.inputPath || '');

  /** Abstract string comparer */
  const stringComparer = (field) => (a, b) => {
    const aField = a.data[field] || '';
    const bField = b.data[field] || '';
    return aField.localeCompare(bField, 'en');
  };

  /** Build comparer for field */
  const buildComparer = (field) => {
    switch (field) {
      case 'date':
        return dateComparer;
      case 'meta-date':
        return metaDateComparer;
      case 'order':
        return orderComparer;
      case 'path':
        return pathComparer;
      default:
        return stringComparer(field);
    }
  };

  /** Comparer composer */
  const compose = (...comparers) => (a, b) => comparers.reduce((res, cmp) => res || cmp(a, b), 0);

  config.addFilter('sortBy', (values, ...fields) => {
    if (!Array.isArray(values)) {
      console.error(`Unexpected values for sort filter: ${values}`);
      return values;
    }
    const comparers = fields.map(buildComparer);
    return [...values].sort(compose(...comparers));
  });
};
