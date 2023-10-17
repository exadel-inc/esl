const fs = require('fs');
const path = require('path');

const rootFolder = process.cwd();
const config = require(path.resolve(rootFolder, 'bump.config'));
const root = require(path.resolve(rootFolder, config.versionFile));

config.files.forEach((file) => {
  try {
    const filePath = path.resolve(rootFolder, file);
    const contentOfFile = fs.readFileSync(filePath, 'utf8');
    const updatedContent = contentOfFile.replace(
      /"version": "(\d+)\.(\d+)\.(\d+)"/,
      `"version": "${root.version}"`
    );
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`${file} version bumped to`, root.version);
  } catch (err) {
    console.error('Can`t bump version: ', err);
  }
});
