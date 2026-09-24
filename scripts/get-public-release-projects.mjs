#!/usr/bin/env node
import {getReleaseGroups} from './common/release.mjs';

const pretty = process.argv.slice(2).includes('--pretty');
const groups = await getReleaseGroups();
const matrix = groups.map(({
  groupName,
  projectNames,
  version,
  isPrerelease,
  releaseTag,
  releaseTagGlob,
  changelogProjects,
  artifacts
}) => ({
  groupName,
  projectNames,
  version,
  isPrerelease,
  releaseTag,
  releaseTagGlob,
  changelogProjects,
  artifacts
}));

console.log(JSON.stringify(matrix, null, pretty ? 2 : undefined));

