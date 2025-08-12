#!/usr/bin/env node
import {getProjectFile} from './common/config.mjs';
import {getVersionForProject} from './common/version.mjs';
import {extractReleaseNotes, normalizeChangelog} from './common/changelog.mjs';

const arg = process.argv[2] || process.env.PROJECT_NAME || '';

const projects = arg.split(',').map(p => p.trim()).filter(Boolean);
if (projects.length === 0) projects.push(''); // Default to workspace if no project specified

const changelogs = [];
for (const project of projects) {
  try {
    const [projectName, argVersion] = project.split('@');
    const version = argVersion || await getVersionForProject(projectName);
    const changelog = await getProjectFile(projectName, 'CHANGELOG.md');
    const versionChangelog = extractReleaseNotes(changelog, version);
    changelogs.push(normalizeChangelog(versionChangelog, projectName));
  } catch (error) {
    console.error(`Error retrieving release notes for project ${project}:`, error.message);
  }
}

if (changelogs.length > 0) {
  console.log(changelogs.join('\n\n---\n\n'));
  process.exit(0);
} else {
  console.error('No changelogs found for the specified projects.');
  process.exit(1);
}
