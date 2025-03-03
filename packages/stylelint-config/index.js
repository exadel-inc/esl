/** @type {import('stylelint').Config} */
export default {
  plugins: ['@stylistic/stylelint-plugin'],
  extends: ['@stylistic/stylelint-config'],
  rules: {
    '@stylistic/string-quotes': 'single',
    '@stylistic/declaration-colon-newline-after': null,
    '@stylistic/max-line-length': null,
    '@stylistic/indentation': [2, {
      ignore: ['value', 'inside-parens']
    }]
  }
};
