import fs from 'node:fs/promises';
import path from 'node:path';

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
 * @param {(source: string, absFilePath: string) => Promise<string>} options.compile - compiler producing CSS
 * @returns {(filePath: string) => Promise<void>}
 */
export function createStyleWorker({ext, compile, filter, copy}) {
  return async function (filePath) {
    const absFilePath = path.resolve(filePath);
    const relFilePath = path.relative(SRC_DIR, absFilePath);
    const destFilePath = path.join(OUT_DIR, relFilePath);

    await fs.mkdir(path.dirname(destFilePath), {recursive: true});

    if (copy) await fs.copyFile(filePath, destFilePath);
    if (typeof filter === 'function' && !filter(relFilePath)) return;

    const source = await fs.readFile(filePath, 'utf-8');
    const content = await compile(source.toString(), absFilePath);

    await fs.writeFile(destFilePath.replace(new RegExp(`\\.${ext}$`), '.css'), content);
  };
};
