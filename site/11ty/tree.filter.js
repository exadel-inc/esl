const findParent = (list, parent) => {
  if (!parent) return null;
  return list.find((item) => item.fileSlug === parent || item.data.id === parent || item.data.title === parent);
};

const findCurrentCollection = (collections, tags) => tags.find((tag) => collections.includes(tag));

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

function treePath(items, sidebarItems) {
  if (!Array.isArray(items)) return;

  const result = [];
  const collections = sidebarItems.map(item => item.collection);
  items.forEach((item) => {
    const tag = item.data.tags && findCurrentCollection(collections, item.data.tags);
    if (!tag) return;
    const {title, parent} = item.data;
    const parents = [{'title': sidebarItems.find(item => item.collection === tag).title, 'url': `/${tag}/`}];
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
