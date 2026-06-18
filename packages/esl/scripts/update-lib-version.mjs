import fs from 'fs';
import {fileURLToPath} from 'url';

import pkj from '../package.json' with {type: 'json'};

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
  fs.writeFileSync(target.path, updatedContent);
  console.log(`Update ${target.path} version to ${pkj.version}`);
}
