import path from 'node:path';
import fs from 'node:fs';
import less from 'less';
import {transform, browserslistToTargets} from 'lightningcss';
import browserslist from 'browserslist';

const SRC_DIR = path.resolve('src');
const OUT_DIR = path.resolve('dist/bundles');
const targets = browserslistToTargets(browserslist());

export default async function(filePath) {
  const absFilePath = path.resolve(filePath);
  const relFilePath = path.relative(SRC_DIR, absFilePath);

  const lessContent = fs.readFileSync(filePath, 'utf-8');
  let css;
  let map;
  try {
    const result = await less.render(lessContent, {
      filename: absFilePath,
      sourceMap: {}
    });
    css = result.css;
    map = result.map;
  } catch (err) {
    throw new Error(err);
  }

  const cssFileName = path.basename(relFilePath, '.less') + '.css';
  const destFilePath = path.join(OUT_DIR, cssFileName);

  const {code, map: minMap} = transform({
    filename: cssFileName,
    code: Buffer.from(css),
    minify: true,
    sourceMap: true,
    inputSourceMap: map,
    targets
  });

  fs.mkdirSync(OUT_DIR, {recursive: true});
  const mapRelPath = `${cssFileName}.map`;
  const banner = `\n/*# sourceMappingURL=${mapRelPath} */\n`;
  fs.writeFileSync(destFilePath, Buffer.concat([Buffer.from(code), Buffer.from(banner)]));
  fs.writeFileSync(destFilePath + '.map', minMap);
}
