module.exports = {
  randomColor() {
    return `#${Math.floor(Math.random() * 4095).toString(16).padStart(3, "0")}`;
  },
};
