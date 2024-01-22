const ns = {
  randomColor() {
    return `#${Math.floor(Math.random() * 4095).toString(16).padStart(3, '0')}`;
  },

  isActivePath(url, collection) {
    return collection && url.includes(collection);
  },

  findItemsByName(names, collection) {
    return names
      .map((name) => collection.find((item) => item.fileSlug === name))
      .filter((item) => !!item);
  }
};

module.exports = (config) => {
  config.addGlobalData('functions', ns);
};
Object.assign(module.exports, ns);
