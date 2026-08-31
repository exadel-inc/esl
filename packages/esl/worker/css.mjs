import fs from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import postcssImport from 'postcss-import';

const SRC_DIR = path.resolve('src');
const OUT_DIR = path.resolve('modules');
const processor = postcss([postcssImport()]);

export default async function (filePath) {
  const absFilePath = path.resolve(filePath);
  const relFilePath = path.relative(SRC_DIR, absFilePath);
  const destFilePath = path.join(OUT_DIR, relFilePath);

  await fs.mkdir(path.dirname(destFilePath), {recursive: true});
  await fs.copyFile(filePath, destFilePath);

  if (!['all.css', 'core.css'].includes(path.basename(relFilePath))) return;

  const source = await fs.readFile(filePath, 'utf-8');
  const result = await processor.process(source.toString(), {from: absFilePath, map: false});

  await fs.writeFile(destFilePath, result.css);
}

