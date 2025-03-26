# [ESL](../../) Shared ESLint Configuration

Authors: *Anastasiya Lesun, Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

Packages maintained by ESL Team often use ESLint to ensure code quality and consistency. 
To simplify the process of configuring ESLint for these packages, we have developed a shared ESLint configuration. 
This configuration is designed to be used as a base for ESLint configuration in projects that use ESL package, 
or decide to follow ESL source code style.

<a name="installation"></a>

### Installation

To use ESL shared ESLint configuration, you need to install it as npm package:

```bash
npm install --save-dev @exadel/eslint-config-esl
```

Ensure that you have the ESLint package of version 9.0.0 or higher, shared configuration is distributed only as flat ESLint config.

Once installed, the configuration needs to be added in eslint configuration file:

```js
// Import only configs you need
import {lang, base, codestyle, medium, strict} from '@exadel/eslint-config-esl';

export default [
    // Default lang (parsers) configs, if required
    //...lang.js,
    //...lang.ts,
        
    // ESL ESLint configuration of your choice
    ...strict // or medium, or base, or codestyle   
    // Note: recommended sets of eslint / typscript-esint are included in base, medium and strict config.     
        
    // ESLint user configuration ...
];
```

Please note '@exadel/eslint-config-esl' is an ESM-only package.
You either need to use ESM in your project or run eslint independently with `.mjs` configuration file.

<a name="configuration"></a>

### Configuration

ESL Shared ESLint Configuration is split into several configurations/bunches:
- `base` - basic light linting configuration, uses `@eslint/js/` recommended and `typescript-eslint` recommended ruleset as a base.
- `codestyle` - code style configuration, uses `@stylistic` and `import` plugins. Does not include `base` rules.
- `medium` - medium configuration, combination `base` and `codestyle` rules.
- `strict` - strict configuration, includes `base` and `codestyle`, extended with the most restrictive settings.

The `base` ruleset recommended for consumers to have basic code checks similar to ESL source code.
The `codestyle` ruleset is recommended for projects that want to follow ESL code style.
The `medium` ruleset is a shortcut for projects that want to have both basic and code style checks.
The `strict` ruleset is recommended for projects that completely follow ESL code style and want to have the most restrictive checks.

### Default lang (parsers) configs

ESL Shared ESLint Configuration includes default lang (parsers) configs for JavaScript and TypeScript.

Feel free to extend or default them manually.

Default JavaScript parser config:
```js
const js = {  // lang.js
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        globals: {
            ...globals.browser,
            ...globals.node
        }
    }
};
```

Default TypeScript parser config:
```js
const ts = { // lang.ts
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
        parser: tsParser, // @typescript-eslint/parser
        ecmaVersion: 2017,
        sourceType: 'module',
        parserOptions: {
            projectService: true
        },
        globals: {
            ...globals.browser
        },
        settings: {
            'import/resolver': {
                typescript: true
            }
        }
    }
};
```

### Inner Plugins

ESL Shared ESLint Configuration includes several inner plugins that are used to provide additional rules and configurations for ESLint.
Here is the list of included plugins and their ESLint aliases:

- `@eslint/js` - basic ESLint rules from [eslint](https://eslint.org/) project.
- `typescript-eslint` - TypeScript specific rules from [TypeScript ESLint](https://typescript-eslint.io/) project.
- `@stylistic` - code style rules from [@stylistic](https://eslint.style/) project.
- `import` - rules for imports from [eslint-plugin-import-x](https://www.npmjs.com/package/eslint-plugin-import-x);
  - `eslint-import-resolver-typescript` - TypeScript resolver for `import` plugin;
- `tsdoc` - rules for TSDoc comments from [eslint-plugin-tsdoc](https://www.npmjs.com/package/eslint-plugin-tsdoc);
- `sonarjs` - rules for code quality from [eslint-plugin-sonarjs](https://www.npmjs.com/package/eslint-plugin-sonarjs);

All mentioned plugins are direct dependencies of `@exadel/eslint-config-esl` package, you don't need to install them separately.
