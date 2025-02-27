import editorConfigPlugin from 'eslint-plugin-editorconfig';

export default [
  {
    plugins: {
      editorconfig: editorConfigPlugin
    },
    rules: {
      // Enforce charset check
      'editorconfig/charset': "warn",
      // Enforce EOL for all files
      'editorconfig/eol-last': "warn",
      // Require no trailing spaces
      'editorconfig/no-trailing-spaces': "warn"
    }
  }
];
