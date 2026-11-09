#!/usr/bin/env node
import {execFileSync} from 'child_process';
import path from 'path';
import {getReleaseGroups} from './common/release.mjs';

function getChangedFiles() {
  const output = execFileSync('git', ['diff', '--name-only', '--'], {
    encoding: 'utf8'
  }).trim();

  return output ? output.split(/\r?\n/).filter(Boolean) : [];
}

function isReleaseFile(filePath) {
  const fileName = path.posix.basename(filePath.replaceAll('\\', '/'));
  return fileName === 'package.json' || fileName === 'CHANGELOG.md';
}

const changedFiles = getChangedFiles().map((filePath) => filePath.replaceAll('\\', '/'));
const groups = await getReleaseGroups();
const changedGroups = groups.filter((group) => group.projects.some((project) => {
  const projectRoot = `${project.projectRoot.replaceAll('\\', '/')}/`;
  return changedFiles.some((filePath) => filePath.startsWith(projectRoot) && isReleaseFile(filePath));
}));

const title = changedGroups.length === 1
  ? changedGroups[0].releaseTag
  : changedGroups.length > 1
    ? `${changedGroups.length} release groups`
    : 'workspace release';

const summary = changedGroups.length > 0
  ? changedGroups.map((group) => `- ${group.releaseTag} (${group.projectNames.join(', ')})`).join('\n')
  : '- No release groups detected';

console.log(JSON.stringify({
  total: changedGroups.length,
  title,
  summary,
  changelogProjects: changedGroups.map((group) => group.changelogProjects).join(','),
  groups: changedGroups
}));

