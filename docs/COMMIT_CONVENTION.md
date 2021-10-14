# Commit Convention of ESL project

The project is using `@commitlint/config-conventional` commit message rules. 
Please check it out in case you want to contribute to ESL. 
Use this short note to renew commit message rules.

## IDE Support

If you are using JetBrains IDE (IDEA or WebStorm) you can use this
[plugin](https://plugins.jetbrains.com/plugin/13389-conventional-commit) to simplify commit validation.

If you are using Visual Studio Code then you can use the following 
[plugin](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits)
to be sure that you are following the commit convention.

## Convention Goals

- provide more standardized and informative commit messages
- allows automatically generate CHANGELOG.md
- allows categorizing commits by importance and goals

## FAQ
- Why do ESL use commit convention?
    - It's important for us to have an automated process of RELEASE NOTES and CHANGELOG creation.
- What if incorrect commits were added to my branch?
    - Try to reword your commit messages using
      [git rebase](https://google.gprivate.com/search.php?search?q=git+rebase+reword)
    - You can also squash (concat into one commit) your commits but that's not necessary,
      the most important point is that your final commit messages correctly define the
      type and have a detailed and clear description of the changes
    - Just in case you can't fix up your git history, provide a noticeable comment 
      to use GitHub Squash Merge. It's also will be nice if you write a commit summary 
      to make have the ability to make a result commit faster.
- Do I need to define a type for each of the commits in my feature?
    - Yes, you will need a type for each commit. But, be careful with the following situations:
        - **If the feature or bug changes are not released and already described by the first message - 
          make sure you are using style or refactor change type. Even, if you are fixing your previous commit, 
          it doesn't matter for project history until changes are not released.**
        - **Prefer squashing in case the result history does not describe changes enough or does it incorrectly**

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

You can increase importance of the patch changes to the minor using the `MINOR VERSION` marker in the message.

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
