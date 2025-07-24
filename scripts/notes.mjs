/**
 * Script to extract latest release notes from the CHANGELOG.md file
 */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import pkj from '../package.json' with { type: 'json' };

// Abstract the version heading from the changelog
const VERSION_HEADING_REGEXP = /##? \[([^\]]+)]/gm

const PWD = path.dirname(fileURLToPath(import.meta.url));

const CHANGELOG_FILE = path.resolve(PWD, '../CHANGELOG.md');
const RELEASE_NOTES_FILE = path.resolve(PWD, '../RELEASE_NOTES.md');

const changelog = fs.readFileSync(CHANGELOG_FILE, 'utf8');

// Split changelog into versions
const versions = changelog.split(VERSION_HEADING_REGEXP);

const index = versions.indexOf(pkj.version);
if (index < 0 || index + 1 >= versions.length) {
  console.error(`No release notes found for current version ${pkj.version}`);
  process.exit(1);
}

// Extract the release notes for the latest version
const releaseNotes = (`# [${pkj.version}]` + versions[index + 1]).trim();

// Replace the release notes file with the latest release notes
fs.writeFileSync(RELEASE_NOTES_FILE, releaseNotes);
