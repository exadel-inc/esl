import fs from 'fs';
import {execFileSync} from 'child_process';
import {fileURLToPath} from 'url';

import pkj from '../package.json' with {type: 'json'};

const noGit = process.argv.includes('-no-git') || process.argv.includes('--no-git');

const targets = [
  {
    path: fileURLToPath(new URL('../src/lib.ts', import.meta.url)),
    pattern: /ExportNs\.declare\(['"]([-.\w]+)['"]\);/,
    replacement: `ExportNs.declare('${pkj.version}');`,
  },
  {
    path: fileURLToPath(new URL('../skills/esl/SKILL.md', import.meta.url)),
    pattern: /^packageVersion:\s*.+$/m,
    replacement: `packageVersion: '${pkj.version}'`,
  },
];

for (const target of targets) {
  const content = fs.readFileSync(target.path, 'utf8');

  if (!target.pattern.test(content)) {
    throw new Error(`Version marker not found in ${target.path}`);
  }

  const updatedContent = content.replace(target.pattern, target.replacement);
  if (updatedContent === content) {
    console.log(`The ${target.path} is up to date`);
  } else {
    fs.writeFileSync(target.path, updatedContent);
    if (!noGit) {
      execFileSync('git', ['add', target.path], {stdio: 'inherit'});
    } else {
      console.log(`Skip git add for ${target.path} because -no-git was provided`);
    }
    console.log(`Update ${target.path} version to ${pkj.version}`);
  }
}
