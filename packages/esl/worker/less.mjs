import path from 'node:path';
import less from 'less';
import {createStyleWorker} from './styles.mjs';

// A sibling .css source (compiled first by the build:css target) may target the
// same output file, so merge to concatenate .less and .css styles per module.
export default createStyleWorker({
  ext: 'less',
  copy: true,
  compile: async (source, absFilePath) => {
    const result = await less.render(source, {filename: absFilePath});
    return result.css;
  },
  filter: (relFilePath) => {
    if (relFilePath.endsWith('.mixin.less')) return false;
    const depth = relFilePath.split(path.sep).length - 1;
    const pkg = relFilePath.split(path.sep)[0];
    if (pkg === 'esl-forms' || pkg === 'esl-utils') return depth < 3;
    return depth < 2 ;
  }
});
