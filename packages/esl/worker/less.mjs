import path from 'node:path';
import fs from 'node:fs';
import less from 'less';

const SRC_DIR = path.resolve('src');
const OUT_DIR = path.resolve('modules');

export default async function(filePath) {
  const absFilePath = path.resolve(filePath);
  const relFilePath = path.relative(SRC_DIR, absFilePath);
  const destFilePath = path.join(OUT_DIR, relFilePath);

  fs.mkdirSync(path.dirname(destFilePath), {recursive: true});
  fs.copyFileSync(filePath, destFilePath);

  // Compile .less to .css for:
  // - depth 0-1: all packages (e.g. all.less, esl-alert/core.less)
  // - depth 2: only esl-utils and esl-forms sub-packages
  // - exclude *.mixin.less files (they are imported, not compiled directly)
  if (relFilePath.endsWith('.mixin.less')) return;
  const depth = relFilePath.split(path.sep).length - 1;
  const pkg = relFilePath.split(path.sep)[0];
  if (depth > 2) return;
  if (depth === 2 && pkg !== 'esl-utils' && pkg !== 'esl-forms') return;

  const lessContent = fs.readFileSync(filePath, 'utf-8');
  let css;
  try {
    const result = await less.render(lessContent, {filename: absFilePath});
    css = result.css;
  } catch (err) {
    throw new Error(err);
  }
  fs.writeFileSync(destFilePath.replace(/\.less$/, '.css'), css);
}
