#!/usr/bin/env node
import {getProjectFile} from './common/config.mjs';
import {getPackageManifestForProject, getPublicReleaseProjectNames, getReleaseGroups} from './common/release.mjs';
import {getVersionForProject} from './common/version.mjs';
import {extractReleaseNotes, normalizeChangelog} from './common/changelog.mjs';

const [command, value] = process.argv.slice(2);
const projectArgument = command || process.env.PROJECT_NAME || '';

async function getProjects() {
  if (command === '--all') {
    const groups = await getReleaseGroups();
    return groups.flatMap((group) => group.projects.map((project) => `${project.projectName}@${group.version}`));
  }
  if (command === '--group') {
    const groups = await getReleaseGroups();
    const group = groups.find((item) => item.groupName === value);
    if (!group) throw new Error(`Release group "${value || ''}" not found.`);
    return group.changelogProjects.split(',');
  }
  return projectArgument
    ? projectArgument.split(',').map((project) => project.trim()).filter(Boolean)
    : getPublicReleaseProjectNames();
}

const changelogs = [];
const errors = [];
let projects = [];
try {
  projects = await getProjects();
} catch (error) {
  errors.push(error.message);
}

for (const project of projects) {
  try {
    const [projectName, argVersion] = project.split('@');
    const version = argVersion || await getVersionForProject(projectName);
    const changelog = await getProjectFile(projectName, 'CHANGELOG.md');
    const versionChangelog = extractReleaseNotes(changelog, version);
    const {name: packageName} = await getPackageManifestForProject(projectName);
    changelogs.push(normalizeChangelog(versionChangelog, packageName || projectName));
  } catch (error) {
    errors.push(`Error retrieving release notes for project ${project}: ${error.message}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
} else if (changelogs.length > 0) {
  console.log(changelogs.join('\n\n---\n\n'));
  process.exit(0);
} else {
  console.error('No changelogs found for the specified projects.');
  process.exit(1);
}
