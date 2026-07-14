import path from 'node:path';
import fs from 'node:fs';

const SRC_DIR = path.resolve('src');
const OUT_DIR = path.resolve('modules');

/**
 * Create a job-ripper worker that mirrors a `src` style file into `modules` and
 * compiles entry points to `.css`.
 *
 * Compiles for:
 * - depth 0-1: all packages (e.g. all.<ext>, esl-alert/core.<ext>)
 * - depth 2: only esl-utils and esl-forms sub-packages
 * - excludes *.mixin.<ext> partials (they are imported, not compiled directly)
 *
 * @param {object} options
 * @param {string} options.ext - source extension to handle (e.g. `less`, `css`)
 * @param {(source: string, absFilePath: string) => string | Promise<string>} options.compile - compiler producing CSS
 * @returns {(filePath: string) => Promise<void>}
 */
export function createStyleWorker({ext, compile}) {
  return async function (filePath) {
    const absFilePath = path.resolve(filePath);
    const relFilePath = path.relative(SRC_DIR, absFilePath);
    const destFilePath = path.join(OUT_DIR, relFilePath);

    fs.mkdirSync(path.dirname(destFilePath), {recursive: true});
    fs.copyFileSync(filePath, destFilePath);

    if (relFilePath.endsWith(`.mixin.${ext}`)) return;
    const depth = relFilePath.split(path.sep).length - 1;
    const pkg = relFilePath.split(path.sep)[0];
    if (depth > 2) return;
    if (depth === 2 && pkg !== 'esl-utils' && pkg !== 'esl-forms') return;

    const source = fs.readFileSync(filePath, 'utf-8');
    let css;
    try {
      css = await compile(source, absFilePath);
    } catch (err) {
      throw new Error(err);
    }

    fs.writeFileSync(destFilePath.replace(new RegExp(`\\.${ext}$`), '.css'), css);
  };
}
