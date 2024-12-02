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

function treePath(items) {
  const possibleTags = ['introduction', 'core', 'components', 'examples', 'blogs', 'dev'];
  const result = [];
  if (!Array.isArray(items)) return;
  items.forEach((item) => {
    const {tags} = item.data;
    if (!possibleTags.includes(tags[0])) return;
    const {title, parent} = item.data;
    const parents = [{'title': tags[0].replace(/\b\w/g, c => c.toUpperCase()), 'url': `/${tags[0]}/`}];
    if (parent) {
      const nextParent = findParent(items, parent);
      parents.push({'title': parent, 'url': nextParent.data.page.url});
    }
    result.push({title, 'parents': parents});
  })
  return result;
}

module.exports = (config) => {
  config.addFilter('tree', treeBuilder);
  config.addFilter('treepath', treePath);
};
