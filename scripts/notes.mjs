#!/usr/bin/env node
// Script to extract latest release notes from the CHANGELOG.md file
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import pkj from '../package.json' with { type: 'json' };

// Version heading regexp to match version sections - should match ## level headings only
const VERSION_HEADING_REGEXP = /(?=^##? )/gm;

const PWD = path.dirname(fileURLToPath(import.meta.url));
const CHANGELOG_FILE = path.resolve(PWD, '../CHANGELOG.md');

const changelog = fs.readFileSync(CHANGELOG_FILE, 'utf8');

// Get version from command line argument or fall back to package.json
const version = process.argv[2] || pkj.version;
// Split changelog into versions
const versions = changelog.split(VERSION_HEADING_REGEXP);

const index = versions.findIndex(section => {
  const firstLine = section.split('\n')[0];
  return firstLine.includes(`[${version}]`) || firstLine.includes(`${version} (`);
});
if (index < 0 || index + 1 >= versions.length) {
  console.error(`No release notes found for current version ${version}`);
  process.exit(1);
}

// Extract the release notes for the latest version
const releaseNotes = versions[index].trim();

// Post-format: convert ## headers to # and adjust all other headers accordingly
const formattedReleaseNotes = releaseNotes.replace(/^(#+)/gm, (match) => {
  return match.slice(1); // Remove one # from each header
});

console.log(formattedReleaseNotes);
