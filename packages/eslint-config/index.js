import lang from './rules/lang/index.js';
import base from './rules/base/index.js';
import extended from './rules/strict/index.js';
import codestyle from './rules/codestyle/index.js';

export {lang, base, codestyle};

export const medium = [
  ...base,
  ...codestyle
];

export const strict = [
  ...base,
  ...extended,
  ...codestyle
];
