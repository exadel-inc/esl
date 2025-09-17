#!/usr/bin/env node
/**
 * Helper script: get-dist-tag
 * Determines the NPM distribution tag based on versions in the workspace (independent versioning).
 *
 * Rules (single version):
 *  - 1.2.3            => latest
 *  - 1.2.3-beta.0     => beta
 *  - 1.2.3-preview.0  => preview
 *
 * Without args: evaluates all package (workspace) projects (excluding root) and returns the weakest tag
 * using priority: latest > beta > preview (so if any package is preview => preview; else if any is beta => beta; else latest).
 *
 * With a project name argument (or PROJECT_NAME env) returns the tag for that project only.
 */

import {getAllProjectNames} from './common/config.mjs';
import {getVersionForProject} from './common/version.mjs';

// Define tag priority
// Lower index means higher priority
// If tag not defined in priority list, it considered higher priority
const TAG_PRIORITY = ['preview', 'beta', 'next', 'latest'];

function versionToTag(version) {
  if (!version) throw new Error('Version is missing');
  const [, postfix] = version.split('-'); // ignore build metadata
  if (!postfix) return 'latest'; // stable
  if (!postfix.includes('.')) {
    throw new Error(`Unknown version tag in version "${version}"`);
  }
  // Remove everything after the first dot
  return postfix.split('.')[0];
}

async function getTagForProject(projectName) {
  const version = await getVersionForProject(projectName);
  return versionToTag(version);
}

async function getOverallTag() {
  const projects = await getAllProjectNames()
  const tags = await Promise.all(projects.map(getTagForProject));
  tags.sort((a, b) => TAG_PRIORITY.indexOf(a) - TAG_PRIORITY.indexOf(b));
  return tags[0] || 'latest';
}

(async () => {
  const projectName = (process.argv[2] || process.env.PROJECT_NAME || '').trim();
  try {
    if (projectName) {
      console.log(await getTagForProject(projectName));
    } else {
      console.log(await getOverallTag());
    }
    process.exit(0);
  } catch (error) {
    console.error(`Error determining dist-tag${projectName ? ' for project ' + projectName : ''}:`, error.message);
    process.exit(1);
  }
})();
