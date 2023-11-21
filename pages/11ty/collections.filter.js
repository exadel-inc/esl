/** get value from object by path */
const get = (item, path) => path.split('.').reduce((acc, key) => acc && acc[key], item);

/** filter to include only items that have a property with passed value */
function filter(collection, prop, value) {
  const matcher = arguments.length === 2 ?
    (item) => !!get(item, prop) :
    (item) => get(item, prop) === value;
  return (collection || []).filter(matcher);
}
/** filter to exclude items that have a property with passed value */
function exclude(collection, prop, value) {
  const matcher = arguments.length === 2 ?
    (item) => !get(item, prop) :
    (item) => get(item, prop) !== value;
  return (collection || []).filter(matcher);
}

module.exports = (config) => {
  config.addFilter('filter', filter);
  config.addFilter('exclude', exclude);
};
