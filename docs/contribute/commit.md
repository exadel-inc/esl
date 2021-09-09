# Commit Convention

Project is using `@commitlint/config-conventional` commit message rules. Please check it out in case you want to
contribute to ESL. Use this short note to renew commit message rules.

In case you are using JetBrains IDE (IDEA or WebStorm) you can use this
[plugin](https://plugins.jetbrains.com/plugin/13389-conventional-commit) to simplify commit validation.

For Visual Studio Code use the following [plugin](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits).

## Goals

- provide more standardized and informative commit messages
- allows automatically generate CHANGELOG.md
- allows categorizing commits by importance and goals

## Commit Message Signature

```text
<type> (<scope>): <subject>

<body>

<footer>
```

`<type>` and `<subject>` parts are always required. So minimal valid commit message:
```text
<type>: <subject>
```

---

### \<type\>
Type is a required part of the message, and it is limited by the following values:

| \<type\> | Description |
|:--------:|:----------- |
| feat     | Add new functionality |
| fix      | Fix existing functionality |
| refactor | Code changes that are not add new functionality or fix something |
| test     | Add or update tests |
| docs     | Add or update docs |
| chore    | Development changes related to build system or package dependencies |
| revert   | Revert functionality |
| style    | Just code style changes (linting, semicolons, etc) |
| ci       | Continuous integration and deployment related changes |
| perf     | Backward-compatible performance improvements |

Type should be in a lowercase.

### Force minor version update

You can increase importance of the patch changes to the minor using the `MAJOR` marker in the message.

### BREAKING CHANGES

**To identify breaking changes use `!` postfix for the <type>**
```text
feat!: Hey I'm breaking something that already exist
```

**Identify everything that break or change existing API or behaviour with the `BREACKING CHAGES:` list
```text
feat!: Hey I'm breaking something that already exist

BREAKING CHANGES:
  something was broken
  some api was changed
```

---

### \<scope\>

Scope is an optional but "nice to have" part of your commit message.

Use scope to clarify changes area (module, component, feature or epic).

Scope should be placed in parentheses after type but before `:`.

Scope should be compatibly short and in a lowercase.

```text
fix(esl-component): IE compatibility
```

---

### \<subject\>

Subject is the main part of commit message where you should describe your changes.

Subject text rules:
- be informative
- use imperative, present tense: “change” not “changed” nor “changes”
- don't capitalize first letter
- no dot (.) at the end

**NOT**:
```text
fix: some fixes
```
```text
feat: Component updated to the new base class. 
```

**BUT**
```text
fix (esl-utils): IE compatibility for scroll type detection
```
```text
feat (esl-popup): esl-popup component base structure 
```

---

### \<body\>

The body is optional part of commit message. 
Body part can be used to provide details of commit changes or clarify the motivation for changes.

The header and body are supposed to be separated by a blank line.

---

### \<footer\>

The footer is optional lines to provide additional details like linking closed issues, mentioning contributors and so on.

The body and footer are also should be separated by a blank line.

Example:
```text
fix: disappearing controls on hover

Update of css rules order.

Close PR #123.
```
