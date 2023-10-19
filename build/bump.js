const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const color = require('kleur');
const {exec} = require('child_process');

const rootFolder = process.cwd();
const config = yaml.load(fs.readFileSync(path.resolve(rootFolder, 'bump.config.yml')));
const {version} = require(path.resolve(rootFolder, config.versionFile));

config.files.forEach(processFile);
doPostAction();

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

function doPostAction() {
  const {postAction} = config;
  if (!config.postAction) return;
  exec(postAction, (error, stdout, stderr) => {
    if (error) {
      console.error(color.red(`Error executing post action: ${error.message}`));
      return;
    }
    if (stderr) {
      console.error(color.red(`Error executing post action (stderr): ${stderr}`));
      return;
    }
    console.log(color.green(`stdout ${postAction}: ${stdout}`));
  });
}
