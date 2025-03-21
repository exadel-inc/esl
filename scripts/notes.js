/**
 * Script to extract latest release notes from the CHANGELOG.md file
 */
// Abstract the version heading from the changelog
const VERSION_HEADING_REGEXP = /##? \[([^\]]+)]/gm

const fs = require('fs');
const path = require('path');

const {version} = require('../lerna.json');
const CHANGELOG_FILE = path.resolve(__dirname, '../CHANGELOG.md');
const RELEASE_NOTES_FILE = path.resolve(__dirname, '../RELEASE_NOTES.md');

const changelog = fs.readFileSync(CHANGELOG_FILE, 'utf8');

// Split changelog into versions
const versions = changelog.split(VERSION_HEADING_REGEXP);

const index = versions.indexOf(version);
if (index < 0 || index + 1 >= versions.length) {
  console.error(`No release notes found for current version ${version}`);
  process.exit(1);
}

// Extract the release notes for the latest version
const releaseNotes = (`# [${version}]` + versions[index + 1]).trim();

// Replace the release notes file with the latest release notes
fs.writeFileSync(RELEASE_NOTES_FILE, releaseNotes);
