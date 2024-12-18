const findParent = (list, parent) => {
  if (!parent) return null;
  return list.find((item) => item.fileSlug === parent || item.data.id === parent || item.data.title === parent);
};

/** Group items into a tree structure using given property */
function treeBuilder(items) {
  const root = [];
  items.forEach((item, index) => {
    item.children = [];
    item.data.index = index;
  });
  items.forEach((item) => {
    const parent = findParent(items, item.data.parent);
    if (parent) {
      parent.children.push(item);
    } else {
      root.push(item);
    }
  });
  return root;
}

module.exports = (config) => {
  config.addFilter('tree', treeBuilder);
};
