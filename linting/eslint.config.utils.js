const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

module.exports.readYAML = function readYAML (file) {
  if (!file.endsWith('.yml')) file += '.yml';
  const filePath = path.resolve(__dirname, file);
  return yaml.load(fs.readFileSync(filePath, 'utf8'));
};
