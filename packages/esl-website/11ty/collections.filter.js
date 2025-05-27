/** get value from an object by path */
const get = (item, path) => path.split('.').reduce((acc, key) => acc && acc[key], item);

/**
 * filter to include only items that have a property with passed values
 * - if no values are passed, include items that have a truthy value for the property
 * - if values are passed, include items that have a value that matches one of the passed values
 */
function filter(collection, prop, ...values) {
  values = values.flat(1);
  const matcher = values.length > 0 ?
    (item) => values.includes(get(item, prop)) :
    (item) => !!get(item, prop);

  return (collection || []).filter(matcher);
}
/**
 * filter to exclude items that have a property with passed values
 * - if no values are passed, exclude items that have a truthy value for the property
 * - if values are passed, exclude items that have a value that matches one of the passed values
 */
function exclude(collection, prop, ...values) {
  values = values.flat(1);
  const matcher = values.length > 0 ?
    (item) => !values.includes(get(item, prop)) :
    (item) => !get(item, prop);

  return (collection || []).filter(matcher);
}

export default (config) => {
  config.addFilter('filter', filter);
  config.addFilter('exclude', exclude);
};
