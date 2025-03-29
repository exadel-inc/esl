# [Exadel Smart Library](../../) - Shared StyleLint Configuration

Authors: *Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

Packages maintained by ESL Team often use StyleLint to ensure code quality and consistency.
To simplify the process of configuring StyleLint for these packages, we have developed a shared StyleLint configuration.
This configuration is designed to be used as a base for StyleLint configuration in projects that use ESL package,
or decide to follow ESL source code style.

<a name="installation"></a>

### Installation

To use ESL shared StyleLint configuration, you need to install it as npm package:

```bash
npm install --save-dev @exadel/stylelint-config-esl
```

Ensure that you have the StyleLint package of version 15.0.0 or higher, 
shared configuration uses separate @stylistic package to check style rules.

Once installed, the configuration needs to be added in StyleLint configuration file:

```js
module.exports = {
  // StyleLint configuration
  // ...
  extends: [
    // Apply ESL Shared StyleLint Configuration
    '@exadel/stylelint-config-esl',
  ]
};
```

---

**Exadel, Inc.**

[![](../../docs/images/exadel-logo.png)](https://exadel.com)
