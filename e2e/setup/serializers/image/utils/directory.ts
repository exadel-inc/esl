import fs from 'fs';

export function mkDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, {recursive: true});
}
