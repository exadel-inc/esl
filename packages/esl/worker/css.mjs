import postcss from 'postcss';
import postcssImport from 'postcss-import';
import {createStyleWorker} from './style-worker.mjs';

const processor = postcss([postcssImport()]);

export default createStyleWorker({
  ext: 'css',
  compile: async (source, absFilePath) => {
    const result = await processor.process(source, {from: absFilePath, map: false});
    return result.css;
  }
});
