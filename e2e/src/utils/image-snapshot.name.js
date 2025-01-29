const path = require('path');
const jestConfig = require(path.resolve(process.cwd(), 'jest.config.js'));

function buildSnapshotName(...snapshotParts) {
  const sanitize = (str) => (str || '').replace(/\W+/g, '-').toLowerCase();
  return snapshotParts.map(sanitize).join('-') + '.jpg';
}

const getRootDir = (testPath) => jestConfig.roots.find((root) => path.resolve(testPath).includes(path.resolve(root)));

function getDirName(testPath) {
  const rootDir = getRootDir(testPath);
  const basePath = path.resolve(rootDir);
  return path.relative(basePath, testPath)
}

function getSnapshotDir(testPath) {
  const snapshotDir = path.resolve(getRootDir(testPath), '__image_snapshots__');
  return path.join(snapshotDir, getDirName(testPath));
}

function getDiffDir(testPath) {
  const diffDir = path.resolve('.diff');
  return path.join(diffDir, getDirName(testPath));
}

module.exports = {
  buildSnapshotName,
  getSnapshotDir,
  getDiffDir,
  getDirName
};
