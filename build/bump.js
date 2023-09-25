const fs = require('fs');
const path = require('path');
const root = require('../package.json');

const packagePath = path.resolve(process.cwd(), 'package.json');

try {
  const content = fs.readFileSync(packagePath, 'utf8');

  const result = content.replace(
    /"version": "(\d+)\.(\d+)\.(\d+)"/,
    `"version": "${root.version}"`
  );

  fs.writeFileSync(packagePath, result, 'utf8');
  console.log('Submodule version bumped to', root.version);
} catch (err) {
  console.error("Can not bump version: ", err);
}
