import eslintjs from '@eslint/js';
import {configs as typescriptConfigs} from 'typescript-eslint';

import esbase from './ecmascript.js';
import tsbase from './typescript.js';
import imports from './imports.js';

export {esbase, tsbase, imports};

export default [
  eslintjs.configs.recommended,
  ...typescriptConfigs.recommended,
  ...esbase,
  ...tsbase,
  ...imports
];
