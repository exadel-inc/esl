#!/usr/bin/env node
import { execFileSync } from 'child_process';
import { getReleaseGroups } from './common/release.mjs';

const args = process.argv.slice(2);
const remoteIndex = args.indexOf('--remote');
const remote = remoteIndex >= 0 ? args[remoteIndex + 1] : 'origin';

function hasRemoteTag(tag) {
  const output = execFileSync('git', ['ls-remote', '--tags', remote, tag], {
    encoding: 'utf8'
  }).trim();
  return Boolean(output);
}

const groups = await getReleaseGroups();
const missing = groups.filter((group) => !hasRemoteTag(`refs/tags/${group.releaseTagGlob}`));

if (missing.length === 0) {
  console.log(`All release groups have at least one base tag on ${remote}.`);
  process.exit(0);
}

console.log(`Missing release group base tags on ${remote}:`);
for (const group of missing) {
  console.log(`- ${group.groupName}: expected ${group.releaseTagGlob}`);
}
process.exit(1);


