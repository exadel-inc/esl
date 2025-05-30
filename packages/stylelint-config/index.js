/** @type {import('stylelint').Config} */
export default {
  plugins: ['@stylistic/stylelint-plugin'],
  extends: ['@stylistic/stylelint-config'],
  rules: {
    // --- Stylistic overrides ---
    '@stylistic/string-quotes': 'single',
    '@stylistic/declaration-colon-newline-after': null,
    '@stylistic/max-line-length': null,
    '@stylistic/indentation': [2, {
      ignore: ['value', 'inside-parens']
    }],

    // --- EditorConfig overrides ---
    '@stylistic/unicode-bom': 'never',
    '@stylistic/no-eol-whitespace': true,

    // --- Main rules ---
    // Disallow unknown at-rules
    'at-rule-no-unknown': true,
    // Warn about empty selectors
    'block-no-empty': [true, {severity: 'warning'}],
    // Disallow invalid hex colors
    'color-hex-length': ['short', {severity: 'warning'}],
    // Disallow invalid hex colors
    'color-no-invalid-hex': true,
    // Disallow empty comments
    'comment-no-empty': [true, {severity: 'warning'}],
    // Disallow duplicated font family reverencing
    'font-family-no-duplicate-names': true,
    // Disallow missing font family keyword
    'font-family-no-missing-generic-family-keyword': [true, {severity: 'warning'}],
    // Disallow an unspaced operator within `calc` functions
    'function-calc-no-unspaced-operator': true,
    // Disallow direction values in `linear-gradient()` calls that are not valid according to the standard syntax
    'function-linear-gradient-no-nonstandard-direction': true,
    // Disallow !important within keyframe declarations
    'keyframe-declaration-no-important': true,
    // Disallow duplicated at-rules
    'no-duplicate-at-import-rules': [true, {severity: 'warning'}],
    // Warn if empty sources
    'no-empty-source': [true, {severity: 'warning'}],
    // Disallow double-slash comments `(//...)` for clear CSS, as they are not supported by CSS
    // and could lead to unexpected results
    'no-invalid-double-slash-comments': [true, {severity: 'warning'}],
    // Disallow unknown properties
    'property-no-unknown': [true, {severity: 'warning'}],
    // Use double colon notation for applicable pseudo-elements
    'selector-pseudo-element-colon-notation': 'double',
    // Disallow unknown pseudo-class selectors
    'selector-pseudo-class-no-unknown': [true],
    // Disallow unknown pseudo-element selectors
    'selector-pseudo-element-no-unknown': [true, {
      ignorePseudoElements: [
        '/^-webkit-/',
        '/^-moz-/'
      ],
      severity: 'warning'
    }],
    // Disallow unknown type selectors
    'selector-type-no-unknown': [true, {
      ignore: ['custom-elements']
    }],
    // Warn about newlines (unescaped) in strings
    'string-no-newline': [true, {severity: 'warning'}],
    // Disallow unknown units
    'unit-no-unknown': true
  }
};
