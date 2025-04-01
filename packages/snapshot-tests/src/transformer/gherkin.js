import fs from 'fs';

import {cucumber, GenericTransformer} from 'stucumber';

function process(source, filename) {
  const transformer = new GenericTransformer({
    featureFn: 'describe',
    scenarioFn: 'test',
    beforeAllFn: 'beforeAll',
    afterAllFn: 'afterAll'
  });

  try {
    return {
      code: transformer.transform(filename, source)
    };
  } catch (e) {
    if (e.name === 'SyntaxError' && e.location) {
      throw new Error(`${filename} (${e.location.start.line}, ${e.location.start.column}): ${e.message}`);
    } else {
      throw new Error(`${e.name}: ${e.message}`);
    }
  }
}

function getCacheKey(source, filename) {
  const stat = fs.statSync(filename);
  return `${filename}-${stat.mtimeMs}`;
}

export {cucumber, process, getCacheKey};
export default {cucumber, process, getCacheKey};
