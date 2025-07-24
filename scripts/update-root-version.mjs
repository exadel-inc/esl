/**
 * Release process step to update the root package.json version based on a max version of all sub-packages
 */

import fs from 'fs';
import {fileURLToPath} from 'url';
import {dirname, resolve} from 'path';
import {compare} from 'semver';
import glob from 'fast-glob';
import {execSync} from 'child_process';

const PWD = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(`${PWD}/..`);
const ROOT_PACKAGE_JSON = `${ROOT_DIR}/package.json`;

const {version, workspaces} = JSON.parse(fs.readFileSync(ROOT_PACKAGE_JSON, 'utf8'));

// Resolve all sub-packages paths
const subPackages = workspaces.map((item) => {
  if (!item.includes('*')) return item;
  return glob.sync(item, {
    base: ROOT_DIR,
    onlyDirectories: true
  });
}).flat();

if (subPackages.length === 0) console.warn('No sub-packages found in workspaces.');

// Resolve the max version from all sub-packages
const maxVersion = subPackages.reduce((max, pkg) => {
  const pkgJsonPath = resolve(ROOT_DIR, pkg, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    const {version: pkgVersion} = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    console.log(`Found package version "${pkgVersion}" in ${pkg}`);
    return compare(pkgVersion, max) > 0 ? pkgVersion : max;
  }
  return max;
}, '0.0.0');

if (maxVersion !== version) {
  console.log(`Updating root package.json version from ${version} to ${maxVersion}`);
  // Using npm to update the root package.json version (to handle package-lock.json and hooks)
  // Do not commit this change automatically, as it may require manual review
  execSync(`npm version ${maxVersion} --no-git-tag-version`, {stdio: 'inherit', cwd: PWD});
  // Ensure both package.json and package-lock.json are in stash
  execSync('git add package.json package-lock.json', {stdio: 'inherit', cwd: PWD});
} else {
  console.log(`Root package.json version is already up-to-date: ${version}`);
}
