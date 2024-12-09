const fs = require('fs');

function mkDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, {recursive: true});
}

module.exports = {
  mkDir
};
