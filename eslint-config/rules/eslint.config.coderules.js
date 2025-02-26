module.exports = [
  {
    rules: {
      // Verify calls of super() in constructors
      'constructor-super': 'warn',

      // Requires === and !== usage
      'eqeqeq': 'warn',

      // Require Guarding for-in to exclude prototype keys
      'guard-for-in': 'warn',

      // There is no blacklisted identifiers
      'id-blacklist': 'off',

      // Bitwise operators are not recommended
      'no-bitwise': 'warn',

      // Disallow use of caller/callee
      'no-caller': 'error',

      // Warn about assignment operators in conditional statements
      'no-cond-assign': 'warn',

      // Console API is formally allowed
      'no-console': 'off',

      // Debugger operator is not allowed
      'no-debugger': 'error',

      // Allows case statement to fallthrough
      'no-fallthrough': 'off',

      // Warn about using redundant primitive wrapper instances usage
      'no-new-wrappers': 'warn',

      // Warn about redundant initializing to undefined
      'no-undef-init': 'warn',

      // Disallow control flow statements in finally blocks
      'no-unsafe-finally': 'error',

      // Labels are not allowed
      'no-labels': 'error',

      // Require implicit radix parameter for parseInt
        'radix': 'error',

      // Require calls to isNaN() when checking for NaN
        'use-isnan': 'error',

      // Enforce comparing typeof expressions against valid strings
      'valid-typeof': 'error',

      // Enforces consistent usage of type imports
      '@typescript-eslint/consistent-type-imports': [
        'error', {
          prefer: 'type-imports'
        }
      ],

      // Disallow the use of custom TypeScript modules and namespaces
      '@typescript-eslint/no-namespace': 'error',

      // Disallows using a non-null assertion after an optional chain expression
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',

      // Disallows invocation of require()
      '@typescript-eslint/no-require-imports': 'error',

      // Disallow aliasing this
      '@typescript-eslint/no-this-alias': 'error',

      // Flags unnecessary equality comparisons against boolean literals
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',

      // Disallows the use of require statements except in import statements
      '@typescript-eslint/no-var-requires': 'error',

      // Prefer usage of as const over literal type
      '@typescript-eslint/prefer-as-const': 'error',

      // Disallow iterating over an array with a for-in loop
        '@typescript-eslint/no-for-in-array': 'error',

      // Disallow extra non-null assertion
      '@typescript-eslint/no-extra-non-null-assertion': 'error',

      // Enforce default parameters to be last
      'default-param-last': 'off',
      '@typescript-eslint/default-param-last': 'error',

      // Prefers member overloads to be consecutive
      '@typescript-eslint/adjacent-overload-signatures': 'warn',

      // Prefers using either T[] or Array<T> for arrays
        '@typescript-eslint/array-type': 'warn',

      // Warn about awaiting of a value that is not a Thenable
      '@typescript-eslint/await-thenable': 'warn',

      // Bans @ts-<directive> comments from being used or requires descriptions after directive
      '@typescript-eslint/ban-ts-comment': 'warn',

      // Bans Function types from being used
      '@typescript-eslint/no-unsafe-function-type': 'warn',

      // Bans usage of the {} type
      '@typescript-eslint/no-empty-object-type': [
        'warn', {
          allowInterfaces: 'always'
        }
      ],

      // Warn about invalid definition of new and constructor
      '@typescript-eslint/no-misused-new': 'warn',

      // Warns when a namespace qualifier is unnecessary
      '@typescript-eslint/no-unnecessary-qualifier': 'warn',

      // Prefers function types instead of interfaces with call signatures
      '@typescript-eslint/prefer-function-type': 'warn',

      // Sets preference level for triple slash directives versus ES6-style import declarations
      '@typescript-eslint/triple-slash-reference': 'warn',

      // Warns if a type assertion does not change the type of an expression
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',

      // It's recommended to pass a compareFn to the Array.sort method
      '@typescript-eslint/require-array-sort-compare': 'warn',

      // Warns if missed return type on functions or class methods
      '@typescript-eslint/explicit-function-return-type': 'warn',

      /** Ignores if two overloads could be unified into one by using a union or an optional/rest parameter
       * Because of the possibility to separate TSDocs between different function/method overloads
       */
      '@typescript-eslint/unified-signatures': 'off',

      // Allows the delete operator with computed key expressions
      '@typescript-eslint/no-dynamic-delete': 'off',

      // Allows the use of parameter properties in class constructors
      '@typescript-eslint/no-parameter-properties': 'off',

      // Allows the use of type aliases
      '@typescript-eslint/no-type-alias': 'off',

      // There is no prefer of ‘for-of’ loop over a standard ‘for’ loop if the index is only used to access the array being iterated
      '@typescript-eslint/prefer-for-of': 'off',

      // There is no restriction when adding two variables, operands must both be of type number or of type string
      '@typescript-eslint/restrict-plus-operands': 'off',

      // Do not restricts the types allowed in boolean expressions
      '@typescript-eslint/strict-boolean-expressions': 'off',

      // Allows the declaration of empty interfaces
      '@typescript-eslint/no-empty-interface': 'off',

      // Allows empty functions
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': 'off',

      // Allows usage of the any type
      '@typescript-eslint/no-explicit-any': 'off',

      // Allows non-null assertions using the ! postfix operator
      '@typescript-eslint/no-non-null-assertion': 'off',

      // Do not ensures that literals on classes are exposed in a consistent style
      '@typescript-eslint/class-literal-property-style': 'off',

      // Allows the use of the record type
      '@typescript-eslint/consistent-indexed-object-style': 'off',

      // There is no preferences for interfaces or types
      '@typescript-eslint/consistent-type-definitions': 'off',

      // Do not require explicit accessibility modifiers on class properties and methods
      '@typescript-eslint/explicit-member-accessibility': 'off',

      /** Do not require a consistent member declaration order
      * TODO: discuss for the future
       */
      'member-ordering': 'off',
      '@typescript-eslint/member-ordering': 'off',

      // There is no preferences of a particular method signature syntax
      '@typescript-eslint/method-signature-style': 'off',

      // Ensure .toString() is only called on objects which provide useful information when stringified
      '@typescript-eslint/no-base-to-string': 'warn',

      // Warn about non-null assertion in locations that may be confusing
      '@typescript-eslint/no-confusing-non-null-assertion': 'warn',

      // Do not requires expressions of type void to appear in statement position
      '@typescript-eslint/no-confusing-void-expression': 'off',

      // Do not forbids the use of classes as namespaces
      '@typescript-eslint/no-extraneous-class': 'off',

      /** Do not require Promise-like values to be handled appropriately
      * TODO: enable
       */
      '@typescript-eslint/no-floating-promises': 'off',

      // Allows usage of the implicit any type in catch clauses
      '@typescript-eslint/no-implicit-any-catch': 'off',

      // Allows explicit type declarations for variables or parameters initialized to a number, string, or boolean
      '@typescript-eslint/no-inferrable-types': 'off',

      // Allows usage of void type outside of generic or return types
      '@typescript-eslint/no-invalid-void-type': 'off',

      // There is no requirement of using promises in places not designed to handle them
      '@typescript-eslint/no-misused-promises': 'off',

      // Check that type arguments will not be used if not required
      '@typescript-eslint/no-unnecessary-type-arguments': 'warn',

      // Warn about unnecessary constraints on generic types
      '@typescript-eslint/no-unnecessary-type-constraint': 'warn',

      // Allows calling a function with an any type value
      '@typescript-eslint/no-unsafe-argument': 'off',

      // Allows assigning any to variables and properties
      '@typescript-eslint/no-unsafe-assignment': 'off',

      // Prefers a non-null assertion over explicit type cast when possible
      '@typescript-eslint/non-nullable-type-assertion-style': 'warn',

      // Prefer initializing each enums member value
      '@typescript-eslint/prefer-enum-initializers': 'error',

      // Require that all enum members be literal values to prevent unintended enum member name shadow issues
      '@typescript-eslint/prefer-literal-enum-member': 'error',

      // There is no enforce of the usage of the nullish coalescing operator instead of logical chaining
      '@typescript-eslint/prefer-nullish-coalescing': 'off',

      // There is no prefer of using concise optional chain expressions instead of chained logical ands
      '@typescript-eslint/prefer-optional-chain': 'off',

      // Do not requires any function or method that returns a Promise to be marked async
      '@typescript-eslint/promise-function-async': 'off',

      // Allows unbound methods to be called outside their expected scope
      '@typescript-eslint/unbound-method': 'off',

      // Do not require explicit return and argument types on exported functions' and classes' public class methods
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Disable check of conditionals where the type is always truthy or always falsy
      '@typescript-eslint/no-unnecessary-condition': 'off',

      // Allows generic Array constructors
      'no-array-constructor': 'off',
      '@typescript-eslint/no-array-constructor': 'off',

      // Allows the use of variables before they are defined
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'off'
    }
  },
  {
    files: ["**/*.shape.ts"],
    rules: {
      '@typescript-eslint/no-namespace': "off",
      // Temporary of as false positive
      '@typescript-eslint/no-unnecessary-type-arguments': "off"
    }
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      // ts-ignore is off to test clean es cases
      '@typescript-eslint/ban-ts-comment': "off",
      // there is no need to evaluate tests strictly
      '@typescript-eslint/non-nullable-type-assertion-style': "off",
      // return type on functions or class methods is not required in tests
      '@typescript-eslint/explicit-function-return-type': "off"
    }
  }
]
