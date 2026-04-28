---
layout: content
name: ESL v6.0.0 Overview & Migration Guide
title: ESL v6.0.0 Overview & Migration Guide
tags: [blogs]
order: 11
date: 2026-04-27
---

ESL 6.0.0 is a major release focused on cleanup, safer defaults, and long-postponed removal of deprecated APIs.

If your project is already on a recent v5.x line, the upgrade is usually straightforward — but it is still worth treating it as a deliberate migration rather than a routine patch update.

---

## Preparation

Before switching to ESL 6.0.0, it is worth doing three quick checks in your codebase:

1. **Enable the Deprecation & Migration Assistance rules first.** Historically this workflow came from `@exadel/eslint-plugin-esl`; in the current setup it is integrated into `@exadel/eslint-config-esl`, so the practical upgrade path is to enable the shared config and run its ESL migration checks before touching code manually.
2. **Search for deprecated or dynamic parsing patterns.** In particular, look for `evaluate`, `@jsonAttr` values that rely on calculations or references, and custom media-rule object parsing.
3. **Review component configuration overrides.** Popup alignment, anchor-nav customization, footnote ignore configuration, and toggleable manager imports are the most likely places to require manual edits.

---

## Breaking changes

### 1. Safer object parsing replaces arbitrary expressions

The old `evaluate` utility is removed.

This is mainly a **security cleanup**: configuration values can no longer execute arbitrary expressions.
One of the few things that may have felt convenient before was the ability to reference something outside the config itself — for example a global object — but convenient does not mean safe, and that flexibility came with obvious risk.

The supported replacements are:
- `parseObject`
- `parseObjectSafe`
- `JSON.parse` when plain JSON is enough

The nice part is that the new parser still keeps a lightweight attribute-friendly syntax, so in many cases the migration is simpler than it sounds.

Just as important: ordinary configs that people typically use in day-to-day development still parse as expected, so most straightforward declarative setups do not need to change.

For example:

```html
<!-- before: expression-style config, flexible but unsafe -->
<esl-component param="{target: window.appTarget, offset: baseOffset + 8}"></esl-component>

<!-- after: safe config with the new lightweight syntax -->
<esl-component param="target: 'popup'; offset: 8"></esl-component>

<!-- ordinary everyday config: still valid -->
<esl-component param="{target: '#my-dlg', timeout: 1000}"></esl-component>
```

So the real migration rule is straightforward:
- keep declarative values inside the config string;
- move dynamic logic to JavaScript;
- use custom parsers or component config resolvers only when truly needed.

This also affects APIs that now rely on the new parsing model:
- `@jsonAttr`
- `ESLMediaRuleList.OBJECT_PARSER`
- internal config parsing in components such as carousel, media controls, and drag-to-scroll

---

### 2. Deprecated core / utils APIs are removed

v6 finalizes a broad cleanup of APIs that had already been discouraged across previous releases.

Notable removals and renames include:
- `ESLAlert.defaultConfig` → use `ESLAlert.DEFAULT_PARAMS`
- `ESLEventUtils.getAutoDescriptors` → use `ESLEventUtils.descriptors(host, {auto: true})`
- `ESLEnvShortcuts` alias removed in favor of `ESLMediaShortcuts`
- `PromiseUtils` removed in favor of individual helpers
- `RTLScroll`, `ScrollType`, `testRTLScrollType` removed
- `isBot` removed
- `DeviceDetector` removed as the recommended abstraction
- `flat` removed in favor of native `Array.prototype.flat`
- umbrella helpers such as `UID`, `ArrayUtils`, `ObjectUtils`, `FormatUtils`, and `FunctionUtils` removed in favor of direct utility imports

### Recommendation

Treat this part of the migration as a cleanup pass:
- start by running the Deprecation & Migration Assistance rules (historically from `@exadel/eslint-plugin-esl`, now integrated into `@exadel/eslint-config-esl`),
- remove old aliases,
- switch to direct util imports,
- prefer native platform methods where ESL no longer keeps compatibility wrappers.

