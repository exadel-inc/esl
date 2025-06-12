import fs from 'fs';
import {fileURLToPath} from 'url';

import pkj from '../package.json' with { type: 'json' };

const fPath = fileURLToPath(new URL('../src/lib.ts', import.meta.url));
const content = fs.readFileSync(fPath, 'utf8');

// Replace the version in ExportNs.declare('...');
const updatedContent = content.replace(
  /ExportNs\.declare\(['"]([\d.]+)['"]\);/,
  `ExportNs.declare('${pkj.version}');`
);

fs.writeFileSync(fPath, updatedContent);
console.log(`Update ${fPath} version to ${pkj.version}`);
