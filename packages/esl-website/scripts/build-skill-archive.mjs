import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import {ZipArchive} from 'archiver';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(currentDir, '../../..');
const sourceDir = path.join(workspaceRoot, 'packages/esl/skills/esl');
const outputDir = path.join(workspaceRoot, 'packages/esl-website/dist/downloads');
const outputFile = path.join(outputDir, 'exadel-esl-ai-skill.zip');


if (!fs.existsSync(sourceDir)) throw new Error(`Skill source directory not found: ${sourceDir}`);
fs.mkdirSync(outputDir, {recursive: true});

const archive = new ZipArchive('zip', {
  zlib: { level: 9 }
});

archive.pipe(fs.createWriteStream(outputFile));
archive.directory(sourceDir, 'esl');

await archive.finalize();
console.log(`[esl-website:build-skill-archive] Created ${outputFile}`);
