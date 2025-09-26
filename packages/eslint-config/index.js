import lang from './rules/lang/index.js';
import base from './rules/base/index.js';
import extended from './rules/strict/index.js';
import codestyle from './rules/codestyle/index.js';
import esl from './rules/custom/index.js';

export {lang, base, codestyle, esl};

export const medium = [
  ...base,
  ...codestyle
];

export const strict = [
  ...base,
  ...extended,
  ...codestyle
];
