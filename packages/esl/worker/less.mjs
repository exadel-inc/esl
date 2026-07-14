import less from 'less';
import {createStyleWorker} from './style-worker.mjs';

// A sibling .css source (compiled first by the build:css target) may target the
// same output file, so merge to concatenate .less and .css styles per module.
export default createStyleWorker({
  ext: 'less',
  compile: async (source, absFilePath) => {
    const result = await less.render(source, {filename: absFilePath});
    return result.css;
  }
});
