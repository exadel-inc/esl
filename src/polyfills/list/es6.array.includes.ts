if (!Array.prototype.includes) {
  Array.prototype.includes = function <T>(item: T): boolean {
    return Array.prototype.indexOf.call(this, item) !== -1;
  };
}
