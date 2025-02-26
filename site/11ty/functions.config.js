function randomColor() {
  return `#${Math.floor(Math.random() * 4095).toString(16).padStart(3, '0')}`;
}

function isActivePath(url, collection) {
  return collection && url.includes(collection);
}

function findItemsByName(names, collection) {
  return names
    .map((name) => collection.find((item) => item.fileSlug === name))
    .filter((item) => !!item);
}

export default (config) => {
  config.addGlobalData('functions', {randomColor, isActivePath, findItemsByName});
};
