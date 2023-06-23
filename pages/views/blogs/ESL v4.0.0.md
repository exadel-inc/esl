---
layout: content
name: ESL v4.0.0
title: ESL v4.0.0
tags: [blogs, news, draft]
date: 2022-10-01
emoji: ⚡️
containerCls: container markdown-container
---

## ESL Core

### Features:
  - `ESLEventListener`s  functionality introduced
  - `ESLMixinElement`s functionality introduced
  - `ESLBaseElement` extended API 
    - `ESLBaseElement.create` shortcut to create current custom element

### Structural changes:
  - Attribute decorators moved to the `esl-utils`
  - All ESL modules migrated to `ESLEventListener`s
  - Event names are now defined on the prototype level

### BREAKING CHANGES
  - `$$fire` no longer adds 'esl:' prefix to the fired events

---

## ESL Media Query

### Features:
  - `ESLMediaQuery` now implements `EventTarget` interface
  - `ESLMediaRuleList` API reworked with `EventTarget` interface and new calculation strategy

### BREAKING CHANGES
  - `ESLMediaRuleList.parseTuple` arguments order changed
  - `ESLMediaRule` no longer supports default marker, now "default" is equal to "all" query
  - `ESLMediaRuleList` observation callback signature changed, now it should be `EventListener`
  - `ESLMediaRuleList.prototype.default` removed as no longer default rules
  - `ESLMediaRuleList` no longer fires events on rule change, now it's based on active value change
  - `ESLMediaRuleList` now uses merging of all active rules to define result value, however you were still able to get the last active rule value
  - `ESLMediaRuleList.prototype.active` now returns an array of active rules

---

## ESL Traversing Query

