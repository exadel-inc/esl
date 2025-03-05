import ecmascript from './ecmascript.js';
import typescript from './typescript.js';
import stylistic from './stylistic.js';
import editorconfig from './editorconfig.js';
import imports from './imports.js';

export default [
  ...ecmascript,
  ...typescript,
  ...stylistic,
  ...editorconfig,
  ...imports
];
