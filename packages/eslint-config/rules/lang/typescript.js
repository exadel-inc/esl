import globals from 'globals';
import {parser} from 'typescript-eslint';

export default [{
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    parser,
    ecmaVersion: 2017,
    sourceType: 'module',
    parserOptions: {
      projectService: true
    },
    globals: {
      ...globals.browser
    }
  },
  settings: {
    'import/resolver': {
      typescript: true
    }
  }
}];
