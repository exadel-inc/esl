import fs from 'fs';

export function mkDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, {recursive: true});
}
