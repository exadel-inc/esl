import path from 'path';
import jestConfig from '../../jest.config.js';

export function buildSnapshotName(...snapshotParts) {
  const sanitize = (str) => (str || '').replace(/\W+/g, '-').toLowerCase();
  return snapshotParts.map(sanitize).join('-') + '.jpg';
}

const getRootDir = (testPath) => jestConfig.roots.find((root) => path.resolve(testPath).includes(path.resolve(root)));

export function getDirName(testPath) {
  const rootDir = getRootDir(testPath);
  const basePath = path.resolve(rootDir);
  return path.relative(basePath, testPath);
}

export function getSnapshotDir(testPath) {
  const snapshotDir = path.resolve(getRootDir(testPath), '__image_snapshots__');
  return path.join(snapshotDir, getDirName(testPath));
}

export function getDiffDir(testPath) {
  const diffDir = path.resolve('.diff');
  return path.join(diffDir, getDirName(testPath));
}
