const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const color = require('kleur');

const rootFolder = process.cwd();
const config = yaml.load(fs.readFileSync(path.resolve(rootFolder, 'bump.config.yml')));
const {version} = require(path.resolve(rootFolder, 'package.json'));

config.files.forEach(processFile);

function processFile(file) {
  try {
    const filePath = path.resolve(rootFolder, file.filePath);
    let fileContent = fs.readFileSync(filePath, 'utf8');
    file.patterns?.forEach((pattern) => {
      [...fileContent.matchAll(new RegExp(pattern, 'gm'))].forEach(match => {
        const [subStr, currentVersion] = match;
        fileContent = fileContent.replace(subStr, subStr.replace(currentVersion, version));
      });
    });
    fs.writeFileSync(filePath, fileContent, 'utf8');

    console.log(color.green(`${filePath} version bumped to`), color.bgGreen(version));
  } catch (err) {
    console.error(color.red('Can`t bump version: '), err);
  }
}
