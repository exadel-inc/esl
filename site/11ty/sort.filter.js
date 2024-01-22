module.exports = (config) => {
  /** Generic sort njk filter */
  const createSortFilter = (comparer) => (values) => {
    if (!Array.isArray(values)) {
      console.error(`Unexpected values for sort filter: ${values}`);
      return values;
    }
    return [...values].sort(comparer);
  };

  // Utils
  const resolveDate = (item) => new Date(item.date).getTime();
  const resolveMetaDate = (item) => item.data.date ? new Date(item.date).getTime() : Number.POSITIVE_INFINITY;

  /** Comparer composer */
  const compose = (...cmps) => (a, b) => cmps.reduce((res, cmp) => res || cmp(a, b), 0);

  /** Name metadata comparer */
  const nameComparer = (a, b) => a.data.name.localeCompare(b.data.name);
  /** Order metadata comparer */
  const orderComparer = (a, b) => (a.data.order || 0) - (b.data.order || 0);
  /** Date metadata comparer */
  const dateComparer = (a, b) => resolveDate(a) - resolveDate(b);
  /** Date metadata comparer (will not use file creation date) */
  const dateComparerStrict = (a, b) => resolveMetaDate(a) - resolveMetaDate(b);

  config.addFilter('sortByName', createSortFilter(nameComparer));
  config.addFilter('sortByNameAndOrder', createSortFilter(compose(orderComparer, nameComparer)));
  config.addFilter('sortByDate', createSortFilter(dateComparer));
  config.addFilter('sortByDateStrict', createSortFilter(dateComparerStrict));
};
