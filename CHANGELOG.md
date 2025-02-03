## [5.0.1-beta.2](https://github.com/exadel-inc/esl/compare/v5.0.1-beta.1...v5.0.1-beta.2) (2025-01-24)

### Bug Fixes

* **eslint-plugin:** remove peer dependency for esl (handled via warnings) ([c06fbde](https://github.com/exadel-inc/esl/commit/c06fbdee050ff5608eda8d3e8bb8c4fba000b981))

## [5.0.1](https://github.com/exadel-inc/esl/compare/esl-v5.0.0...esl-v5.0.1) (2025-02-03)


### Bug Fixes

* **esl-carousel:** ability to provide slide size fallback trough `--esl-slide-fallback-size` variable ([78ae62f](https://github.com/exadel-inc/esl/commit/78ae62f01ce651a24aa165115382ff13d96a0b84)), closes [#2879](https://github.com/exadel-inc/esl/issues/2879)
* **esl-carousel:** fix initial rendering layout shift to eliminate CLS degradation ([7d65335](https://github.com/exadel-inc/esl/commit/7d6533548545744502191b761773e6be9c5081eb)), closes [#2879](https://github.com/exadel-inc/esl/issues/2879)
* **esl-image-utils:** omit console warnings in case of missing inner image ([ca13a8a](https://github.com/exadel-inc/esl/commit/ca13a8a467b769240c7b5e9fd740c01bff75ef4e))
* **eslint-plugin:** remove peer dependency for esl (handled via warnings) ([c06fbde](https://github.com/exadel-inc/esl/commit/c06fbdee050ff5608eda8d3e8bb8c4fba000b981))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @exadel/eslint-plugin-esl bumped from file:eslint-plugin to 5.0.1
    * @exadel/eslint-config-esl bumped from file:eslint-config to 5.0.1

## [5.0.1-beta.1](https://github.com/exadel-inc/esl/compare/v5.0.0...v5.0.1-beta.1) (2025-01-24)

### Bug Fixes

* **esl-carousel:** ability to provide slide size fallback trough `--esl-slide-fallback-size` variable ([78ae62f](https://github.com/exadel-inc/esl/commit/78ae62f01ce651a24aa165115382ff13d96a0b84)), closes [#2879](https://github.com/exadel-inc/esl/issues/2879)
* **esl-carousel:** fix initial rendering layout shift to eliminate CLS degradation ([7d65335](https://github.com/exadel-inc/esl/commit/7d6533548545744502191b761773e6be9c5081eb)), closes [#2879](https://github.com/exadel-inc/esl/issues/2879)

## [5.0.0](https://github.com/exadel-inc/esl/compare/v4.18.1...v5.0.0) (2025-01-17)

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


## [5.0.0-beta.45](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.44...v5.0.0-beta.45) (2025-01-16)

### Bug Fixes

* overall dependencies invalidation ([35e3042](https://github.com/exadel-inc/esl/commit/35e30421b012dac82509b54dcc4a3e54dc4e9449))

## [5.0.0-beta.44](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.43...v5.0.0-beta.44) (2025-01-16)

### Bug Fixes

* **esl-mixin-element:** fix ESLMixin broken order when mixins modify DOM when connected ([36352d9](https://github.com/exadel-inc/esl/commit/36352d96e1512d70ff70742747632acb9968601d))
* **esl-toggleable:** inner activator leads to infinite loop while getting toggleables chain ([b8c40dc](https://github.com/exadel-inc/esl/commit/b8c40dc539d2bb1650237b3672a01a2a8924c937))
* **eslint-plugin:** remove 4 version checks due to stable 5.0.0 release; fix unexpected version note message ([2312443](https://github.com/exadel-inc/esl/commit/231244375b83b8a061bfff3fa4dc74a0738a7db5))

## [5.0.0-beta.43](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.42...v5.0.0-beta.43) (2024-12-18)

### Bug Fixes

* **esl-media:** make esl-media unfocusable according to `focusable` attribute, provide default based on `controls` option ([#2829](https://github.com/exadel-inc/esl/issues/2829)) ([44be58d](https://github.com/exadel-inc/esl/commit/44be58d58bc2ee01f2efc1b12eef2359fa73eb44))
* **esl-toggleable:** ESLToggleable should ignore activator direct events ([9a8d545](https://github.com/exadel-inc/esl/commit/9a8d545f0992e4c8c75109accc966c9e6ba198c4))

## [5.0.0-beta.42](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.41...v5.0.0-beta.42) (2024-12-10)

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

## [5.0.0-beta.41](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.40...v5.0.0-beta.41) (2024-11-18)

### Bug Fixes

* **esl-toggleable:** fix focus should return to activator ([3033b33](https://github.com/exadel-inc/esl/commit/3033b3372fec61c879d90409e43763c599887d21))
* **esl-toggleable:** focus management reworked to use scopes. Introduced `ESLToggleableFocusManager` ([fbac20e](https://github.com/exadel-inc/esl/commit/fbac20eae422a4d3a822c3df4572b5ac7275a4f9))
* **eslint-config:** update file lines limit to `500` LOC ([f0825ff](https://github.com/exadel-inc/esl/commit/f0825fffa694be811350926305f94d5f5a23232b))

## [5.0.0-beta.40](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.39...v5.0.0-beta.40) (2024-11-15)

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

## [5.0.0-beta.39](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.38...v5.0.0-beta.39) (2024-11-11)

### Features

* **esl-popup:** add position-origin attribute ([6be5133](https://github.com/exadel-inc/esl/commit/6be51338181d403c43291cb87713496f3bb2a308))
* **esl-utils:** `safeContains` traverse utility ([7ca4f8b](https://github.com/exadel-inc/esl/commit/7ca4f8bcdaac756650fd60f5256128f2949e0ded))

## [5.0.0-beta.38](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.37...v5.0.0-beta.38) (2024-11-04)

### ⚠ BREAKING CHANGES

* **esl-footnotes:** `tooltip-shown` readonly attribute(prop) replaced with `active` (from `ESLBaseTrigger`)

### Features

* **esl-footnotes:** claenup readonly API of `esl-note` ([cb43086](https://github.com/exadel-inc/esl/commit/cb430865e265b808d0312e96c0f76b755aaff4bc))
* **esl-footnotes:** migrate esl-note to esl-base-trigger ([d2e0dbb](https://github.com/exadel-inc/esl/commit/d2e0dbb4a37e4a85da39a59e5a02289c5f848bc4))

## [5.0.0-beta.37](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.36...v5.0.0-beta.37) (2024-10-21)

### Bug Fixes

* **esl-carousel:** add missing TSX declaration for `esl-carousel-dots` ([7f30c71](https://github.com/exadel-inc/esl/commit/7f30c718f92da43b378022b1d9d29e0f504204ff))
* **esl-carousel:** esl-carousel tag is not declared to be used in TSX ([70b1607](https://github.com/exadel-inc/esl/commit/70b160754f5c9a7c8e399f3eff1446e40824d0d5)), closes [#2330](https://github.com/exadel-inc/esl/issues/2330)
* **esl-drag-to-scroll:** fix issue with un-prevented click action after drag ([c98cfa4](https://github.com/exadel-inc/esl/commit/c98cfa49a1629790a01dab4a6704d5fcea6e19d7))
* **esl-drag-to-scroll:** fix propagation of the click if drag detected ([0b4aee6](https://github.com/exadel-inc/esl/commit/0b4aee6611d0c69f4df8445b41aade9754bcd9ca))

## [5.0.0-beta.36](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.35...v5.0.0-beta.36) (2024-09-30)

### Features

* **esl-carousel:** add attribute to carousel if it has only one slide ([25dc3bb](https://github.com/exadel-inc/esl/commit/25dc3bba2c614362c5d8abee99e78cc0f83c5f86))
* **eslint-config:** introducing shared eslint-config for esl projects (internal use only for now) ([ca5f454](https://github.com/exadel-inc/esl/commit/ca5f4549645683a3cf191943ab7df098cb206915))
* **lint:** adapt eslint plugin to be used with ESLint 9 ([93c90d2](https://github.com/exadel-inc/esl/commit/93c90d2678d463c2e5c4c1d3c141db68eb1982fb))

### Bug Fixes

* **lint:** fix Literal import processing & update eslint 9.11.1 ([3345564](https://github.com/exadel-inc/esl/commit/334556429dc2f976c669d0662654056ab0876e90))

## [5.0.0-beta.34](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.33...v5.0.0-beta.34) (2024-09-19)

### Features

* **esl-drag-to-scroll:** create mixin to enable drag-to-scroll functionality ([1ff5242](https://github.com/exadel-inc/esl/commit/1ff5242bb942d304278d7c8469b084ba2ad5470b))

### Bug Fixes

* **esl-base-element:** fix subscription for component that currently out of DOM ([a2526c9](https://github.com/exadel-inc/esl/commit/a2526c9083dddeceed3a123a40060be4f932b001))

## [5.0.0-beta.33](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.32...v5.0.0-beta.33) (2024-08-22)

### Bug Fixes

* **esl-carousel:** fix slide mixin initialization order ([ad92042](https://github.com/exadel-inc/esl/commit/ad92042f1c11f6f798b490a4e270ce42ba58e3fc))

## [5.0.0-beta.32](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.31...v5.0.0-beta.32) (2024-08-22)

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

## [5.0.0-beta.31](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.30...v5.0.0-beta.31) (2024-08-13)

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

## [5.0.0-beta.30](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.29...v5.0.0-beta.30) (2024-07-31)

### Bug Fixes

* **esl-carousel:** fix carousel empty state ([8f88589](https://github.com/exadel-inc/esl/commit/8f885890e317ad28adf4da7810c515d238b2298f))
* **esl-carousel:** fix incomplete centered carousel rendering ([0d7adce](https://github.com/exadel-inc/esl/commit/0d7adce75833b6fc9794f4230667494d0b59a837))

## [5.0.0-beta.29](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.28...v5.0.0-beta.29) (2024-07-30)

### Features

* **esl-carousel:** change carousel move API ([085f977](https://github.com/exadel-inc/esl/commit/085f97741c96b4e717a8c5218b30f33c91e5711b))

### Bug Fixes

* **esl-carousel:** carousel now uses average of the real slide sizes during move action routines ([2472723](https://github.com/exadel-inc/esl/commit/2472723d3fa11d46c8dc26f22e06496cacc1c7a9))
* **esl-carousel:** touch behaviour fix - incorrect touch-action target is used ([18b1ba1](https://github.com/exadel-inc/esl/commit/18b1ba1c2a5a8b30753dc5220704cdf78f2aa822))

## [5.0.0-beta.28](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.27...v5.0.0-beta.28) (2024-07-29)

### Bug Fixes

* **esl-carousel:** fix count of slides to be rendered before the first slide ([cd68ea3](https://github.com/exadel-inc/esl/commit/cd68ea3c0b9076b2c6d237f9fa547af73b4fedd0))

## [5.0.0-beta.27](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.26...v5.0.0-beta.27) (2024-07-23)

### Features

* **esl-carousel:** `esl-carousel-nav` default classes and attributes reworked ([fd50c71](https://github.com/exadel-inc/esl/commit/fd50c719bf08f184b89bc531a4bf46e443eff6fd))

## [5.0.0-beta.26](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.25...v5.0.0-beta.26) (2024-07-22)

### Bug Fixes

* **esl-carousel:** `esl-carousel-dots` does not re-renders after target re-definition ([6252474](https://github.com/exadel-inc/esl/commit/6252474495c63ceef57aaae65031a7e92e55e7f9))
* **esl-carousel:** a11ty targets for arrow controls ([8240921](https://github.com/exadel-inc/esl/commit/82409211823673074c6fe44ac5fa0ade6e8ccabe))
* **esl-carousel:** remove specificity hack for carousel clipping ([0fa0ac7](https://github.com/exadel-inc/esl/commit/0fa0ac7d32a77458b8c90d8b5904c420357f2705))

## [5.0.0-beta.25](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.24...v5.0.0-beta.25) (2024-07-22)

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

## [5.0.0-beta.24](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.23...v5.0.0-beta.24) (2024-07-15)

### Features

* **lint:** deprecation rule for `ESlMediaRuleList.parse` ([#2509](https://github.com/exadel-inc/esl/issues/2509)) ([a1f916a](https://github.com/exadel-inc/esl/commit/a1f916ae4cf9a7d618516646e6629ae3a58f3d68))

### Bug Fixes

* **esl-carousel:** fix handling of pointercancel event by touch plugin ([fb91710](https://github.com/exadel-inc/esl/commit/fb91710af23d5302e93a16c84cf66eea50784393))
* **esl-carousel:** make animated carousel area equal to the content without padding ([1c1f6d8](https://github.com/exadel-inc/esl/commit/1c1f6d82c572d6bec038701eaabc6352218ba50b))
* **esl-event-listener:** fix missing signature for `$$on` method of base component ([7197e30](https://github.com/exadel-inc/esl/commit/7197e30af63b71573237eb3433a69ff91c8a011a))
* **esl-mixin-element:** major fix for nested hierarchy mixin disconnection ([d360da0](https://github.com/exadel-inc/esl/commit/d360da0e61e90c2ef71ba219256505e741429ca3)), closes [#2505](https://github.com/exadel-inc/esl/issues/2505)

## [5.0.0-beta.23](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.22...v5.0.0-beta.23) (2024-07-01)

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

## [5.0.0-beta.22](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.21...v5.0.0-beta.22) (2024-06-26)

### Bug Fixes

* **esl-carousel:** fix incorrect alignment of the grid carousel renderer if there are no enough slides ([6956729](https://github.com/exadel-inc/esl/commit/69567295a56d0017e6364f3aa558f10d79efac38))

## [5.0.0-beta.21](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.20...v5.0.0-beta.21) (2024-06-25)

### Features

* **esl-carousel:** add `grid` renderer with capability to render multi row (column) carousel ([a54a1ab](https://github.com/exadel-inc/esl/commit/a54a1abc384aa029954f9168274d8094b3c0431e))

### Bug Fixes

* **deps:** bump puppeteer from 22.11.2 to 22.12.0 ([2a5c371](https://github.com/exadel-inc/esl/commit/2a5c3713c51b55efa37d676d89e815708431072c))

## [5.0.0-beta.20](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.19...v5.0.0-beta.20) (2024-06-20)

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

## [5.0.0-beta.19](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.18...v5.0.0-beta.19) (2024-05-31)


### Features

* **esl-event-listener:** add support for criteria-based subscriptions ([b571d88](https://github.com/exadel-inc/esl/commit/b571d888afdf4748b110b13f0c642d257e99af36))
* **esl-popup:** add handler for refresh event ([5864c92](https://github.com/exadel-inc/esl/commit/5864c9293046a43d49b900818573b4fd879b6834))
* **lint:** add deprecation warning regarding incorrect direct imports for `attr`, `prop`, `jsonAttr`, `boolAttr`, `listen` ([e592048](https://github.com/exadel-inc/esl/commit/e592048d19aa4575f89e056632e7455a50f47eac))


### Bug Fixes

* **deps:** bump pug from 3.0.2 to 3.0.3 ([8006a45](https://github.com/exadel-inc/esl/commit/8006a45a96aaf52e9a341bf13768613cc0bf17b4))
* **esl-utils:** fix event cancellation handling ([8e45a75](https://github.com/exadel-inc/esl/commit/8e45a7560c3260f21dbe22e9beaa64c8afe19ca5))
* **esl-utils:** fix isRelativeNode signature (can accept undefined as a node) ([4e2c7af](https://github.com/exadel-inc/esl/commit/4e2c7af179d186de521e7a55c0be66d1e3dc68fa))

## [5.0.0-beta.18](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.17...v5.0.0-beta.18) (2024-05-24)


### Features

* **esl-carousel:** Default Renderer: the reordering algorithm improved to respect slides semantical order an available limit of slides ([b2efe6f](https://github.com/exadel-inc/esl/commit/b2efe6f2371ec97d96e943f50165f952a39893ac))
* **esl-media:** `fill-mode` option updated to render through `aspect-ratio` and `wide` marker ([49fd5b6](https://github.com/exadel-inc/esl/commit/49fd5b6ffd29c43da4b23a25d11ec5a2481b47cd))


### Bug Fixes

* **deps:** bump puppeteer from 22.9.0 to 22.10.0 ([d82fa11](https://github.com/exadel-inc/esl/commit/d82fa11e6059fe34eaaca7f0990e8d013826fca7))
* **esl-media:** fix missing reinitialization on start-time attribute changing ([e5922ed](https://github.com/exadel-inc/esl/commit/e5922ed801b08066c96dba10edef6e8abb6655b2))
* **esl-media:** fix TSX shape for supporting start-time attribute ([1f43a22](https://github.com/exadel-inc/esl/commit/1f43a22094db5f204f0b69df36272d60beffb638))
* **esl-media:** play-in-viewport tolerance changed to 50% (75% before) ([06d2a13](https://github.com/exadel-inc/esl/commit/06d2a13ca0bbde6c5d4fbd93e6a68f94fe93ef4e))
* **esl-panel:** fix the falsy state of animation in the default open panel in esl-panel-group ([64925e0](https://github.com/exadel-inc/esl/commit/64925e0b47293124430f988474df821c423cc2bd))

## [5.0.0-beta.17](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.16...v5.0.0-beta.17) (2024-05-21)


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

## [5.0.0-beta.16](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.15...v5.0.0-beta.16) (2024-04-30)


### Bug Fixes

* **esl-event-listener:** fix `listen` decorator strict types are incorrect ([94c85f2](https://github.com/exadel-inc/esl/commit/94c85f2ddbea29b420c2540e025c7d510dfba5b1))

## [5.0.0-beta.15](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.14...v5.0.0-beta.15) (2024-04-29)


### Features

* **esl-carousel:** add handler for `esl-show-request` ([1b24ee0](https://github.com/exadel-inc/esl/commit/1b24ee0e32683a32ebd4b8cbf373d018c0eb91e0))
* **esl-utils:** make DelegatedEvent equal too `DelegatedEvent<Event>`, fix types compatibility ([#2360](https://github.com/exadel-inc/esl/issues/2360)) ([458ea53](https://github.com/exadel-inc/esl/commit/458ea53900ed2554772b54e3a0a1567757bb6125))


### Bug Fixes

* **esl-animate:** fix handling of `esl-animate-mixin` attribute changes ([0bb3a44](https://github.com/exadel-inc/esl/commit/0bb3a449ff2b5e6c9c74f763fa1d98a6757a6038))
* **esl-footnotes:** drop extra margins for `esl-carousel-slides` container ([be4e9b0](https://github.com/exadel-inc/esl/commit/be4e9b0cfb75781e0eea06704c2eecd0cfe8c66b))
* **esl-footnotes:** fix default display block for `esl-footnote` tag ([beba690](https://github.com/exadel-inc/esl/commit/beba690ee6f1846df071970b3456fec4603db6bb))

## [5.0.0-beta.14](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.13...v5.0.0-beta.14) (2024-04-20)


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

## [5.0.0-beta.13](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.12...v5.0.0-beta.13) (2024-04-16)


### Features

* **esl-carousel:** rework `ESLCarouselNavDots` plugin, improve a11ty ([ab40f94](https://github.com/exadel-inc/esl/commit/ab40f94324d617fb313f8aee4471d82dd82cdf6d))

## [5.0.0-beta.12](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.11...v5.0.0-beta.12) (2024-04-12)


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

## [5.0.0-beta.11](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.10...v5.0.0-beta.11) (2024-03-01)


### Features

* **esl-utils:** extend `attr` decorator with inherit option to take over the value of declared attribute ([b29acde](https://github.com/exadel-inc/esl/commit/b29acde4a70fe60ff0372d119832ed1acffbbb17))


### Bug Fixes

* **esl-event-listener:** fix delegation handling for improper targets ([127297c](https://github.com/exadel-inc/esl/commit/127297cdc0552d6ab810ebb829807b8225b46977))
* **esl-popup:** fix incorrect behavior of popup for fit-major and fit-minor modes ([f26f907](https://github.com/exadel-inc/esl/commit/f26f90703309a2ead44669b4143196951c381abf))
* **esl-toggleable:** outside action should be handled from entire page ([aa6f5a5](https://github.com/exadel-inc/esl/commit/aa6f5a52a9c3639dc50e27d837247cfa22653aeb))

## [5.0.0-beta.10](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.9...v5.0.0-beta.10) (2024-02-14)


### Features

* **esl-event-listener:** ootb ability to skip custom `longwheel` and `swipe` events in case of content scrolling ([#2098](https://github.com/exadel-inc/esl/issues/2098)) ([ecc849f](https://github.com/exadel-inc/esl/commit/ecc849f26a8444ea8b840e698afab18e79e80391)), closes [#2085](https://github.com/exadel-inc/esl/issues/2085)
* **esl-popup:** rework esl-popup styles to use CSS variables ([cd781b9](https://github.com/exadel-inc/esl/commit/cd781b9195b876a24debb574410423e853ea3e1a))


### Bug Fixes

* **microtask:** fix argument list on next fn call ([f421e88](https://github.com/exadel-inc/esl/commit/f421e882e4fb01ad691bf94209aab486c22cd50b))
* **swipe:** fix swipe tests ([e1aefb8](https://github.com/exadel-inc/esl/commit/e1aefb8f3ac08b19e40cb138c413dd659ac3500d))
