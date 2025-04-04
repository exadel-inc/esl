# [Exadel Smart Library](../../) - Migration support

Authors: *Natalia Smirnova, Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

This article aims to assist the smooth migration process from older versions of ESL to the latest version. To support this transition, we have developed an ESLint plugin designed specifically for ESL library. This plugin targets deprecated features and aliases within the library, offering a seamless means of identifying these outdated elements. Additionally, it suggests suitable replacements, thereby ensuring a hassle-free upgrade to the newest version of ESL.

<a name="installation"></a>

### Installation
**Note**: Before installing the plugin, ensure that you have the ESLint package of version 8.0.0 or higher. If you do not intend to install ESLint, this article may not as helpful. However, there are deprecated features listed in the [Rules](#rules) section, that may assist in manual migration. Alternatively, see our [Release notes](https://github.com/exadel-inc/esl/releases).

To use custom ESLint plugin, you need to install it as npm package:

```bash
npm install --save-dev @exadel/eslint-plugin-esl
```

Once installed, the plugin needs to be added to eslint configuration file.

For ESLint 8.0.0 with legacy config:
```json
{
  // ...
  "plugins": [
    "@exadel/esl"
  ]
  // ...
}
```

Or in YAML:
```js
  plugins: 
    - "@exadel/esl"
```

For ESLint +8.0.0 with Flat config:

```js
module.exports = [
  // ESLint configuration

  // Apply Recomended ESL ESLint Plugin checks
  ...require('@exadel/eslint-plugin-esl').recommended,
];
```

<a name="configuration"></a>

### Configuration
We strongly recommend using a built-in preset tailored to your specific needs:
- If you use ESL version 4 and wish to receive notifications about ESL best practices and deprecations with a lighter approach, we recommend using the `default-4.0` preset. It is configured to display all recommendations as warnings.
Provide the following line to extend the section of eslint configuration: `plugin:@exadel/esl/default-4`
- If you want to stay up-to-date and be prepared for ESL version 5, consider using the `default-5.0` preset. It treats all items on the deprecation list with the error severity.
Provide the following line to extend the section of eslint configuration: `plugin:@exadel/esl/default-5`

However, you still have the option to manually manage the rules if needed.

**Note**: All the rules in our custom ESLint plugin are auto-correctable. This means you can take advantage of ESLint's `--fix` option to perform automatic adjustments to your code.

<a name="rules"></a>

### Rules

The ESLint plugin provides a separate rule for each deprecated utility within the ESL project, that's considered to be deprecated. Below is the list of them:

- `@exadel/esl/deprecated-4-aliases` - Rule for deprecated aliases

- `@exadel/esl/deprecated-4-methods` - Rule for deprecated methods.

- `@exadel/esl/deprecated-4-import` - Rule for deprecated import paths.

- `@exadel/esl/deprecated-5-aliases` - Rule for deprecated aliases

These rules can be configured manually inside the `rules` section of your ESLint configuration file.

### Running ESL ESLint with CLI (without ESLint installed)

⚠️ **Note**: This approach is not recommended. If you use ESL, consider installing ESLint with the ESL plugin and keep it in your project.

If you do not have ESLint installed, you can still run ESL ESLint with the following command:
```bash
npm i -g eslint @babel/eslint-parser @typescript-eslint/parser
npx eslint --plugin @exadel/esl --no-eslintrc --config https://raw.githubusercontent.com/exadel-inc/esl/main/eslint/eslint/defaults/ts-config-default.eslint.yml --ext .js,.ts,.jsx,.tsx .
```

There are a couple of basic [configurations](https://github.com/exadel-inc/esl/tree/main/eslint/defaults):
  - defaults/es-config-default.eslint.yml
  - defaults/ts-config-default.eslint.yml
Note: You may still need to configure them temporarily in the root of the project to ensure ESLint can parse your code correctly.


---

**Exadel, Inc.**

[![](../../docs/images/exadel-logo.png)](https://exadel.com)
