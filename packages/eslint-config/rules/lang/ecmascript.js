import globals from 'globals';

export default [{
  files: ['**/*.js', '**/*.mjs'],
  languageOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.node
    }
  }
}];
