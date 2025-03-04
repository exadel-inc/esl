import eslintjs from '@eslint/js';
import {configs as typescriptConfigs} from 'typescript-eslint';

import esbase from './rules/es.base.js';
import tsbase from './rules/ts.base.js';
import stylistic from './rules/stylistic.js';

import tsdoc from './rules/tsdoc.js';
import sonarjs from './rules/sonarjs.js';
import editorconfig from './rules/editorconfig.js';
import importconfig from './rules/import.js';

import lang from './rules/lang.ts.js';

export {lang};

export const strict = [
  eslintjs.configs.recommended,
  ...typescriptConfigs.recommended,
  ...esbase,
  ...tsbase,
  ...stylistic,
  ...sonarjs,
  ...editorconfig,
  ...importconfig,
  ...tsdoc
];
