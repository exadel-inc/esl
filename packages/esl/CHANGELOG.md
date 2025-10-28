## 5.15.1 (2025-10-28)

This was a version bump only for esl to align it with other projects, there were no code changes.

## 5.15.0 (2025-10-22)

### 🚀 Features

- **esl-carousel:** add esl carousel info element helper ([f162d2a5a](https://github.com/exadel-inc/esl/commit/f162d2a5a))
- **esl-carousel:** add ability to check if the passed target is current + `current` marker support for esl-carousel-nav mixin ([57bb690c1](https://github.com/exadel-inc/esl/commit/57bb690c1))

### 🩹 Fixes

- **esl-popup:** fix race condition in ESLPopup when rapidly toggling state ([6816150fd](https://github.com/exadel-inc/esl/commit/6816150fd))

## 5.14.0 (2025-09-30)

### 🚀 Features

- **esl-carousel:** introduce capabilities to provide custom autoplay restrictions. Resolves #3349 ([#3349](https://github.com/exadel-inc/esl/issues/3349))
- introduce ESLIntrinsicElements ESL custom tag jsx declaration interface ([8b053737b](https://github.com/exadel-inc/esl/commit/8b053737b))

### 🩹 Fixes

- **esl-utils:** handle empty eventName in dispatch function ([8821c837a](https://github.com/exadel-inc/esl/commit/8821c837a))
- **esl-trigger:** update esl-base-trigger and it's instances to dispatch `esl:change:action` ([e1b84e326](https://github.com/exadel-inc/esl/commit/e1b84e326))

### 💅 Refactors

- **eslint-config:** has embedded support of esl/custom linting ([1417150d8](https://github.com/exadel-inc/esl/commit/1417150d8))
- rename some Shape types declarations for consistency ([6e709d0d6](https://github.com/exadel-inc/esl/commit/6e709d0d6))
- introduce global ESLIntrinsicElements interface ([fe64e7871](https://github.com/exadel-inc/esl/commit/fe64e7871))
- **ui-playground:** migrate UIP project to latest (8) JSX-DOM ([5275cb787](https://github.com/exadel-inc/esl/commit/5275cb787))
- **site:** add playground description ([e83a7eb79](https://github.com/exadel-inc/esl/commit/e83a7eb79))
- **site:** playground navigation ([772859d85](https://github.com/exadel-inc/esl/commit/772859d85))
- **site:** drop changes not related to playground readme ([c1a0a222e](https://github.com/exadel-inc/esl/commit/c1a0a222e))
- **site:** add playground section ([dbaf99955](https://github.com/exadel-inc/esl/commit/dbaf99955))

### Documentation updates

- **esl-utils:** update cumulative docs ([8ddf9d90e](https://github.com/exadel-inc/esl/commit/8ddf9d90e))
- **esl-utils:** add `@jsonAttr` decorator draft documentation ([c445edd61](https://github.com/exadel-inc/esl/commit/c445edd61))
- **esl-utils:** add `@listen` decorator documentation ([4f0e0eb15](https://github.com/exadel-inc/esl/commit/4f0e0eb15))
- **esl-utils:** add `@boolAttr` decorator documentation ([50be80d0c](https://github.com/exadel-inc/esl/commit/50be80d0c))
- **esl-utils:** add `@prop` decorator documentation ([ce08e6c28](https://github.com/exadel-inc/esl/commit/ce08e6c28))
- **esl-utils:** add `@decorate` decorator documentation ([be705918a](https://github.com/exadel-inc/esl/commit/be705918a))
- **esl-utils:** add `@ready` decorator documentation ([9c6bf404d](https://github.com/exadel-inc/esl/commit/9c6bf404d))
- **esl-utils:** add `@memoize` decorator documentation ([622d27c4b](https://github.com/exadel-inc/esl/commit/622d27c4b))
- **esl-utils:** add `@bind` decorator documentation ([f5e2a75cb](https://github.com/exadel-inc/esl/commit/f5e2a75cb))
- **esl-utils:** add `@safe` decorator documentation ([4e4c73551](https://github.com/exadel-inc/esl/commit/4e4c73551))
- add detailed TSX support guide ([dee009e76](https://github.com/exadel-inc/esl/commit/dee009e76))

## 5.13.0 (2025-09-05)

### 🚀 Features

- **esl-carousel:** add ability to define interaction scope, fix initial checks to prevent autoplay on hover/focus after state change ([a5c1953ff](https://github.com/exadel-inc/esl/commit/a5c1953ff))
- **esl-utils:** add `@safe` decorator for error handling with fallback support ([f9754b7c8](https://github.com/exadel-inc/esl/commit/f9754b7c8))
- **esl-media-query:** add an empty ruleset `ESLMediaRuleList.EMPTY`, update error message and type for `parse` and `parseTuple` ([94e82f2c6](https://github.com/exadel-inc/esl/commit/94e82f2c6))
- **esl-event-listener:** introduce `TypedTarget` interface ([f1be1b8fc](https://github.com/exadel-inc/esl/commit/f1be1b8fc))
- **esl-event-listener:** strict types for typed EventTargets ([6035e28f7](https://github.com/exadel-inc/esl/commit/6035e28f7))
- **esl-event-listener:** strict types for SyntheticEventTarget ([fa0cd867d](https://github.com/exadel-inc/esl/commit/fa0cd867d))
- **esl-event-listener:** implement correct multi-event support with restrictive EventTarget ([563f53b9d](https://github.com/exadel-inc/esl/commit/563f53b9d))

### 🩹 Fixes

- **esl-event-listener:** fix `ESLEventListener.subscribe` types to correctly differentiate criteria from handler instance ([efa047e3e](https://github.com/exadel-inc/esl/commit/efa047e3e))

### 💅 Refactors

- **esl-carousel:** esl-carousel-autoplay internal API and state machine completely reworked ([2b8b7a4f3](https://github.com/exadel-inc/esl/commit/2b8b7a4f3))
- **esl-carousel:** improve error handling for media query based params ([a83e7ff36](https://github.com/exadel-inc/esl/commit/a83e7ff36))
- **esl-line-clamp:** improve error handling for media query based params ([0fbccdd1a](https://github.com/exadel-inc/esl/commit/0fbccdd1a))

## 5.12.0 (2025-08-29)

### 🚀 Features

- **esl-line-clamp:** add an attribute to specify mask to use tuple string of values ([995b25cf4](https://github.com/exadel-inc/esl/commit/995b25cf4))
- **esl-utils:** `parseTime` will treat `none` as 0 (exclusion) ([e90035d65](https://github.com/exadel-inc/esl/commit/e90035d65))
- **esl-carousel:** rework esl-carousel-autoplay plugin to support pause on slides marked with 0 duration; turn autoplay to inactive state if the navigation command is not possible for current carousel state ([0356225b0](https://github.com/exadel-inc/esl/commit/0356225b0))
- **esl-toggleable:** add high priority for focusable elements with the autofocus attribute ([2e84cd4f7](https://github.com/exadel-inc/esl/commit/2e84cd4f7))
- **esl-animate:** added CSS variable for transition timing/function ([989374a41](https://github.com/exadel-inc/esl/commit/989374a41))
- **esl-line-clamp:** add auto mode for esl-line-clamp mixin ([cdd46db03](https://github.com/exadel-inc/esl/commit/cdd46db03))

### 🩹 Fixes

- **esl-utils:** add tests and validation to prevent prototype pollution (CWE-1321) for `set` and `setByPath` utils ([bee0378e1](https://github.com/exadel-inc/esl/commit/bee0378e1))
- **esl-line-clamp:** fix styles of esl-line-clamp mixin ([2e5796321](https://github.com/exadel-inc/esl/commit/2e5796321))
- `esl` package should contain actual version info in global scope ([23fb7686f](https://github.com/exadel-inc/esl/commit/23fb7686f))

### 💅 Refactors

- **esl-carousel:** fix typos in JSDocs ([199b8ad63](https://github.com/exadel-inc/esl/commit/199b8ad63))
- **esl-toggleable:** change the way of detecting auto-focusable element ([87daaa878](https://github.com/exadel-inc/esl/commit/87daaa878))

### Documentation updates

- **esl-line-clamp:** fix typo and inconsistencies ([6a4743e40](https://github.com/exadel-inc/esl/commit/6a4743e40))
- **esl-carousel:** update esl-carousel-autoplay documentation ([ea9e882cb](https://github.com/exadel-inc/esl/commit/ea9e882cb))
- **esl-line-clamp:** update README ([cadfb7a79](https://github.com/exadel-inc/esl/commit/cadfb7a79))
- **esl-line-clamp:** update README with auto mode ([3cf1b1fdd](https://github.com/exadel-inc/esl/commit/3cf1b1fdd))

## 5.11.0 (2025-08-15)

### 🚀 Features

- **esl-carousel:** add ability to define esl-carousel-autoplay plugin timeout per slide ([#3255](https://github.com/exadel-inc/esl/issues/3255))
- **ui-playground:** squashed ui-playground repository version https://github.com/exadel-inc/ui-playground.git ([c5856a4f0](https://github.com/exadel-inc/esl/commit/c5856a4f0))

### 🩹 Fixes

- **esl-carousel:** do not debug-log slide move if slide is actually just added ([dfbf1aab6](https://github.com/exadel-inc/esl/commit/dfbf1aab6))

### 💅 Refactors

- **esl-carousel:** cosmetic rename `direction` utility to `dir` to less mess-up with same property ([e4442690f](https://github.com/exadel-inc/esl/commit/e4442690f))
- **esl-event-listener:** declare type per custom event instance ([fa8de0086](https://github.com/exadel-inc/esl/commit/fa8de0086))

### Documentation updates

- fix qlty (coverage, maintainability) badges ([5700cd927](https://github.com/exadel-inc/esl/commit/5700cd927))
- **esl-carousel:** small improvements in documentation for `esl-carousel-autoplay-progress` ([562a4e7ce](https://github.com/exadel-inc/esl/commit/562a4e7ce))

## 5.10.0 (2025-07-28)

### 🚀 Features

- **esl-line-clamp:** introduce esl-line-clamp mixin to limit text content in the block ([fef05f07b](https://github.com/exadel-inc/esl/commit/fef05f07b))
- **deps:** bump @stylistic/stylelint-plugin from 3.1.3 to 4.0.0; the plugin now requires stylelint version 16.22.0 or higher. ([#3261](https://github.com/exadel-inc/esl/pull/3261))
- **esl-utils:** introduce common TS type utils file ([c962eb353](https://github.com/exadel-inc/esl/commit/c962eb353))
- **esl-event-listener:** introduce improve ESLEventUtils event type handling ([de4217fb1](https://github.com/exadel-inc/esl/commit/de4217fb1))

### 🩹 Fixes

- **esl-carousel:** fix wheel event handling (wheel ignores next slide direction) ([#3260](https://github.com/exadel-inc/esl/issues/3260))
- **esl-event-listener:** fix missing event type definitions for custom event targets ([bd5c8ba16](https://github.com/exadel-inc/esl/commit/bd5c8ba16))

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.9.1](https://github.com/exadel-inc/esl/compare/v5.9.0...v5.9.1) (2025-07-22)


### Bug Fixes

* **esl-media:** fix user detection to treat stop by ending as system command ([ad6ee44](https://github.com/exadel-inc/esl/commit/ad6ee44f340228a704baba1e01cd435067ae87a3))





# [5.9.0](https://github.com/exadel-inc/esl/compare/v5.8.1...v5.9.0) (2025-07-10)


### Bug Fixes

* **esl-carousel:** fix missing activators for build-in plugins ([f133dbe](https://github.com/exadel-inc/esl/commit/f133dbebe0c1182c434461b2aab088fd8e86e9a2))
* **esl-media:** fix ESLMedia play-in-viewport observes viewport intersection ratio threshold incorrectly ([1df78c6](https://github.com/exadel-inc/esl/commit/1df78c6d57a4cd1f5ca0eeb0902b4ac2efd2e53d))
* **esl-popup:** fix ESLPopup is still visible when the trigger is outside the viewport ([e17823e](https://github.com/exadel-inc/esl/commit/e17823e23987048db72cae21f4426cdf92e84402))
* **esl-toggleable:** fix a11y warning of trying to focus hidden element (happens due to collision issue of focus & task queries) ([f41bd46](https://github.com/exadel-inc/esl/commit/f41bd469620f3603c702ad61fc2ad1b59d74b1bb))


### Features

* **esl-carousel:** add out of the box viewport visibility control for ESL Carousel autoplay plugin ([f7a9feb](https://github.com/exadel-inc/esl/commit/f7a9feb1ec504e86c7cd958ced5ac6cee5f0dca1)), closes [#3190](https://github.com/exadel-inc/esl/issues/3190)
* **esl-carousel:** extended esl-carousel-wheel implementation ([f48eda4](https://github.com/exadel-inc/esl/commit/f48eda48f9b604bdac1ed03056b02aa6a82b9595))
* **esl-carousel:** implement updated `esl-carousel-relate-to` plugin that follows specification and expected flow ([0a23b82](https://github.com/exadel-inc/esl/commit/0a23b82f39f816007878a4215da5b33e0d9f362f))
* **esl-carousel:** introduce non-bubbling move event for esl-carousel ([37480c9](https://github.com/exadel-inc/esl/commit/37480c9de016a6b9e4babcd8ec1272b1d1839052))
* **esl-carousel:** major rework state API to use `ESLCarouselRenderer` instance ([9849a1f](https://github.com/exadel-inc/esl/commit/9849a1f19c5879bb5d53b7c4b00c8dc40c3cba53))
* **esl-carousel:** move stage offset to public ESL Carousel navigation API ([d4ce7b6](https://github.com/exadel-inc/esl/commit/d4ce7b64e4589ce6f36aa47f747183dca3604547))
* **esl-carousel:** update carousel nav syntax according spec (more clear behaviour) ([a7b9f08](https://github.com/exadel-inc/esl/commit/a7b9f08143a25818ff9f83796003a977c960066f))
* **esl-carousel:** update index processing to use 1-based indexing for prefixed requests, add correct out of bounds/invalid requests handling ([8421f90](https://github.com/exadel-inc/esl/commit/8421f90699af6ab7aa2bf943c39eb5c6ceb153e6))
* **esl-media:** extend `play-in-viewport` by two options ([28081f5](https://github.com/exadel-inc/esl/commit/28081f5dfd1ce9fd0616135ef8f4af4d5b77f14a))
* **esl-trigger:** esl-base-trigger based elements now stops handled `click` and `keydown` events bubbling by default ([1618a5f](https://github.com/exadel-inc/esl/commit/1618a5f261e573615f041d9475ec608aa85044cf))





## [5.8.1](https://github.com/exadel-inc/esl/compare/v5.8.0...v5.8.1) (2025-06-26)


### Bug Fixes

* **esl-mixin-element:** fix ESLMixinRegistry instance duplicate due to creation in separate context ([52f661e](https://github.com/exadel-inc/esl/commit/52f661e5bfbe1089d17ff61ecce89f977f312f98))





# [5.8.0](https://github.com/exadel-inc/esl/compare/v5.7.1...v5.8.0) (2025-06-16)


### Bug Fixes

* **esl-carousel:** fix `esl-carousel-relate-to` plugin to correctly handle proactive action (including updated events API) ([b189b01](https://github.com/exadel-inc/esl/commit/b189b01f9462d78cd18e281f268b8389cc6b4837))
* **esl-carousel:** fix carousel renderer flow to prevent pre-active markers before lock check + logic generalization ([b658df5](https://github.com/exadel-inc/esl/commit/b658df56b2e879e41b8f3cd87da8d1883a0d79f3))


### Features

* add `ESL.version` to "open" mode of ESL package ([588d837](https://github.com/exadel-inc/esl/commit/588d837f20f1b33873e99fe6159bb846809aaa6a))
* **esl-carousel:** rework events API to have both proactive and final event being dispatched during move/commit operations; `pre-active` slides now processed equal during move operation for renderers; `pre-active` marker can not be applied to `active` slide ([4477cce](https://github.com/exadel-inc/esl/commit/4477cce7e36f1a97623e0a3357293e977bf3c9f9))
* **esl-carousel:** support for proactive `container-class` handling using 'esl-carousel-class-behavior' plugin ([152a9fe](https://github.com/exadel-inc/esl/commit/152a9fe909a398f268dc5de8c6bd136ae7733d30))
* **esl-tab:** default `no-target` attribute styles to hide inactive tab ([1198795](https://github.com/exadel-inc/esl/commit/1198795c6697e3c3303bf17dd483c725d0b3e6e9))
* **esl-trigger:** `no-target` attribute support out of the box, no console warning (default 'disabled' styles) ([fc78f25](https://github.com/exadel-inc/esl/commit/fc78f250562b27604623c4a65237dc5571958806))





## [5.7.1](https://github.com/exadel-inc/esl/compare/v5.7.0...v5.7.1) (2025-06-10)


### Bug Fixes

* **esl-media-query:** fix singleton storage for ESLMediaShortcuts + add shortcut name validation ([76dbf6e](https://github.com/exadel-inc/esl/commit/76dbf6e7463978895c0a5481a80e3416190b088a))
* fix all private symbols across library to be multi-bundeled-prof ([c072818](https://github.com/exadel-inc/esl/commit/c07281805d42d53ecca4b57cc0c9adc137ecc488))





# [5.7.0](https://github.com/exadel-inc/esl/compare/v5.6.0...v5.7.0) (2025-06-09)


### Bug Fixes

* **esl-carousel:** fix incorrect `canNavigate` behaviour for undefined direction navigation (equal distance for both direction to reach the target slide) ([34a70fa](https://github.com/exadel-inc/esl/commit/34a70fab80f92d1f8572bbf219d5546d7164ceb8))
* **esl-carousel:** improve collision handling, introduce special type of Error - ESLCarouselNavRejection it represents renderer rejection but not produce noisy log in console ([b02207a](https://github.com/exadel-inc/esl/commit/b02207a001a7f83cb60bf6dca9bc8bbc6e803f63))


### Features

* **esl-media-query:** new ESLMediaShortcuts introduced (instead of ESLEnvShortcuts) with support for dynamic media conditions ([369cc7c](https://github.com/exadel-inc/esl/commit/369cc7c583436c4f0588f2df3e909e94691aa3db))





# [5.6.0](https://github.com/exadel-inc/esl/compare/v5.5.0...v5.6.0) (2025-06-03)


### Features

* **esl-carousel:** rework default process of esl-carousel CSS renderer to use auto-height ([f856548](https://github.com/exadel-inc/esl/commit/f8565488406891c618730d054098cfde86ed68d9))





# [5.5.0](https://github.com/exadel-inc/esl/compare/v5.4.0...v5.5.0) (2025-06-02)


### Bug Fixes

* **esl-animate:** fix esl-animate does not work with repeat + ratio 1 ([3ff2221](https://github.com/exadel-inc/esl/commit/3ff222138ed3baaecf54ffe191920c416c3e8f9b))
* **esl-carousel:** clear error response and validation for `goTo` carousel method ([6b1a20d](https://github.com/exadel-inc/esl/commit/6b1a20d82bcee879e309cb95d071ea1c3bc64c1a))
* **esl-carousel:** fix carousel plugin attribute parsing (affects autoplay and wheel plugins) ([6437eaf](https://github.com/exadel-inc/esl/commit/6437eaf5925f9923950e3aaf5cab461093005f11))
* **esl-carousel:** optimize carousel plugins config memoizing flow (affects touch, wheel, autoplay) ([a548d87](https://github.com/exadel-inc/esl/commit/a548d87fbf835a229b69a67158ed6e31c256a534))
* **esl-utils:** simplify `parseTime` method, allow to pass number type ([162ba65](https://github.com/exadel-inc/esl/commit/162ba658b89f024d243f3bf98ef29cae588f81ec))


### Features

* **esl-carousel:** `esl-carousel-autoplay` plugin full support ([e32fce8](https://github.com/exadel-inc/esl/commit/e32fce8b6f0315fdaa6804e3238db010906f4fa2))
* **esl-carousel:** CSS renderer base implementation ([0a825fa](https://github.com/exadel-inc/esl/commit/0a825fa0f5a444f629fa8240ac4cfa91fc542dc7))
* **esl-carousel:** introduce CSS based carousel animation time ([6667d87](https://github.com/exadel-inc/esl/commit/6667d87a897230f755dd534d622df8022e600398))
* **esl-carousel:** introduce separate CSS based renderers (slide and fade one) ([6f9eb35](https://github.com/exadel-inc/esl/commit/6f9eb35ee73e6ca4eb30e67f0ad571ad9305e132))





# [5.4.0](https://github.com/exadel-inc/esl/compare/v5.3.2...v5.4.0) (2025-04-28)

**Note:** Version bump only for package @exadel/esl





## [5.3.2](https://github.com/exadel-inc/esl/compare/v5.3.1...v5.3.2) (2025-04-09)

**Note:** Version bump only for package @exadel/esl





## [5.3.1](https://github.com/exadel-inc/esl/compare/v5.3.0...v5.3.1) (2025-03-26)


### Bug Fixes

* fix missing README file ([a827954](https://github.com/exadel-inc/esl/commit/a8279548cb159ebe78b33742d02f8aacf9ec77fc))





# [5.3.0](https://github.com/exadel-inc/esl/compare/v5.2.0...v5.3.0) (2025-03-26)


### Bug Fixes

* **esl-utils:** deprecate `isBot` utility and remove 'bot' shortcut from ESLMediaQuery support ([#3012](https://github.com/exadel-inc/esl/issues/3012)) ([6fd7732](https://github.com/exadel-inc/esl/commit/6fd7732a6fc4ffc3e9c2a037ed1d9f280c3a7e3a)), closes [#2996](https://github.com/exadel-inc/esl/issues/2996)


### Features

* ESL repository migrated to classic monorepo structure; all processes now managed trough lerna ([f242051](https://github.com/exadel-inc/esl/commit/f242051df0dcc5a3562007cadf98c85344ed7eeb))
