module.exports = {
  randomColor() {
    return `#${Math.floor(Math.random() * 4095).toString(16).padStart(3, '0')}`;
  },

  isActivePath(url, collection) {
    return collection && url.includes(collection);
  }
};
