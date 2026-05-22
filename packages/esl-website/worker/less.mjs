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
  const {css, map} = await less.render(lessContent, {
    filename: absFilePath,
    sourceMap: {}
  });

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
  const mapRelPath = `dist/bundles/${cssFileName}.map`;
  fs.writeFileSync(destFilePath, code + `\n/*# sourceMappingURL=${mapRelPath} */\n`);
  fs.writeFileSync(destFilePath + '.map', minMap);
}
