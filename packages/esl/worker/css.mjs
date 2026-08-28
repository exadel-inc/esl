import path from 'node:path';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import {createStyleWorker} from './styles.mjs';

const processor = postcss([postcssImport()]);

export default createStyleWorker({
  ext: 'css',
  copy: true,
  compile: async (source, absFilePath) => {
    const result = await processor.process(source, {from: absFilePath, map: false});
    return result.css;
  },
  filter: (relFilePath) => {
    return ['all.css', 'core.css'].includes(path.basename(relFilePath));
  }
});
