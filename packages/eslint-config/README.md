# [Exadel Smart Library](../../) - Shared ESLint Configuration

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
import {lang, base, codestyle, medium, strict, esl} from '@exadel/eslint-config-esl';

export default [
    // Default lang (parsers) configs, if required
    //...lang.js,
    //...lang.ts,
        
    // ESL ESLint configuration of your choice
    ...strict, // or medium, or base, or codestyle   
    // Note: recommended sets of eslint / typescript-eslint are included in base, medium and strict config.     

    // (Optional) ESL integrated migration / deprecation checks (warn severity by default)
    ...esl.recommended(),
        
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
        }
    },
    settings: {
      'import/resolver': {
        typescript: true
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
- `import` - rules for imports from [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import);
  Note: the config does not provide typescript import resolver out of the box. In case you have path aliases in your project, you need to add `import/resolver` setting manually.
- `tsdoc` - rules for TSDoc comments from [eslint-plugin-tsdoc](https://www.npmjs.com/package/eslint-plugin-tsdoc);
- `sonarjs` - rules for code quality from [eslint-plugin-sonarjs](https://www.npmjs.com/package/eslint-plugin-sonarjs);

All mentioned plugins are direct dependencies of `@exadel/eslint-config-esl` package, you don't need to install them separately.

<a name="deprecations"></a>

### Deprecation & Migration Assistance (Integrated)

The previously separate `@exadel/eslint-plugin-esl` (migration / deprecation plugin) was removed.
Its functionality is now integrated directly into this shared config package under the `esl` export.

#### Key points
- Flat-config only (ESLint 9+).
- Three helper rules: `deprecated-alias`, `deprecated-paths`, `deprecated-static`.
- Automatic union of all known version deprecations in `esl.recommended()`.
- All rules autofix where safe.
- You control a single uniform severity for all deprecation rules.

#### Enabling (default WARN)
```js
import {esl} from '@exadel/eslint-config-esl';
export default [
  ...esl.recommended(), // same as esl.recommended('warn')
];
```

#### Custom severity
Accepted severity values (case-insensitive):
- numbers: `0 | 1 | 2`
- strings: `off | warn | error`

Examples:
```js
...esl.recommended('error');       // escalate all deprecation rules to error
...esl.recommended(0);             // disable all deprecation rules
...esl.recommended('off');         // same as above
```

#### Helper rules & config shapes
1. `@exadel/esl/deprecated-alias`
```js
{ "DeprecatedName": "ReplacementName" }
```
2. `@exadel/esl/deprecated-paths`
```js
{
  AliasName: { legacy: 'old/path.js', path: '@exadel/esl/AliasName' }
  // or legacy: ['old/a.js','old/b.js']
}
```
3. `@exadel/esl/deprecated-static`
```js
{
  ClassName: {
    oldMethod: 'newMethod',
    anotherOld: { replacement: 'newOne', message: 'ClassName.newOne()' }
  }
}
```

#### Building a custom subset
Use `esl.forConfig(customConfig, severity)`:
```js
import {esl} from '@exadel/eslint-config-esl';
const onlyAliases = esl.forConfig({
  aliases: esl.configs['6.0.0'].aliases,
  paths: {},
  staticMembers: {}
}, 'error');

export default [
  ...onlyAliases
];
```

`forConfig` second argument behaves the same as `recommended` severity parameter. If omitted, defaults to `warn`.

#### Migration from removed standalone plugin
Old rules (removed):
- `@exadel/esl/deprecated-4-aliases`
- `@exadel/esl/deprecated-4-methods`
- `@exadel/esl/deprecated-4-import`
- `@exadel/esl/deprecated-5-aliases`

Now use:
```js
...esl.recommended(); // or with desired severity
```
Optionally tailor with `forConfig` (see above) but per-item toggling is intentionally not exposed.

#### Why a single severity knob?
- Keeps deprecation signal consistent.
- Simplifies CI policy (treat all deprecations uniformly).
- Easier future extension for version scoping.

#### Future roadmap
Planned: version-scoped modes (e.g. "treat code as if upgrading to 7.x") and opt‑in early warnings. Today `recommended()` returns union of released deprecations.

---

**Exadel, Inc.**

[![](../../docs/images/exadel-logo.png)](https://exadel.com)