---

### 3. Popup alignment API changed

Popup positioning attributes were renamed:
- `margin-arrow` → `margin-tether`
- `offset-arrow` → `alignment-tether`

If your project has shared popup presets, mixins, or markup snippets, update them centrally first.

---

### 4. Anchor-nav API became more explicit

`esl-anchornav` now expects an explicit `anchor-selector` attribute instead of the old prototype-driven `ANCHOR_SELECTOR` approach.

At the same time:
- the anchor lookup model becomes more flexible;
- the `findAnchors` hook works with `ESLTraversingQuery`;
- empty markers and abstract data are supported.

### What to migrate

Review custom subclasses or integrations that relied on:
- `ANCHOR_SELECTOR`,
- implicit anchor discovery assumptions,
- custom anchor metadata wiring.

---

### 5. Footnotes ignore API is stricter

`ESLNoteIgnore.noteSelector` was renamed to `noteTag`.

This is more than a naming change: the new API is intentionally restrictive and expects **tag-based** usage rather than arbitrary selectors.

If you relied on broad selector syntax, plan a small markup or integration refactor.

---

### 6. Toggleable manager naming changed

`ESLToggleableManager` default instance is now named `ESLToggleableManagerDefault`.

Also note that the manager interface fix is considered a breaking change for consumers that import or type against the previous name directly.

---

## Important non-breaking but notable updates

These changes may not break builds directly, but they are worth knowing during upgrade:

- Base elements now expose `$$find` and `$$findAll`.
- `esl-incremental-scroll` is added.
- `esl-line-clamp-alt` and `esl-line-clamp-toggler` are introduced.
- Carousel CSS renderers support vertical orientation and viewport-in animations.
- `esl-media` accepts extended start-time format.
- Footnotes react better to dynamic ignored-note updates.
- `ESLImage` is now officially deprecated.

---

## Tooling and package ecosystem

### ESLint
`@exadel/eslint-config-esl` now includes embedded support for ESL custom linting.

For most projects, the upgrade direction is simple:
- keep the config package,
- stop depending on the old standalone `@exadel/eslint-plugin-esl` setup.

### Stylelint
`@exadel/stylelint-config-esl` is now aligned with Stylelint 17.

If your project pins older Stylelint behavior, review local overrides before upgrading.

### Website e2e
The legacy snapshot-based website test flow is replaced with the Playwright-based `@exadel/esl-website-e2e` module.

This mainly affects maintainers of the ESL site and release pipeline rather than downstream consumers.

### UI Playground versioning
UI Playground jumps from `1.0.0` to `6.0.0` as a one-time alignment step with the monorepo release line.

This does **not** mean the project suddenly accumulated five major rounds of breaking API changes.
It is a version alignment move, and public modules are expected to version more independently going forward.

---

## Suggested upgrade checklist

- [ ] replace `evaluate` usage
- [ ] review `@jsonAttr` values for expression-like syntax
- [ ] update popup alignment attributes
- [ ] migrate anchor-nav selector configuration to `anchor-selector`
- [ ] replace `ESLNoteIgnore.noteSelector` with `noteTag`
- [ ] review `ESLToggleableManager` imports / naming
- [ ] remove deprecated util aliases and retired helpers
- [ ] switch to `@exadel/eslint-config-esl` if still using the old ESL lint-plugin migration flow
- [ ] plan to move away from `ESLImage` toward native images plus `esl-image-utils` where ESL sugar is still useful

---

## Looking beyond v6

A few adjacent streams are already in progress, but they should be treated as **next-step platform work**, not as shipped v6 features:
- AI Skills on the ESL site and broader agent-oriented library adaptation;
- TypeScript 6 migration;
- cleaner CSS asset distribution on the path to v7.

In that sense, ESL 6.0.0 is both a release and a reset: it removes accumulated compatibility burden so the next iterations can move faster.