### Features:
  - add comma support to define multiple target ([#1120](https://github.com/exadel-inc/esl/issues/1120) / [#1129](https://github.com/exadel-inc/esl/issues/1129)) ([2890d7b](https://github.com/exadel-inc/esl/commit/2890d7b7667492b982b266048d23874c57b938ea)), closes [#1102](https://github.com/exadel-inc/esl/issues/1102)
  - add ability to find closest element ([ada6fbb](https://github.com/exadel-inc/esl/commit/ada6fbb172a2fb2cf0d435420ad8fb0a46e7766f))

---
  
## ESL Utils

### Features:
  - ability to grow/shrink axis of the `Rect` ([1c58a1c](https://github.com/exadel-inc/esl/commit/1c58a1c19b0aa82abf7eb73c40781e9c4a4860ba))
  - `SyntheticEventTarget` to implement `EventTarget` interface with more listeners control ([e4f3eb8](https://github.com/exadel-inc/esl/commit/e4f3eb89e0dd8227937d476a8d2090730342de64))
  - simplify and extend `@prop` decorator API ([fd6ede3](https://github.com/exadel-inc/esl/commit/fd6ede34b0a3c7496083cb58aa9b726d4a692085))
  - add `skipOneRender` RAF utility ([ddc3227](https://github.com/exadel-inc/esl/commit/ddc322798e6f8cf447874896786fe6d368bbe5ef))
  - add ability to pass predicate to sequence finder ([dd8c3cb](https://github.com/exadel-inc/esl/commit/dd8c3cbb43ed529330c32459b9787949a0927a01))
  - add `@decorate` decorator to bind and decorate method of the class
  - `@attr` extended with ability to pass Serializer/Parser ([012eb83](https://github.com/exadel-inc/esl/commit/012eb83ebcbba8315a2766af090239774c21234e))
  - create dom html sanitize method ([004642f](https://github.com/exadel-inc/esl/commit/004642f866ac1b2ed5278084963288d8c2fd17e0))
  - create `extractValues` object utility ([8edd9e7](https://github.com/exadel-inc/esl/commit/8edd9e7b564b4ac78a4fc952ee58f76b6a54cf89))
  - create cumulative imports for esl-utils submodules ([2e9d6ad](https://github.com/exadel-inc/esl/commit/2e9d6ad8f327ede991feef4ebc7c76fdd55726af))

### BREAKING CHANGES
  - `isMouseEvent`, `isTouchEvent` moved outside of `EventUtils`
  - `normalizeTouchPoint` renamed to `touchPoint` and moved outside of `EventUtils`
  - `normalizeCoordinates` removed. Use `getOffsetPoint` in combination with `getTouchPoint` instead
  - `@prop` signature changed `prop(value?: any, prototypeConfig: OverrideDecoratorConfig = {})` instead
  - `ScrollUtils.lock` no longer accessible. Use `lockScroll(document.documentElement, {strategy: '...'})` instead
  - `ScrollUtils.unlock` no longer accessible. Use `unlockScroll(document.documentElement, {strategy: '...'})` instead
  - `ScrollUtils.lockRequest` no longer accessible. Use `lockScroll(document.documentElement, {strategy: '...', initiatior})` instead
  - `ScrollUtils.unlockRequest` no longer accessible. Use `unlockScroll(document.documentElement, {strategy: '...', initiatior})` instead

### Bugfixes
  - make attr decorators correctly strict typed
  - `deepMerge` primitive values merging improved, undefined arguments now ignored ([5b7b730](https://github.com/exadel-inc/esl/commit/5b7b73003acd4d29250af12603ced5d58c40aff6))
  - fix `@bind` decorator to save original function enumerable marker ([92c2086](https://github.com/exadel-inc/esl/commit/92c2086df610a5572143463302baf7aeea6174e9))
  - update `@decorate` decorator to allow to save context properly (on instance level) ([0ac1b0c](https://github.com/exadel-inc/esl/commit/0ac1b0cb9c90648ae1e0a18a16a936971c4b4ee9))

---

## ESL Toggleable and ESL Trigger

### Features:
  - migrate `esl-toggleable` and `esl-trigger` to ESLEventListeners
  - `esl:show:request` additional data ([a121872](https://github.com/exadel-inc/esl/commit/a121872b6e69fd7fb7a71bdfa9058430e650f423))
  - support of `esl:hide:request` ([8a0928b](https://github.com/exadel-inc/esl/commit/8a0928b2f2bda63c6fbbaf5e9b6453d660091ec1))
  - add support of dynamic `aria-label` for `esl-trigger` ([5c18841](https://github.com/exadel-inc/esl/commit/5c188418720ad4a972caa7450563a29268d8ec97))
  - add esc key event handler for `esl-trigger` ([3dab6da](https://github.com/exadel-inc/esl/commit/3dab6dad39259f7e920c9a108757271cb58a216d))
  - add `ignore-esc` attribute for `esl-trigger` ([605b715](https://github.com/exadel-inc/esl/commit/605b715a29ef1a852e24ce5120ca30d394fc19c1))


## ESL Panel and ESL Panel Group

### Features:
  - migrate `esl-panel` and `esl-panel-group` to ESLEventListeners
  - add `refresh-strategy` attribute ([#1156](https://github.com/exadel-inc/esl/issues/1156)) ([36027ad](https://github.com/exadel-inc/esl/commit/36027ad2574c0c33df1b6370484448a6889a647a))
  - add ability to control min/max open panels per media condition ([67ca2ba](https://github.com/exadel-inc/esl/commit/67ca2ba16e3fc4ee4300d1c79ca2e5d0da845af7))

### BREAKING CHANGES
  - `ESLPanelGroup.noCollapse` (with related attribute) renamed to `ESLPanelGroup.noAnimate` (`no-animate` attribute)
  - `ESLPanelGroup.shouldCollapse` renamed to `ESLPanelGroup.shouldAnimate`
  - `PanelActionParams.noCollapse` renamed to `PanelActionParams.noAnimate`
  - `ESLPanelGroup` `view` attribute is no longer supported
  - `open` mode of `ESLPanelGroup` is no longer supported, it should be replaced with a `min-open-items="all"`
  - `accordion-group="single"` attribute of `ESLPanelGroup` is no longer supported, replaced with `max-open-items="1"`
  - `accordion-group="single"` attribute of `ESLPanelGroup` is no longer supported, replaced with `max-open-items="all"`
  - components inherited from `ESLPanelGroup` should use `@listen({inherit: true})` for proper subscription

### Bugfixes
  - add `capturedBy` and fix `after:show` dispatch ([9bdc98c](https://github.com/exadel-inc/esl/commit/9bdc98c98a2926fe42c7cd15007c31a19171027c))
  - fix `esl:before:hide` bubbling from uncontrolled toggleables ([9212b6b](https://github.com/exadel-inc/esl/commit/9212b6beacd97d39d0410a464598e9e2e0bdb1c2))
  - fix animation process capturing by `ESLPanel` component ([9a5b3a5](https://github.com/exadel-inc/esl/commit/9a5b3a576d5cb4dbd47d113d944932586155c7f6))
  - change `no-animate` API ([dde3500](https://github.com/exadel-inc/esl/commit/dde35009268a92bae92a45f00d11cb29edee98fa))


## ESL Tab and ESLTabs

### Features:
  - `esl-tab` and `esl-tabs` migrated to ESLEventListeners

### Bugfixes:
  - fix alignment behavior ([b5ebd66](https://github.com/exadel-inc/esl/commit/b5ebd668de7b4d1eea7311ae7d734c02abb537cf))

### BREAKING CHANGES
  - Listeners extended from `ESLTab` should now use `@listen` annotation to work correctly
  - Listeners extended from `ESLTabs` should now use `@listen` annotation to work correctly

## ESL Alert

### Features:
  - `esl-alert` migrated to ESLEventListeners, inner API updates

### BREAKING CHANGES
  - Listeners extended from `ESLAlert` should now use `@listen` annotation to work correctly
  - `eventNs` is no longer supported, event is now defined directly on the prototype level


## ESL Popup

### Features:
  - add configurable `rootMargin` for the popup activator observer ([5d647d6](https://github.com/exadel-inc/esl/commit/5d647d60673a65e7b27472c1b68a1e174fa40740))
  - add extended `offsetContainer` configuration ([63cbc0a](https://github.com/exadel-inc/esl/commit/63cbc0a996a8578549360dadaa3bb17c53884bfe))

### BREAKING CHANGES
  - Listeners extended from `ESLPopup` should now use `@listen` annotation to work correctly


## ESL Footnotes

### Features:
  - migrate `esl-notes` and `esl-footnotes` to ESLEventListeners
  - add configurable `intersectionMargin`  for the note tooltip activator observer ([b9b1599](https://github.com/exadel-inc/esl/commit/b9b159942e3534965f43cac94c140d5680308548))

### BREAKING CHANGES
  - Listeners extended from `ESLNote` should now use `@listen` annotation to work correctly
  - Listeners extended from `ESLFootnote` should now use `@listen` annotation to work correctly
  - `eventNs` is no longer supported, event is now defined directly on the prototype level

## ESL Image and ESL Media

### Bugfixes:
  - fix esl-image to prevent DOM XSS vulnerabilities ([4fd925d](https://github.com/exadel-inc/esl/commit/4fd925df8605994b0f7d345d77a425e0cdc487e8))
  - fix wrong error status on svg images in FF ([cad6b40](https://github.com/exadel-inc/esl/commit/cad6b40ccce01aaea8b1869b2cd7d542939a4fd4))


## ESL Scrollbar

### Features:
  - migrate `esl-scrollbar` to ESLEventListeners

### Bugfixes
  - remove unnecessary width ([6e18909](https://github.com/exadel-inc/esl/commit/6e18909c6768c259d76084b463404fe6b29c9af8))

### BREAKING CHANGES
  - Listeners extended from `ESLScrollbar` should now use `@listen` annotation to work correctly


## ESL Select

### Features:
  - migrate `esl-select` to ESLEventListeners ([76ca947](https://github.com/exadel-inc/esl/commit/76ca9479090546cdf092d1c9c3f5d993263f0581))
  - add `dropdown-class` param to specify dropdown additional CSS class(es) ([938357f](https://github.com/exadel-inc/esl/commit/938357fa6fb5db804f445f31eb4f73641dfbcccf))


## ESL Polyfills

### Features:
  - `Event`, `CustomEvent`, `MouseEvent`, `KeyboardEvent`, `FocusEvent` extended polyfills ([9ca3c40](https://github.com/exadel-inc/esl/commit/9ca3c406ff1f6f99490fdf09d2f15bc450c7be57))
  - `Object.assign` and `Array.from` extended polyfills ([590bca4](https://github.com/exadel-inc/esl/commit/590bca4fab39c566db68f7bc2440e5d84355a991))
  - extended `es5-target-shim` ([ef53df9](https://github.com/exadel-inc/esl/commit/ef53df936dd2beda859a41e9f8a900199bb24f3e))

### BREAKING CHANGES
  - ES5 shim `shimES5ElementConstructor` replaced with `shimES5Constructor`
