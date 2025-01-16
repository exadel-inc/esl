module.exports = [
  {
    plugins: {
      editorconfig: require('eslint-plugin-editorconfig')
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
