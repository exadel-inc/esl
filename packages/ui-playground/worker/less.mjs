import path from 'node:path';
import fs from 'node:fs';
import less from 'less';

const SRC_DIR = path.resolve('src');
const OUT_DIR = path.resolve('dist');

export default async function (filePath) {
  const absFilePath = path.resolve(filePath);
  const relFilePath = path.relative(SRC_DIR, absFilePath);
  const destFilePath = path.join(OUT_DIR, relFilePath);

  fs.mkdirSync(path.dirname(destFilePath), {recursive: true});
  fs.copyFileSync(filePath, destFilePath);

  // compile only top-level .less files to avoid processing of mixins and other imports
  const depth = relFilePath.split(path.sep).length - 1;
  if (depth > 1) return;

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
