#!/usr/bin/env node
import {getProjectFile} from './common/config.mjs';
import {getVersionForProject} from './common/version.mjs';
import {extractReleaseNotes, normalizeChangelog} from './common/changelog.mjs';

const arg = process.argv[2] || process.env.PROJECT_NAME || '';
let [projectName, argVersion] = arg.split('@');

try {
  const version = argVersion || await getVersionForProject(projectName);
  const changelog = await getProjectFile(projectName, 'CHANGELOG.md');
  const versionChangelog = extractReleaseNotes(changelog, version);
  console.log(normalizeChangelog(versionChangelog));
  process.exit(0);
} catch (error) {
  console.error(`Error retrieving release notes for project ${projectName}:`, error.message);
  process.exit(1);
}




