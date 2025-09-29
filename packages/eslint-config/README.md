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
- Version-aware: `esl.recommended()` detects the installed `@exadel/esl` version and applies only relevant deprecations.
- If the version can't be detected, a superset (all known deprecations) is applied and a single warning is printed.
- All rules autofix where safe.
- Uniform severity control (single parameter).

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
...esl.recommended('error');       // escalate
...esl.recommended(0);             // disable all deprecations
...esl.recommended('off');         // same as above
```

#### Forcing a specific ESL version (tests / CI / preview)
You can force generation for a target ESL version (bypassing auto-detection):
```js
import {esl} from '@exadel/eslint-config-esl';
export default [
  ...esl.version('6.1.0', 'warn')
];
```
This is mainly useful in CI or when validating upcoming upgrades.

#### Verbose output
Run ESLint with `--verbose` to see a single log line indicating which ESL version (or superset fallback) was used to build the deprecation config.

#### Migration from removed standalone plugin
Historically a standalone migration / deprecation plugin existed (`@exadel/eslint-plugin-esl`). It exposed grouped configs separating deprecations introduced in ESL v4 and v5.
Those configs (`default-4`, `default-5`, `default`, plus a flat-friendly `recommended`) are removed and replaced with the version‑aware `esl.recommended()` helper in this package.

Minimal legacy examples for context:
```js
// .eslintrc.js (legacy non-flat)
module.exports = {
  plugins: ['@exadel/esl'],
  extends: ['plugin:@exadel/esl/default']
};
```
```js
// eslint.config.mjs (legacy flat)
import deprecated from '@exadel/eslint-plugin-esl';
export default [
  ...deprecated.configs.recommended
];
```
Other legacy variants included:
- Selecting `plugin:@exadel/esl/default-5` to escalate older (v4) deprecations to error while keeping newer (v5) at warn.
- Using `default-4` or `default` explicitly for narrower sets.
- Manually enabling individual rule IDs like `@exadel/esl/deprecated-4-aliases` or `@exadel/esl/deprecated-5-methods` with custom severities.
All those granular patterns are intentionally consolidated now.

Current approach (single spread):
```js
import {esl} from '@exadel/eslint-config-esl';
export default [
  ...esl.recommended('warn')
];
```

Key changes vs legacy:
- Unified list: no need to pick between `default-*` variants.
- Single severity parameter (per‑major severity tiers removed).
- Auto version detection chooses deprecations relevant to the installed `@exadel/esl`; missing version => superset + one warning.

Need strict treatment for older deprecations? Use `esl.recommended('error')` and inline-disable rare new ones temporarily.

Migration checklist:
1. Remove `@exadel/eslint-plugin-esl` from `devDependencies`.
2. Drop any `plugin:@exadel/esl/<config>` extends and legacy rule IDs.
3. Add `...esl.recommended(<severity>)` (default warn) to your flat config.
4. Clean obsolete inline disables referencing removed rule names.
5. (Optional) Run ESLint with `--verbose` to confirm detected ESL version.

Edge cases:
- No `@exadel/esl` in consumer: superset applied, single warning.
- Monorepo: version resolution is from the invoking project root.

Need multi-tier severities back? Open a discussion; future version-scoped preview modes may offer structured staging without reintroducing legacy complexity.

#### Why a single severity knob?
- Consistent signal across all deprecations.
- Simple CI policy.
- Easier future extension (e.g. version-scoped modes).

---

**Exadel, Inc.**

[![](../../docs/images/exadel-logo.png)](https://exadel.com)
