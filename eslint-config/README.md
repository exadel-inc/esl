# [ESL](../../../) Shared ESLint Configuration

Authors: *Anastasiya Lesun, Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

Packages maintained by ESL Team often use ESLint to ensure code quality and consistency. 
To simplify the process of configuring ESLint for these packages, we have developed a shared ESLint configuration. 
This configuration is designed to be used as a base for ESLint configuration in projects that use ESL package, 
or desided to follow ESL source code style.

<a name="installation"></a>

### Installation

To use ESL shared ESLint configuration, you need to install it as npm package:

```bash
npm install --save-dev @exadel/eslint-config-esl
```

Ensure that you have the ESLint package of version 9.0.0 or higher, shared configuration distributed only as Flat ESLint config.

Once installed, the configuration needs to be added in eslint configuration file:

```js
module.exports = [
    // ESLint configuration ...

    // Apply ESL Shared ESLint Configuration
    ...require('@exadel/eslint-config-esl').typescript,
    ...require('@exadel/eslint-config-esl').recommended,
];
```

<a name="configuration"></a>

### Configuration

There are no additional configuration options for ESL Shared ESLint Configuration at that moment. 
Please be aware that we asre in progress of standardizing rule list and currently considering of suporrting EcmaScript in addition to TypeScript.

Still yor are able to override any rule from the configuration in your project's ESLint configuration file 
by declaring it in the `rules` section of the configuration file after applying the shared configuration.

### Inner Plugins

ESL Shared ESLint Configuration includes several inner plugins that are used to provide additional rules and configurations for ESLint.
Here is the list of included plugins and thair ESLint aliases:

- `@stylistic` - code style rules from [@stylistic](https://eslint.style/) project.
- `typescript-eslint` - TypeScript specific rules from [TypeScript ESLint](https://typescript-eslint.io/) project.
- `import` - rules for imports from [eslint-plugin-import-x](https://www.npmjs.com/package/eslint-plugin-import-x);
- `tsdoc` - rules for TSDoc comments from [eslint-plugin-tsdoc](https://www.npmjs.com/package/eslint-plugin-tsdoc);
- `sonarjs` - rules for code quality from [eslint-plugin-sonarjs](https://www.npmjs.com/package/eslint-plugin-sonarjs); 
  Note: uses 1.*.* version of the plugin due to incompatibility with flat config.
- `editorconfig` - rules for EditorConfig from [eslint-plugin-editorconfig](https://www.npmjs.com/package/eslint-plugin-editorconfig);

All mentioned plugins could be used from shared configuration without additional installation.
