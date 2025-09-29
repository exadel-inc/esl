## 5.14.0-beta.1 (2025-09-29)

### 🚀 Features

- **esl-carousel:** update carousel API configurations to rely on `parseObjectSafe` ([f2dbb7a90](https://github.com/exadel-inc/esl/commit/f2dbb7a90))
- **esl-drag-to-scroll:** update mixin value parser to use 'parseObjectSafe' ([601807ebe](https://github.com/exadel-inc/esl/commit/601807ebe))
- **esl-media:** update 'esl-media-control' mixin value parser to use 'parseObjectSafe' ([92eaf0a7f](https://github.com/exadel-inc/esl/commit/92eaf0a7f))
- **esl-popup:** rework of popup alignment attributes BREAKING CHANGES: `margin-arrow` attribute replaced with `margin-tether` and 'offset-arrow' attribute replaced with `alignment-tether` ([4a2c69239](https://github.com/exadel-inc/esl/commit/4a2c69239))
- **esl-utils:** `parseObject` safe utility added to replace unsafe evaluate method, and unlock short syntax in future ([d14480435](https://github.com/exadel-inc/esl/commit/d14480435))
- **esl-utils:** add `parseObjectSafe` wrapper of `parseObject` with fallback value for parse error ([afe489518](https://github.com/exadel-inc/esl/commit/afe489518))
- ⚠️  **esl-utils:** migrate `@jsonAttr` decorator to use `parseObject` under the hood ([07bd83667](https://github.com/exadel-inc/esl/commit/07bd83667))
- ⚠️  **esl-utils:** replace  `ESLMediaRuleList.OBJECT_PARSER` with a parseObjectSafe reference ([0df811e55](https://github.com/exadel-inc/esl/commit/0df811e55))
- ⚠️  **eslint-config:** has embedded support of esl/custom linting ([452669ada](https://github.com/exadel-inc/esl/commit/452669ada))
- **ui-playground:** default attribute settings ([7ee27aad1](https://github.com/exadel-inc/esl/commit/7ee27aad1))

### 💅 Refactors

- ⚠️  remove deprecated properties and methods across ESL ([e36e19f56](https://github.com/exadel-inc/esl/commit/e36e19f56))
- **esl-popup:** split calcPopupPositionByMinorAxis to several methods ([c67e0cafe](https://github.com/exadel-inc/esl/commit/c67e0cafe))
- ⚠️  **esl-utils:** remove deprecated 'evaluate' utility (resolves CWE-95 / CWE-94) ([17f101eb0](https://github.com/exadel-inc/esl/commit/17f101eb0))
- **site:** playground home page ([7b71b9f15](https://github.com/exadel-inc/esl/commit/7b71b9f15))
- **site:** playground demo logo update ([62d1d8b34](https://github.com/exadel-inc/esl/commit/62d1d8b34))

### Documentation updates

- **esl-popup:** update README with new alignment attributes ([f3accbe92](https://github.com/exadel-inc/esl/commit/f3accbe92))
- **esl-utils:** add `@safe` decorator documentation ([4e4c73551](https://github.com/exadel-inc/esl/commit/4e4c73551))
- **esl-utils:** add `@bind` decorator documentation ([f5e2a75cb](https://github.com/exadel-inc/esl/commit/f5e2a75cb))
- **esl-utils:** add `@memoize` decorator documentation ([622d27c4b](https://github.com/exadel-inc/esl/commit/622d27c4b))
- **esl-utils:** add `@ready` decorator documentation ([9c6bf404d](https://github.com/exadel-inc/esl/commit/9c6bf404d))
- **esl-utils:** add `@decorate` decorator documentation ([be705918a](https://github.com/exadel-inc/esl/commit/be705918a))
- **esl-utils:** add `@prop` decorator documentation ([ce08e6c28](https://github.com/exadel-inc/esl/commit/ce08e6c28))
- **esl-utils:** add `@boolAttr` decorator documentation ([50be80d0c](https://github.com/exadel-inc/esl/commit/50be80d0c))
- **esl-utils:** add `@listen` decorator documentation ([4f0e0eb15](https://github.com/exadel-inc/esl/commit/4f0e0eb15))
- **esl-utils:** add `@jsonAttr` decorator draft documentation ([c445edd61](https://github.com/exadel-inc/esl/commit/c445edd61))
- **esl-utils:** update cumulative docs ([8ddf9d90e](https://github.com/exadel-inc/esl/commit/8ddf9d90e))
- **site:** add detailed site ESL TS Decorators documentation ([e792a2e57](https://github.com/exadel-inc/esl/commit/e792a2e57))

### ⚠️  Breaking Changes

- **eslint-config:** the `@exadel/eslint-plugin-esl` no longer required and out of support, use `@exadel/eslint-config-esl` capabilities instead
- `ESLAlert.defaultConfig` removed (use `ESLAlert.DEFAULT_PARAMS` instead)
- **esl-utils:** the `evaluate` utility no longer available, use `parseObject` or `JSON.parse` instead for object parers
- **esl-utils:** the `ESLMediaRuleList.OBJECT_PARSER` no longer support calculations or references inside values (these were never officially supported). If you need dynamic behavior, use custom parsers instead.
- **esl-utils:** `@jsonAttr`-based attributes no longer support calculations or references inside values (these were never officially supported). If you need dynamic behavior, make sure to override component config resolvers.

## 5.14.0-beta.0 (2025-09-19)

### 🚀 Features

- remove deprecated alias for ActionParams on ESLAlert, ESLPanel, ESLPopup, ESLTooltip ([4c9972092](https://github.com/exadel-inc/esl/commit/4c9972092))
- introduce ESLIntrinsicElements ESL custom tag jsx declaration interface ([8b053737b](https://github.com/exadel-inc/esl/commit/8b053737b))
- **esl-carousel:** introduce capabilities to provide custom autoplay restrictions. Resolves #3349 ([#3349](https://github.com/exadel-inc/esl/issues/3349))
- **esl-popup:** introduce config prop for easily accessing params of popup ([2252767c5](https://github.com/exadel-inc/esl/commit/2252767c5))

### 🩹 Fixes

- **esl-trigger:** update esl-base-trigger and it's instances to dispatch `esl:change:action` ([e1b84e326](https://github.com/exadel-inc/esl/commit/e1b84e326))
- **esl-utils:** handle empty eventName in dispatch function ([8821c837a](https://github.com/exadel-inc/esl/commit/8821c837a))

### 💅 Refactors

- introduce global ESLIntrinsicElements interface ([fe64e7871](https://github.com/exadel-inc/esl/commit/fe64e7871))
- rename some Shape types declarations for consistency ([6e709d0d6](https://github.com/exadel-inc/esl/commit/6e709d0d6))
- **esl-popup:** clearing params on popup hide ([89884d581](https://github.com/exadel-inc/esl/commit/89884d581))
- **site:** add playground section ([dbaf99955](https://github.com/exadel-inc/esl/commit/dbaf99955))
- **site:** add rulers in sidebar ([54454cc1a](https://github.com/exadel-inc/esl/commit/54454cc1a))
- **site:** add automated brakpoints on sidebar, adjust playground examples ([fdd2aebfc](https://github.com/exadel-inc/esl/commit/fdd2aebfc))
- **site:** drop changes not related to playground readme ([c1a0a222e](https://github.com/exadel-inc/esl/commit/c1a0a222e))
- **site:** remove unused tags ([05c77d33f](https://github.com/exadel-inc/esl/commit/05c77d33f))
- **site:** remove unused images ([6d62abf25](https://github.com/exadel-inc/esl/commit/6d62abf25))
- **site:** add empty line ([1c77e2f7f](https://github.com/exadel-inc/esl/commit/1c77e2f7f))
- **site:** remove unused sidebar logo ([1c676738f](https://github.com/exadel-inc/esl/commit/1c676738f))
- **site:** playground navigation ([772859d85](https://github.com/exadel-inc/esl/commit/772859d85))
- **site:** add playground description ([e83a7eb79](https://github.com/exadel-inc/esl/commit/e83a7eb79))
- **site:** move header titles to the actual collection ([f780c38db](https://github.com/exadel-inc/esl/commit/f780c38db))
- **ui-playground:** migrate UIP project to latest (8) JSX-DOM ([5275cb787](https://github.com/exadel-inc/esl/commit/5275cb787))

### Documentation updates

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

- **esl-animate:** added CSS variable for transition timing/function ([989374a41](https://github.com/exadel-inc/esl/commit/989374a41))
- **esl-carousel:** rework esl-carousel-autoplay plugin to support pause on slides marked with 0 duration; turn autoplay to inactive state if the navigation command is not possible for current carousel state ([0356225b0](https://github.com/exadel-inc/esl/commit/0356225b0))
- **esl-line-clamp:** add auto mode for esl-line-clamp mixin ([cdd46db03](https://github.com/exadel-inc/esl/commit/cdd46db03))
- **esl-line-clamp:** add an attribute to specify mask to use tuple string of values ([995b25cf4](https://github.com/exadel-inc/esl/commit/995b25cf4))
- **esl-toggleable:** add high priority for focusable elements with the autofocus attribute ([2e84cd4f7](https://github.com/exadel-inc/esl/commit/2e84cd4f7))
- **esl-utils:** `parseTime` will treat `none` as 0 (exclusion) ([e90035d65](https://github.com/exadel-inc/esl/commit/e90035d65))

### 🩹 Fixes

- `esl` package should contain actual version info in global scope ([23fb7686f](https://github.com/exadel-inc/esl/commit/23fb7686f))
- **esl-line-clamp:** fix styles of esl-line-clamp mixin ([2e5796321](https://github.com/exadel-inc/esl/commit/2e5796321))
- **esl-utils:** add tests and validation to prevent prototype pollution (CWE-1321) for `set` and `setByPath` utils ([bee0378e1](https://github.com/exadel-inc/esl/commit/bee0378e1))

### 💅 Refactors

- **esl-carousel:** fix typos in JSDocs ([199b8ad63](https://github.com/exadel-inc/esl/commit/199b8ad63))
- **esl-toggleable:** change the way of detecting auto-focusable element ([87daaa878](https://github.com/exadel-inc/esl/commit/87daaa878))

### Documentation updates

- **esl-carousel:** update esl-carousel-autoplay documentation ([ea9e882cb](https://github.com/exadel-inc/esl/commit/ea9e882cb))
- **esl-line-clamp:** update README with auto mode ([3cf1b1fdd](https://github.com/exadel-inc/esl/commit/3cf1b1fdd))
- **esl-line-clamp:** update README ([cadfb7a79](https://github.com/exadel-inc/esl/commit/cadfb7a79))
- **esl-line-clamp:** fix typo and inconsistencies ([6a4743e40](https://github.com/exadel-inc/esl/commit/6a4743e40))

## 5.11.0 (2025-08-15)

### 🚀 Features

- **esl-carousel:** add ability to define esl-carousel-autoplay plugin timeout per slide ([#3255](https://github.com/exadel-inc/esl/issues/3255))
- **eslint-config:** extend test rules to `*.test-d.ts` files (type tests) ([10922c9ec](https://github.com/exadel-inc/esl/commit/10922c9ec))
- **ui-playground:** squashed ui-playground repository version https://github.com/exadel-inc/ui-playground.git ([c5856a4f0](https://github.com/exadel-inc/esl/commit/c5856a4f0))

### 🩹 Fixes

- **esl-carousel:** do not debug-log slide move if slide is actually just added ([dfbf1aab6](https://github.com/exadel-inc/esl/commit/dfbf1aab6))

### 💅 Refactors

- **esl-carousel:** cosmetic rename `direction` utility to `dir` to less mess-up with same property ([e4442690f](https://github.com/exadel-inc/esl/commit/e4442690f))
- **esl-event-listener:** declare type per custom event instance ([fa8de0086](https://github.com/exadel-inc/esl/commit/fa8de0086))
- **site:** update site example for esl-carousel-autoplay plugin ([f5b0aaead](https://github.com/exadel-inc/esl/commit/f5b0aaead))
- **site:** news section labels refresh ([01912dfec](https://github.com/exadel-inc/esl/commit/01912dfec))
- **site:** refactor new label with mixin approach ([51a27fff2](https://github.com/exadel-inc/esl/commit/51a27fff2))
- **site:** add empty space at news title end ([1d6bee779](https://github.com/exadel-inc/esl/commit/1d6bee779))

### Documentation updates

- fix qlty (coverage, maintainability) badges ([5700cd927](https://github.com/exadel-inc/esl/commit/5700cd927))
- **esl-carousel:** small improvements in documentation for `esl-carousel-autoplay-progress` ([562a4e7ce](https://github.com/exadel-inc/esl/commit/562a4e7ce))

## 5.10.0 (2025-07-28)

### 🚀 Features

- **deps:** bump @stylistic/stylelint-plugin from 3.1.3 to 4.0.0; the plugin now requires stylelint version 16.22.0 or higher. ([#3261](https://github.com/exadel-inc/esl/pull/3261))
- **esl-event-listener:** introduce improve ESLEventUtils event type handling ([de4217fb1](https://github.com/exadel-inc/esl/commit/de4217fb1))
- **esl-line-clamp:** introduce esl-line-clamp mixin to limit text content in the block ([fef05f07b](https://github.com/exadel-inc/esl/commit/fef05f07b))
- **esl-utils:** introduce common TS type utils file ([c962eb353](https://github.com/exadel-inc/esl/commit/c962eb353))

### 🩹 Fixes

- **esl-carousel:** fix wheel event handling (wheel ignores next slide direction) ([#3260](https://github.com/exadel-inc/esl/issues/3260))
- **esl-event-listener:** fix missing event type definitions for custom event targets ([bd5c8ba16](https://github.com/exadel-inc/esl/commit/bd5c8ba16))

## 5.9.1 (2025-07-22)


### Bug Fixes

* **esl-media:** fix user detection to treat stop by ending as system command ([ad6ee44](https://github.com/exadel-inc/esl/commit/ad6ee44f340228a704baba1e01cd435067ae87a3))



## 5.9.0 (2025-07-10)


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



## 5.8.1 (2025-06-26)


### Bug Fixes

* **esl-mixin-element:** fix ESLMixinRegistry instance duplicate due to creation in separate context ([52f661e](https://github.com/exadel-inc/esl/commit/52f661e5bfbe1089d17ff61ecce89f977f312f98))





## 5.8.0 (2025-06-16)


### Bug Fixes

* **esl-carousel:** fix `esl-carousel-relate-to` plugin to correctly handle proactive action (including updated events API) ([b189b01](https://github.com/exadel-inc/esl/commit/b189b01f9462d78cd18e281f268b8389cc6b4837))
* **esl-carousel:** fix carousel renderer flow to prevent pre-active markers before lock check + logic generalization ([b658df5](https://github.com/exadel-inc/esl/commit/b658df56b2e879e41b8f3cd87da8d1883a0d79f3))
* **eslint-config:** replace @stylistic/eslint-plugin-jsx rules with @stylistic/eslint-plugin embedded jsx support ([152d284](https://github.com/exadel-inc/esl/commit/152d28405f4341d164a004f5f117b63edebb2126))


### Features

* add `ESL.version` to "open" mode of ESL package ([588d837](https://github.com/exadel-inc/esl/commit/588d837f20f1b33873e99fe6159bb846809aaa6a))
* **esl-carousel:** rework events API to have both proactive and final event being dispatched during move/commit operations; `pre-active` slides now processed equal during move operation for renderers; `pre-active` marker can not be applied to `active` slide ([4477cce](https://github.com/exadel-inc/esl/commit/4477cce7e36f1a97623e0a3357293e977bf3c9f9))
* **esl-carousel:** support for proactive `container-class` handling using 'esl-carousel-class-behavior' plugin ([152a9fe](https://github.com/exadel-inc/esl/commit/152a9fe909a398f268dc5de8c6bd136ae7733d30))
* **esl-tab:** default `no-target` attribute styles to hide inactive tab ([1198795](https://github.com/exadel-inc/esl/commit/1198795c6697e3c3303bf17dd483c725d0b3e6e9))
* **esl-trigger:** `no-target` attribute support out of the box, no console warning (default 'disabled' styles) ([fc78f25](https://github.com/exadel-inc/esl/commit/fc78f250562b27604623c4a65237dc5571958806))





## 5.7.1 (2025-06-10)


### Bug Fixes

* **esl-media-query:** fix singleton storage for ESLMediaShortcuts + add shortcut name validation ([76dbf6e](https://github.com/exadel-inc/esl/commit/76dbf6e7463978895c0a5481a80e3416190b088a))
* fix all private symbols across library to be multi-bundeled-prof ([c072818](https://github.com/exadel-inc/esl/commit/c07281805d42d53ecca4b57cc0c9adc137ecc488))





## 5.7.0 (2025-06-09)


### Bug Fixes

* **esl-carousel:** fix incorrect `canNavigate` behaviour for undefined direction navigation (equal distance for both direction to reach the target slide) ([34a70fa](https://github.com/exadel-inc/esl/commit/34a70fab80f92d1f8572bbf219d5546d7164ceb8))
* **esl-carousel:** improve collision handling, introduce special type of Error - ESLCarouselNavRejection it represents renderer rejection but not produce noisy log in console ([b02207a](https://github.com/exadel-inc/esl/commit/b02207a001a7f83cb60bf6dca9bc8bbc6e803f63))


### Features

* **esl-media-query:** new ESLMediaShortcuts introduced (instead of ESLEnvShortcuts) with support for dynamic media conditions ([369cc7c](https://github.com/exadel-inc/esl/commit/369cc7c583436c4f0588f2df3e909e94691aa3db))





## 5.6.0 (2025-06-03)


### Features

* **esl-carousel:** rework default process of esl-carousel CSS renderer to use auto-height ([f856548](https://github.com/exadel-inc/esl/commit/f8565488406891c618730d054098cfde86ed68d9))





## 5.5.0 (2025-06-02)


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





## 5.4.0 (2025-04-28)


### Features

* **eslint-config:** replace `eslint-import-plugin-x` with `eslint-import-plugin` ([431d078](https://github.com/exadel-inc/esl/commit/431d0788c9302b09569420e00f22cf693a9236fc))





## 5.3.2 (2025-04-09)

Regular version bump for project dependencies





## 5.3.1 (2025-03-26)


### Bug Fixes

* fix missing README file ([a827954](https://github.com/exadel-inc/esl/commit/a8279548cb159ebe78b33742d02f8aacf9ec77fc))





## 5.3.0 (2025-03-26)


### Bug Fixes

* **esl-utils:** deprecate `isBot` utility and remove 'bot' shortcut from ESLMediaQuery support ([#3012](https://github.com/exadel-inc/esl/issues/3012)) ([6fd7732](https://github.com/exadel-inc/esl/commit/6fd7732a6fc4ffc3e9c2a037ed1d9f280c3a7e3a)), closes [#2996](https://github.com/exadel-inc/esl/issues/2996)
* **eslint-config:** fix import plugin configuration ([705dfd1](https://github.com/exadel-inc/esl/commit/705dfd15453252f866a064a2c3b00f81d3138a89))


### Features

* ESL repository migrated to classic monorepo structure; all processes now managed trough lerna ([f242051](https://github.com/exadel-inc/esl/commit/f242051df0dcc5a3562007cadf98c85344ed7eeb))





## 5.2.0 (2025-03-19)

### Features

* **esl-carousel:** ability to forbid slide reorder in the loop mode ([fcf0316](https://github.com/exadel-inc/esl/commit/fcf0316a9595e81f6af6844b8610cb57d1365b79))
* **esl-utils:** add `pick` method implementation to `esl-utils/misc/object` ([503ef52](https://github.com/exadel-inc/esl/commit/503ef52e23b4f5d6fc05700abc8fe68ce39cff3d))
* **esl-utils:** implement reusable `parseLazyAttr` method in `esl-utils/misc/format` ([22518ab](https://github.com/exadel-inc/esl/commit/22518ab3df00884e2d4ac0e44325aed7e5c3df16))
* **eslint-config:** extend @exadel/eslint-config-esl defaults with sonarjs rules for all levels ([a6d433f](https://github.com/exadel-inc/esl/commit/a6d433f3b3a579dde917536fb8aa1e3657f51389))

### Bug Fixes

* **esl-carousel:** fix initial CLS for looped carousels ([f67f97b](https://github.com/exadel-inc/esl/commit/f67f97b810c0f02885a16da746b05b143eb2c6c4)), closes [#2879](https://github.com/exadel-inc/esl/issues/2879)
* **esl-media:** fix ESLMedia does not show preview on iOS Mobile devices ([241f0f7](https://github.com/exadel-inc/esl/commit/241f0f79ba8bc240121c7b57ae32c22bc83445e0))
* **esl-media:** rework native media settings applier, native video provider now supports `disablePictureInPicture` and `startTime` ([0c90b9c](https://github.com/exadel-inc/esl/commit/0c90b9c1402c102650648480419cdbab98bda0d2))
* **esl-media:** support for `disablePictureInPicture` in bightcove/iframe provider ([b0657b7](https://github.com/exadel-inc/esl/commit/b0657b7764d7288363e96c1af73bcb0bbbc6d0b7))
* **esl-media:** update config parser implementation, fix `lazy` attr parser, add `disablePictureInPicture` attribute support ([9e0a2eb](https://github.com/exadel-inc/esl/commit/9e0a2eb5e0e55188147b8649b3b861cb0224fe3d))
* **esl-scrollbar:** inconsistent dragging if target is `html` ([50a71ae](https://github.com/exadel-inc/esl/commit/50a71ae0a939888b8a49cab177b35613201c9207))
* **eslint-config:** replace legacy editorconfig-eslint-plugin with direct rules ([dc8853e](https://github.com/exadel-inc/esl/commit/dc8853e5545d35e3dec62c9847681385c169ef1e))
* **stylelint-config:** extend @exadel/stylelint-config-esl defaults with the primary rules ([5f53cb8](https://github.com/exadel-inc/esl/commit/5f53cb8aa25a5ccbdfc65158ea397fee30c0f29d))

## 5.1.0 (2025-03-05)

### Features

* **esl-lazy-template:** introducing `esl-lazy-template` mixin to load HTML parts lazy and asynchronous ([#2535](https://github.com/exadel-inc/esl/issues/2535)) ([344eb8c](https://github.com/exadel-inc/esl/commit/344eb8c133ce738c5ef28ab73b2e92e976aaf521))
* **esl-media:** `esl-media-control` mixin created to control and observe `esl-media` state ([60695cc](https://github.com/exadel-inc/esl/commit/60695ccdf9dddc08e947c99783fdb21d6b349d90)), closes [#2876](https://github.com/exadel-inc/esl/issues/2876)
* **esl-media:** `play-in-viewport` feature reworked to be more customizable ([3971eda](https://github.com/exadel-inc/esl/commit/3971eda571adcc711a44094e500541679858b18a))
* **esl-media:** add cancelable `esl:media:before:play` event-hook to control low-level play call, prevent unnecessary player command execution ([#2939](https://github.com/exadel-inc/esl/issues/2939)) ([39eb59e](https://github.com/exadel-inc/esl/commit/39eb59e208aa856a2463218c3495805f19c7b9d1))
* **esl-media:** observation for togglebale container state ([e66c384](https://github.com/exadel-inc/esl/commit/e66c3848e7b2c7ad68c6e0a1e11b667215a9ddde))
* **esl-utils:** RTL type detection removed as it is out of current browser support list ([#2913](https://github.com/exadel-inc/esl/issues/2913)) ([3974302](https://github.com/exadel-inc/esl/commit/397430299885f46f0bac4d15fc349050989afd86))
* **stylelint-config:** introducing `@exadel/stylelint-config-esl` instead of prettier ([db466d9](https://github.com/exadel-inc/esl/commit/db466d904f8b8f6f07eecf1b683ed5f04b87fa72))

### Bug Fixes

* **esl-event-listener:** fix `ESLEventUtils.subscribe(this)` does not subscribe descriptors if the host is function/class ([#2927](https://github.com/exadel-inc/esl/issues/2927)) ([010d3aa](https://github.com/exadel-inc/esl/commit/010d3aa18f9ca8ebd34594d60453dc102c40b9d2))
* **esl-media:** auto-init call for non-lazy players with play-in-viewport feature enabled ([d4a30ab](https://github.com/exadel-inc/esl/commit/d4a30ab3c54e5ad5284918790700c83d1b274c1b))
* **esl-media:** detect youtube provider stopped state ([#2918](https://github.com/exadel-inc/esl/issues/2918)) ([85da24f](https://github.com/exadel-inc/esl/commit/85da24ff3bb41e05a2e8582a1186c8706426972e))

## 5.0.1 (2025-02-05)

### Bug Fixes

* **esl-carousel:** ability to provide slide size fallback trough `--esl-slide-fallback-size` variable ([78ae62f](https://github.com/exadel-inc/esl/commit/78ae62f01ce651a24aa165115382ff13d96a0b84)), closes [#2879](https://github.com/exadel-inc/esl/issues/2879)
* **esl-carousel:** fix initial rendering layout shift to eliminate CLS degradation ([7d65335](https://github.com/exadel-inc/esl/commit/7d6533548545744502191b761773e6be9c5081eb)), closes [#2879](https://github.com/exadel-inc/esl/issues/2879)
* **esl-image-utils:** omit console warnings in case of missing inner image ([ca13a8a](https://github.com/exadel-inc/esl/commit/ca13a8a467b769240c7b5e9fd740c01bff75ef4e))
* **esl-media:** fix play preconditions for toggle method ([#2906](https://github.com/exadel-inc/esl/issues/2906)) ([1f7b8dc](https://github.com/exadel-inc/esl/commit/1f7b8dc82a4dfc156fb810a8c289afe0d1001f69))
* **esl-media:** postpone BrightcoveProvider ready state notification until metadata is available ([e3d4159](https://github.com/exadel-inc/esl/commit/e3d41590a93169168fe699e60fab1e7df6e56d1b))
* **eslint-plugin:** remove peer dependency for esl (handled via warnings) ([c06fbde](https://github.com/exadel-inc/esl/commit/c06fbdee050ff5608eda8d3e8bb8c4fba000b981))

## 5.0.1-beta.2 (2025-01-24)

### Bug Fixes

* **eslint-plugin:** remove peer dependency for esl (handled via warnings) ([c06fbde](https://github.com/exadel-inc/esl/commit/c06fbdee050ff5608eda8d3e8bb8c4fba000b981))

## 5.0.1-beta.1 (2025-01-24)

### Bug Fixes

* **esl-carousel:** ability to provide slide size fallback trough `--esl-slide-fallback-size` variable ([78ae62f](https://github.com/exadel-inc/esl/commit/78ae62f01ce651a24aa165115382ff13d96a0b84)), closes [#2879](https://github.com/exadel-inc/esl/issues/2879)
* **esl-carousel:** fix initial rendering layout shift to eliminate CLS degradation ([7d65335](https://github.com/exadel-inc/esl/commit/7d6533548545744502191b761773e6be9c5081eb)), closes [#2879](https://github.com/exadel-inc/esl/issues/2879)

## 5.0.0 (2025-01-17)
Note: 5.0.0 stable release is equal to 5.0.0-beta.45

### ⚠ BREAKING CHANGES
* Drop IE11 support ([6d376ee](https://github.com/exadel-inc/esl/commit/6d376ee2a6a77ddff4827cda454b61b60a690d8a))
* Drop Edge old versions (<14) support ([b577fd1](https://github.com/exadel-inc/esl/commit/b577fd1cc085a6a2c5fbdcfa97a5401e0ad7b259))
* Exclude duplicated exports of `esl-utils/decorators` from outer moules ([f6c84af](https://github.com/exadel-inc/esl/commit/f6c84afe00558346994d4220db69ac102ccba817))
* **esl-utils:** `TOUCH_EVENTS` from `device-detector` module retired, DeviceDetector is deprecated ([e9ed603](https://github.com/exadel-inc/esl/commit/e9ed603164f3cd913f6fe80027000f560aae454d))
* **esl-tooltip:** `disable-arrow` attribute removed from ESLTooltip component
* **esl-popup:** 'autofocus' no longer available for popup, use 'a11y' modes instead
* **esl-share:** `ESLSharePopup` no longer inherits `ESLTooltip`, `ESLPopup`
* **esl-tooltip:** `hasFocusLoop` no longer available use `a11y` instead
* **esl-footnotes:** `tooltip-shown` readonly attribute(prop) replaced with `active` (from `ESLBaseTrigger`)
* **esl-image:** legacy implementation of `esl-image` no longer distributes aspect-ratio styles
* **esl-utils:** `Rect` utility object now immutable from TS perspective
* **esl-utils:** both `DeviceDetector.TOUCH_EVENTS` and `TOUCH_EVENTS` are retired from `device-detector` module.
  Please also note that the DeviceDetector class is also deprecated.
* **esl-media:** `load-cls-target`, `load-cls-accepted` and `load-cls-declined` use `load-condition-class` and `load-condition-class-target` instead
* **esl-media:** `disabled` no longer supported use `lazy="manual"` instead
* `prop`, `attr`, `boolAttr`, `jsonAttr`, `listen` no longer available in `esl-base-element` and `esl-mixin-element` exports
* **esl-utils:** `createZIndexIframe` and `is-fixes` module no longer available due to drop of IE11 support
* **esl-utils:** `hasEventListener` no longer accepts min number value use `this.getEventListeners(type).length` to make extended checks
* **esl-utils:** `dispatchEvent` does not accepts target argument
* `ESLEventUtils.descriptors` alias of `ESLEventUtils.getAutoDescriptors` is no longer supported
* `EventUtils` alias of `ESLEventUtils` is no longer supported
* `esl-media-quey` module no longer supports `addListener` and `removeListener` shorthand
* `SynteticEventTarget` no longer supports `addListener` and `removeListener` shorthand
* 'fallback-duration' is no longer in the JSX shape of ESLPanel and ESLPanelGroup
* `ToggleableActionParams` alias of `ESLToggleableActionParams` is no longer supported
* `TraversingQuery` alias of `ESLTraversingQuery` is no longer supported
* `RTLUtils` retired use separate methods instead
* `TraversingUtils` retired use separate methods instead
* `deepCompare` alias of `isEqual` is no longer supported
* `generateUId` alias of `randUID` no longer supported

* ESL UI site renderer and ESL polyfills no longer support Edge old versions and ES6 polyfils.
* ESL UI site renderer and ESL polyfills no longer support IE11 and ES5 target.

### Features

* **attr:** add provider to default value in attr ([e482aaf](https://github.com/exadel-inc/esl/commit/e482aaf5fe6c33b482eecaadf65f00246dc14b8c))
* **esl-anchornav:** create esl-anchornav component to provide anchor navigation ([cf79db8](https://github.com/exadel-inc/esl/commit/cf79db850f7cab27b2fa886f4a4469860028e3a0))
* **esl-anchornav:** create esl-anchornav-sticked mixin to provide sticked behaviour ([d28d430](https://github.com/exadel-inc/esl/commit/d28d4305a8ea0b9728992268b1d5405917a90697))
* **esl-carousel:** new `esl-carousel` component introduced according to spec [#1282](https://github.com/exadel-inc/esl/issues/1282) ([5b6fc64](https://github.com/exadel-inc/esl/commit/5b6fc646ed86e1985e6f3b4ebb5e227846566702))
* **esl-carousel:** `ESLCarouselTouchMixin` plugin is ready for usage with both: drag and touch support ([480bac1](https://github.com/exadel-inc/esl/commit/480bac1f7a7f74d85b03c31aa15bb16a16912c49))
* **esl-carousel:** add `esl-carousel` mouse wheel control support mixin ([748390c](https://github.com/exadel-inc/esl/commit/748390c1e8a61c394d506ab182935141500826d4))
* **esl-carousel:** add `grid` renderer with capability to render multi row (column) carousel ([a54a1ab](https://github.com/exadel-inc/esl/commit/a54a1abc384aa029954f9168274d8094b3c0431e))
* **esl-carousel:** add centered renderer ([dd26e7e](https://github.com/exadel-inc/esl/commit/dd26e7edde7d0a62b4dcae1af50df1681a6c18cc))
* **esl-carousel:** complete support of the navigation plugins for ESLCarousel ([19bd241](https://github.com/exadel-inc/esl/commit/19bd241ef58dd96c3787324ac0157ab138fe3f0e))
* **esl-carousel:** Default Renderer: the reordering algorithm improved to respect slides semantical order an available limit of slides ([b2efe6f](https://github.com/exadel-inc/esl/commit/b2efe6f2371ec97d96e943f50165f952a39893ac))
* **esl-carousel:** support for autoplay mixin plugin for ESLCarousel component ([1deea71](https://github.com/exadel-inc/esl/commit/1deea718bc89264f992ac7a05b5b4b85f796bfb2))
* **esl-carousel:** support for relation mixin plugin for ESLCarousel component ([77cbbd9](https://github.com/exadel-inc/esl/commit/77cbbd9a93de0b149ec484d7dae35409a7897926))
* **esl-drag-to-scroll:** create mixin to enable drag-to-scroll functionality ([1ff5242](https://github.com/exadel-inc/esl/commit/1ff5242bb942d304278d7c8469b084ba2ad5470b))
* **esl-event-listener:** add `isVertical` property to `ESLSwipeGestureEvent` ([019715c](https://github.com/exadel-inc/esl/commit/019715c7b3e520f8e7abf7025835cfdddf50f6db))
* **esl-event-listener:** add ability to ESLWheelTarget to ignore income wheel events by predicate ([af47dbb](https://github.com/exadel-inc/esl/commit/af47dbb3ac9a99ae143c417b04c382dbccf77f85))
* **esl-event-listener:** add ability to prevent default wheel action trough ESLWheelTarget ([0e1f192](https://github.com/exadel-inc/esl/commit/0e1f192aca5f6113f11cb16e84dbaf45141ae894))
* **esl-event-listener:** add support for criteria-based subscriptions ([b571d88](https://github.com/exadel-inc/esl/commit/b571d888afdf4748b110b13f0c642d257e99af36))
* **esl-event-listener:** ootb ability to skip custom `longwheel` and `swipe` events in case of content scrolling ([#2098](https://github.com/exadel-inc/esl/issues/2098)) ([ecc849f](https://github.com/exadel-inc/esl/commit/ecc849f26a8444ea8b840e698afab18e79e80391)), closes [#2085](https://github.com/exadel-inc/esl/issues/2085)
* **esl-event-listener:** update listener internal mechanics to store and collect descriptors (with ability to filter them) ([48bf06a](https://github.com/exadel-inc/esl/commit/48bf06a7b26c057a8f08953466fa339ab819ca77))
* **esl-footnotes:** claenup readonly API of `esl-note` ([cb43086](https://github.com/exadel-inc/esl/commit/cb430865e265b808d0312e96c0f76b755aaff4bc))
* **esl-footnotes:** migrate esl-note to esl-base-trigger ([d2e0dbb](https://github.com/exadel-inc/esl/commit/d2e0dbb4a37e4a85da39a59e5a02289c5f848bc4))
* **esl-image-utils:** create esl-img-container mixin to provide img container functionality ([5b4761a](https://github.com/exadel-inc/esl/commit/5b4761aefbbc1880b7b2d414d44df571fd80b1ef))
* **esl-image-utils:** helper container classes for native img / picture containers ([16fc5cb](https://github.com/exadel-inc/esl/commit/16fc5cbcc5bc97c3499cb5d2eb94189e4ff3e283))
* **esl-media-query:** ingore tuple values if query syntax passed ([1899484](https://github.com/exadel-inc/esl/commit/1899484ff238d9dc213f3e6b4f1999fb7375d8e8))
* **esl-media:** `fill-mode` option updated to render through `aspect-ratio` and `wide` marker ([49fd5b6](https://github.com/exadel-inc/esl/commit/49fd5b6ffd29c43da4b23a25d11ec5a2481b47cd))
* **esl-popup:** add offset-trigger attribute ([d4161f1](https://github.com/exadel-inc/esl/commit/d4161f10f9e15cfa24b1d01cbde731aeaf0f2dc8))
* **esl-popup:** add position-origin attribute ([6be5133](https://github.com/exadel-inc/esl/commit/6be51338181d403c43291cb87713496f3bb2a308))
* **esl-popup:** get rid from all focus management code ([11b10ea](https://github.com/exadel-inc/esl/commit/11b10eaf8514b5c27f257d470464ce720e2c0765))
* **esl-popup:** rework esl-popup styles to use CSS variables ([cd781b9](https://github.com/exadel-inc/esl/commit/cd781b9195b876a24debb574410423e853ea3e1a))
* **esl-share:** separate `ESLSharePopup` implementation from `ESLTooltip` ([b5260b9](https://github.com/exadel-inc/esl/commit/b5260b937840fbd5a6023d7d0ed1557f86c00e8a))
* **esl-toggleable:** `_onOutsideAction` no longer part of ESLToggleable instance, now it's ESLToggleableManager responsibility ([573eece](https://github.com/exadel-inc/esl/commit/573eececb60fb5269b5b6e1c4cce37f7ebd4985e))
* **esl-toggleable:** add out of the box `ESLToggleable` focus manager, see `a11y`([c954d72](https://github.com/exadel-inc/esl/commit/c954d72dad67ec726b6d42012b03796bc8143896))
* **esl-toggleable:** rework ESLToggleableManger to produce `FocusIn` outside event actions trough main flow + fix initial focus task ([23ed309](https://github.com/exadel-inc/esl/commit/23ed309dbd347718caf092f7850b8ba4f447ede1))
* **esl-toggleable:** true related opening chain check support for toggleables ([72b849e](https://github.com/exadel-inc/esl/commit/72b849e625f04f834e32f805948dadff1bcbbd59))
* **esl-tooltip:** get rid from inner `hasFocusLoop` and custom focus manager, now utilizes ESLToggleable features ([6ef1f2e](https://github.com/exadel-inc/esl/commit/6ef1f2e23b821fcccefb219330bcead8f7c57a4b))
* **esl-tooltip:** remove disable-arrow attribute ([adbeb5d](https://github.com/exadel-inc/esl/commit/adbeb5d344180138a6860c094413339688aa624b))
* **esl-utils:** `isReducedMotion` detection result constant created ([2f3dd13](https://github.com/exadel-inc/esl/commit/2f3dd134ecbbb25c7239f87690448a8f4941110d))
* **esl-utils:** `safeContains` traverse utility ([7ca4f8b](https://github.com/exadel-inc/esl/commit/7ca4f8bcdaac756650fd60f5256128f2949e0ded))
* **esl-utils:** add `parseTime` alternative, less restrictive to passed format ([05e5963](https://github.com/exadel-inc/esl/commit/05e5963d6baf874193dcf4476d821e9109b3e905))
* **esl-utils:** add ability to resize Rect instance ([1a4aa60](https://github.com/exadel-inc/esl/commit/1a4aa608b8b8f8ece404c22ea489b1c48934c2a0))
* **esl-utils:** add extended `handleFocusFlow` keyboard based focus manager ([376f388](https://github.com/exadel-inc/esl/commit/376f38836cce6f17dbdff7f2e45ac8d94516428c))
* **esl-utils:** create utility to get element that is viewport for specified element ([63d869b](https://github.com/exadel-inc/esl/commit/63d869b14074da74b8bdaf342116428098816532))
* **esl-utils:** extend `attr` decorator with inherit option to take over the value of declared attribute ([b29acde](https://github.com/exadel-inc/esl/commit/b29acde4a70fe60ff0372d119832ed1acffbbb17))
* **esl-utils:** extend params for the `getKeyboardFocusableElements` with full `VisibilityOptions` ([16b04ff](https://github.com/exadel-inc/esl/commit/16b04ff6643935941b62400e92a34bc893834963))
* **esl-utils:** introduce `promisifyTransition` utility ([9dbabfc](https://github.com/exadel-inc/esl/commit/9dbabfc982f97c8fe3ef04f9f35e66877ab04531))
* **esl-utils:** made Rect class immutable ([923c70a](https://github.com/exadel-inc/esl/commit/923c70ab1a8cc55e121b41651cb34ea1ce0cb04c))
* **esl-utils:** utility to postpone execution to microtask ([2a4c8c5](https://github.com/exadel-inc/esl/commit/2a4c8c59cbdc36a31c7dc370944abce1713b21b2))
* **eslint-config:** introducing shared eslint-config for esl projects (internal use only for now) ([ca5f454](https://github.com/exadel-inc/esl/commit/ca5f4549645683a3cf191943ab7df098cb206915))
* **lint:** adapt eslint plugin to be used with ESLint 9 ([93c90d2](https://github.com/exadel-inc/esl/commit/93c90d2678d463c2e5c4c1d3c141db68eb1982fb))

### Bug Fixes

* **esl-base-element:** fix subscription for component that currently out of DOM ([a2526c9](https://github.com/exadel-inc/esl/commit/a2526c9083dddeceed3a123a40060be4f932b001))
* **esl-event-listener:** fix missing signature for `$$on` method of base component ([7197e30](https://github.com/exadel-inc/esl/commit/7197e30af63b71573237eb3433a69ff91c8a011a))
* **esl-event-listener:** fix support for any object-like host ([9ca6aa4](https://github.com/exadel-inc/esl/commit/9ca6aa4e5a12971285c4af7d10a2ecf277c83197))
* **esl-footnotes:** drop extra margins for `esl-carousel-slides` container ([be4e9b0](https://github.com/exadel-inc/esl/commit/be4e9b0cfb75781e0eea06704c2eecd0cfe8c66b))
* **esl-footnotes:** fix default display block for `esl-footnote` tag ([beba690](https://github.com/exadel-inc/esl/commit/beba690ee6f1846df071970b3456fec4603db6bb))
* **esl-footnotes:** fix improper note highlighting ([c7c3d1c](https://github.com/exadel-inc/esl/commit/c7c3d1c88e08096b3c1ed4748fc7dd9d9be4eead))
* **esl-media:** fix conflict of alignment classes, move definition to the main mixin ([55589f2](https://github.com/exadel-inc/esl/commit/55589f26828e4279f2e59d28d70c61ad48648963))
* **esl-media:** make esl-media unfocusable according to `focusable` attribute, provide default based on `controls` option ([#2829](https://github.com/exadel-inc/esl/issues/2829)) ([44be58d](https://github.com/exadel-inc/esl/commit/44be58d58bc2ee01f2efc1b12eef2359fa73eb44))
* **esl-mixin-element:** fix ESLMixin broken order when mixins modify DOM when connected ([36352d9](https://github.com/exadel-inc/esl/commit/36352d96e1512d70ff70742747632acb9968601d))
* **esl-popup:** fix incorrect behavior of popup for fit-major and fit-minor modes ([f26f907](https://github.com/exadel-inc/esl/commit/f26f90703309a2ead44669b4143196951c381abf))
* **esl-share:** fix inner ESLToggleableActionParams instances type ([ea8dd94](https://github.com/exadel-inc/esl/commit/ea8dd9407cbecf20cf18c8df7bfb11253fe34e61))
* **esl-share:** fix merging of `additional`(nested) params when `ESLShareConfig.update` method is called ([a1b1942](https://github.com/exadel-inc/esl/commit/a1b1942907e36597bac89166ba239be402b76df4))
* **esl-share:** rename copy action `alertText` param to `copyAlertMsg` ([3ba61ac](https://github.com/exadel-inc/esl/commit/3ba61aca2d6bd44648ab70a7897dcbffcaaa9233))
* **esl-share:** simplify code and remove overrides (according to esl-popup base state) ([04d6a63](https://github.com/exadel-inc/esl/commit/04d6a63819049242230841365d21a1f2eb4510e7))
* **esl-toggleable:** ESLToggleable should ignore activator direct events ([9a8d545](https://github.com/exadel-inc/esl/commit/9a8d545f0992e4c8c75109accc966c9e6ba198c4))
* **esl-toggleable:** fix focus should return to activator ([3033b33](https://github.com/exadel-inc/esl/commit/3033b3372fec61c879d90409e43763c599887d21))
* **esl-toggleable:** focus management reworked to use scopes. Introduced `ESLToggleableFocusManager` ([fbac20e](https://github.com/exadel-inc/esl/commit/fbac20eae422a4d3a822c3df4572b5ac7275a4f9))
* **esl-toggleable:** inner activator leads to infinite loop while getting toggleables chain ([b8c40dc](https://github.com/exadel-inc/esl/commit/b8c40dc539d2bb1650237b3672a01a2a8924c937))
* **esl-tooltip:** fix tooltip arrow disappearing ([780b295](https://github.com/exadel-inc/esl/commit/780b295c68d3ca7353cfba29588314a2a9c73fbe))
* **esl-tooltip:** simplify code and remove overrides (according to esl-popup base state) ([699ac7f](https://github.com/exadel-inc/esl/commit/699ac7ff8ad5ff7d32cdbdd5fdec29632da1cf40))
* **esl-utils:** `createZIndexIframe` retired ([ad678cb](https://github.com/exadel-inc/esl/commit/ad678cb3d20e122c8e7a87cb19c9e92b3f129a0a))
* **esl-utils:** `SyntheticEventTarget` optimizations ([a4c9b8d](https://github.com/exadel-inc/esl/commit/a4c9b8d4cfd9b9e3ad20b84a16b8eb6ccc5ae4c0))
* **esl-utils:** clean IE11 micro-optimizations ([7ed8830](https://github.com/exadel-inc/esl/commit/7ed883054b43c8c142409e6c6539aca93ef0048b))
* **esl-utils:** fix event cancellation handling ([dffbc53](https://github.com/exadel-inc/esl/commit/dffbc53992841731e6dbc2c73991fc740991fa33))
* **esl-utils:** fix getting viewport sizes ([c17d2e3](https://github.com/exadel-inc/esl/commit/c17d2e3f9e5c9e3341857db65e43f6f83ddad240))
* **esl-utils:** fix types for `unwrap` array utility ([a4b432a](https://github.com/exadel-inc/esl/commit/a4b432a8680b02cab6edb23a0fb3de85788a2985))
* **esl-utils:** fix visibility and a11y checks for getKeyboardFocusableElements ([e078c78](https://github.com/exadel-inc/esl/commit/e078c78b2ac607bff82b6a25832e95e513e3a7bf))
* **esl-utils:** simplified `flat` array utility ([788a782](https://github.com/exadel-inc/esl/commit/788a782ec03af63d370dd0c2785c40547a0f7624))
* **esl-utils:** simplified `union` utility ([043fe45](https://github.com/exadel-inc/esl/commit/043fe45054da7dd1c05c61ea16146ff53555c54e))
* **esl-utils:** simplified `uniq` array utility ([45f282f](https://github.com/exadel-inc/esl/commit/45f282f05ef8d05d0035d1a99d45034d9a4cf790))
* **eslint-config:** update file lines limit to `500` LOC ([f0825ff](https://github.com/exadel-inc/esl/commit/f0825fffa694be811350926305f94d5f5a23232b))
* **eslint-plugin:** remove 4 version checks due to stable 5.0.0 release; fix unexpected version note message ([2312443](https://github.com/exadel-inc/esl/commit/231244375b83b8a061bfff3fa4dc74a0738a7db5))
* **eslint:** fix peerDependency constraint ([20b5d9d](https://github.com/exadel-inc/esl/commit/20b5d9d2c8a1b1e51288524024dfe6c17b665671))
* **lint:** fix Literal import processing & update eslint 9.11.1 ([3345564](https://github.com/exadel-inc/esl/commit/334556429dc2f976c669d0662654056ab0876e90))


## 5.0.0-beta.45 (2025-01-16)

### Bug Fixes

* overall dependencies invalidation ([35e3042](https://github.com/exadel-inc/esl/commit/35e30421b012dac82509b54dcc4a3e54dc4e9449))

## 5.0.0-beta.44 (2025-01-16)

### Bug Fixes

* **esl-mixin-element:** fix ESLMixin broken order when mixins modify DOM when connected ([36352d9](https://github.com/exadel-inc/esl/commit/36352d96e1512d70ff70742747632acb9968601d))
* **esl-toggleable:** inner activator leads to infinite loop while getting toggleables chain ([b8c40dc](https://github.com/exadel-inc/esl/commit/b8c40dc539d2bb1650237b3672a01a2a8924c937))
* **eslint-plugin:** remove 4 version checks due to stable 5.0.0 release; fix unexpected version note message ([2312443](https://github.com/exadel-inc/esl/commit/231244375b83b8a061bfff3fa4dc74a0738a7db5))

## 5.0.0-beta.43 (2024-12-18)

### Bug Fixes

* **esl-media:** make esl-media unfocusable according to `focusable` attribute, provide default based on `controls` option ([#2829](https://github.com/exadel-inc/esl/issues/2829)) ([44be58d](https://github.com/exadel-inc/esl/commit/44be58d58bc2ee01f2efc1b12eef2359fa73eb44))
* **esl-toggleable:** ESLToggleable should ignore activator direct events ([9a8d545](https://github.com/exadel-inc/esl/commit/9a8d545f0992e4c8c75109accc966c9e6ba198c4))

## 5.0.0-beta.42 (2024-12-10)

### ⚠ BREAKING CHANGES

* **esl-tooltip:** `disable-arrow` attribute removed from ESLTooltip component

### Features

* **esl-popup:** add offset-trigger attribute ([d4161f1](https://github.com/exadel-inc/esl/commit/d4161f10f9e15cfa24b1d01cbde731aeaf0f2dc8))
* **esl-toggleable:** `_onOutsideAction` no longer part of ESLToggleable instance, now it's ESLToggleableManager responsibility ([573eece](https://github.com/exadel-inc/esl/commit/573eececb60fb5269b5b6e1c4cce37f7ebd4985e))
* **esl-toggleable:** reimplementation of `focus-behaviour` to a11y mode ([d1d1500](https://github.com/exadel-inc/esl/commit/d1d15007fb94e756938121675f5ce2baacda7f44))
* **esl-toggleable:** rework ESLToggleableManger to produce `FocusIn` outside event actions trough main flow + fix initial focus task ([23ed309](https://github.com/exadel-inc/esl/commit/23ed309dbd347718caf092f7850b8ba4f447ede1))
* **esl-toggleable:** true related opening chain check support for toggleables ([72b849e](https://github.com/exadel-inc/esl/commit/72b849e625f04f834e32f805948dadff1bcbbd59))
* **esl-tooltip:** remove disable-arrow attribute ([adbeb5d](https://github.com/exadel-inc/esl/commit/adbeb5d344180138a6860c094413339688aa624b))
* **esl-utils:** extend params for the `getKeyboardFocusableElements` with full `VisibilityOptions` ([16b04ff](https://github.com/exadel-inc/esl/commit/16b04ff6643935941b62400e92a34bc893834963))

### Bug Fixes

* **esl-media:** fix conflict of alignment classes, move definition to the main mixin ([55589f2](https://github.com/exadel-inc/esl/commit/55589f26828e4279f2e59d28d70c61ad48648963))

## 5.0.0-beta.41 (2024-11-18)

### Bug Fixes

* **esl-toggleable:** fix focus should return to activator ([3033b33](https://github.com/exadel-inc/esl/commit/3033b3372fec61c879d90409e43763c599887d21))
* **esl-toggleable:** focus management reworked to use scopes. Introduced `ESLToggleableFocusManager` ([fbac20e](https://github.com/exadel-inc/esl/commit/fbac20eae422a4d3a822c3df4572b5ac7275a4f9))
* **eslint-config:** update file lines limit to `500` LOC ([f0825ff](https://github.com/exadel-inc/esl/commit/f0825fffa694be811350926305f94d5f5a23232b))

## 5.0.0-beta.40 (2024-11-15)

### ⚠ BREAKING CHANGES

* **esl-popup:** 'autofocus' no longer available for popup, use 'focus-behaviour' instead
* **esl-share:** `ESLSharePopup` no longer inherits `ESLTooltip`, `ESLPopup` now direct base for `ESLSharePopup`
* **esl-tooltip:** `hasFocusLoop` no longer available use `focusBehaviour` instead

### Features

* **esl-drag-to-scroll:** update draggable state based on content size ([63d83a9](https://github.com/exadel-inc/esl/commit/63d83a9dfec9f5101f28b7f2b5aea2fdc9fa3071))
* **esl-popup:** get rid from all focus management code ([11b10ea](https://github.com/exadel-inc/esl/commit/11b10eaf8514b5c27f257d470464ce720e2c0765))
* **esl-share:** separate `ESLSharePopup` implementation from `ESLTooltip` ([b5260b9](https://github.com/exadel-inc/esl/commit/b5260b937840fbd5a6023d7d0ed1557f86c00e8a))
* **esl-toggleable:** add out of the box `ESLToggleable` focus manager ([c954d72](https://github.com/exadel-inc/esl/commit/c954d72dad67ec726b6d42012b03796bc8143896))
* **esl-toggleable:** update focusBehaviour option to smoothly support boundary focus actions across different options ([2b8a0c7](https://github.com/exadel-inc/esl/commit/2b8a0c7affa2b5af5b6baa8efd64932e735ca5d9))
* **esl-tooltip:** get rid from inner `hasFocusLoop` and custom focus manager, now utilizes ESLToggleable features ([6ef1f2e](https://github.com/exadel-inc/esl/commit/6ef1f2e23b821fcccefb219330bcead8f7c57a4b))
* **esl-utils:** add extended `handleFocusFlow` keyboard based focus manager ([376f388](https://github.com/exadel-inc/esl/commit/376f38836cce6f17dbdff7f2e45ac8d94516428c))

### Bug Fixes

* **esl-footnotes:** fix improper note highlighting ([c7c3d1c](https://github.com/exadel-inc/esl/commit/c7c3d1c88e08096b3c1ed4748fc7dd9d9be4eead))
* **esl-share:** fix inner ESLToggleableActionParams instances type ([ea8dd94](https://github.com/exadel-inc/esl/commit/ea8dd9407cbecf20cf18c8df7bfb11253fe34e61))
* **esl-share:** simplify code and remove overrides (according to esl-popup base state) ([04d6a63](https://github.com/exadel-inc/esl/commit/04d6a63819049242230841365d21a1f2eb4510e7))
* **esl-tooltip:** fix tooltip arrow disappearing ([780b295](https://github.com/exadel-inc/esl/commit/780b295c68d3ca7353cfba29588314a2a9c73fbe))
* **esl-tooltip:** simplify code and remove overrides (according to esl-popup base state) ([699ac7f](https://github.com/exadel-inc/esl/commit/699ac7ff8ad5ff7d32cdbdd5fdec29632da1cf40))
* **esl-utils:** fix visibility and a11y checks for getKeyboardFocusableElements ([e078c78](https://github.com/exadel-inc/esl/commit/e078c78b2ac607bff82b6a25832e95e513e3a7bf))

## 5.0.0-beta.39 (2024-11-11)

### Features

* **esl-popup:** add position-origin attribute ([6be5133](https://github.com/exadel-inc/esl/commit/6be51338181d403c43291cb87713496f3bb2a308))
* **esl-utils:** `safeContains` traverse utility ([7ca4f8b](https://github.com/exadel-inc/esl/commit/7ca4f8bcdaac756650fd60f5256128f2949e0ded))

## 5.0.0-beta.38 (2024-11-04)

### ⚠ BREAKING CHANGES

* **esl-footnotes:** `tooltip-shown` readonly attribute(prop) replaced with `active` (from `ESLBaseTrigger`)

### Features

* **esl-footnotes:** claenup readonly API of `esl-note` ([cb43086](https://github.com/exadel-inc/esl/commit/cb430865e265b808d0312e96c0f76b755aaff4bc))
* **esl-footnotes:** migrate esl-note to esl-base-trigger ([d2e0dbb](https://github.com/exadel-inc/esl/commit/d2e0dbb4a37e4a85da39a59e5a02289c5f848bc4))

## 5.0.0-beta.37 (2024-10-21)

### Bug Fixes

* **esl-carousel:** add missing TSX declaration for `esl-carousel-dots` ([7f30c71](https://github.com/exadel-inc/esl/commit/7f30c718f92da43b378022b1d9d29e0f504204ff))
* **esl-carousel:** esl-carousel tag is not declared to be used in TSX ([70b1607](https://github.com/exadel-inc/esl/commit/70b160754f5c9a7c8e399f3eff1446e40824d0d5)), closes [#2330](https://github.com/exadel-inc/esl/issues/2330)
* **esl-drag-to-scroll:** fix issue with un-prevented click action after drag ([c98cfa4](https://github.com/exadel-inc/esl/commit/c98cfa49a1629790a01dab4a6704d5fcea6e19d7))
* **esl-drag-to-scroll:** fix propagation of the click if drag detected ([0b4aee6](https://github.com/exadel-inc/esl/commit/0b4aee6611d0c69f4df8445b41aade9754bcd9ca))

## 5.0.0-beta.36 (2024-09-30)

### Features

* **esl-carousel:** add attribute to carousel if it has only one slide ([25dc3bb](https://github.com/exadel-inc/esl/commit/25dc3bba2c614362c5d8abee99e78cc0f83c5f86))
* **eslint-config:** introducing shared eslint-config for esl projects (internal use only for now) ([ca5f454](https://github.com/exadel-inc/esl/commit/ca5f4549645683a3cf191943ab7df098cb206915))
* **lint:** adapt eslint plugin to be used with ESLint 9 ([93c90d2](https://github.com/exadel-inc/esl/commit/93c90d2678d463c2e5c4c1d3c141db68eb1982fb))

### Bug Fixes

* **lint:** fix Literal import processing & update eslint 9.11.1 ([3345564](https://github.com/exadel-inc/esl/commit/334556429dc2f976c669d0662654056ab0876e90))

## 5.0.0-beta.34 (2024-09-19)

### Features

* **esl-drag-to-scroll:** create mixin to enable drag-to-scroll functionality ([1ff5242](https://github.com/exadel-inc/esl/commit/1ff5242bb942d304278d7c8469b084ba2ad5470b))

### Bug Fixes

* **esl-base-element:** fix subscription for component that currently out of DOM ([a2526c9](https://github.com/exadel-inc/esl/commit/a2526c9083dddeceed3a123a40060be4f932b001))

## [5.0.0-beta.33](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.32...v5.0.0-beta.33) (2024-08-22)

### Bug Fixes

* **esl-carousel:** fix slide mixin initialization order ([ad92042](https://github.com/exadel-inc/esl/commit/ad92042f1c11f6f798b490a4e270ce42ba58e3fc))

## 5.0.0-beta.32 (2024-08-22)

### Features

* **esl-anchornav:** add active-class to set on active item ([e452e71](https://github.com/exadel-inc/esl/commit/e452e71c516ead3df82c6c533c88148660b643b5))
* **esl-carousel:** add step animation duration customization ([4bc8c90](https://github.com/exadel-inc/esl/commit/4bc8c908dc85a7bdaf520178cd713b7833ec84b1))

### Bug Fixes

* **esl-anchornav:** fix ESLAnchornavRender signature ([3d43ba1](https://github.com/exadel-inc/esl/commit/3d43ba1ceece1b56903d26672ac82f7e95a5feaf))
* **esl-carousel:** fix esl-carousel DOM manipulation and slides livecycle ([9ab2b6b](https://github.com/exadel-inc/esl/commit/9ab2b6b52a027c709f9c24c95581cdc52f7d534f))
* **esl-carousel:** fix initial index normalization and long animation speed ([45c7560](https://github.com/exadel-inc/esl/commit/45c7560b031c1256fa113fe9f1d5477f1e6279e0))
* **esl-carousel:** fix navigation group indexes restriction for non-loop carousels ([d5a84bf](https://github.com/exadel-inc/esl/commit/d5a84bf6ace398b59c278c2f3027080fba0b7ca2))
* **esl-carousel:** incomplete carousel should be normalized with non loop constraints ([2157e6a](https://github.com/exadel-inc/esl/commit/2157e6abfcfe0714fe522932985def1e7d202fe4))
* **esl-image-utils:** de-scope (img-cover, img-contain) classes ([028b94f](https://github.com/exadel-inc/esl/commit/028b94fbf48da85f42751f481217e10bb620bb16))
* **esl-image-utils:** remove extra overflow style ([b1c5238](https://github.com/exadel-inc/esl/commit/b1c5238e218698f383a15fc3cb29f4c1bec5b83d))
* **lint:** fix package missing `kleur` dependency ([b6581b9](https://github.com/exadel-inc/esl/commit/b6581b9094e222ce218e1dd9b3f7295de838d2cf))
* **site:** share preview cards ([58194ca](https://github.com/exadel-inc/esl/commit/58194ca867d035b07980d9f3faddd23a2d03ee17))

## 5.0.0-beta.31 (2024-08-13)

### ⚠ BREAKING CHANGES

* **esl-image-utils:** legacy implementation of `esl-image` no longer distributes aspect-ratio styles

### Features

* **esl-anchornav:** create esl-anchor mixin ([db5fb32](https://github.com/exadel-inc/esl/commit/db5fb3261fa99cff87f5d93e16cdc50f3371ce17))
* **esl-anchornav:** create esl-anchornav component to provide anchor navigation ([cf79db8](https://github.com/exadel-inc/esl/commit/cf79db850f7cab27b2fa886f4a4469860028e3a0))
* **esl-anchornav:** create esl-anchornav-sticked mixin to provide sticked behaviour ([d28d430](https://github.com/exadel-inc/esl/commit/d28d4305a8ea0b9728992268b1d5405917a90697))
* **esl-carousel:** rework default renderer animation approach (now uses js animation) ([04b730d](https://github.com/exadel-inc/esl/commit/04b730d95cfa5907e4d3b2106c0a63a210b0fc1d))
* **esl-image-utils:** create esl-img-container mixin to provide img container functionality ([5b4761a](https://github.com/exadel-inc/esl/commit/5b4761aefbbc1880b7b2d414d44df571fd80b1ef))
* **esl-image-utils:** helper container classes for native img / picture containers ([16fc5cb](https://github.com/exadel-inc/esl/commit/16fc5cbcc5bc97c3499cb5d2eb94189e4ff3e283))
* **esl-utils:** add `parseTime` alternative, less restrictive to passed format ([05e5963](https://github.com/exadel-inc/esl/commit/05e5963d6baf874193dcf4476d821e9109b3e905))
* **esl-utils:** create utility to get element that is viewport for specified element ([63d869b](https://github.com/exadel-inc/esl/commit/63d869b14074da74b8bdaf342116428098816532))

### Bug Fixes

* **esl-carousel:** direction related issues, cleanup internal nav API ([30cef21](https://github.com/exadel-inc/esl/commit/30cef2170b95c78a44f62377e2e84cab28b13db9))

### Code Refactoring

* **esl-image-utils:** update implementation to use json attr and new compact representation ([602afc7](https://github.com/exadel-inc/esl/commit/602afc7eb4e208c11d89cfe9bce8198d4c0b664e))

## 5.0.0-beta.30 (2024-07-31)

### Bug Fixes

* **esl-carousel:** fix carousel empty state ([8f88589](https://github.com/exadel-inc/esl/commit/8f885890e317ad28adf4da7810c515d238b2298f))
* **esl-carousel:** fix incomplete centered carousel rendering ([0d7adce](https://github.com/exadel-inc/esl/commit/0d7adce75833b6fc9794f4230667494d0b59a837))

## 5.0.0-beta.29 (2024-07-30)

### Features

* **esl-carousel:** change carousel move API ([085f977](https://github.com/exadel-inc/esl/commit/085f97741c96b4e717a8c5218b30f33c91e5711b))

### Bug Fixes

* **esl-carousel:** carousel now uses average of the real slide sizes during move action routines ([2472723](https://github.com/exadel-inc/esl/commit/2472723d3fa11d46c8dc26f22e06496cacc1c7a9))
* **esl-carousel:** touch behaviour fix - incorrect touch-action target is used ([18b1ba1](https://github.com/exadel-inc/esl/commit/18b1ba1c2a5a8b30753dc5220704cdf78f2aa822))

## 5.0.0-beta.28 (2024-07-29)

### Bug Fixes

* **esl-carousel:** fix count of slides to be rendered before the first slide ([cd68ea3](https://github.com/exadel-inc/esl/commit/cd68ea3c0b9076b2c6d237f9fa547af73b4fedd0))

## 5.0.0-beta.27 (2024-07-23)

### Features

* **esl-carousel:** `esl-carousel-nav` default classes and attributes reworked ([fd50c71](https://github.com/exadel-inc/esl/commit/fd50c719bf08f184b89bc531a4bf46e443eff6fd))

## 5.0.0-beta.26 (2024-07-22)

### Bug Fixes

* **esl-carousel:** `esl-carousel-dots` does not re-renders after target re-definition ([6252474](https://github.com/exadel-inc/esl/commit/6252474495c63ceef57aaae65031a7e92e55e7f9))
* **esl-carousel:** a11ty targets for arrow controls ([8240921](https://github.com/exadel-inc/esl/commit/82409211823673074c6fe44ac5fa0ade6e8ccabe))
* **esl-carousel:** remove specificity hack for carousel clipping ([0fa0ac7](https://github.com/exadel-inc/esl/commit/0fa0ac7d32a77458b8c90d8b5904c420357f2705))

## 5.0.0-beta.25 (2024-07-22)

### Features

* **esl-carousel:** add centered renderer ([dd26e7e](https://github.com/exadel-inc/esl/commit/dd26e7edde7d0a62b4dcae1af50df1681a6c18cc))
* **esl-carousel:** complete rework ESLCarousel container feature ([ca7d308](https://github.com/exadel-inc/esl/commit/ca7d308b63dd92bdcc335b8b4cc14bf81a639de4))
* **esl-carousel:** extend ESLCarousel API with new markers, fix carousel change events ([2a41d67](https://github.com/exadel-inc/esl/commit/2a41d675e45294d123e84dbccad03239d8ac75e5))
* **esl-carousel:** improve ESLCarouselNav mixin API and internal livecycle ([156656a](https://github.com/exadel-inc/esl/commit/156656aecfad6fbe2d1adbc238af55a915791379))
* **esl-carousel:** rework carousel plugins API to use json attr + smart media query ([0166b8d](https://github.com/exadel-inc/esl/commit/0166b8d22b7fbffb5cd9750276bcff1766ba7a41))
* **esl-media-query:** ingore tuple values if query syntax passed ([1899484](https://github.com/exadel-inc/esl/commit/1899484ff238d9dc213f3e6b4f1999fb7375d8e8))

### Bug Fixes

* **esl-carousel:** add more specificity to styles to limit scope of the carousel animation ([4d4db05](https://github.com/exadel-inc/esl/commit/4d4db0526f11baf3439c0f142760e75ed6bf1add))
* **esl-carousel:** fix ESLCarouselNavDots livecycle and carousel observation ([c03c8f9](https://github.com/exadel-inc/esl/commit/c03c8f9322fc69fe7771f71b11031ba1e6e02d94))
* **esl-carousel:** rework carousel slide change event with complete and more clear information ([0b5983f](https://github.com/exadel-inc/esl/commit/0b5983fe67922246cee2e760af3b1d0535dcf61b))

## 5.0.0-beta.24 (2024-07-15)

### Features

* **lint:** deprecation rule for `ESlMediaRuleList.parse` ([#2509](https://github.com/exadel-inc/esl/issues/2509)) ([a1f916a](https://github.com/exadel-inc/esl/commit/a1f916ae4cf9a7d618516646e6629ae3a58f3d68))

### Bug Fixes

* **esl-carousel:** fix handling of pointercancel event by touch plugin ([fb91710](https://github.com/exadel-inc/esl/commit/fb91710af23d5302e93a16c84cf66eea50784393))
* **esl-carousel:** make animated carousel area equal to the content without padding ([1c1f6d8](https://github.com/exadel-inc/esl/commit/1c1f6d82c572d6bec038701eaabc6352218ba50b))
* **esl-event-listener:** fix missing signature for `$$on` method of base component ([7197e30](https://github.com/exadel-inc/esl/commit/7197e30af63b71573237eb3433a69ff91c8a011a))
* **esl-mixin-element:** major fix for nested hierarchy mixin disconnection ([d360da0](https://github.com/exadel-inc/esl/commit/d360da0e61e90c2ef71ba219256505e741429ca3)), closes [#2505](https://github.com/exadel-inc/esl/issues/2505)

## 5.0.0-beta.23 (2024-07-01)

### Features

* **esl-carousel:** add ability to pass slide as a `goTo` parametr ([2313c2a](https://github.com/exadel-inc/esl/commit/2313c2aaf0be64fc6b258265c87f3aa73fd65f04))
* **esl-carousel:** add current and related slide element accessors to carousel change event ([4064b9f](https://github.com/exadel-inc/esl/commit/4064b9f305af0a59418cf734dd6ea3499808f3df))
* **esl-carousel:** make ESLCarouselWheelMixin respect direction & able to prevent default wheel action ([376f303](https://github.com/exadel-inc/esl/commit/376f30328f79c9533a2f1e4bb4cabee427d1de91))
* **esl-event-listener:** add ability to ESLWheelTarget to ignore income wheel events by predicate ([af47dbb](https://github.com/exadel-inc/esl/commit/af47dbb3ac9a99ae143c417b04c382dbccf77f85))
* **esl-event-listener:** add ability to prevent default wheel action trough ESLWheelTarget ([0e1f192](https://github.com/exadel-inc/esl/commit/0e1f192aca5f6113f11cb16e84dbaf45141ae894))

### Bug Fixes

* **deps:** bump puppeteer from 22.12.0 to 22.12.1 ([56ebbfa](https://github.com/exadel-inc/esl/commit/56ebbfa67a90695aa43c867705bcd16fe5fcc5d6))
* **esl-carousel:** add ability to ignore defined content areas by ESLCarouselWheelMixin ([766dabe](https://github.com/exadel-inc/esl/commit/766dabe92eede50066e0440175f3c4d8cc960050))
* **esl-carousel:** de-scope `[esl-carousel-slides]` style defaults ([d3ad98a](https://github.com/exadel-inc/esl/commit/d3ad98ae33fcf7d42652eb831d28e3638790436b))
* **esl-carousel:** fix deprecated type usage inside carousel wheel plugin ([1c9f8c4](https://github.com/exadel-inc/esl/commit/1c9f8c4eba488074a5b236ed6556f29d80d72735))
* **esl-carousel:** improve log messaging and fix initialization exceptions ([8e45f58](https://github.com/exadel-inc/esl/commit/8e45f588a669900fdd53e54c0d1a6357e9159b09))

## 5.0.0-beta.22 (2024-06-26)

### Bug Fixes

* **esl-carousel:** fix incorrect alignment of the grid carousel renderer if there are no enough slides ([6956729](https://github.com/exadel-inc/esl/commit/69567295a56d0017e6364f3aa558f10d79efac38))

## 5.0.0-beta.21 (2024-06-25)

### Features

* **esl-carousel:** add `grid` renderer with capability to render multi row (column) carousel ([a54a1ab](https://github.com/exadel-inc/esl/commit/a54a1abc384aa029954f9168274d8094b3c0431e))

### Bug Fixes

* **deps:** bump puppeteer from 22.11.2 to 22.12.0 ([2a5c371](https://github.com/exadel-inc/esl/commit/2a5c3713c51b55efa37d676d89e815708431072c))

## 5.0.0-beta.20 (2024-06-20)

### Bug Fixes

* **deps:** bump @11ty/eleventy-dev-server from 2.0.0 to 2.0.1 ([9211eaf](https://github.com/exadel-inc/esl/commit/9211eaff52c013cc13a010234f013e13e162df1b))
* **deps:** bump puppeteer from 22.10.0 to 22.11.0 ([1f3b833](https://github.com/exadel-inc/esl/commit/1f3b83321778662127f9aa1167de0c387feafdfd))
* **deps:** bump puppeteer from 22.11.0 to 22.11.1 ([40c7f0a](https://github.com/exadel-inc/esl/commit/40c7f0a06018f756c2ec88cfdd472fc1d22a9332))
* **deps:** bump puppeteer from 22.11.1 to 22.11.2 ([8a824cf](https://github.com/exadel-inc/esl/commit/8a824cffc9ba70a56bc877fcf6683fb5a80d9b6f))
* **deps:** bump webpack from 5.91.0 to 5.92.0 ([ab7f579](https://github.com/exadel-inc/esl/commit/ab7f579cc46f602e4575fc9562c9d8d8baa9b7cd))
* **deps:** bump webpack from 5.92.0 to 5.92.1 ([6909d17](https://github.com/exadel-inc/esl/commit/6909d1709e32b570af9d8cffb7c0ba509d724ae6))
* **deps:** bump ws from 7.5.9 to 7.5.10 ([330fd97](https://github.com/exadel-inc/esl/commit/330fd97664ba5276e89ef723e4ca388a201424db))
* **esl-carousel:** add possibility to hide controls according to closest container state ([b941748](https://github.com/exadel-inc/esl/commit/b941748a4ba7d51adf6ea9b8747570e8c774dd16))
* **lint:** notify about version differences for `eslint-plugin-esl` ([4cc0ddc](https://github.com/exadel-inc/esl/commit/4cc0ddc515f1c2b5ed2f4e2d745001784a98ce2f))

## 5.0.0-beta.19 (2024-05-31)


### Features

* **esl-event-listener:** add support for criteria-based subscriptions ([b571d88](https://github.com/exadel-inc/esl/commit/b571d888afdf4748b110b13f0c642d257e99af36))
* **esl-popup:** add handler for refresh event ([5864c92](https://github.com/exadel-inc/esl/commit/5864c9293046a43d49b900818573b4fd879b6834))
* **lint:** add deprecation warning regarding incorrect direct imports for `attr`, `prop`, `jsonAttr`, `boolAttr`, `listen` ([e592048](https://github.com/exadel-inc/esl/commit/e592048d19aa4575f89e056632e7455a50f47eac))


### Bug Fixes

* **deps:** bump pug from 3.0.2 to 3.0.3 ([8006a45](https://github.com/exadel-inc/esl/commit/8006a45a96aaf52e9a341bf13768613cc0bf17b4))
* **esl-utils:** fix event cancellation handling ([8e45a75](https://github.com/exadel-inc/esl/commit/8e45a7560c3260f21dbe22e9beaa64c8afe19ca5))
* **esl-utils:** fix isRelativeNode signature (can accept undefined as a node) ([4e2c7af](https://github.com/exadel-inc/esl/commit/4e2c7af179d186de521e7a55c0be66d1e3dc68fa))

## 5.0.0-beta.18 (2024-05-24)


### Features

* **esl-carousel:** Default Renderer: the reordering algorithm improved to respect slides semantical order an available limit of slides ([b2efe6f](https://github.com/exadel-inc/esl/commit/b2efe6f2371ec97d96e943f50165f952a39893ac))
* **esl-media:** `fill-mode` option updated to render through `aspect-ratio` and `wide` marker ([49fd5b6](https://github.com/exadel-inc/esl/commit/49fd5b6ffd29c43da4b23a25d11ec5a2481b47cd))


### Bug Fixes

* **deps:** bump puppeteer from 22.9.0 to 22.10.0 ([d82fa11](https://github.com/exadel-inc/esl/commit/d82fa11e6059fe34eaaca7f0990e8d013826fca7))
* **esl-media:** fix missing reinitialization on start-time attribute changing ([e5922ed](https://github.com/exadel-inc/esl/commit/e5922ed801b08066c96dba10edef6e8abb6655b2))
* **esl-media:** fix TSX shape for supporting start-time attribute ([1f43a22](https://github.com/exadel-inc/esl/commit/1f43a22094db5f204f0b69df36272d60beffb638))
* **esl-media:** play-in-viewport tolerance changed to 50% (75% before) ([06d2a13](https://github.com/exadel-inc/esl/commit/06d2a13ca0bbde6c5d4fbd93e6a68f94fe93ef4e))
* **esl-panel:** fix the falsy state of animation in the default open panel in esl-panel-group ([64925e0](https://github.com/exadel-inc/esl/commit/64925e0b47293124430f988474df821c423cc2bd))

## 5.0.0-beta.17 (2024-05-21)


### Features

* **esl-event-listener:** add a `group` key to process batch subscription operations ([3d1ece0](https://github.com/exadel-inc/esl/commit/3d1ece0fcf747efdb7de7fcfb125c4ad02390e50)), closes [#2381](https://github.com/exadel-inc/esl/issues/2381)
* **esl-event-listener:** rework and make warnings of event listener system with more strict and truthful detection of a problem ([f6fd40b](https://github.com/exadel-inc/esl/commit/f6fd40b8e370de1bcc61cb3d6862b2be9188018a))
* **esl-event-listener:** update listener internal mechanics to store and collect descriptors (with ability to filter them) ([48bf06a](https://github.com/exadel-inc/esl/commit/48bf06a7b26c057a8f08953466fa339ab819ca77))
* **esl-media:** add ability to provide video initial position (start time) ([7367bb7](https://github.com/exadel-inc/esl/commit/7367bb78c50514a96edbf4cef7b56b2bf0fe0340))
* **esl-utils:** add ability to reject promisifyEvent by using AbortSignal ([b49da0e](https://github.com/exadel-inc/esl/commit/b49da0e533de7771ccc50465d15a51f157bde568))


### Bug Fixes

* **esl-event-listener:** `ESLEventUtils.descriptors` api notes correction ([309c130](https://github.com/exadel-inc/esl/commit/309c130a7e62348fd02f8bf71cc546f9eab3fe21))
* **esl-event-listener:** fix re-subscription when condition is used ([b304c52](https://github.com/exadel-inc/esl/commit/b304c52a30d86d462e2d5e03b00353b7bbf39cb7))
* **esl-media:** add exact element resize observation reduce; extra subscriptions manipulation ([7e58bbd](https://github.com/exadel-inc/esl/commit/7e58bbdc981ec54902bb7940242e238df5780df5))
* **esl-media:** seekTo leads to no proper behavior when YouTube video is not ready ([f5a0762](https://github.com/exadel-inc/esl/commit/f5a0762301b4e108b708ea1e75834be0b74d2827))
* **esl-popup:** fix it is not possible to set the offset-arrow to 0 ([c6f1a9f](https://github.com/exadel-inc/esl/commit/c6f1a9f2ddfcbbc5bad2adb3da6a73bc34e50277))
* **esl-utils:** fix parseNumber signature (undefined when default provided) ([647b736](https://github.com/exadel-inc/esl/commit/647b7364e3a8024d9d3d4cdef464dc98078a0d01))

## 5.0.0-beta.16 (2024-04-30)


### Bug Fixes

* **esl-event-listener:** fix `listen` decorator strict types are incorrect ([94c85f2](https://github.com/exadel-inc/esl/commit/94c85f2ddbea29b420c2540e025c7d510dfba5b1))

## 5.0.0-beta.15 (2024-04-29)


### Features

* **esl-carousel:** add handler for `esl-show-request` ([1b24ee0](https://github.com/exadel-inc/esl/commit/1b24ee0e32683a32ebd4b8cbf373d018c0eb91e0))
* **esl-utils:** make DelegatedEvent equal too `DelegatedEvent<Event>`, fix types compatibility ([#2360](https://github.com/exadel-inc/esl/issues/2360)) ([458ea53](https://github.com/exadel-inc/esl/commit/458ea53900ed2554772b54e3a0a1567757bb6125))


### Bug Fixes

* **esl-animate:** fix handling of `esl-animate-mixin` attribute changes ([0bb3a44](https://github.com/exadel-inc/esl/commit/0bb3a449ff2b5e6c9c74f763fa1d98a6757a6038))
* **esl-footnotes:** drop extra margins for `esl-carousel-slides` container ([be4e9b0](https://github.com/exadel-inc/esl/commit/be4e9b0cfb75781e0eea06704c2eecd0cfe8c66b))
* **esl-footnotes:** fix default display block for `esl-footnote` tag ([beba690](https://github.com/exadel-inc/esl/commit/beba690ee6f1846df071970b3456fec4603db6bb))

## 5.0.0-beta.14 (2024-04-20)


### Features

* **esl-carousel:** `container-class` slide implementation ([e042e4b](https://github.com/exadel-inc/esl/commit/e042e4bba2ea4a1552c7c227c3f0bf66040e7677))
* **esl-carousel:** migrate `esl-carousel-slide` from custom tag to Mixin ([74fb670](https://github.com/exadel-inc/esl/commit/74fb670704df5546d955683f0ee47d976c625d42))
* **esl-carousel:** updated a11ty auto markers, default ids, initial event ([d3ad7cf](https://github.com/exadel-inc/esl/commit/d3ad7cff63b0985b5c6df54240bb60b0645500b2))
* **esl-event-listener:** separate intersection events ([370d33b](https://github.com/exadel-inc/esl/commit/370d33bf384c5fed6ca734bb680a9fd3ede86680))
* **esl-utils:** add provider function support into `[@prop](https://github.com/prop)` decorator ([9f4bfbe](https://github.com/exadel-inc/esl/commit/9f4bfbee09e1cbd1aeac1b9d4176cc6518682bc9))
* **esl-utils:** add the ability to use additional attributes in `loadScript` utility ([#2279](https://github.com/exadel-inc/esl/issues/2279)) ([f803226](https://github.com/exadel-inc/esl/commit/f80322656efc10dd138f6452f1d3f601229405c9))


### Bug Fixes

* **esl-carousel:** `dotBuilder`/`dotUpdater` does not inherit static default ([8fd173e](https://github.com/exadel-inc/esl/commit/8fd173e9bc4d0895c437a921cbbde7a0257ec031))
* **esl-carousel:** it is impossible to use cascading of css variable properly to define dots styles on the carousel level ([d361295](https://github.com/exadel-inc/esl/commit/d361295d6bce56f57986f7c69092273cd187eb74))
* **site:** `esl-animate` example page wrong animation ([7fd86b4](https://github.com/exadel-inc/esl/commit/7fd86b405839ebb3c15dcd22eabdcf14967e41a5))

## 5.0.0-beta.13 (2024-04-16)


### Features

* **esl-carousel:** rework `ESLCarouselNavDots` plugin, improve a11ty ([ab40f94](https://github.com/exadel-inc/esl/commit/ab40f94324d617fb313f8aee4471d82dd82cdf6d))

## 5.0.0-beta.12 (2024-04-12)


### ⚠ BREAKING CHANGES

* **esl-utils:** `Rect` utility object now immutable from TS perspective

### Features

* **esl-carousel:** `ESLCarouselTouchMixin` plugin is ready for usage with both: drag and touch support ([480bac1](https://github.com/exadel-inc/esl/commit/480bac1f7a7f74d85b03c31aa15bb16a16912c49))
* **esl-carousel:** add `esl-carousel` mouse wheel control support mixin ([748390c](https://github.com/exadel-inc/esl/commit/748390c1e8a61c394d506ab182935141500826d4))
* **esl-carousel:** complete support of the drag (touch) for ESLCarousel ([94bc18f](https://github.com/exadel-inc/esl/commit/94bc18f7f16d2cbff8aa8132ee6ed87dd6cce556))
* **esl-carousel:** complete support of the navigation plugins for ESLCarousel ([19bd241](https://github.com/exadel-inc/esl/commit/19bd241ef58dd96c3787324ac0157ab138fe3f0e))
* **esl-carousel:** new `esl-carousel` component introduced according to spec [#1282](https://github.com/exadel-inc/esl/issues/1282) ([5b6fc64](https://github.com/exadel-inc/esl/commit/5b6fc646ed86e1985e6f3b4ebb5e227846566702))
* **esl-carousel:** support for autoplay mixin plugin for ESLCarousel component ([1deea71](https://github.com/exadel-inc/esl/commit/1deea718bc89264f992ac7a05b5b4b85f796bfb2))
* **esl-carousel:** support for relation mixin plugin for ESLCarousel component ([77cbbd9](https://github.com/exadel-inc/esl/commit/77cbbd9a93de0b149ec484d7dae35409a7897926))
* **esl-event-listener:** add `isVertical` property to `ESLSwipeGestureEvent` ([019715c](https://github.com/exadel-inc/esl/commit/019715c7b3e520f8e7abf7025835cfdddf50f6db))
* **esl-event-listener:** ootb ability to skip custom `longwheel` and `swipe` events in case of content scrolling ([#2098](https://github.com/exadel-inc/esl/issues/2098)) ([80c5747](https://github.com/exadel-inc/esl/commit/80c57471d9a7c0c9e126ecd53baafc978999d7f8)), closes [#2085](https://github.com/exadel-inc/esl/issues/2085)
* **esl-toggleable:** introducing alternative internal hooks `shouldShow`/`shouldHide` instead of deprecated `onBeforeShow`/`onBeforeHide`. ([3786423](https://github.com/exadel-inc/esl/commit/378642368986284e041b8cc081f342f89c51769f))
* **esl-utils:** add ability to resize Rect instance ([1a4aa60](https://github.com/exadel-inc/esl/commit/1a4aa608b8b8f8ece404c22ea489b1c48934c2a0))
* **esl-utils:** add provider to default value in attr ([f13cc98](https://github.com/exadel-inc/esl/commit/f13cc98d88dd171d2eb50093fca3e1dad887c9d9))
* **esl-utils:** extend `attr` decorator with inherit option to take over the value of declared attribute ([a794886](https://github.com/exadel-inc/esl/commit/a794886979347d789e11261c5145c5cb4edc29ef))
* **esl-utils:** introduce `promisifyTransition` utility ([9dbabfc](https://github.com/exadel-inc/esl/commit/9dbabfc982f97c8fe3ef04f9f35e66877ab04531))
* **esl-utils:** made Rect class immutable ([923c70a](https://github.com/exadel-inc/esl/commit/923c70ab1a8cc55e121b41651cb34ea1ce0cb04c))
* **esl-utils:** utility to postpone execution to microtask ([2a4c8c5](https://github.com/exadel-inc/esl/commit/2a4c8c59cbdc36a31c7dc370944abce1713b21b2))


### Bug Fixes

* **esl-event-listener:** fix support for any object-like host ([ae4c98d](https://github.com/exadel-inc/esl/commit/ae4c98d6839d063f3260bea59d66f86611bab8d4))
* **esl-popup:** fix esl-popup infinitely created independently of placeholder state ([63ae414](https://github.com/exadel-inc/esl/commit/63ae4146073b1374bb63f23c37a9ac469a742275))
* **esl-share:** fix merging of `additional`(nested) params when `ESLShareConfig.update` method is called ([b9b4e5f](https://github.com/exadel-inc/esl/commit/b9b4e5fad974a60c22fbaf022cd5076ae96e6e74))
* **esl-share:** rename copy action `alertText` param to `copyAlertMsg` ([d3e3c3a](https://github.com/exadel-inc/esl/commit/d3e3c3ae62197972fed35c08b992a2ba7f121634))
* **esl-tab:** fix `esl-tabs` initialization delay before DOM ready ([52b0beb](https://github.com/exadel-inc/esl/commit/52b0bebe18fc19dc5a2ff528f1b6b44a7c79dce5))
* **esl-utils:** fix argument list on next fn call ([c2e5c1d](https://github.com/exadel-inc/esl/commit/c2e5c1d89384bff3d7f27f81a79f5e568122b26f))
* **esl-utils:** fix event cancellation handling ([dffbc53](https://github.com/exadel-inc/esl/commit/dffbc53992841731e6dbc2c73991fc740991fa33))

## 5.0.0-beta.11 (2024-03-01)


### Features

* **esl-utils:** extend `attr` decorator with inherit option to take over the value of declared attribute ([b29acde](https://github.com/exadel-inc/esl/commit/b29acde4a70fe60ff0372d119832ed1acffbbb17))


### Bug Fixes

* **esl-event-listener:** fix delegation handling for improper targets ([127297c](https://github.com/exadel-inc/esl/commit/127297cdc0552d6ab810ebb829807b8225b46977))
* **esl-popup:** fix incorrect behavior of popup for fit-major and fit-minor modes ([f26f907](https://github.com/exadel-inc/esl/commit/f26f90703309a2ead44669b4143196951c381abf))
* **esl-toggleable:** outside action should be handled from entire page ([aa6f5a5](https://github.com/exadel-inc/esl/commit/aa6f5a52a9c3639dc50e27d837247cfa22653aeb))

## 5.0.0-beta.10 (2024-02-14)


### Features

* **esl-event-listener:** ootb ability to skip custom `longwheel` and `swipe` events in case of content scrolling ([#2098](https://github.com/exadel-inc/esl/issues/2098)) ([ecc849f](https://github.com/exadel-inc/esl/commit/ecc849f26a8444ea8b840e698afab18e79e80391)), closes [#2085](https://github.com/exadel-inc/esl/issues/2085)
* **esl-popup:** rework esl-popup styles to use CSS variables ([cd781b9](https://github.com/exadel-inc/esl/commit/cd781b9195b876a24debb574410423e853ea3e1a))


### Bug Fixes

* **microtask:** fix argument list on next fn call ([f421e88](https://github.com/exadel-inc/esl/commit/f421e882e4fb01ad691bf94209aab486c22cd50b))
* **swipe:** fix swipe tests ([e1aefb8](https://github.com/exadel-inc/esl/commit/e1aefb8f3ac08b19e40cb138c413dd659ac3500d))
