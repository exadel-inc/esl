const findPage = (items, page) => items.find((item) => item.data.page.url === page.url);

const findParent = (list, parent) => {
  const alias = parent?.data?.parent;
  if (!alias) return null;
  const candidates = list.filter((item) => item.fileSlug === alias || item.data.id === alias || item.data.title === alias);
  const parentPath = parent.data.page.url.split('/');
  const similarity = (item) => {
    const itemPath = item.data.page.url.split('/');
    let i = 0;
    while (itemPath[i] === parentPath[i]) i++;
    return i;
  };
  // Sort by file system tree position to ensure the last item is the one we want
  candidates.sort((a, b) => similarity(a) - similarity(b));
  return candidates.pop();
};

function * findParents(items, page) {
  while (page) {
    page = findParent(items, page);
    if (page) yield page;
  }
}

/** Group items into a tree structure using given property */
function treeBuilder(items) {
  const root = [];
  items.forEach((item, index) => {
    item.children = [];
    item.data.index = index;
  });
  items.forEach((item) => {
    const parent = findParent(items, item);
    if (parent) {
      parent.children.push(item);
    } else {
      root.push(item);
    }
  });
  return root;
}

function parents(items) {
  if (!Array.isArray(items)) return;
  const currentPage = findPage(items, this.page);
  return  [...findParents(items, currentPage)].reverse();
}

export default (config) => {
  config.addFilter('tree', treeBuilder);
  config.addFilter('parents', parents);
};
