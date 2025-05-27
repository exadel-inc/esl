import ecmascript from './ecmascript.js';
import typescript from './typescript.js';
import imports from './imports.js';
import sonarjs from './sonarjs.js';
import tsdoc from './tsdoc.js';

export default [
  ...ecmascript,
  ...typescript,
  ...imports,
  ...sonarjs,
  ...tsdoc
];
