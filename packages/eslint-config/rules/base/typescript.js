import {plugin} from 'typescript-eslint';

export default [
  {
    plugins: {
      '@typescript-eslint': plugin
    },
    rules: {
      // Enforce default parameters to be last
      '@typescript-eslint/default-param-last': 'error',

      // Warn about invalid definition of new and constructor
      '@typescript-eslint/no-misused-new': 'warn',

      // Allows unused expressions
      '@typescript-eslint/no-unused-expressions': 'off',

      // Warn about unused variables
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'none',
          caughtErrors: 'none',
          vars: 'all'
        }
      ]
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': plugin
    },
    rules: {
      // Warn about awaiting of a value that is not a Thenable
      '@typescript-eslint/await-thenable': 'warn',

      // Prefers member overloads to be consecutive
      '@typescript-eslint/adjacent-overload-signatures': 'warn',

      // Prefers using either T[] or Array<T> for arrays
      '@typescript-eslint/array-type': 'warn',

      // Does not bans @ts-<directive> comments in base ESLint configuration
      '@typescript-eslint/ban-ts-comment': 'off',

      // Bans Function types from being used
      '@typescript-eslint/no-unsafe-function-type': 'warn',

      // Bans usage of the {} type
      '@typescript-eslint/no-empty-object-type': [
        'warn', {
          allowInterfaces: 'always'
        }
      ],

      // Allow the use of custom TypeScript modules and namespaces (in base configuration)
      '@typescript-eslint/no-namespace': 'off',

      // Warns when a namespace qualifier is unnecessary
      '@typescript-eslint/no-unnecessary-qualifier': 'warn',

      // Prefers function types instead of interfaces with call signatures
      '@typescript-eslint/prefer-function-type': 'warn',

      /** Ignores if two overloads could be unified into one by using a union or an optional/rest parameter
       * Because of the possibility to separate TSDocs between different function/method overloads
       */
      '@typescript-eslint/unified-signatures': 'off',

      // Allows the use of parameter properties in class constructors
      '@typescript-eslint/no-parameter-properties': 'off',

      // Allows the use of type aliases
      '@typescript-eslint/no-type-alias': 'off',

      // There is no restriction when adding two variables, operands must both be of type number or of type string
      '@typescript-eslint/restrict-plus-operands': 'off',

      // Do not restricts the types allowed in boolean expressions
      '@typescript-eslint/strict-boolean-expressions': 'off',

      // Allows the declaration of empty interfaces
      '@typescript-eslint/no-empty-interface': 'off',

      // Allows empty functions
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
      '@typescript-eslint/member-ordering': 'off',

      // There is no preferences of a particular method signature syntax
      '@typescript-eslint/method-signature-style': 'off',

      // It's recommended to pass a compareFn to the Array.sort method
      '@typescript-eslint/require-array-sort-compare': 'warn',

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
      '@typescript-eslint/no-array-constructor': 'off',

      // Allows the use of variables before they are defined
      '@typescript-eslint/no-use-before-define': 'off',

      // Do not enforce dot notation whenever possible
      '@typescript-eslint/dot-notation': 'off',

      // Prefers consistent usage of type assertions
      '@typescript-eslint/consistent-type-assertions': 'warn',

      // Require the use of the namespace keyword instead of the module keyword to declare custom TypeScript modules
      '@typescript-eslint/prefer-namespace-keyword': 'warn',

      // Allows initialization in variable declarations
      '@typescript-eslint/init-declarations': 'off',

      // Warn about duplicate class members
      '@typescript-eslint/no-dupe-class-members': 'warn',

      // The use of eval()-like methods is not recommended
      '@typescript-eslint/no-implied-eval': 'warn',

      // Allows this keywords outside of classes or class-like objects
      '@typescript-eslint/no-invalid-this': 'off',

      // Warn about function declarations that contain unsafe references inside loop statements
      '@typescript-eslint/no-loop-func': 'warn',

      // Warn about literal numbers that lose precision
      '@typescript-eslint/no-loss-of-precision': 'warn',

      // Disallow variable redeclaration
      '@typescript-eslint/no-redeclare': 'error',

      // Warn about variable declarations that are shadowing variables declared in the outer scope
      '@typescript-eslint/no-shadow': 'warn',

      // Warn about throwing literals as exceptions
      '@typescript-eslint/only-throw-error': 'warn',

      // Warn about unnecessary constructors
      '@typescript-eslint/no-useless-constructor': 'warn',

      // Do not warn if an async function has no await expression
      '@typescript-eslint/require-await': 'off',

      // Prefers consistent returning of awaited values
      '@typescript-eslint/return-await': 'warn'
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    plugins: {
      '@typescript-eslint': plugin
    },
    rules: {
      // ts-ignore is off to test clean es cases
      '@typescript-eslint/ban-ts-comment': 'off',
      // there is no need to evaluate tests strictly
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      // return type on functions or class methods is not required in tests
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  }
];
