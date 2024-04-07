# [4.15.0](https://github.com/exadel-inc/esl/compare/v4.14.1...v4.15.0) (2024-04-05)


### Bug Fixes

* **esl-event-listener:** fix delegation handling for improper targets ([127297c](https://github.com/exadel-inc/esl/commit/127297cdc0552d6ab810ebb829807b8225b46977))
* **esl-event-listener:** fix delegation recognition on non-DOM targets ([4716947](https://github.com/exadel-inc/esl/commit/47169479b46994e4fd1571a8cefe0454c983a89b))
* **esl-event-listener:** fix missing host in debug information of empty subscription ([4abfa1e](https://github.com/exadel-inc/esl/commit/4abfa1e12346662616cc7ac431bb9e0161fe0bf0)), closes [#2078](https://github.com/exadel-inc/esl/issues/2078)
* **esl-event-listener:** improve compatibility of decorated event handler type ([de0c37e](https://github.com/exadel-inc/esl/commit/de0c37e2a399c2e88c16b10c2baaec662538e9a8))
* **esl-panel-group:** `has-opened` attribute inconsistent ([13003e4](https://github.com/exadel-inc/esl/commit/13003e4b8d5bb039b7ae142739ea8a4667af4e2a))
* **esl-popup:** create optional autofocus property; update flow with optimized rendering flow ([8e71d20](https://github.com/exadel-inc/esl/commit/8e71d208368f9208b167900211399d138ee7eaa6))
* **esl-popup:** fix esl-popup infinitely created independently of placeholder state ([63ae414](https://github.com/exadel-inc/esl/commit/63ae4146073b1374bb63f23c37a9ac469a742275))
* **esl-share:** fix focus behavior to a loop inside esl-share-popup ([e3393fe](https://github.com/exadel-inc/esl/commit/e3393fe6641497af149a6f9df5c87e98e7d637c4))
* **esl-share:** fix share() method signature of print action ([ca7091d](https://github.com/exadel-inc/esl/commit/ca7091df6c6f361e4b8f3e2b328b08a9fb51044e))
* **esl-tab:** fix `esl-tabs` initialization delay before DOM ready ([52b0beb](https://github.com/exadel-inc/esl/commit/52b0bebe18fc19dc5a2ff528f1b6b44a7c79dce5))
* **esl-toggleable:** outside action should be handled from entire page ([aa6f5a5](https://github.com/exadel-inc/esl/commit/aa6f5a52a9c3639dc50e27d837247cfa22653aeb))
* **esl-tooltip:** add constraints to fix DOM position management for `esl-tooltip` ([9c25137](https://github.com/exadel-inc/esl/commit/9c25137217b93e3ef2c22d5898d550eca0160c2f))


### Features

* **esl-event-listener:** `ESLWheelTarget` proxy target created to handle long wheel user actions ([#2031](https://github.com/exadel-inc/esl/issues/2031)) ([4dc4bfc](https://github.com/exadel-inc/esl/commit/4dc4bfcd3f2f16f9695b9fd468d3b5a6c587c8e8)), closes [#2017](https://github.com/exadel-inc/esl/issues/2017)
* **esl-open-state:** create ESL Open State mixin ([a8327a8](https://github.com/exadel-inc/esl/commit/a8327a8671bde9544c05cb942589cf80415b84d8))
* **esl-popup:** add support of `PopupActionParams.extraClass` on popup level ([32b6d0a](https://github.com/exadel-inc/esl/commit/32b6d0a62a10b9009ac1352c9f68b2e7128ec5b0))
* **esl-popup:** add support of `PopupActionParams.extraStyle` ([399685b](https://github.com/exadel-inc/esl/commit/399685ba69e93a517ac9ec1d081c5926f51bd34b))
* **esl-share:** add ability to update config items (single one or in batch) ([96eac6b](https://github.com/exadel-inc/esl/commit/96eac6b1ad93d50bf16d76c9f0716d570c625bd9))
* **esl-share:** add OOTB configuration for the Skype share button ([c3a76c4](https://github.com/exadel-inc/esl/commit/c3a76c490288c61fb1f198d8792c407c350055c8))
* **esl-share:** add OOTB configuration for the Tumblr share button ([bb73186](https://github.com/exadel-inc/esl/commit/bb731864a0448853f2bb8d96f978b5f8e4b6ab65))
* **esl-share:** add OOTB configuration for the Viber share button ([5dd4ea4](https://github.com/exadel-inc/esl/commit/5dd4ea41a4700722d97cecdcf40193a5b7f01bd2))
* **esl-share:** add OOTB configuration for the WhatsApp share button ([748117f](https://github.com/exadel-inc/esl/commit/748117f199fcebd596a2079eea03ca5a14f7fe3e))
* **esl-toggleable:** introducing alternative internal hooks `shouldShow`/`shouldHide` instead of deprecated `onBeforeShow`/`onBeforeHide`. ([3786423](https://github.com/exadel-inc/esl/commit/378642368986284e041b8cc081f342f89c51769f))
* **esl-utils:** improve `rect` utility (it's almost ready to be immutable) ([f82fb1e](https://github.com/exadel-inc/esl/commit/f82fb1eed5ca06bff3718ce1ac1c86c2769fb2f3))

# [5.0.0-beta.9](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.8...v5.0.0-beta.9) (2024-01-19)


### Code Refactoring

* **esl-utils:** `TOUCH_EVENTS` from `device-detector` module retired, DeviceDetector is deprecated ([e9ed603](https://github.com/exadel-inc/esl/commit/e9ed603164f3cd913f6fe80027000f560aae454d))


### Features

* **attr:** add provider to default value in attr ([e482aaf](https://github.com/exadel-inc/esl/commit/e482aaf5fe6c33b482eecaadf65f00246dc14b8c))
* **esl-utils:** `isReducedMotion` detection result constant created ([2f3dd13](https://github.com/exadel-inc/esl/commit/2f3dd134ecbbb25c7239f87690448a8f4941110d))


### BREAKING CHANGES

* **esl-utils:** both `DeviceDetector.TOUCH_EVENTS` and `TOUCH_EVENTS` are retired from `device-detector` module.
Please also note that the DeviceDetector class is also deprecated.

# [5.0.0-beta.8](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.7...v5.0.0-beta.8) (2024-01-11)


### Bug Fixes

* **esl-share:** fix merging of `additional`(nested) params when `ESLShareConfig.update` method is called ([a1b1942](https://github.com/exadel-inc/esl/commit/a1b1942907e36597bac89166ba239be402b76df4))
* **esl-share:** rename copy action `alertText` param to `copyAlertMsg` ([3ba61ac](https://github.com/exadel-inc/esl/commit/3ba61aca2d6bd44648ab70a7897dcbffcaaa9233))

# [5.0.0-beta.7](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.6...v5.0.0-beta.7) (2024-01-05)

# [5.0.0-beta.6](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.5...v5.0.0-beta.6) (2024-01-05)

# [5.0.0-beta.5](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.4...v5.0.0-beta.5) (2024-01-05)

# [5.0.0-beta.4](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.3...v5.0.0-beta.4) (2024-01-05)


### Bug Fixes

* **esl-utils:** fix getting viewport sizes ([c17d2e3](https://github.com/exadel-inc/esl/commit/c17d2e3f9e5c9e3341857db65e43f6f83ddad240))


### Features

* **esl-toggleable:** introducing a base trigger class in purpose to simplify and make Trigger-Toggleable constructions more API strict in ESL ([4ea1565](https://github.com/exadel-inc/esl/commit/4ea1565d3fc29376f39920b392c9883065723382))

# [5.0.0-beta.3](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.2...v5.0.0-beta.3) (2023-12-21)


### Bug Fixes

* **esl-event-listener:** fix support for any object-like host ([9ca6aa4](https://github.com/exadel-inc/esl/commit/9ca6aa4e5a12971285c4af7d10a2ecf277c83197))
* **esl-utils:** `createZIndexIframe` retired ([ad678cb](https://github.com/exadel-inc/esl/commit/ad678cb3d20e122c8e7a87cb19c9e92b3f129a0a))
* **esl-utils:** `SyntheticEventTarget` optimizations ([a4c9b8d](https://github.com/exadel-inc/esl/commit/a4c9b8d4cfd9b9e3ad20b84a16b8eb6ccc5ae4c0))
* **esl-utils:** clean IE11 micro-optimizations ([7ed8830](https://github.com/exadel-inc/esl/commit/7ed883054b43c8c142409e6c6539aca93ef0048b))
* **esl-utils:** fix types for `unwrap` array utility ([a4b432a](https://github.com/exadel-inc/esl/commit/a4b432a8680b02cab6edb23a0fb3de85788a2985))
* **esl-utils:** simplified `flat` array utility ([788a782](https://github.com/exadel-inc/esl/commit/788a782ec03af63d370dd0c2785c40547a0f7624))
* **esl-utils:** simplified `union` utility ([043fe45](https://github.com/exadel-inc/esl/commit/043fe45054da7dd1c05c61ea16146ff53555c54e))
* **esl-utils:** simplified `uniq` array utility ([45f282f](https://github.com/exadel-inc/esl/commit/45f282f05ef8d05d0035d1a99d45034d9a4cf790))


### Code Refactoring

* Drop Edge old versions (<14) support ([b577fd1](https://github.com/exadel-inc/esl/commit/b577fd1cc085a6a2c5fbdcfa97a5401e0ad7b259))
* Drop IE11 support ([6d376ee](https://github.com/exadel-inc/esl/commit/6d376ee2a6a77ddff4827cda454b61b60a690d8a))
* **esl-media:** remove legacy features of `esl-media` ([c19561d](https://github.com/exadel-inc/esl/commit/c19561d8b04e95ab9525d7ca2dee2ced261b94a8))
* exclude duplicated exports of `esl-utils/decorators` ([f6c84af](https://github.com/exadel-inc/esl/commit/f6c84afe00558346994d4220db69ac102ccba817))


### Features

* drop deprecated aliases ([#1505](https://github.com/exadel-inc/esl/issues/1505)) ([df7f5e5](https://github.com/exadel-inc/esl/commit/df7f5e5c6a3fa62ad559bd93f4c56095def64a0c))


### BREAKING CHANGES

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

# [5.0.0-beta.2](https://github.com/exadel-inc/esl/compare/v5.0.0-beta.1...v5.0.0-beta.2) (2023-12-19)


### Bug Fixes

* **eslint:** fix peerDependency constraint ([20b5d9d](https://github.com/exadel-inc/esl/commit/20b5d9d2c8a1b1e51288524024dfe6c17b665671))

# [5.0.0-beta.1](https://github.com/exadel-inc/esl/compare/v4.14.1...v5.0.0-beta.1) (2023-12-19)


### Bug Fixes

* **esl-event-listener:** fix delegation recognition on non-DOM targets ([4716947](https://github.com/exadel-inc/esl/commit/47169479b46994e4fd1571a8cefe0454c983a89b))
* **esl-event-listener:** fix missing host in debug information of empty subscription ([4abfa1e](https://github.com/exadel-inc/esl/commit/4abfa1e12346662616cc7ac431bb9e0161fe0bf0)), closes [#2078](https://github.com/exadel-inc/esl/issues/2078)
* **esl-event-listener:** improve compatibility of decorated event handler type ([de0c37e](https://github.com/exadel-inc/esl/commit/de0c37e2a399c2e88c16b10c2baaec662538e9a8))
* **esl-panel-group:** `has-opened` attribute inconsistent ([13003e4](https://github.com/exadel-inc/esl/commit/13003e4b8d5bb039b7ae142739ea8a4667af4e2a))
* **esl-popup:** create optional autofocus property; update flow with optimized rendering flow ([8e71d20](https://github.com/exadel-inc/esl/commit/8e71d208368f9208b167900211399d138ee7eaa6))
* **esl-share:** fix focus behavior to a loop inside esl-share-popup ([e3393fe](https://github.com/exadel-inc/esl/commit/e3393fe6641497af149a6f9df5c87e98e7d637c4))
* **esl-share:** fix share() method signature of print action ([ca7091d](https://github.com/exadel-inc/esl/commit/ca7091df6c6f361e4b8f3e2b328b08a9fb51044e))
* **esl-toggleable:** rework actions pre-checks to fix flow on reopening toggleable ([c023e55](https://github.com/exadel-inc/esl/commit/c023e55da877a03e2378e6685d86839bcecb7dd1))
* **esl-tooltip:** add constraints to fix DOM position management for `esl-tooltip` ([9c25137](https://github.com/exadel-inc/esl/commit/9c25137217b93e3ef2c22d5898d550eca0160c2f))
* **esl-trigger:** default target for `esl-trigger` is not logically correct and obvious ([db4ffb8](https://github.com/exadel-inc/esl/commit/db4ffb8de4efb569587e56a978d8a23bb4671b50))


### Code Refactoring

* **esl-toggleable:** move `open` state updating to `onShow`/`onHide` callbacks ([b184eb1](https://github.com/exadel-inc/esl/commit/b184eb185c6816412c81a3a085e2cac276968165))


### Features

* **esl-event-listener:** `ESLWheelTarget` proxy target created to handle long wheel user actions ([#2031](https://github.com/exadel-inc/esl/issues/2031)) ([4dc4bfc](https://github.com/exadel-inc/esl/commit/4dc4bfcd3f2f16f9695b9fd468d3b5a6c587c8e8)), closes [#2017](https://github.com/exadel-inc/esl/issues/2017)
* **esl-open-state:** create ESL Open State mixin ([a8327a8](https://github.com/exadel-inc/esl/commit/a8327a8671bde9544c05cb942589cf80415b84d8))
* **esl-popup:** add support of `PopupActionParams.extraClass` on popup level ([32b6d0a](https://github.com/exadel-inc/esl/commit/32b6d0a62a10b9009ac1352c9f68b2e7128ec5b0))
* **esl-popup:** add support of `PopupActionParams.extraStyle` ([399685b](https://github.com/exadel-inc/esl/commit/399685ba69e93a517ac9ec1d081c5926f51bd34b))
* **esl-share:** add ability to update config items (single one or in batch) ([96eac6b](https://github.com/exadel-inc/esl/commit/96eac6b1ad93d50bf16d76c9f0716d570c625bd9))
* **esl-share:** add OOTB configuration for the Skype share button ([c3a76c4](https://github.com/exadel-inc/esl/commit/c3a76c490288c61fb1f198d8792c407c350055c8))
* **esl-share:** add OOTB configuration for the Tumblr share button ([bb73186](https://github.com/exadel-inc/esl/commit/bb731864a0448853f2bb8d96f978b5f8e4b6ab65))
* **esl-share:** add OOTB configuration for the Viber share button ([5dd4ea4](https://github.com/exadel-inc/esl/commit/5dd4ea41a4700722d97cecdcf40193a5b7f01bd2))
* **esl-share:** add OOTB configuration for the WhatsApp share button ([748117f](https://github.com/exadel-inc/esl/commit/748117f199fcebd596a2079eea03ca5a14f7fe3e))
* **esl-utils:** improve `rect` utility (it's almost ready to be immutable) ([f82fb1e](https://github.com/exadel-inc/esl/commit/f82fb1eed5ca06bff3718ce1ac1c86c2769fb2f3))


### BREAKING CHANGES

* **esl-toggleable:** `this.open` of Toggleable`s does not updating util `super.onShow` / `super.onHide` called.
Make sure you update `this.open` synchronously or manually notify consumers in case the super call of `onShow`/`onHide` should be postponed.
* **esl-trigger:** `esl-trigger` does not have target defined to `::next` by default
* **esl-toggleable:** `onBeforeShow` and `onBeforeHide` have retired. The constraint now inside `shouldShow`/`shouldHide` methods,
activator change now is the part of main togglable flow

## [4.14.1](https://github.com/exadel-inc/esl/compare/v4.14.0...v4.14.1) (2023-11-27)


### Bug Fixes

* **esl-media:** fix loading class condition should ignore lazy state ([c532ec0](https://github.com/exadel-inc/esl/commit/c532ec0ae01be87f6f15f466eb62560c7dd30995))
* **esl-related-target:** fixed handling of bubbling events `esl:show` and `esl:hide` ([6964148](https://github.com/exadel-inc/esl/commit/6964148eef49760a83a4b4cb589d02acb7a8f998))

# [4.14.0](https://github.com/exadel-inc/esl/compare/v4.13.1...v4.14.0) (2023-11-24)


### Bug Fixes

* **esl-scrollbar:** fix esl:change:scroll event handler invoked before scrollbar updates ([0c9c952](https://github.com/exadel-inc/esl/commit/0c9c95258d92e9557d047c739a4b5891e786ffcb))
* **esl-share:** add support types for correct using in Typesript ([143d3b6](https://github.com/exadel-inc/esl/commit/143d3b6ec81f78ab34b5f76702122c23019695a6))
* **esl-share:** fix a visual issue of displaying a huge list of buttons in a popup ([a2ce0a9](https://github.com/exadel-inc/esl/commit/a2ce0a92958ecd6da4b0a9717cf2af2969b89030))
* **esl-share:** fix button initialization on create ([72775f6](https://github.com/exadel-inc/esl/commit/72775f6553dfc82565dc40ac2b63201b9bc8067c))
* **esl-share:** fix ESLShareConfig deduplication behavior on selecting buttons for the list ([fe0d53a](https://github.com/exadel-inc/esl/commit/fe0d53a9b27cc90a029f412409907b59fd9cce97))
* **esl-share:** fix ready state attribute and ready state event ([3c3dade](https://github.com/exadel-inc/esl/commit/3c3dadefdba1a9837092bd2ff3f3e408b6a48d96))
* **esl-share:** make list an observable attribute ([f418820](https://github.com/exadel-inc/esl/commit/f4188203bd2f204e5e48258ef27ee714132378d4))
* **esl-tabs:** fix iOS auto-scroll / arrow controls boundaries on iOS devices when touch-scroll is enabled ([5845c3a](https://github.com/exadel-inc/esl/commit/5845c3a3c202b40781d79283b5304454e72ee9ab)), closes [#2030](https://github.com/exadel-inc/esl/issues/2030)


### Features

* **esl-panel-group:** add ability to enable match-height behavior for tabs height using `esl-tabs-equal-height` class ([6e0ea33](https://github.com/exadel-inc/esl/commit/6e0ea334eb3b1e52726be3788fe32e3c9b00faeb)), closes [#1949](https://github.com/exadel-inc/esl/issues/1949)
* **esl-popup:** internal ESLPopup implementation updated to use ESLEventListeners; usage of cached properties reduced ([9c78249](https://github.com/exadel-inc/esl/commit/9c78249385fe6c9a5c620cbe5031d3419384f64e))
* **esl-random-text:** create auxiliary `esl-random-text` component to generate dummy text ([0af54a1](https://github.com/exadel-inc/esl/commit/0af54a13926286ea47d3d7d50a010236f43958f8))
* **esl-share:** rename attribute into popup-params ([f07b471](https://github.com/exadel-inc/esl/commit/f07b471188b652ca94be9eb9d7d450952a523054))
* **esl-share:** retire esl-share and rename esl-share-popup-trigger into esl-share ([04baf4b](https://github.com/exadel-inc/esl/commit/04baf4bb36a999dde3afdc3985bb2c3f991d34de))
* **esl-toggleable:** introduce static option `DEFAULT_PARAMS` to define toggleable instance default show/hide params ([14c9e78](https://github.com/exadel-inc/esl/commit/14c9e787cc108e5ef7367dd12b7d7fcfe3b6a59d))
* **esl-tooltip:** add inlineStyles param to pass styles into shared instance of tooltip ([7b28cf8](https://github.com/exadel-inc/esl/commit/7b28cf88b50eca9c6a50be350943a04c1994ae49))
* **esl-utils:** introducing `parseCSSTime` format utility to extract time values from CSS ([#821](https://github.com/exadel-inc/esl/issues/821)) ([d26c96e](https://github.com/exadel-inc/esl/commit/d26c96ed28255a384b801b05ae61f04d34abcd70))
* **eslint:** eslint plugin to find and replace deprecated ESL alias on the customer's projects ([#1374](https://github.com/exadel-inc/esl/issues/1374)) ([3d43f92](https://github.com/exadel-inc/esl/commit/3d43f9250bacbb21087c808baf5ef007343faffe))

## [4.13.1](https://github.com/exadel-inc/esl/compare/v4.13.0...v4.13.1) (2023-11-03)


### Bug Fixes

* **esl-event-listener:** fix subscription to intersects event in `IntersectionObserver` ([0d9ccca](https://github.com/exadel-inc/esl/commit/0d9ccca1e3d9b392ff6b88238f4f745c7e47ce14))
* **esl-event-utils:** `ESLSwipeGestureTarget` target prevents inside element actions ([8fed4bc](https://github.com/exadel-inc/esl/commit/8fed4bc7784ced724c1d0e9410d6e388a1235a10)), closes [#2024](https://github.com/exadel-inc/esl/issues/2024)

# [4.13.0](https://github.com/exadel-inc/esl/compare/v4.12.0...v4.13.0) (2023-10-25)


### Bug Fixes

* **esl-media:** fix brightcove provider autoplay marker flow ([58793cd](https://github.com/exadel-inc/esl/commit/58793cd14aa9dfd8ca884d3a984a0c85df726b0d)), closes [#1979](https://github.com/exadel-inc/esl/issues/1979)
* **esl-popup:** fix default styles for `esl-popup` tag (uninitialized) ([e25eedf](https://github.com/exadel-inc/esl/commit/e25eedfcaf4c81ba0e5d446609b1843b3f815d77))
* **esl-popup:** update popup position according activator change ([#1679](https://github.com/exadel-inc/esl/issues/1679)) ([65e3801](https://github.com/exadel-inc/esl/commit/65e3801a9db981a08275c7c6b1b38be449c12d2a))
* **esl-scrollbar:** fix incorrect `at-start`/`at-end` handling when browser creates dimensions with the floating point ([852ad15](https://github.com/exadel-inc/esl/commit/852ad15b5c8f8c918f60e26199739ff79c8c6580))
* **esl-share:** add a fill color to social network icons ([c0d62ac](https://github.com/exadel-inc/esl/commit/c0d62ac774a9750e6d1f25f7d48c125a1d674066))
* **esl-share:** change default twitter (x.com) icon and bg color ([8c544e4](https://github.com/exadel-inc/esl/commit/8c544e4556c6cf9c98f9f827175f8d3f3dbce408))
* **esl-share:** show copy notification just in case it is successful ([f57fe98](https://github.com/exadel-inc/esl/commit/f57fe98cf9818c861d6f4cb57dc467d1c2387bb8))
* **esl-utils:** fix `debounce` helper random access of undefined ([8cd87e8](https://github.com/exadel-inc/esl/commit/8cd87e872cd3a2dcd6231c09e2cdefb7db5ea3d1))


### Features

* **esl-event-listener:** add `condition` descriptor property to legally prevent subscription ([00b719c](https://github.com/exadel-inc/esl/commit/00b719ca28994f41b2537aefba740b6ed16234ed)), closes [#1947](https://github.com/exadel-inc/esl/issues/1947)
* **esl-event-listener:** create `ESLIntersectionTarget` adapter utility for managing `IntersectionObserver` subscriptions trough event listeners ([34bb7e8](https://github.com/exadel-inc/esl/commit/34bb7e835a33080b63a3dc83928cfbd9f4751072))
* **esl-share:** add default-icon marker to render icon on button init ([081b526](https://github.com/exadel-inc/esl/commit/081b52601583cc3500e9cf40298ddeec702e0b93))
* **esl-share:** add out of the box share config default ([4b97632](https://github.com/exadel-inc/esl/commit/4b97632007dab87afaa7966a27f3aade80369c12))
* **esl-share:** create esl-share-list component ([90b1c1d](https://github.com/exadel-inc/esl/commit/90b1c1d8f4f2a4afa815026a242f1be78a72b2ba))
* **esl-share:** remove iconBackground property from share buttons config ([27d793d](https://github.com/exadel-inc/esl/commit/27d793d542a3d990d2eb1a94f67135ba1885b7d2))
* **esl-share:** rework esl-share-button custom element API ([96a7f84](https://github.com/exadel-inc/esl/commit/96a7f84d4f59cac504dd168dd54767cc9687d787))
* **esl-share:** rework share popup internal implementation ([9b775a0](https://github.com/exadel-inc/esl/commit/9b775a07bb9db96ba6815eb548d0065d28aa965c))

# [4.12.0](https://github.com/exadel-inc/esl/compare/v4.11.0...v4.12.0) (2023-09-22)


### Bug Fixes

* **esl-tabs:** observe element resize instead of window using `ESLResizeObserverTarget` ([9dd4639](https://github.com/exadel-inc/esl/commit/9dd4639c6d937758725c5a4e9e444c6c78d31215))


### Code Refactoring

* **esl-event-listener:** restructure `esl-event-listener/core/targets` ([fbdb6c3](https://github.com/exadel-inc/esl/commit/fbdb6c335e9863fddb6a817a66689cc127356335))


### Features

* **esl-event-listener:** `ESLEventUtils.unsubscribe` implementation moved to internal `ESLEventListener.unsubscribe` ([eaa4204](https://github.com/exadel-inc/esl/commit/eaa42045c39f3cbb5f07568aab93b9bd2a6fba98))
* **esl-event-listener:** add `SwipeEventTarget` to subscribe `swipe` events using `ESLEventListener` ([e7e69a2](https://github.com/exadel-inc/esl/commit/e7e69a257b74f985be0c191b8e722dcb124bc74c)), closes [#1809](https://github.com/exadel-inc/esl/issues/1809)
* **esl-media:** support for lazy initialization by `lazy` attribute for `ESLMedia` ([f83d65a](https://github.com/exadel-inc/esl/commit/f83d65a91e064e6f8aa2ddc7f9cc4e8b49eacba5))


### BREAKING CHANGES

* **esl-event-listener:** (if there is references to internal files) `resize.adapter.ts`/`resize.adapter.event.ts` renamed to `resize.target.ts`/`resize.target.event.ts`

# [4.11.0](https://github.com/exadel-inc/esl/compare/v4.10.0...v4.11.0) (2023-09-01)


### Bug Fixes

* **esl-event-listener:** `ESLResizeObserverTarget.for` handles no target cases silently (warning + null result) ([b28d6af](https://github.com/exadel-inc/esl/commit/b28d6aff7a674fc04d23aaedadc03ace0f8d9cb3)), closes [#1885](https://github.com/exadel-inc/esl/issues/1885)
* **esl-event-listener:** fix support of separate DOM realms for `ESLEventListener` ([905e7a8](https://github.com/exadel-inc/esl/commit/905e7a886b6ab975e32e712ae4f4b1109c42f0de))
* **esl-media:** update `esl-media` refresh handler to use consistent `isElement` check ([d6f8855](https://github.com/exadel-inc/esl/commit/d6f8855428d69323815689335449ce1e17f9568f))
* **esl-scrollbar:** update `esl-scrollbar` to use consistent `isElement` check on refresh and mutation observation ([f817837](https://github.com/exadel-inc/esl/commit/f817837e5ea1b35f8b4f0d2b2000321d2ddcc560))
* **esl-trigger:** update `esl-trigger` to use consistent `isElement` check in `isTargetIgnored` check ([fe41661](https://github.com/exadel-inc/esl/commit/fe4166110dd077ac6759a7b4b509e6b11af058b2))
* **esl-utils:** fix support of separate DOM realms for `getScrollParent` ([eb7ede6](https://github.com/exadel-inc/esl/commit/eb7ede60531c97f91c90e66df00aff1f43794514))
* **esl-utils:** fix support of separate DOM realms for `resolveDomTarget` ([c16e1dd](https://github.com/exadel-inc/esl/commit/c16e1ddfa762f2ad7d64f308857fb5aa1bc93bc8))
* **esl-utils:** fix types and Element check for `isVisible` predicate (support of separate DOM realms) ([7c83e09](https://github.com/exadel-inc/esl/commit/7c83e09e576ca1afb76cbf93698a261b28de9c42))


### Features

* **esl-panel-group:** add readonly `has-opened` marker for `esl-panel-group` ([a565a71](https://github.com/exadel-inc/esl/commit/a565a71ba7d6b89f834b5241b941b6314012ac4a))
* **esl-panel-group:** support for esl-panel-group driven animation to closed state ([0698b1c](https://github.com/exadel-inc/esl/commit/0698b1c4d3942127adcd4c2674ce4807dbf9f963))
* **esl-utils:** `isPlainObject` and `isElement` type guard utilities ([86f0bfb](https://github.com/exadel-inc/esl/commit/86f0bfb957d2dfbea4143b9b5af6d3e59a1def32))

# [4.10.0](https://github.com/exadel-inc/esl/compare/v4.9.4...v4.10.0) (2023-08-10)


### Bug Fixes

* **esl-footnotes:** shape to support TSX is missing in module ([fd8cd07](https://github.com/exadel-inc/esl/commit/fd8cd076e07d2ea745da9cd59488f3f3001dbcae))
* **esl-togglable:** open attribute change behavior ([826b27b](https://github.com/exadel-inc/esl/commit/826b27b9e4a48e0e42da96c0da7a8db1563473e1))
* **esl-toggleable:** fix activator when close-on inner trigger click handled ([#1852](https://github.com/exadel-inc/esl/issues/1852)) ([f450d8b](https://github.com/exadel-inc/esl/commit/f450d8b68395785b5bb7e67d753994653d9d1a0a))
* **esl-utils:** fix unhandled rejection when deferred is rejected but actual promise was not requested ([#1839](https://github.com/exadel-inc/esl/issues/1839)) ([5e111ba](https://github.com/exadel-inc/esl/commit/5e111baf343fba2c4e49c9618131fd50b78376f8))


### Features

* **esl-toggleable:** change `closeOnEsc` and `closeOnOutsideAction` mappers to extended boolean ('0' and 'false' values now considered as falsy) ([181a2b7](https://github.com/exadel-inc/esl/commit/181a2b767cfcb041620d30c95e08dffd3d3fd064))
* **esl-trigger:** change `ignoreEsc` mapper to extended boolean ('0' and 'false' values now considered as falsy) ([9ccee3d](https://github.com/exadel-inc/esl/commit/9ccee3d03486df3cc88a7cfd06448f18dd139623))
* **esl-utils:** `lockScroll` / `unlockScroll` methods reworked with no-scroll detection ([25b5b91](https://github.com/exadel-inc/esl/commit/25b5b9139c36f9bfc78319ba39e7cf6cee464a46))
* **esl-utils:** create `toBooleanAttribute` and create extended boolean attribute flow ([e039256](https://github.com/exadel-inc/esl/commit/e0392569045dc8526d0d1f8ff383e54b044f5f1b))

## [4.9.4](https://github.com/exadel-inc/esl/compare/v4.9.3...v4.9.4) (2023-07-17)


### Bug Fixes

* **esl-base-element:** fix redefine tag feature (existing component receives incorrect tag name) ([6c17690](https://github.com/exadel-inc/esl/commit/6c17690e9c332927df91bd7c87e93cb0732ba8bf)), closes [#1804](https://github.com/exadel-inc/esl/issues/1804)

## [4.9.3](https://github.com/exadel-inc/esl/compare/v4.9.2...v4.9.3) (2023-07-13)


### Bug Fixes

* **esl-footnotes:** fix esl-tooltip related to the note does not perceive dir and lang of original content ([e506d0d](https://github.com/exadel-inc/esl/commit/e506d0dbf6504197032e384139115433b8d1a414))

## [4.9.2](https://github.com/exadel-inc/esl/compare/v4.9.1...v4.9.2) (2023-07-12)


### Bug Fixes

* **esl-footnotes:** remove the possibility of setup esl-note anchor markup conditionally ([a26a3ed](https://github.com/exadel-inc/esl/commit/a26a3eda139eabc5db2094b89028b4c3cd0db8cb))

## [4.9.1](https://github.com/exadel-inc/esl/compare/v4.9.0...v4.9.1) (2023-07-07)


### Bug Fixes

* hotfix for writeable `is` field short initialization syntax ([e46461b](https://github.com/exadel-inc/esl/commit/e46461bf69335993f7005efd55b8fd55dbe0f152))

# [4.9.0](https://github.com/exadel-inc/esl/compare/v4.8.0...v4.9.0) (2023-07-07)


### Bug Fixes

* **esl-animate:** default print styles for esl-animate ootb animation ([3d4ea2a](https://github.com/exadel-inc/esl/commit/3d4ea2a52cb5c5de019bf5aedc94d182fbf7dfc8))
* **esl-animate:** missing types for `esl-animate` module ([2000e04](https://github.com/exadel-inc/esl/commit/2000e041f882a7f22af620285b52ff5e5caf3b19))
* **esl-base-element:** more accurate check for element redeclaration (detects both: tag and class inconsistency) ([66266a9](https://github.com/exadel-inc/esl/commit/66266a9996d52245c3c094edfb8397066e1d6895))
* **esl-mixin-element:** remove mixin store invalidate on re-requesting registration + more accurate exceptions ([86b7620](https://github.com/exadel-inc/esl/commit/86b7620a3e18408701f7bde3234bc7781abfff9a))
* **esl-mixin-element:** significant improvement for mixin registration process (scope DOM invalidation to changes records and registered mixin type ) ([06bd2ff](https://github.com/exadel-inc/esl/commit/06bd2ff1d32337af86fbe7d43b4ecc327b17110c))
* **esl-panel-group:** default print styles for esl-panel-group ([9a2fc28](https://github.com/exadel-inc/esl/commit/9a2fc281d06b2070a90679cbdf758d606dd9aa0b))
* **esl-panel:** default print styles for esl-panel ([68cf512](https://github.com/exadel-inc/esl/commit/68cf512f709d51686c03797066e382f1f4b38080))
* **esl-select:** activator lost on dropdown hide ([02de9dd](https://github.com/exadel-inc/esl/commit/02de9ddb7fd6a3e590b4201890565a9321221162))
* **gh-pages:** default print styles for gh-pages ([bb8a0ab](https://github.com/exadel-inc/esl/commit/bb8a0ab98ac85502af179d43a521dbeee32666cc))


### Code Refactoring

* **esl-animate:** rework default animation classes ([69ef3af](https://github.com/exadel-inc/esl/commit/69ef3af0927e5cf2e283326e86bc134f8999a477))


### Features

* **esl-footnotes:** add support of the anchor relationship between note and footnote for the print version ([d30c662](https://github.com/exadel-inc/esl/commit/d30c6629729071db724bd377681863dbf260947b))
* **esl-footnotes:** create esl-note-ignore mixin ([3caa0d5](https://github.com/exadel-inc/esl/commit/3caa0d52ef260876009bb04c961ebc5fbba11a10))
* **esl-select:** internal `esl-select-dropdown` is migrated to `esl-popup` ([#1393](https://github.com/exadel-inc/esl/issues/1393)) ([5f0009c](https://github.com/exadel-inc/esl/commit/5f0009cdefb341aa3cd0f5ea7e95e84633148a27))
* **esl-share:** create esl-share-trigger component ([75a84f6](https://github.com/exadel-inc/esl/commit/75a84f6eb29e971b5bd2095af809ad9149c3c078))
* **esl-share:** create popup mode for esl-share component ([0df4116](https://github.com/exadel-inc/esl/commit/0df41165e9f5aee54709f2c3c68609412aa5d6bb))


### BREAKING CHANGES

* **esl-animate:** default esl-animate module class `esl-animate-slide-up` replaced with `esl-animate-slide up`
* **esl-animate:** default esl-animate module class `esl-animate-slide-down` replaced with `esl-animate-slide down`
* **esl-animate:** default esl-animate module class `esl-animate-slide-left` replaced with `esl-animate-slide left`
* **esl-animate:** default esl-animate module class `esl-animate-slide-right` replaced with `esl-animate-slide right`

# [4.8.0](https://github.com/exadel-inc/esl/compare/v4.7.1...v4.8.0) (2023-06-26)


### Features

* **esl-animate:** animate mixin element ([9f9c156](https://github.com/exadel-inc/esl/commit/9f9c156c098df5d4de61e7cc7d13753e38a0391f))
* **esl-toggleable:** ability to set up state class to any related element ([#1728](https://github.com/exadel-inc/esl/issues/1728)) ([648b114](https://github.com/exadel-inc/esl/commit/648b1149b1dc336779350fdea25f1cd90f4837f7)), closes [#1727](https://github.com/exadel-inc/esl/issues/1727)

## [4.7.1](https://github.com/exadel-inc/esl/compare/v4.7.0...v4.7.1) (2023-06-15)


### Bug Fixes

* **esl-utils:** fix missing export of `createDeferred` method under `esl-utils/async/promise` ([756440e](https://github.com/exadel-inc/esl/commit/756440e8840e131a03d0ed7f82c9bd93caa3ba59))
* **esl-utils:** fix unsubscription if `promisifiedEvent` rejected by timeout ([#1698](https://github.com/exadel-inc/esl/issues/1698)) ([#1724](https://github.com/exadel-inc/esl/issues/1724)) ([b675793](https://github.com/exadel-inc/esl/commit/b675793079c2650f243b1dac580f0666e801a732))

# [4.7.0](https://github.com/exadel-inc/esl/compare/v4.6.0...v4.7.0) (2023-06-09)


### Bug Fixes

* **esl-utils:** fix sequence finder behaviour in case step function leads to loop ([c23e2c2](https://github.com/exadel-inc/esl/commit/c23e2c2622bec1e894ba97ba068d198d6dd53a4e))


### Code Refactoring

* **esl-carousel:** remove legacy esl-carousel implementation ([b31599a](https://github.com/exadel-inc/esl/commit/b31599ab101afb14081c4e2d8619ce9ee390571a))


### Features

* **esl-event-listener:** add the ability to get the current delegated event target ([#1675](https://github.com/exadel-inc/esl/issues/1675)) ([8b4b089](https://github.com/exadel-inc/esl/commit/8b4b089ca8d63ae7df0f39e4434ff7b2b38f5e59))
* **esl-popup:** change the logic of auto injection of arrow ([a7ba04c](https://github.com/exadel-inc/esl/commit/a7ba04c2f9f16caab992566354a98376fca1672f))
* **esl-utils:** add `findNextLooped` and `findPrevLooped` common traversing utility ([80a4e67](https://github.com/exadel-inc/esl/commit/80a4e67324301665b16b3780f6f81e03bcc27914))
* **esl-utils:** add `promisifyNextRender` common utility ([3a93887](https://github.com/exadel-inc/esl/commit/3a938876791201e38919af33646d8fb28d248e45))
* **esl-utils:** introduce `promisifyTransition` utility ([68d0556](https://github.com/exadel-inc/esl/commit/68d0556d56624728ff57a77e5f6cead568ab14f3))
* **esl-utils:** utility to postpone execution to microtask ([4f4f637](https://github.com/exadel-inc/esl/commit/4f4f6374741d2534547e650bf59d39596008f25b))


### BREAKING CHANGES

* **esl-carousel:** `draft/esl-carousel` no longer available

# [4.6.0](https://github.com/exadel-inc/esl/compare/v4.5.0...v4.6.0) (2023-05-22)


### Bug Fixes

* **esl-utils:** fix `unwrap` method signature types ([ee16641](https://github.com/exadel-inc/esl/commit/ee16641844fb7d10f845eb26ff54264c799833ac))
* **esl-utils:** make ts decorators work with babel ([05462da](https://github.com/exadel-inc/esl/commit/05462daf52d1471a9d7676abae2862d2f8e5556a))


### Features

* **🚩esl-share:** beta version of esl-share([#1327](https://github.com/exadel-inc/esl/issues/1327)) component released ([#1660](https://github.com/exadel-inc/esl/issues/1660)) ([be7aa83](https://github.com/exadel-inc/esl/commit/be7aa830c47ddc0b8e70cd593718e90709e9d3f5))

# [4.5.0](https://github.com/exadel-inc/esl/compare/v4.4.1...v4.5.0) (2023-05-15)


### Features

* `ESLBaseComponent` interface shared between `ESLMixinElement` and `ESLBaseElement` ([507dfe8](https://github.com/exadel-inc/esl/commit/507dfe88e9473555f8f0d50c1ea32b0415413e72))
* **esl-mixin-element:** `ESLMixinElement` API updates: **IMPORTANT !** hooks methods now have protected visibility modifier ([2be1b44](https://github.com/exadel-inc/esl/commit/2be1b4438d7d47af573b83546085475d4e512322))
* **esl-mixin-element:** add `getAll` public utility method ([2be1b44](https://github.com/exadel-inc/esl/commit/2be1b4438d7d47af573b83546085475d4e512322))
* **esl-mixin-element:** add the ability to get mixin by name by `ESLMixinElement` ([7365e13](https://github.com/exadel-inc/esl/commit/7365e13d563b1f56daab5be4149a4e6475e1ec3f))
* **esl-mixin-element:** improve observation mechanism of mixin's observed attributes ([e7ed2ab](https://github.com/exadel-inc/esl/commit/e7ed2ab93493e15e22fbf1c37f3baf310e3651e9))
* **esl-mixin-element:** mixin primary attribute observed unconditionally by mixin manager ([c6741a4](https://github.com/exadel-inc/esl/commit/c6741a4dddafc11a5017b8bad9cfbf0408aa2ab2))


## [4.4.1](https://github.com/exadel-inc/esl/compare/v4.4.0...v4.4.1) (2023-04-25)


### Bug Fixes

* **esl-utils:** incorrect throttle behaviour ([918944d](https://github.com/exadel-inc/esl/commit/918944d0255961651eb3df8f060a9b65fc1ca228))
* **gh-pages:** add new favicon icons ([b2846be](https://github.com/exadel-inc/esl/commit/b2846bea077fe19a8c321349b795837a43cb78e6))
* **gh-pages:** add new favicon icons according to the favicons guide ([83d0ca4](https://github.com/exadel-inc/esl/commit/83d0ca44ac2640fed04023878c696399562b5bac))

## [4.4.1](https://github.com/exadel-inc/esl/compare/v4.4.0...v4.4.1) (2023-04-25)


### Bug Fixes

* **esl-utils:** incorrect throttle behaviour ([918944d](https://github.com/exadel-inc/esl/commit/918944d0255961651eb3df8f060a9b65fc1ca228))
* **gh-pages:** add new favicon icons ([b2846be](https://github.com/exadel-inc/esl/commit/b2846bea077fe19a8c321349b795837a43cb78e6))
* **gh-pages:** add new favicon icons according to the favicons guide ([83d0ca4](https://github.com/exadel-inc/esl/commit/83d0ca44ac2640fed04023878c696399562b5bac))

# [4.4.0](https://github.com/exadel-inc/esl/compare/v4.3.1...v4.4.0) (2023-04-12)


### Bug Fixes

* **esl-event-listener:** fix `ESLEventTargetDecorator` dispatched event `target` ([8252988](https://github.com/exadel-inc/esl/commit/82529888e18e857a0fe86ff4fdd4faf4c746f26b))
* **esl-event-listener:** fix target delegation checking ([b307ce6](https://github.com/exadel-inc/esl/commit/b307ce647c9efd3d7e639dcf873f7a428ecb1d85))
* **esl-event-listener:** fix typechecking for TS5 ([d434275](https://github.com/exadel-inc/esl/commit/d434275d7db041c77329f01885dcadf3e53fdb3f))
* **esl-media:** fix `iv_load_policy` param and small test regexp optimization in YouTube provider ([2deb64b](https://github.com/exadel-inc/esl/commit/2deb64b8ff2e6c564eba5f5b95746c2c285d9394))
* **esl-utils:** `SynteticEventTarget` no longer mutate `event.target` without need; `event.currentTarget` fix to current instance ([d5e2c78](https://github.com/exadel-inc/esl/commit/d5e2c78a3c41341dffe46c7419aedff0f38ae1d1)), closes [#1534](https://github.com/exadel-inc/esl/issues/1534)


### Code Refactoring

* **esl-event-listener:** change API of extended EventTargets ([39b01cc](https://github.com/exadel-inc/esl/commit/39b01cc210672a6cd832b56a4bf5dfd0b9fb1b09))


### Features

* **esl-base-element:** `ESLBaseElement.prototype.baseTagName` shortcut ([c10fc6d](https://github.com/exadel-inc/esl/commit/c10fc6da0547658220693979c32d566ccea1637b))
* **esl-event-listener:** improved `ESLResizeObserverTarget` API with a standardized `ESLElementResizeEvent` ([8e1d72e](https://github.com/exadel-inc/esl/commit/8e1d72e7f28ad6a1865ed092cbc0253709e5b9dd))
* **esl-event-listener:** support for `ESLDomElementTarget` in `ESLResizeObserverTarget` ([#1573](https://github.com/exadel-inc/esl/issues/1573)) ([f177381](https://github.com/exadel-inc/esl/commit/f177381066024f5fc74704f86a16682f6b2346f8))
* **esl-utils:** `getEventListeners()` method introduced for `SynteticEventTarget` ([#1548](https://github.com/exadel-inc/esl/issues/1548)) ([c293b61](https://github.com/exadel-inc/esl/commit/c293b61e61e913a7e299e76a2aad88c90bbc9a12))


### BREAKING CHANGES (Beta)

* **esl-event-listener:** beta `ESLEventUtils.resize` replaced with `ESLResizeObserverTarget.for`
* **esl-event-listener:** beta `ESLEventUtils.decorate` replaced with `ESLDecoratedEventTarget.for`

## [4.3.1](https://github.com/exadel-inc/esl/compare/v4.3.0...v4.3.1) (2023-03-09)


### Bug Fixes

* **esl-event-listener:** (HOTFIX) `[@listen](https://github.com/listen)` should not require host typeof `ESLDomElementTarget` ([01b84c3](https://github.com/exadel-inc/esl/commit/01b84c361100237a181a46595e0f6b67a5067353))

# [4.3.0](https://github.com/exadel-inc/esl/compare/v4.2.1...v4.3.0) (2023-03-08)


### Bug Fixes

* **esl-event-utils:** fix `SyntheticEventTarget` event `target` descriptor configurability ([64a6a84](https://github.com/exadel-inc/esl/commit/64a6a8439a338c4fc2e26a9be6f7750d1487a5ae))
* **esl-media:** `ref:` prefix is optional, user should be able to use internal id ([465fbec](https://github.com/exadel-inc/esl/commit/465fbecd9b45d5f1a5f2fabf8db5a62b5d0f1ba5))


### Features

* **esl-event-listener:** `SyntheticEventTarget` extended with ability to pass custom target to `dispatchEvent` method ([4982a45](https://github.com/exadel-inc/esl/commit/4982a45bf7c38304e3e360180d47152fce1db4ad))
* **esl-event-listener:** create EventTarget decorator and window target utilities ([ca0f0de](https://github.com/exadel-inc/esl/commit/ca0f0de70adf180654afd50b06f78f8e74451f7f))
* **esl-event-listener:** New `ESLEventUtils.resize` utility to create an adapter `EventTargets` for `ResizeObserver` ([e1de096](https://github.com/exadel-inc/esl/commit/e1de09611815d65bccceb91ae2771b870a70c345))
* **esl-utils:** `SyntheticEventTarget` API extended with ability to choose target value and specify default event type ([3fc1f5d](https://github.com/exadel-inc/esl/commit/3fc1f5d5a7f87fe41d6f91737f7d217eedb5bb4e))
* **esl-utils:** attr api extension ([07e3a9f](https://github.com/exadel-inc/esl/commit/07e3a9ffd1a54a9f83cf4e643e507568e730d84c))

## [4.2.1](https://github.com/exadel-inc/esl/compare/v4.2.0...v4.2.1) (2023-02-20)


### Bug Fixes

* **esl-image:** attribute callback before connect ([659fa20](https://github.com/exadel-inc/esl/commit/659fa2031577bba2ce19af32c6950c9403a2ef27))
* **esl-utils:** `memoize.clear` and `memoize.has` signature types improved ([4068bfa](https://github.com/exadel-inc/esl/commit/4068bfaff2150cd2aeb389fcc230a07cd826466a))

# [4.2.0](https://github.com/exadel-inc/esl/compare/v4.1.1...v4.2.0) (2023-02-02)


### Bug Fixes

* **esl-event-listener:** allow to redeclare function descriptor data ([e304726](https://github.com/exadel-inc/esl/commit/e304726ba00f65b70ac25a194703a21aa9ac5d5c))
* **esl-event-listener:** fix `isEventDescriptor` check for incorrect type of event key ([729b486](https://github.com/exadel-inc/esl/commit/729b486e0a934820502ffa8696be28a4f1b1465a))
* **esl-footnotes:** esl-note is not respond on "ignore" attribute change ([7e0f4b8](https://github.com/exadel-inc/esl/commit/7e0f4b8ea8802b93ca0dc9060cfa47a371d729be))
* **esl-mixin-element:** fix oldValue argument of attributeChangedCallback ([36c8d0f](https://github.com/exadel-inc/esl/commit/36c8d0fd5c20ba04eeed6139bcf1688c740e0036))
* **esl-utils:** fix `isObject` predicate signature to accept symbol keys ([c8f0611](https://github.com/exadel-inc/esl/commit/c8f0611ff916e15e8be028766baf6f98a5c9e2a4))


### Features

* **esl-event-listener:** IE safe private key for ESLEventListeners (now stores under Symbol in modern browsers) ([eb5e6c3](https://github.com/exadel-inc/esl/commit/eb5e6c3c37a224309ba3699f47ac75e01f9dbe9f))
* **esl-event-listener:** simplified way to subscribe all auto descriptors ([e6c432b](https://github.com/exadel-inc/esl/commit/e6c432b542d7b9f74079fb5012e9b87373bf805f))
* **esl-related-target:** make related target able to targeting multiple related togglable ([#1398](https://github.com/exadel-inc/esl/issues/1398)) ([9a4423c](https://github.com/exadel-inc/esl/commit/9a4423c63f34731a9708cd93aaca41e8f07690de))
* **esl-utils:** `isVisible` predicate and `ESLTraversingQuery` filter created according to [#931](https://github.com/exadel-inc/esl/issues/931) spec ([#1341](https://github.com/exadel-inc/esl/issues/1341)) ([70ea8fb](https://github.com/exadel-inc/esl/commit/70ea8fbc134eb03ec2aba911600f7441ee953c93))
* **esl-utils:** isVisible predicate ([510d396](https://github.com/exadel-inc/esl/commit/510d396e6393b907afc885f038684b421d2a7449))

## [4.1.1](https://github.com/exadel-inc/esl/compare/v4.1.0...v4.1.1) (2023-01-11)


### Bug Fixes

* **esl-popup:** protected methods visibility ([f53af36](https://github.com/exadel-inc/esl/commit/f53af369e75e6fe902328b947348d94c3ae41627))
* **redirect:** add permalink for ` /utils/esl-utils/` path ([bb3e01a](https://github.com/exadel-inc/esl/commit/bb3e01a1e65dd3ab65c18940bcdb03a57cf108ca))

# [4.1.0](https://github.com/exadel-inc/esl/compare/v4.0.2...v4.1.0) (2022-12-09)


### Bug Fixes

* **esl-scrollbar:** add `resize` event ([36cd4c3](https://github.com/exadel-inc/esl/commit/36cd4c304feaa4d2279a04f860c478ba007004cc))
* **esl-scrollbar:** change target on `window` for `scroll` event ([93a0560](https://github.com/exadel-inc/esl/commit/93a05606178180185f7085fe72e9c0defb55784f))
* **esl-scrollbar:** fix visibility and size of scroll at start ([#1369](https://github.com/exadel-inc/esl/issues/1369)) ([3f58aac](https://github.com/exadel-inc/esl/commit/3f58aacda313cc0a55562a4085a4e15db8b1d480))
* **esl-scrollbar:** remove meta declaration `[@listen](https://github.com/listen)` ([e105286](https://github.com/exadel-inc/esl/commit/e105286f3ae5013a9474a3d1a6a9c4ad816c88aa))
* **gh-pages:** code refactoring ([4a8aefb](https://github.com/exadel-inc/esl/commit/4a8aefb3141013f204714264990de25a104b5180))
* **gh-pages:** code refactoring ([b48eed0](https://github.com/exadel-inc/esl/commit/b48eed098c70bfa9767b0971d9c54df18f562d14))
* **gh-pages:** create redirect links ([bd7228f](https://github.com/exadel-inc/esl/commit/bd7228fa68c24c1a02e908d0a5746146eb175df9))


### Features

* **esl-related-target:** add esl-related-target mixin ([97255b1](https://github.com/exadel-inc/esl/commit/97255b15e0f67eb74817cf87a2413d992a2af544))
* **esl-utils:** add ability to pass multiple memoized props to clear at once ([3dca390](https://github.com/exadel-inc/esl/commit/3dca3905a49aed181b464a686536572e8c0b0d71))
* **eslint:** move files to new `linting` folder ([a196683](https://github.com/exadel-inc/esl/commit/a1966832ae6fc7872ef464d6e4454185ea1be2c6))

## [4.0.2](https://github.com/exadel-inc/esl/compare/v4.0.1...v4.0.2) (2022-10-19)


### Bug Fixes

* **esl-media-query:** fix missing Event type in `core.ts` bundle ([afe54f7](https://github.com/exadel-inc/esl/commit/afe54f7916b6e16c53322dfb492ed2d1ab5936c8))

## [4.0.1](https://github.com/exadel-inc/esl/compare/v4.0.0...v4.0.1) (2022-10-18)


### Bug Fixes

* **esl-media:** make `media-type` optional if `media-src` defined (auto-provider feature) ([029e368](https://github.com/exadel-inc/esl/commit/029e368bbafbdad7a4f8c648b96892d090663096))
* **esl-tabs:** fix styles based on current scrollable type ([c8dd855](https://github.com/exadel-inc/esl/commit/c8dd855c95384d38ffe88c06c1b20c8088e6cc11))
* fix `esl-tabs` and `esl-panel-group` shape `children` property ([6ad7582](https://github.com/exadel-inc/esl/commit/6ad7582e93406b92bb0f4a5b404978f62b310056))

# [4.0.0](https://github.com/exadel-inc/esl/compare/v3.14.3...v4.0.0) (2022-10-04)

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


Co-authored-by: NastaLeo <alesun@exadel.com>
Co-authored-by: Anna Barmina <abarmina@exadel.com>
Co-authored-by: julia-murashko <ymurashka@exadel.com>
Co-authored-by: Yuliya Adamska <yadamska@exadel.com>
Co-authored-by: Dmytro Shovchko <d.shovchko@gmail.com>
Co-authored-by: fshovchko <fshovchko@exadel.com>
Co-authored-by: nsmirnova <nsmirnova@exadel.com>

# [4.0.0-beta.19](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.18...v4.0.0-beta.19) (2022-09-30)


### Bug Fixes

* **esl-event-listener:** allow to subscribe listener by global selector without host instanceof HTMLElement ([fb17e6b](https://github.com/exadel-inc/esl/commit/fb17e6bb88e4fd054d2426511d12ba755c211760))
* **esl-tooltip:** keyboard handling fix ([25d7dc6](https://github.com/exadel-inc/esl/commit/25d7dc658339d371b87db44c1fdf86c7be234725))


### Code Refactoring

* **esl-scrollbar:** migrate all `esl-scrollbar` listeners to ESLEventListener feature ([b5fd7a5](https://github.com/exadel-inc/esl/commit/b5fd7a54ec711298afdd070083958b9f25988bfa))
* **esl-tabs:** migrate `esl-tabs` to ESLEventListeners ([f2d6157](https://github.com/exadel-inc/esl/commit/f2d6157bd6ace254c9de57653440875362e15602))


### Features

* **esl-footnotes:** `ESLFootnotes` migrated to use ESLEventListener standard ([13d9289](https://github.com/exadel-inc/esl/commit/13d9289ab4070cb01e6887113331641b03c5d21f))
* **esl-footnotes:** `ESLNotes` migrated to use ESLEventListener standard ([6cd5502](https://github.com/exadel-inc/esl/commit/6cd55021f1287170294a0e166a9b0bce91d0ede9))
* **esl-select:** `ESLSelect` and `ESLSelectList` migrated to ESLEventListeners ([df80759](https://github.com/exadel-inc/esl/commit/df80759326ad40524274bacc088135f879738184))


### BREAKING CHANGES

* **esl-tabs:** listeners extended from `ESLTabs` should now use `@listen` annotation to work correctly
* **esl-scrollbar:** listeners extended from `ESLScrollbar` should now use `@listen` annotation to work correctly
* **esl-select:** `_onChange` and `_onReset` methods of `ESLSelectWrapper` decorated via `@listen`
* **esl-select:** internal handlers of `ESLSelect`, `ESLSelectRender`, `ESLSelectList` now decorated via `@listen`
* **esl-footnotes:** `_onKeydown`, `_onNoteSubscribe` migrated to `@listen`
* **esl-footnotes:** `_onClick` removed and replaced to `_onItemClick` (decorated by `@listen`)
* **esl-footnotes:** `_onFootnotesReady`, `_onBPChange`, `_onMouseLeave`, `_onMouseEnter`, `_onKeydown`, `_onClick` migrated to `@listen`

# [4.0.0-beta.18](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.17...v4.0.0-beta.18) (2022-09-27)


### Bug Fixes

* **esl-event-listener:** fix ESLListenerDescriptorFn import ([69d81d7](https://github.com/exadel-inc/esl/commit/69d81d70f798902daf31423dbd4d6da3b772c75c))
* **esl-event-listener:** fix event listener props resolving strategy and uniqueness constraint ([2ec70f2](https://github.com/exadel-inc/esl/commit/2ec70f2ac962463664a0026aaf48e6340c021d41))
* **esl-event-listener:** fix multiple subscription by single descriptor ([3f80486](https://github.com/exadel-inc/esl/commit/3f804867dc8dd5b348442f66dee8e86a7b6bc755))
* **esl-event-listener:** fix selector and Storage name of ESLEventListener ([ad2f9db](https://github.com/exadel-inc/esl/commit/ad2f9db0f40ce7c7804b292e0cd390ebd60e54d4))
* **esl-panel-group:** change strategy of closing panels in case the max-open-items limit is reached ([4b21c34](https://github.com/exadel-inc/esl/commit/4b21c34d7878f394cafcd0e02a575bb23ec9a4c1))
* **esl-panel-group:** fix initial reset of panel group leads to incorrect panel selection ([7b164dc](https://github.com/exadel-inc/esl/commit/7b164dc5d007a1723495e818c8c4b8ed045a88a8))
* **esl-scrollbar:** remove unnecessary width ([6e18909](https://github.com/exadel-inc/esl/commit/6e18909c6768c259d76084b463404fe6b29c9af8))
* **esl-tabs:** fix alignment behavoir ([b5ebd66](https://github.com/exadel-inc/esl/commit/b5ebd668de7b4d1eea7311ae7d734c02abb537cf))
* **esl-utils:** make undefined condition truthy for `isMatches` helper ([efcd1c6](https://github.com/exadel-inc/esl/commit/efcd1c6dfa83946f66160508f7ee93808cb6d2a2))


### Features

* **esl-alert:** component reworked according ESLToggleable update ([f8a171f](https://github.com/exadel-inc/esl/commit/f8a171f1850efe3eea23dd8de6f372ba5f3cea8e))
* **esl-base-element:** add `create` shortcut to create current custom element ([14f5706](https://github.com/exadel-inc/esl/commit/14f57063624b3ac20b8ae1868903f3ef2b2bcdfd))
* **esl-panel:** migrate `esl-panel` to ESLEventListeners ([b8350a5](https://github.com/exadel-inc/esl/commit/b8350a54ca110756f35b891bc37c2c6110247f77))
* **esl-select-dropdown:** fix `esl-alert` according `esl-togglable` update ([6e10aaa](https://github.com/exadel-inc/esl/commit/6e10aaab9a8055c1f3333d602b56e5d18b8decdd))
* **esl-select-dropdown:** migrate `esl-select-dropdown` to ESLEventListeners ([76ca947](https://github.com/exadel-inc/esl/commit/76ca9479090546cdf092d1c9c3f5d993263f0581))
* **esl-toggleable:** add ability to request hide of the toggleable, refactor toggle request API ([8a0928b](https://github.com/exadel-inc/esl/commit/8a0928b2f2bda63c6fbbaf5e9b6453d660091ec1))
* **esl-toggleable:** migrate `esl-togglable` to ESLEventListeners ([7159429](https://github.com/exadel-inc/esl/commit/7159429f7237bea78ab80e1b05420594246ff84d))
* **esl-utils:** create `extractValues` object utility ([8edd9e7](https://github.com/exadel-inc/esl/commit/8edd9e7b564b4ac78a4fc952ee58f76b6a54cf89))
* **esl-utils:** create cumulative imports for esl-utils submodules ([2e9d6ad](https://github.com/exadel-inc/esl/commit/2e9d6ad8f327ede991feef4ebc7c76fdd55726af))

# [4.0.0-beta.17](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.16...v4.0.0-beta.17) (2022-09-01)


### Bug Fixes

* **esl-panel-group:** fix animation process capturing by ESLPanel component ([9a5b3a5](https://github.com/exadel-inc/esl/commit/9a5b3a576d5cb4dbd47d113d944932586155c7f6))
* **esl-utils:** ESLEventListener descriptors can't be declared trough prototype inheritance ([a055e71](https://github.com/exadel-inc/esl/commit/a055e71643a6b1f2d560dd1ff5c3152767c43bef))
* **esl-utils:** fix `[@bind](https://github.com/bind)` decorator to save original function enumerable marker ([92c2086](https://github.com/exadel-inc/esl/commit/92c2086df610a5572143463302baf7aeea6174e9))
* **esl-utils:** fix `[@decorate](https://github.com/decorate)` decorator to work properly with `[@listen](https://github.com/listen)` ([286ef57](https://github.com/exadel-inc/esl/commit/286ef579b61fbf43a793550fcf7dc8018bc15f54))


### Features

* **esl-panel-group:** extend esl-panel-group refresh strategies list with 'open' and 'close' strategy ([ee18c9d](https://github.com/exadel-inc/esl/commit/ee18c9d673361e53ecc3cd84f04d8d5650c79693))
* **esl-utils:** add `skipOneRender` RAF utility ([ddc3227](https://github.com/exadel-inc/esl/commit/ddc322798e6f8cf447874896786fe6d368bbe5ef))

# [4.0.0-beta.16](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.15...v4.0.0-beta.16) (2022-08-30)


### Bug Fixes

* **esl-image:** remove internal cyclic references in ESLImage modules ([977c32b](https://github.com/exadel-inc/esl/commit/977c32bdbd475f652948ec4d97ac9a9e42357ba1))
* **esl-media:** remove cyclic reference of the ESLMedia internal IObserver to ESLMedia ([8a3d065](https://github.com/exadel-inc/esl/commit/8a3d065aba6a695451aacb9c3e9b90c6592d6a1e))
* **esl-panel:** remove cyclic reference of the ESLPanel to ESLPanelGroup ([cffe91a](https://github.com/exadel-inc/esl/commit/cffe91aa57f3ec769cd286ee8f0bc149533bba1a))
* **esl-select:** fix internal esl-select-renderer cyclic reference ([b97565e](https://github.com/exadel-inc/esl/commit/b97565eff2d7d31a736e6f3461aba62a6de50899))

# [4.0.0-beta.15](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.14...v4.0.0-beta.15) (2022-08-30)


### Bug Fixes

* **esl-mixin-element:** incorrect context applied for listener applied trough `$$on` ([0c53d6a](https://github.com/exadel-inc/esl/commit/0c53d6a9afefc703c7c372a789ee92ec4280cebd))
* **esl-panel-group:** change `no-animate` API ([dde3500](https://github.com/exadel-inc/esl/commit/dde35009268a92bae92a45f00d11cb29edee98fa))
* **esl-utils:** allow `[@listen](https://github.com/listen)` decorator for decorated methods represented as a get accessor ([dcdc70b](https://github.com/exadel-inc/esl/commit/dcdc70b07c7b46dd37041eb87640ebff5e79d71a))
* **esl-utils:** change descriptor definition condition (`event` no longer required as an own property) ([d17e256](https://github.com/exadel-inc/esl/commit/d17e2566652eca74f5b4e8634dc5499248fccbff))
* **esl-utils:** fix `[@decorate](https://github.com/decorate)` decorator binding ([1cbb070](https://github.com/exadel-inc/esl/commit/1cbb0702cdd97520d82fae614825f21df550fb33))
* **esl-utils:** update `decorate` decorator to allow to save context properly (on instance level) ([0ac1b0c](https://github.com/exadel-inc/esl/commit/0ac1b0cb9c90648ae1e0a18a16a936971c4b4ee9))


### Features

* **esl-panel-group:** add `refresh-strategy` attribute ([#1156](https://github.com/exadel-inc/esl/issues/1156)) ([36027ad](https://github.com/exadel-inc/esl/commit/36027ad2574c0c33df1b6370484448a6889a647a))
* **esl-panel-group:** add ability to control min/max open panels per media condition ([67ca2ba](https://github.com/exadel-inc/esl/commit/67ca2ba16e3fc4ee4300d1c79ca2e5d0da845af7))
* **esl-utils:** allow to pass array of targets to the `ESLEventListener` ([1d23db3](https://github.com/exadel-inc/esl/commit/1d23db3ea84ac4b31adce5d4a1575814ea3fdf54))


### BREAKING CHANGES

* **esl-panel-group:** `open` mode is no longer supported, it should be replaced with a `min-open-items="all"`
BREAKING-CHANGE: `accordion-group="single"` attribute no longer supported, replaced with `max-open-items="1"`
BREAKING-CHANGE: `accordion-group="single"` attribute no longer supported, replaced with `max-open-items="all"`
* **esl-panel-group:** components inherited from `ESLPanelGroup` should use `@listen({inherit: true})` for proper subscription

Co-authored-by: NastaLeo <alesun@exadel.com>

# [4.0.0-beta.14](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.13...v4.0.0-beta.14) (2022-08-15)


### Bug Fixes

* **esl-traversing-query:** fix uniqueness of result on multiple query ([8ff4ec7](https://github.com/exadel-inc/esl/commit/8ff4ec773344cbf0d95fc6ceee3bb1ce47a806db))
* **esl-utils:** fix page content jumping after scroll lock ([410f35f](https://github.com/exadel-inc/esl/commit/410f35f9f8fc152da97eeda0299e3ce2c38c1891))
* **esl-utils:** optimize event subscription with a check for an active targets ([2b2585e](https://github.com/exadel-inc/esl/commit/2b2585e495e74ad5022ebb29239b955e942d96c2))


### Features

* **esl-utils:** ability to inherit ESLEventDescriptor from supertype method definition ([899698b](https://github.com/exadel-inc/esl/commit/899698bea0c9c3da72ccd8ac7b4f5d7d9ebd76d3))
* **gh-pages:** add aurora accent to `promo-banner.njk` ([cfe5abb](https://github.com/exadel-inc/esl/commit/cfe5abb2f7e4f3cbf54ebb98c8fcd6f3c9bce766))
* **gh-pages:** load animation by scrolling ([c8a6a15](https://github.com/exadel-inc/esl/commit/c8a6a1504ed37da64acd7a17588d08b08dd896dc))

# [4.0.0-beta.13](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.12...v4.0.0-beta.13) (2022-08-02)


### Bug Fixes

* **esl-utils:** fix missed body style for scroll lock strategy pseudo ([96c37db](https://github.com/exadel-inc/esl/commit/96c37dbd06a24d45809e6a7528143c09ced9f546))


### Features

* **esl-traversing-query:** add comma support to define multiple target ([#1120](https://github.com/exadel-inc/esl/issues/1120) / [#1129](https://github.com/exadel-inc/esl/issues/1129)) ([2890d7b](https://github.com/exadel-inc/esl/commit/2890d7b7667492b982b266048d23874c57b938ea)), closes [#1102](https://github.com/exadel-inc/esl/issues/1102)
* **esl-trigger:** add `ignore-esc` attribute ([605b715](https://github.com/exadel-inc/esl/commit/605b715a29ef1a852e24ce5120ca30d394fc19c1))
* **esl-utils:** extend SynteticEventTarget with ability to separate events ([#1118](https://github.com/exadel-inc/esl/issues/1118)) ([507726d](https://github.com/exadel-inc/esl/commit/507726d5b760e54fa3286560931ffbe3110e4151)), closes [#1079](https://github.com/exadel-inc/esl/issues/1079)

# [4.0.0-beta.12](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.11...v4.0.0-beta.12) (2022-07-18)


### Bug Fixes

* **esl-image:** fix wrong error status on svg images in FF ([cad6b40](https://github.com/exadel-inc/esl/commit/cad6b40ccce01aaea8b1869b2cd7d542939a4fd4))

# [4.0.0-beta.11](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.10...v4.0.0-beta.11) (2022-07-18)


### Features

* **esl-trigger:** add esc key event handler ([3dab6da](https://github.com/exadel-inc/esl/commit/3dab6dad39259f7e920c9a108757271cb58a216d))

# [4.0.0-beta.10](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.9...v4.0.0-beta.10) (2022-07-08)


### Features

* **esl-select:** add dropdown-class to observed attributes ([29cc1c2](https://github.com/exadel-inc/esl/commit/29cc1c23e20c242c1f4b34a97ddd082fe55c54cb))
* **esl-traversing-query:** add ability to find closest element ([ada6fbb](https://github.com/exadel-inc/esl/commit/ada6fbb172a2fb2cf0d435420ad8fb0a46e7766f))
* **esl-utils:** `ScrollUtils` rewritten in a functional way, API updated ([#1051](https://github.com/exadel-inc/esl/issues/1051)) ([6f6c72f](https://github.com/exadel-inc/esl/commit/6f6c72f2d46bc1ba94d0b072df32782d79560313))
* **esl-utils:** add ability to pass predicate to sequence finder ([dd8c3cb](https://github.com/exadel-inc/esl/commit/dd8c3cbb43ed529330c32459b9787949a0927a01))
* **esl-utils:** move parsers to `esl-utils/misc/format` for shared usage ([e58270a](https://github.com/exadel-inc/esl/commit/e58270a2844379a612c1c218f7b9ea6f03bd9bcf))


### BREAKING CHANGES

* **esl-utils:** `ScrollUtils.lock` no longer accessible use `lockScroll(document.documentElement, {strategy: '...'})`
* **esl-utils:** `ScrollUtils.unlock` no longer accessible use `unlockScroll(document.documentElement, {strategy: '...'})`
* **esl-utils:** `ScrollUtils.lockRequest` no longer accessible use `lockScroll(document.documentElement, {strategy: '...', initiatior})`
* **esl-utils:** `ScrollUtils.unlockRequest` no longer accessible use `unlockScroll(document.documentElement, {strategy: '...', initiatior})`

Co-authored-by: fshovchko <fshovchko@exadel.com>
Co-authored-by: nsmirnova <nsmirnova@exadel.com>
Co-authored-by: ala'n (Alexey Stsefanovich) <astsefanovich@exadel.com>
Co-authored-by: julia-murashko <ymurashka@exadel.com>
Co-authored-by: Anastasiya Lesun <72765981+NastaLeo@users.noreply.github.com>

# [4.0.0-beta.9](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.8...v4.0.0-beta.9) (2022-06-29)


### Bug Fixes

* **esl-image:** fix esl-image to prevent DOM XSS vulnerabilities ([4fd925d](https://github.com/exadel-inc/esl/commit/4fd925df8605994b0f7d345d77a425e0cdc487e8))
* **esl-trigger:** custom aria-label maintaining in case a11yLabelActive and a11yLabelInactive are empty ([06d8f92](https://github.com/exadel-inc/esl/commit/06d8f924080849efe90c979151c6c342d4ca8ffc))
* **esl-utils:** add ability to skip event listener through the target field ([75f6a18](https://github.com/exadel-inc/esl/commit/75f6a186ffcbd98e852627f479284edcb893583f))


### Features

* **esl-image:** prototype defined events ([f49ce01](https://github.com/exadel-inc/esl/commit/f49ce019d81cb76995c05d2dccc6621e8836af66))
* **esl-media-query:** normalize data instead of fail ([3226156](https://github.com/exadel-inc/esl/commit/3226156264e58f085f023b0669179cc48f904c55))
* **esl-media:** prototype defined events ([976a8b9](https://github.com/exadel-inc/esl/commit/976a8b9c54d4e0b40dcf9e5ee48024b1539e94f7))
* **esl-select:** add `dropdown-class` param to specify dropdown additional CSS class(es) ([938357f](https://github.com/exadel-inc/esl/commit/938357fa6fb5db804f445f31eb4f73641dfbcccf))
* **esl-utils:** `[@attr](https://github.com/attr)` extended with ability to pass Serializer/Parser ([012eb83](https://github.com/exadel-inc/esl/commit/012eb83ebcbba8315a2766af090239774c21234e))
* **esl-utils:** create dom html sanitize method ([004642f](https://github.com/exadel-inc/esl/commit/004642f866ac1b2ed5278084963288d8c2fd17e0))
* **gh-pages:** add blogs landing component ([fa71fe0](https://github.com/exadel-inc/esl/commit/fa71fe040ae4954ea55946b927751e33c9eb02ce))

# [4.0.0-beta.8](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.7...v4.0.0-beta.8) (2022-06-16)


### Code Refactoring

* **esl-core:** ESLMixinElement moved to separate module ([9d42adf](https://github.com/exadel-inc/esl/commit/9d42adfc4202ed9def4c86d36debe33d0d14331b))


### Features

* **esl-utils:** ability to pass Provider functions to `event`, `selector`, `target` listener options ([c3503b0](https://github.com/exadel-inc/esl/commit/c3503b0810556388187deb48b14c3cab450c5a8e))
* **esl-utils:** simplify and extend `[@prop](https://github.com/prop)` decorator ([fd6ede3](https://github.com/exadel-inc/esl/commit/fd6ede34b0a3c7496083cb58aa9b726d4a692085))


### BREAKING CHANGES

* **esl-utils:** `@prop` signature changed
`prop(value?: any, prototypeConfig: OverrideDecoratorConfig = {})`
* **esl-core:** (beta only) ESLMixinElement now accessible under 'modules/esl-mixin-element/core'

# [4.0.0-beta.7](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.6...v4.0.0-beta.7) (2022-05-19)


### Code Refactoring

* **esl-media-query:** change tuple `parseTuple` syntax param order ([49305f1](https://github.com/exadel-inc/esl/commit/49305f1564a047443f843a41614586b7f85ddb83))


### Features

* **esl-media-query:** `[@media](https://github.com/media)` decorator to shortcut access to the `ESLMediaRuleList` ([ffb59c2](https://github.com/exadel-inc/esl/commit/ffb59c2c619f50e32aa02af0f5212ebc8e829e62))
* **esl-media-query:** `ESLMediaQuery` now implements `EventTarget` interface ([df2a11e](https://github.com/exadel-inc/esl/commit/df2a11e11c1b781ba261cb33c9eccfdb6a9623a3))
* **esl-media-query:** `ESLMediaRuleList` API reworked with EventTarget interface and new calculation strategy ([b1d6891](https://github.com/exadel-inc/esl/commit/b1d6891d0c90553a5b89069096ab9596b71b6219))
* **esl-togglable:** show:request additional data ([a121872](https://github.com/exadel-inc/esl/commit/a121872b6e69fd7fb7a71bdfa9058430e650f423))
* **esl-trigger:** add support of aria-label ([5c18841](https://github.com/exadel-inc/esl/commit/5c188418720ad4a972caa7450563a29268d8ec97))
* **esl-utils:** `ESLEventListener` now uses EventListenerObject interface to simplify debug ([e3ac838](https://github.com/exadel-inc/esl/commit/e3ac838d810b2c1d9aecc265bc0d7cbf5fb627c1))
* **esl-utils:** created `SyntheticEventTarget` implementation ([e4f3eb8](https://github.com/exadel-inc/esl/commit/e4f3eb89e0dd8227937d476a8d2090730342de64))
* **esl-utils:** extend `SyntheticEventTarget` with ability to subscribe `EventListenerObject` ([e4609e9](https://github.com/exadel-inc/esl/commit/e4609e9e53dfd97cdf9892b1e4f88561ee0eeb67))
* **polyfills:** extended `es5-target-shim` ([ef53df9](https://github.com/exadel-inc/esl/commit/ef53df936dd2beda859a41e9f8a900199bb24f3e))


### BREAKING CHANGES

* **esl-media-query:** `ESLMediaRuleList.parseTuple` arguments order changed
* **esl-media-query:** `ESLMediaRule` no longer supports default marker, now "default" is equal "all" query
* **esl-media-query:** `ESLMediaRuleList` observation callback signature changed, now it should be `EventListener`
* **esl-media-query:** `ESLMediaRuleList.prototype.default` removed as no longer default rules
* **esl-media-query:** `ESLMediaRuleList` no longer fire events on rule change, now it's based on active valuer change
* **esl-media-query:** `ESLMediaRuleList` now uses merging of all active rules to define result value, however you were still able to get the last active rule value
* **esl-media-query:** `ESLMediaRuleList.prototype.active` now returns an array of active rules
* **polyfills:** ES5 shim `shimES5ElementConstructor` replaced with `shimES5Constructor`

# [4.0.0-beta.6](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.5...v4.0.0-beta.6) (2022-04-26)


### Bug Fixes

* **polyfills:** optimized safe version of `Object.assign` polyfill ([96fc0dd](https://github.com/exadel-inc/esl/commit/96fc0dd12f0a45e5862e84d4fa4a5f40f76a964e))

# [4.0.0-beta.5](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.4...v4.0.0-beta.5) (2022-04-26)


### Bug Fixes

* **esl-core:** empty children explicitly check in recursion ([412b2ad](https://github.com/exadel-inc/esl/commit/412b2adee0b5698488f6f3def5dcd16e45ca7b45))
* **esl-popup:** unsubscribe safe check (reproducible in IE11) ([63e842f](https://github.com/exadel-inc/esl/commit/63e842f1b2d4d146e5c5299629f38027fd08bc44))


### Features

* **polyfills:** `Event`, `CustomEvent`, `MouseEvent`, `KeyboardEvent`, `FocusEvent` extended polyfills ([9ca3c40](https://github.com/exadel-inc/esl/commit/9ca3c406ff1f6f99490fdf09d2f15bc450c7be57))
* **polyfills:** `Object.assign` and `Array.from` extended polyfills ([590bca4](https://github.com/exadel-inc/esl/commit/590bca4fab39c566db68f7bc2440e5d84355a991))

# [4.0.0-beta.4](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.3...v4.0.0-beta.4) (2022-04-25)


### Bug Fixes

* **esl-utils:** `deepMerge` primitive values merging improved, undefined arguments now ignored ([5b7b730](https://github.com/exadel-inc/esl/commit/5b7b73003acd4d29250af12603ced5d58c40aff6))


### Code Refactoring

* **esl-core:** Update `$$fire` method API ([4983cbc](https://github.com/exadel-inc/esl/commit/4983cbcdb583e0aacc4cbda49c019105fa9b66a4))


### Features

* **esl-footnotes:** add configurable intersectionMargin for the note tooltip activator observer ([b9b1599](https://github.com/exadel-inc/esl/commit/b9b159942e3534965f43cac94c140d5680308548))
* **esl-popup:** add configurable rootMargin for the popup activator observer ([5d647d6](https://github.com/exadel-inc/esl/commit/5d647d60673a65e7b27472c1b68a1e174fa40740))
* **esl-popup:** add extended offsetContainer configuration ([63cbc0a](https://github.com/exadel-inc/esl/commit/63cbc0a996a8578549360dadaa3bb17c53884bfe))
* **esl-utils/rect:** ability to grow/shrink axis ([1c58a1c](https://github.com/exadel-inc/esl/commit/1c58a1c19b0aa82abf7eb73c40781e9c4a4860ba))


### BREAKING CHANGES

* **esl-core:** `$$fire` no longer add 'esl:' prefix to the fired events

# [4.0.0-beta.3](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.2...v4.0.0-beta.3) (2022-04-12)


### Bug Fixes

* **esl-scrollbar:** fix non-passive listener of the scrollbar touchstart ([a3df8ec](https://github.com/exadel-inc/esl/commit/a3df8ec4b7a8eb3ccc67f02ad3116a13a86b26c6))
* **esl-toggleable:** fix double `esl:` prefix for esl-toggleable `esl:refresh` dispatching ([3316da0](https://github.com/exadel-inc/esl/commit/3316da0c4378466c0bf34346e5791ee36fdfe0a8)), closes [#913](https://github.com/exadel-inc/esl/issues/913)
* **esl-utils:** rename some event/misc utils ([36bdb8a](https://github.com/exadel-inc/esl/commit/36bdb8afa8fdd78f6c71232dfbf65c05a6f54d76))


### Code Refactoring

* **esl-panel-group:** remove deprecated `view` attribute ([e0c5410](https://github.com/exadel-inc/esl/commit/e0c5410d157017fa96133e9ccb84d364bdc55534))
* **esl-panel:** rename noCollapse to noAnimate param ([3f5aa74](https://github.com/exadel-inc/esl/commit/3f5aa74be95eff047db076c33ecc9b8a199d15a4))


### BREAKING CHANGES

* **esl-panel-group:** `ESLPanelGroup` `view` attribute no longer supported
* **esl-panel:** `PanelActionParams.noCollapse` renamed to `PanelActionParams.noAnimate`
* **esl-panel:** `ESLPanelGroup.noCollapse` (with related attribute)
renamed to `ESLPanelGroup.noAnimate` (`no-animate` attribute)
* **esl-panel:** `ESLPanelGroup.shouldCollapse` renamed to `ESLPanelGroup.shouldAnimate`
* **esl-utils:** rename `offsetPoint` to `getOffsetPoint` and `touchPoint` to `getTouchPoint`

# [4.0.0-beta.2](https://github.com/exadel-inc/esl/compare/v4.0.0-beta.1...v4.0.0-beta.2) (2022-04-05)


### Bug Fixes

* **esl-core:** make attr decorators correctly strict typed ([613c260](https://github.com/exadel-inc/esl/commit/613c2603a72dae1651007ce014a0f3c7836da101))
* **esl-panel-group:** fix esl:before:hide bubbling from uncontrolled toggleables ([9212b6b](https://github.com/exadel-inc/esl/commit/9212b6beacd97d39d0410a464598e9e2e0bdb1c2))
* **esl-utils:** add IE compatibility for window rect obtaining ([d5e916c](https://github.com/exadel-inc/esl/commit/d5e916c31c6fd08eacad15ea4274ec57c3a6de2e))
* **esl-utils:** add IE compatibility for window rect obtaining ([882425e](https://github.com/exadel-inc/esl/commit/882425e2e643e129a258deb8ead22d1f9ab6b5b4))
* **esl-utils:** fix `isSimilar` comparer for arrays, add flat comparer option ([251c59c](https://github.com/exadel-inc/esl/commit/251c59cd8a3ba46689ba3e7aa6891d7bf4ed43c7))
* **esl-utils:** fix event descriptors merging and passive listeners support ([6ae7175](https://github.com/exadel-inc/esl/commit/6ae7175d37a0011073b6eaed35075f5e63d4747a))


### Features

* **esl-core:** add ability to define [mixin components]([#671](https://github.com/exadel-inc/esl/issues/671)) ([15f9f6c](https://github.com/exadel-inc/esl/commit/15f9f6caeea5a5a67b196b42adebea3de6e1efed))
* **esl-core:** add ability to use event listener api for mixin components ([33ce7aa](https://github.com/exadel-inc/esl/commit/33ce7aa5c3625266b3900ed8d88f012f847945a6))
* **esl-utils:** `[@decorate](https://github.com/decorate)` syntax-sugar to easily wrap (decorate) method ([1f996f9](https://github.com/exadel-inc/esl/commit/1f996f96665829d3734beae447a48c0b77621f8a))
* **esl-utils:** ability to subscribe handle one event before unsubscribe ([3e1cbe6](https://github.com/exadel-inc/esl/commit/3e1cbe62e80d15f37e07a0d52d26fb0362c9b042))
* **esl-utils:** create auxiliary `isPassiveByDefault` utility ([650d75f](https://github.com/exadel-inc/esl/commit/650d75f743299347237a6fdc7e30381749577dfe))
* **esl-utils:** rework subscription API ([bf1c151](https://github.com/exadel-inc/esl/commit/bf1c1511c74b7323198db0533292a8e34fc9c025))

## [3.14.3](https://github.com/exadel-inc/esl/compare/v3.14.2...v3.14.3) (2022-04-07)


### Bug Fixes

* **esl-toggleable:** fix double `esl:` prefix for esl-toggleable `esl:refresh` dispatching ([3316da0](https://github.com/exadel-inc/esl/commit/3316da0c4378466c0bf34346e5791ee36fdfe0a8)), closes [#913](https://github.com/exadel-inc/esl/issues/913)

## [3.14.2](https://github.com/exadel-inc/esl/compare/v3.14.1...v3.14.2) (2022-03-31)


### Bug Fixes

* **esl-panel-group:** fix esl:before:hide bubbling from uncontrolled toggleables ([9212b6b](https://github.com/exadel-inc/esl/commit/9212b6beacd97d39d0410a464598e9e2e0bdb1c2))

## [3.14.1](https://github.com/exadel-inc/esl/compare/v3.14.0...v3.14.1) (2022-03-29)


### Bug Fixes

* **esl-utils:** add IE compatibility for window rect obtaining ([d5e916c](https://github.com/exadel-inc/esl/commit/d5e916c31c6fd08eacad15ea4274ec57c3a6de2e))

# [4.0.0-beta.1](https://github.com/exadel-inc/esl/compare/v3.14.0...v4.0.0-beta.1) (2022-03-24)


### Bug Fixes

* **esl-panel-group:** add `capturedBy` and fix 'after:show' dispatch ([9bdc98c](https://github.com/exadel-inc/esl/commit/9bdc98c98a2926fe42c7cd15007c31a19171027c))
* **esl-utils:** move attribute decorators to the `esl-utils` ([6e5028a](https://github.com/exadel-inc/esl/commit/6e5028a0d147d9b6b9742088f97c6110c58523c0))


### Features

* **esl-core:** event listeners functionality introduced (`ESLEventListener`s) ([16ae8db](https://github.com/exadel-inc/esl/commit/16ae8db2c7c6f5d2488268c5ecf69b277f9db05b))
* **esl-utils:** event utils destructuring ([a822738](https://github.com/exadel-inc/esl/commit/a82273883b9e7393790de5c75b01092b30838a5a))
* **esl-utils:** extend object:compare utils with `isSimilar` method ([9aa937e](https://github.com/exadel-inc/esl/commit/9aa937e620456457aa9954be161da6816f002e66))


### BREAKING CHANGES

* **esl-utils:**  - `isMouseEvent`, `isTouchEvent` moved outside of `EventUtils`
 - `normalizeTouchPoint` renamed to `touchPoint` and moved outside of `EventUtils`
 - `normalizeCoordinates` removed `offsetPoint` introduced instead
 to be used in combination with `touchPoint`

# [3.14.0](https://github.com/exadel-inc/esl/compare/v3.13.2...v3.14.0) (2022-03-11)


### Bug Fixes

* **esl-core:** type and implementation improvements for attribute decorators ([73edd53](https://github.com/exadel-inc/esl/commit/73edd5340b5bef0e548ef00e932b4630907332b4))
* **esl-media:** fix incorrect `group` definition in shape ([5358933](https://github.com/exadel-inc/esl/commit/5358933c62076a850cdf314f3a31205db5bd2b51))
* **esl-panel-group:** fix animation-end handling target check ([2d66781](https://github.com/exadel-inc/esl/commit/2d6678123141cb2c20eed8f95449ab4126e847b0))
* **esl-panel:** fix animation-end handling target check ([ea897fa](https://github.com/exadel-inc/esl/commit/ea897fabdbbe166adeac9f0c36bda69ca7c63ffd))
* **gh-pages:** change loadScript import ([acad20a](https://github.com/exadel-inc/esl/commit/acad20acbdafc1d3f49482b65800e80acf8512dc))


### Features

* **esl-core:** extend `ESLBaseElement` with `$$cls` and `$$attr` methods ([65ab74a](https://github.com/exadel-inc/esl/commit/65ab74a5d1a749958e7d633e973fd679821a057a))
* **esl-media-query:** extend `ESLMediaRuleList.parseTuple` with ability to pass Parser ([44e9a1c](https://github.com/exadel-inc/esl/commit/44e9a1cf108b82d13908e65ca2d4691b026c49a2))
* **esl-panel-group:** fallback-duration retired, now it's controlled out of the box ([d78553e](https://github.com/exadel-inc/esl/commit/d78553ec4ad474149eb1eba3b4be8d66db942e33))
* **esl-panel:** ESLPanel no longer requires fallback-time definition ([6140ecd](https://github.com/exadel-inc/esl/commit/6140ecd902a0f888a77310fb8a607d5119b143fc))
* **esl-utils:** `misc/object#get` API extended to be similar to `misc/object#set` ([474bd76](https://github.com/exadel-inc/esl/commit/474bd760f4738450d3692fdb08ea5da8d1b9be1b))
* **esl-utils:** add `object#set` extended syntax support ([6d5799c](https://github.com/exadel-inc/esl/commit/6d5799c6dcb19da7e42e08a17b27e4eb1bfb589a))
* **esl-utils:** add small attr utility ([f4ee57a](https://github.com/exadel-inc/esl/commit/f4ee57a8f151f82e1ce7cd187799e2cece3c8a10))
* **esl-utils:** extend `promisifyTimeout` with ability to reject timeout ([#868](https://github.com/exadel-inc/esl/issues/868)) ([0594e5c](https://github.com/exadel-inc/esl/commit/0594e5ca8ec3aea82652fcc8abc3f7cfe87c3496)), closes [#858](https://github.com/exadel-inc/esl/issues/858)
* **esl-utils:** extend `set` method with ability to pass an array of path keys ([9dfa77b](https://github.com/exadel-inc/esl/commit/9dfa77bc47d71ab0e2b440bfcc2cd83c91cf29b5))
* **esl-utils:** extend CSSClassUtils with `has` check ([f260823](https://github.com/exadel-inc/esl/commit/f260823c913e48313f572006dd6ebf376723461c))

# [3.14.0-beta.4](https://github.com/exadel-inc/esl/compare/v3.14.0-beta.3...v3.14.0-beta.4) (2022-03-11)


### Features

* **esl-utils:** `misc/object#get` API extended to be similar to `misc/object#set` ([474bd76](https://github.com/exadel-inc/esl/commit/474bd760f4738450d3692fdb08ea5da8d1b9be1b))
* **esl-utils:** add `object#set` extended syntax support ([6d5799c](https://github.com/exadel-inc/esl/commit/6d5799c6dcb19da7e42e08a17b27e4eb1bfb589a))
* **esl-utils:** extend `promisifyTimeout` with ability to reject timeout ([#868](https://github.com/exadel-inc/esl/issues/868)) ([0594e5c](https://github.com/exadel-inc/esl/commit/0594e5ca8ec3aea82652fcc8abc3f7cfe87c3496)), closes [#858](https://github.com/exadel-inc/esl/issues/858)
* **esl-utils:** extend `set` method with ability to pass an array of path keys ([9dfa77b](https://github.com/exadel-inc/esl/commit/9dfa77bc47d71ab0e2b440bfcc2cd83c91cf29b5))

# [3.14.0-beta.3](https://github.com/exadel-inc/esl/compare/v3.14.0-beta.2...v3.14.0-beta.3) (2022-02-25)


### Features

* **esl-media-query:** extend `ESLMediaRuleList.parseTuple` with ability to pass Parser ([44e9a1c](https://github.com/exadel-inc/esl/commit/44e9a1cf108b82d13908e65ca2d4691b026c49a2))

# [3.14.0-beta.2](https://github.com/exadel-inc/esl/compare/v3.14.0-beta.1...v3.14.0-beta.2) (2022-02-23)


### Bug Fixes

* **esl-panel-group:** fix animation-end handling target check ([2d66781](https://github.com/exadel-inc/esl/commit/2d6678123141cb2c20eed8f95449ab4126e847b0))
* **esl-panel:** fix animation-end handling target check ([ea897fa](https://github.com/exadel-inc/esl/commit/ea897fabdbbe166adeac9f0c36bda69ca7c63ffd))
* **gh-pages:** change loadScript import ([acad20a](https://github.com/exadel-inc/esl/commit/acad20acbdafc1d3f49482b65800e80acf8512dc))

# [3.14.0-beta.1](https://github.com/exadel-inc/esl/compare/v3.13.2...v3.14.0-beta.1) (2022-02-21)


### Bug Fixes

* **esl-core:** type and implementation improvements for attribute decorators ([73edd53](https://github.com/exadel-inc/esl/commit/73edd5340b5bef0e548ef00e932b4630907332b4))
* **esl-media:** fix incorrect `group` definition in shape ([5358933](https://github.com/exadel-inc/esl/commit/5358933c62076a850cdf314f3a31205db5bd2b51))


### Features

* **esl-core:** extend `ESLBaseElement` with `$$cls` and `$$attr` methods ([65ab74a](https://github.com/exadel-inc/esl/commit/65ab74a5d1a749958e7d633e973fd679821a057a))
* **esl-panel-group:** fallback-duration retired, now it's controlled out of the box ([d78553e](https://github.com/exadel-inc/esl/commit/d78553ec4ad474149eb1eba3b4be8d66db942e33))
* **esl-panel:** ESLPanel no longer requires fallback-time definition ([6140ecd](https://github.com/exadel-inc/esl/commit/6140ecd902a0f888a77310fb8a607d5119b143fc))
* **esl-utils:** add small attr utility ([f4ee57a](https://github.com/exadel-inc/esl/commit/f4ee57a8f151f82e1ce7cd187799e2cece3c8a10))
* **esl-utils:** extend CSSClassUtils with `has` check ([f260823](https://github.com/exadel-inc/esl/commit/f260823c913e48313f572006dd6ebf376723461c))

## [3.13.2](https://github.com/exadel-inc/esl/compare/v3.13.1...v3.13.2) (2022-02-16)


### Bug Fixes

* **esl-utils:** fix `RTLUtils.isRtl` types API ([f77791b](https://github.com/exadel-inc/esl/commit/f77791b22c99b6fec927c779b350caf2cbbbf918))

## [3.13.1](https://github.com/exadel-inc/esl/compare/v3.13.0...v3.13.1) (2022-02-16)


### Bug Fixes

* **esl-scrollbar:** fix `normalizePosition` method to handle vertical scroll on RTL ([#839](https://github.com/exadel-inc/esl/issues/839)) ([a67c2a3](https://github.com/exadel-inc/esl/commit/a67c2a32262ad025fa328d9d63679d9acb52a550))

# [3.13.0](https://github.com/exadel-inc/esl/compare/v3.12.1...v3.13.0) (2022-02-14)


### Bug Fixes

* **els-footnotes:** add ready decorator to disconnected callback ([87aa3e7](https://github.com/exadel-inc/esl/commit/87aa3e78649605bce24acc313b76f1ad4694778e))
* **esl-footnotes:** fix behavior during connect/disconnect callbacks ([68a0553](https://github.com/exadel-inc/esl/commit/68a0553b409fa42b0251952401bee54a55fd24e6))
* **esl-footnotes:** fix esl-note scroll into view on activate ([7a71a14](https://github.com/exadel-inc/esl/commit/7a71a143e0df804b07baa50cb0fb1a8f35fc438c))
* **esl-footnotes:** fix esl-note-group attributes propagation ([9fe21b1](https://github.com/exadel-inc/esl/commit/9fe21b19daa87c95a2153ef932051ab8d27b1f81))
* **esl-footnotes:** fix esl-note-group attributes propagation ([7f3d569](https://github.com/exadel-inc/esl/commit/7f3d569c3fc13353b7e4007de3142b7d537e810f))
* **esl-footnotes:** fix the sort order of notes ([e299def](https://github.com/exadel-inc/esl/commit/e299def2b6e2daac0c4baa2b9ea6a3f6405da1c9))
* **esl-footnotes:** replace container with containerEl at tooltip params ([5278b1f](https://github.com/exadel-inc/esl/commit/5278b1fe1be6107f0b5e089b7a9999111938cbe9))
* **esl-note:** fix the corruption of the note's content ([bd0340d](https://github.com/exadel-inc/esl/commit/bd0340d44388c95b2cd749bcf8380d15460a1b3d))
* **esl-popup:** fix the position of popups container ([e2d4ba4](https://github.com/exadel-inc/esl/commit/e2d4ba4a3c1a73d00abf5cb5dff0ff1eec2d96d3))


### Features

* **esl-footnotes:** add activate timeout ([c91d4e8](https://github.com/exadel-inc/esl/commit/c91d4e83a53726c14b4018b391e0e907ef615c7b))
* **esl-footnotes:** add container attribute to esl-note-group ([621ab2e](https://github.com/exadel-inc/esl/commit/621ab2e97ff7dc12dd6d534aef0cb8afe72329d5))
* **esl-footnotes:** add container attribute to set up bounds of visibility ([f420ac6](https://github.com/exadel-inc/esl/commit/f420ac6c61439de75478e28a69a12ad66f98dfc5))
* **esl-footnotes:** add getting attribute value from  closest element with group behavior settings ([b286e92](https://github.com/exadel-inc/esl/commit/b286e92cdef5ab44058263e4c8fcdae474125b9f))
* **esl-footnotes:** add ignore-footnotes attribute to disallow footnotes to pick up a note ([9b8db3e](https://github.com/exadel-inc/esl/commit/9b8db3e17a3f0f8ecde8833146f44aeaf1e01d30))
* **esl-footnotes:** create els-note-group element ([ffce746](https://github.com/exadel-inc/esl/commit/ffce746973011ec333c08365e317535f8115d43c))
* **esl-popup:** add container attribute to set up bounds of visibility ([5ae9238](https://github.com/exadel-inc/esl/commit/5ae92386d0f9a336d65c6be48080548174eda9e0))
* **esl-popup:** add containerEl param to action params ([4321863](https://github.com/exadel-inc/esl/commit/43218638eed1b17f57be36ffc1adef3f4efd0b7e))
* **esl-popup:** add the ability to esl-popup to move into body in case when it is not in body ([13d3733](https://github.com/exadel-inc/esl/commit/13d3733b4012ef8958af3e823719c4b150985272))
* **esl-popup:** create esl-popup-proxy component ([ee27f90](https://github.com/exadel-inc/esl/commit/ee27f90506910d77c9dc794205cf9bfe7652c413))
* **esl-toggleable:** add handler for esl:show:request ([0d32ae9](https://github.com/exadel-inc/esl/commit/0d32ae9f86247d95d1f9e9ba465f77f78a10957a))
* **esl-toggleable:** create esl-toggleable-proxy element ([d0fb90e](https://github.com/exadel-inc/esl/commit/d0fb90e6397b5e1eb1ad19fbf541c3791980d5ec))
* **esl-trigger:** add the ability for the target to get origin from proxied element ([523752a](https://github.com/exadel-inc/esl/commit/523752a394918fdcccba001a7e182d6639a87afc))
* rename elements from *-proxy to *-placeholder ([b98fe34](https://github.com/exadel-inc/esl/commit/b98fe345d9e86aae58160b9e01d5dfe137747b55))

# [3.13.0-beta.6](https://github.com/exadel-inc/esl/compare/v3.13.0-beta.5...v3.13.0-beta.6) (2022-02-10)


### Features

* **esl-footnotes:** add getting attribute value from  closest element with group behavior settings ([b286e92](https://github.com/exadel-inc/esl/commit/b286e92cdef5ab44058263e4c8fcdae474125b9f))

# [3.13.0-beta.5](https://github.com/exadel-inc/esl/compare/v3.13.0-beta.4...v3.13.0-beta.5) (2022-02-02)


### Bug Fixes

* **els-footnotes:** add ready decorator to disconnected callback ([87aa3e7](https://github.com/exadel-inc/esl/commit/87aa3e78649605bce24acc313b76f1ad4694778e))

# [3.13.0-beta.4](https://github.com/exadel-inc/esl/compare/v3.13.0-beta.3...v3.13.0-beta.4) (2022-02-02)


### Bug Fixes

* **esl-footnotes:** fix behavior during connect/disconnect callbacks ([68a0553](https://github.com/exadel-inc/esl/commit/68a0553b409fa42b0251952401bee54a55fd24e6))
* **esl-footnotes:** fix esl-note scroll into view on activate ([7a71a14](https://github.com/exadel-inc/esl/commit/7a71a143e0df804b07baa50cb0fb1a8f35fc438c))
* **esl-footnotes:** fix esl-note-group attributes propagation ([9fe21b1](https://github.com/exadel-inc/esl/commit/9fe21b19daa87c95a2153ef932051ab8d27b1f81))
* **esl-footnotes:** fix esl-note-group attributes propagation ([7f3d569](https://github.com/exadel-inc/esl/commit/7f3d569c3fc13353b7e4007de3142b7d537e810f))
* **esl-footnotes:** replace container with containerEl at tooltip params ([5278b1f](https://github.com/exadel-inc/esl/commit/5278b1fe1be6107f0b5e089b7a9999111938cbe9))
* **esl-popup:** fix the position of popups container ([e2d4ba4](https://github.com/exadel-inc/esl/commit/e2d4ba4a3c1a73d00abf5cb5dff0ff1eec2d96d3))


### Features

* **esl-popup:** add containerEl param to action params ([4321863](https://github.com/exadel-inc/esl/commit/43218638eed1b17f57be36ffc1adef3f4efd0b7e))

# [3.13.0-beta.3](https://github.com/exadel-inc/esl/compare/v3.13.0-beta.2...v3.13.0-beta.3) (2022-01-26)


### Features

* **esl-footnotes:** add activate timeout ([c91d4e8](https://github.com/exadel-inc/esl/commit/c91d4e83a53726c14b4018b391e0e907ef615c7b))
* **esl-footnotes:** add container attribute to esl-note-group ([621ab2e](https://github.com/exadel-inc/esl/commit/621ab2e97ff7dc12dd6d534aef0cb8afe72329d5))
* **esl-footnotes:** add container attribute to set up bounds of visibility ([f420ac6](https://github.com/exadel-inc/esl/commit/f420ac6c61439de75478e28a69a12ad66f98dfc5))
* **esl-popup:** add container attribute to set up bounds of visibility ([5ae9238](https://github.com/exadel-inc/esl/commit/5ae92386d0f9a336d65c6be48080548174eda9e0))
* **esl-popup:** add the ability to esl-popup to move into body in case when it is not in body ([13d3733](https://github.com/exadel-inc/esl/commit/13d3733b4012ef8958af3e823719c4b150985272))
* **esl-popup:** create esl-popup-proxy component ([ee27f90](https://github.com/exadel-inc/esl/commit/ee27f90506910d77c9dc794205cf9bfe7652c413))
* **esl-toggleable:** create esl-toggleable-proxy element ([d0fb90e](https://github.com/exadel-inc/esl/commit/d0fb90e6397b5e1eb1ad19fbf541c3791980d5ec))
* **esl-trigger:** add the ability for the target to get origin from proxied element ([523752a](https://github.com/exadel-inc/esl/commit/523752a394918fdcccba001a7e182d6639a87afc))
* rename elements from *-proxy to *-placeholder ([b98fe34](https://github.com/exadel-inc/esl/commit/b98fe345d9e86aae58160b9e01d5dfe137747b55))
* update husky ([d15499d](https://github.com/exadel-inc/esl/commit/d15499db4026437ea26c70084e740d822e17bf35))

# [3.13.0-beta.2](https://github.com/exadel-inc/esl/compare/v3.13.0-beta.1...v3.13.0-beta.2) (2022-01-18)


### Bug Fixes

* **esl-media:** fix incorrect `load-condition` definition in shape ([94e8d77](https://github.com/exadel-inc/esl/commit/94e8d7784392585ce787d35fee3cce1e1b07a7c7))

## [3.12.1](https://github.com/exadel-inc/esl/compare/v3.12.0...v3.12.1) (2022-01-18)


### Bug Fixes

* **esl-media:** fix incorrect `load-condition` definition in shape ([94e8d77](https://github.com/exadel-inc/esl/commit/94e8d7784392585ce787d35fee3cce1e1b07a7c7))

# [3.13.0-beta.1](https://github.com/exadel-inc/esl/compare/v3.12.0...v3.13.0-beta.1) (2022-01-17)


### Bug Fixes

* **esl-footnotes:** fix the sort order of notes ([e299def](https://github.com/exadel-inc/esl/commit/e299def2b6e2daac0c4baa2b9ea6a3f6405da1c9))
* **esl-note:** fix the corruption of the note's content ([bd0340d](https://github.com/exadel-inc/esl/commit/bd0340d44388c95b2cd749bcf8380d15460a1b3d))


### Features

* **esl-footnotes:** add ignore-footnotes attribute to disallow footnotes to pick up a note ([9b8db3e](https://github.com/exadel-inc/esl/commit/9b8db3e17a3f0f8ecde8833146f44aeaf1e01d30))
* **esl-footnotes:** create els-note-group element ([ffce746](https://github.com/exadel-inc/esl/commit/ffce746973011ec333c08365e317535f8115d43c))
* **esl-toggleable:** add handler for esl:show:request ([0d32ae9](https://github.com/exadel-inc/esl/commit/0d32ae9f86247d95d1f9e9ba465f77f78a10957a))

# [3.12.0](https://github.com/exadel-inc/esl/compare/v3.11.0...v3.12.0) (2022-01-17)


### Bug Fixes

* **esl-media:** fix missing load condition reinitialization and docs ([4f136d7](https://github.com/exadel-inc/esl/commit/4f136d7b37e06fc0c8ed4b00a150d943e3cad941))
* **esl-media:** style/performance improvement for condition query ([#777](https://github.com/exadel-inc/esl/issues/777)) ([48bfed5](https://github.com/exadel-inc/esl/commit/48bfed540eedc4b766452c8dfea7b650e6e0a98c))


### Features

* **esl-toggleable:** add handler for esl:show:request ([ff0556a](https://github.com/exadel-inc/esl/commit/ff0556a41760473ed0a11af087f3a97e550c9b40))

# [3.11.0](https://github.com/exadel-inc/esl/compare/v3.10.0...v3.11.0) (2022-01-12)


### Bug Fixes

* **esl-media-query:** fix `ESLMediaRuleList.prototype.default` type ([0ec7ef3](https://github.com/exadel-inc/esl/commit/0ec7ef3019ff7e56ab8c105c13163d534771febb))
* **esl-panel-group:** fix event trowing when class target not specified ([4ad5e56](https://github.com/exadel-inc/esl/commit/4ad5e56d6d28c995e8b978c0d0c8a84d05ea41da))
* **esl-toggleable:** improve outside keyboard events handling ([38160b6](https://github.com/exadel-inc/esl/commit/38160b66d4fec7c93b072b1d857fd9d2b093416f))
* **esl-tooltip:** fix focus out behavior after SHIFT+TAB keypress ([98821a0](https://github.com/exadel-inc/esl/commit/98821a04131f4af234b0f3233f8825d786386a8d))
* tests unhandled promise rejection ([d6ca55a](https://github.com/exadel-inc/esl/commit/d6ca55a7a0b11e2fe2e161dd04bf60609dfc9d0c))


### Features

* **esl-panel-group:** ability to define params for child panels requests ([08cf513](https://github.com/exadel-inc/esl/commit/08cf51385cae2514b220b9950d53d0afa4b1b5d3))
* **esl-panel-group:** dispatch esl:change:mode event ([8d41dbd](https://github.com/exadel-inc/esl/commit/8d41dbd69ac703858f1dd8d43ece748da58780f1))
* **esl-panel-group:** make animation disabled on transform by default ([1815b00](https://github.com/exadel-inc/esl/commit/1815b006a6decfc91b275b5c28ae9da17b1bf311))
* **esl-panel-group:** rename `view` attribute to `current-mode`; extend mode class API ([52188fe](https://github.com/exadel-inc/esl/commit/52188fe43457d2f362cd7cca0a126cbf01ffb9c9))
* **esl-toggleable:** add id auto-creation feature for toggleable instances ([eaf02dc](https://github.com/exadel-inc/esl/commit/eaf02dc490dd0c92b6b9bbdf758769eeba15d62d))
* **gh-pages:** GSS integration ([#723](https://github.com/exadel-inc/esl/issues/723)) ([8c348be](https://github.com/exadel-inc/esl/commit/8c348be9e6c0a535b2b94c20634cdf1ab13fe5ef))
* **gh-pages:** GSS integration ([#723](https://github.com/exadel-inc/esl/issues/723)) ([9636e1e](https://github.com/exadel-inc/esl/commit/9636e1eae99c5378d91f2d941663bd2c798fb7cc))

# [3.11.0-beta.3](https://github.com/exadel-inc/esl/compare/v3.11.0-beta.2...v3.11.0-beta.3) (2021-12-23)


### Bug Fixes

* **esl-toggleable:** improve outside keyboard events handling ([38160b6](https://github.com/exadel-inc/esl/commit/38160b66d4fec7c93b072b1d857fd9d2b093416f))

# [3.11.0-beta.2](https://github.com/exadel-inc/esl/compare/v3.11.0-beta.1...v3.11.0-beta.2) (2021-12-23)


### Bug Fixes

* **esl-panel-group:** fix event trowing when class target not specified ([4ad5e56](https://github.com/exadel-inc/esl/commit/4ad5e56d6d28c995e8b978c0d0c8a84d05ea41da))

# [3.11.0-beta.1](https://github.com/exadel-inc/esl/compare/v3.10.1-beta.1...v3.11.0-beta.1) (2021-12-22)


### Features

* **esl-panel-group:** dispatch esl:change:mode event ([8d41dbd](https://github.com/exadel-inc/esl/commit/8d41dbd69ac703858f1dd8d43ece748da58780f1))

## [3.10.1-beta.1](https://github.com/exadel-inc/esl/compare/v3.10.0...v3.10.1-beta.1) (2021-12-22)


### Bug Fixes

* **esl-tooltip:** fix focus out behavior after SHIFT+TAB keypress ([98821a0](https://github.com/exadel-inc/esl/commit/98821a04131f4af234b0f3233f8825d786386a8d))

# [3.10.0](https://github.com/exadel-inc/esl/compare/v3.9.1...v3.10.0) (2021-12-22)


### Bug Fixes

* **esl-scrollbar:** fix event subscriber leak ([abaf22a](https://github.com/exadel-inc/esl/commit/abaf22a9ec6380fec3d6676dc7f6944688724c1c))
* **esl-toggleable:** fix `_onOutsideAction` and `_onClick` signature ([0a2600b](https://github.com/exadel-inc/esl/commit/0a2600b66d0ade06fa19e811cfdb1a8fc050dd37))
* **esl-toggleable:** fix wrong and missing TSX shape attributes ([0dc77ff](https://github.com/exadel-inc/esl/commit/0dc77ffe2b7cf55d7cb3c71e15d65604b7a82fb4))


### Features

* **esl-toggleable:** `keypress` event now also considered as an outside action ([b3c5374](https://github.com/exadel-inc/esl/commit/b3c537430287f2fd909824d4cabab986f368debe))

## [3.9.1](https://github.com/exadel-inc/esl/compare/v3.9.0...v3.9.1) (2021-12-16)


### Bug Fixes

* **esl-scrollbar:** fix drag behaviour for short scroll ([03b179d](https://github.com/exadel-inc/esl/commit/03b179d5c0e1dbf974b8e61af700ffff7bc4decc))

# [3.9.0](https://github.com/exadel-inc/esl/compare/v3.8.0...v3.9.0) (2021-12-15)


### Bug Fixes

* **esl-utils:** add support for Touch and Pointer events in normalize utilities ([a5a183c](https://github.com/exadel-inc/esl/commit/a5a183c34655aa04899ed66d57eeac59d5c6a5a5))


### Features

* **esl-animate:** add jsx/tsx support ([3db5644](https://github.com/exadel-inc/esl/commit/3db564497ea478dc263199cce7c1e232a41d06c4))
* **esl-scrollbar:** api simplified + performance improvements ([81b8824](https://github.com/exadel-inc/esl/commit/81b8824535253477efb06c8dc640e92746d1da56))
* **esl-scrollbar:** support for continues click on the scrollbar area ([#688](https://github.com/exadel-inc/esl/issues/688)) ([aae79b4](https://github.com/exadel-inc/esl/commit/aae79b43d05d2ef2a3de144075cddeaf48207d98))
* **esl-scrollbar:** support for touch actions on scrollbar ([acc42f7](https://github.com/exadel-inc/esl/commit/acc42f702273a1612f551e0df0fdce7c9df8195d))

# [3.8.0](https://github.com/exadel-inc/esl/compare/v3.7.0...v3.8.0) (2021-12-10)


### Bug Fixes

* **esl-footnotes:** add event propagation stop at esl-note ([d69ff60](https://github.com/exadel-inc/esl/commit/d69ff60822d6976fbd2c03302322f89d8a504aa3))
* **esl-footnotes:** fix handling keydown event on return to note button ([83b4131](https://github.com/exadel-inc/esl/commit/83b4131c488b30692997f97a5440cfa3c30523b3))
* **esl-footnotes:** fix inappropriate behaviour when activating note through the return to note ([c054226](https://github.com/exadel-inc/esl/commit/c054226f6466fbbc59da994d725e5023657d7c49))
* **esl-popup:** fix wrong arrow position when popup size greater than size outer limiter ([d6f7c2e](https://github.com/exadel-inc/esl/commit/d6f7c2eb377cd539521dce692a76900c3b65810f))
* **esl-utils:** fix scrollIntoView resolution and horizontal scroll ([15e0891](https://github.com/exadel-inc/esl/commit/15e0891655bc4bc4ae6b0b5d58ca1a30a9986ee5))


### Features

* **esl-footnotes:** add back-to-note-label to outputting title for the button ([717c23f](https://github.com/exadel-inc/esl/commit/717c23ffe30f5d9963d7463262e4739d2d7d0b1d))
* **esl-footnotes:** add dispatch esl:show:request event on activate esl-note ([023b7c6](https://github.com/exadel-inc/esl/commit/023b7c6aed677b7734a31aec6d4d1ab64d280388))
* **esl-footnotes:** add separate method to render content of connected note ([bea4379](https://github.com/exadel-inc/esl/commit/bea4379d35aab4f2e550cb4af13622eee733877e))
* **esl-popup:** add disable activator observation attribute and add to behavior new values ([bcd8212](https://github.com/exadel-inc/esl/commit/bcd8212ff8acbf90e9d7c7f464800faad5163093))
* **esl-popup:** add RTL support ([9aab290](https://github.com/exadel-inc/esl/commit/9aab290738547a5b8d7b64e0437e00cdacc13d1c))
* **esl-popup:** add updating position on transition ([8fb47ed](https://github.com/exadel-inc/esl/commit/8fb47ed866b7c67f93919edcf66b7611eabcbe1f))
* **esl-popup:** create esl-popup-init mixin to make it easier to initialize styles ([6e78265](https://github.com/exadel-inc/esl/commit/6e7826561d3c7be943dbedd75f94ab1bdcb6f280))
* **esl-tooltip:** add focus out handling to return focus to activator ([4b20ef8](https://github.com/exadel-inc/esl/commit/4b20ef84d7bac792e43a0b77caec1695faf6c4e1))
* **esl-utils:** add helper method to get keyboard-focusable elements within a specified element ([3577397](https://github.com/exadel-inc/esl/commit/3577397adc339eb15313637bb1672de159b279d8))
* **esl-utils:** add static method isEqual() to Rect ([128cbcb](https://github.com/exadel-inc/esl/commit/128cbcbd0f470a960f5ab50479e765f43b31e3b2))

# [3.8.0-beta.1](https://github.com/exadel-inc/esl/compare/v3.7.0...v3.8.0-beta.1) (2021-12-07)


### Bug Fixes

* **esl-footnotes:** add event propagation stop at esl-note ([d69ff60](https://github.com/exadel-inc/esl/commit/d69ff60822d6976fbd2c03302322f89d8a504aa3))
* **esl-footnotes:** fix handling keydown event on return to note button ([83b4131](https://github.com/exadel-inc/esl/commit/83b4131c488b30692997f97a5440cfa3c30523b3))
* **esl-footnotes:** fix inappropriate behaviour when activating note through the return to note ([c054226](https://github.com/exadel-inc/esl/commit/c054226f6466fbbc59da994d725e5023657d7c49))
* **esl-utils:** fix scrollIntoView resolution and horizontal scroll ([15e0891](https://github.com/exadel-inc/esl/commit/15e0891655bc4bc4ae6b0b5d58ca1a30a9986ee5))


### Features

* **esl-footnotes:** add back-to-note-label to outputting title for the button ([717c23f](https://github.com/exadel-inc/esl/commit/717c23ffe30f5d9963d7463262e4739d2d7d0b1d))
* **esl-footnotes:** add dispatch esl:show:request event on activate esl-note ([023b7c6](https://github.com/exadel-inc/esl/commit/023b7c6aed677b7734a31aec6d4d1ab64d280388))
* **esl-footnotes:** add separate method to render content of connected note ([bea4379](https://github.com/exadel-inc/esl/commit/bea4379d35aab4f2e550cb4af13622eee733877e))
* **esl-popup:** add disable activator observation attribute and add to behavior new values ([bcd8212](https://github.com/exadel-inc/esl/commit/bcd8212ff8acbf90e9d7c7f464800faad5163093))
* **esl-popup:** add RTL support ([9aab290](https://github.com/exadel-inc/esl/commit/9aab290738547a5b8d7b64e0437e00cdacc13d1c))
* **esl-popup:** add updating position on transition ([8fb47ed](https://github.com/exadel-inc/esl/commit/8fb47ed866b7c67f93919edcf66b7611eabcbe1f))
* **esl-popup:** create esl-popup-init mixin to make it easier to initialize styles ([6e78265](https://github.com/exadel-inc/esl/commit/6e7826561d3c7be943dbedd75f94ab1bdcb6f280))
* **esl-tooltip:** add focus out handling to return focus to activator ([4b20ef8](https://github.com/exadel-inc/esl/commit/4b20ef84d7bac792e43a0b77caec1695faf6c4e1))
* **esl-utils:** add helper method to get keyboard-focusable elements within a specified element ([3577397](https://github.com/exadel-inc/esl/commit/3577397adc339eb15313637bb1672de159b279d8))
* **esl-utils:** add static method isEqual() to Rect ([128cbcb](https://github.com/exadel-inc/esl/commit/128cbcbd0f470a960f5ab50479e765f43b31e3b2))

# [3.7.0-beta.4](https://github.com/exadel-inc/esl/compare/v3.7.0-beta.3...v3.7.0-beta.4) (2021-12-03)


### Features

* **esl-footnotes:** add dispatch esl:show:request event on activate esl-note ([023b7c6](https://github.com/exadel-inc/esl/commit/023b7c6aed677b7734a31aec6d4d1ab64d280388))

# [3.7.0-beta.3](https://github.com/exadel-inc/esl/compare/v3.7.0-beta.2...v3.7.0-beta.3) (2021-12-01)


### Bug Fixes

* **esl-footnotes:** fix handling keydown event on return to note button ([83b4131](https://github.com/exadel-inc/esl/commit/83b4131c488b30692997f97a5440cfa3c30523b3))


### Features

* **esl-tooltip:** add focus out handling to return focus to activator ([4b20ef8](https://github.com/exadel-inc/esl/commit/4b20ef84d7bac792e43a0b77caec1695faf6c4e1))
* **esl-utils:** `ESLVSizeCSSProxy` utility to fix 100vh problem is introduced ([5bae888](https://github.com/exadel-inc/esl/commit/5bae8882f87797741ef10cc835e50f7485fe63c8))
* **esl-utils:** add helper method to get keyboard-focusable elements within a specified element ([3577397](https://github.com/exadel-inc/esl/commit/3577397adc339eb15313637bb1672de159b279d8))

# [3.7.0-beta.2](https://github.com/exadel-inc/esl/compare/v3.7.0-beta.1...v3.7.0-beta.2) (2021-11-30)


### Bug Fixes

* **esl-footnotes:** add event propagation stop at esl-note ([d69ff60](https://github.com/exadel-inc/esl/commit/d69ff60822d6976fbd2c03302322f89d8a504aa3))


### Features

* **esl-popup:** add updating position on transition ([8fb47ed](https://github.com/exadel-inc/esl/commit/8fb47ed866b7c67f93919edcf66b7611eabcbe1f))
* **esl-popup:** create esl-popup-init mixin to make it easier to initialize styles ([6e78265](https://github.com/exadel-inc/esl/commit/6e7826561d3c7be943dbedd75f94ab1bdcb6f280))
* **esl-utils:** add static method isEqual() to Rect ([128cbcb](https://github.com/exadel-inc/esl/commit/128cbcbd0f470a960f5ab50479e765f43b31e3b2))

# [3.7.0-beta.1](https://github.com/exadel-inc/esl/compare/v3.6.0...v3.7.0-beta.1) (2021-11-28)


### Features

* **esl-footnotes:** add back-to-note-label to outputting title for the button ([717c23f](https://github.com/exadel-inc/esl/commit/717c23ffe30f5d9963d7463262e4739d2d7d0b1d))
* **esl-footnotes:** add separate method to render content of connected note ([bea4379](https://github.com/exadel-inc/esl/commit/bea4379d35aab4f2e550cb4af13622eee733877e))

# [3.7.0](https://github.com/exadel-inc/esl/compare/v3.6.0...v3.7.0) (2021-12-07)


### Bug Fixes

* **esl-utils:** `CSSClassUtils` utility should support lower DOM API ([594b889](https://github.com/exadel-inc/esl/commit/594b8892db600f3fcb99915fe28ea062a5942281))
* **esl-utils:** fix usage of deprecated substr in `CSSClassUtils` ([c142152](https://github.com/exadel-inc/esl/commit/c142152edfab5ab5398a53eb3029cb94fc03eb94))


### Features

* **esl-animate:** make a new module "esl-animate" to animate elements on viewport intersecting ([e369350](https://github.com/exadel-inc/esl/commit/e3693507b65194ec952ada37d5255bc6f9d48b31))
* **esl-utils:** `ESLVSizeCSSProxy` utility to fix 100vh problem is introduced ([5bae888](https://github.com/exadel-inc/esl/commit/5bae8882f87797741ef10cc835e50f7485fe63c8))

# [3.6.0](https://github.com/exadel-inc/esl/compare/v3.5.0...v3.6.0) (2021-11-23)


### Bug Fixes

* **esl-media:** `preload` and `fill-mode` types restricted ([4c41cb3](https://github.com/exadel-inc/esl/commit/4c41cb338c49559a3425029fd31f9957c741b3aa))
* **esl-poup:** fix popup positioning ([61b0237](https://github.com/exadel-inc/esl/commit/61b0237f3b7fc9c14f786d382b0900ceffeaa9d0))


### Features

* **esl-popup:** add new feature to be able to set position of arrow on popup ([7973e1f](https://github.com/exadel-inc/esl/commit/7973e1f4f2281f538abb7783046463d2b7967fa2))
* **esl-traversing-query:** add ability to restrict global scope ([3e136c0](https://github.com/exadel-inc/esl/commit/3e136c09245f10dd5bfe24cc0c7deb94551f8aed))
* **esl-utils:** array unwrap utility ([45c50a0](https://github.com/exadel-inc/esl/commit/45c50a067b9a0de42e1740ae6bba0264d1229280))
* **esl-utils:** fix `isPrimitive` check and `isObject` return type, add `isArrayLike` ([80b8aa0](https://github.com/exadel-inc/esl/commit/80b8aa04068f9d047c459769ce32a71a5ddaf0d9))

# [3.5.0](https://github.com/exadel-inc/esl/compare/v3.4.1...v3.5.0) (2021-11-15)


### Bug Fixes

* **esl-alert:** default alert background color changed ([0243e63](https://github.com/exadel-inc/esl/commit/0243e632efd2a6a27679f3b942fa828f2c5bcfe2))
* **esl-popup:** fix arrow position for adjacent axis ([b37d550](https://github.com/exadel-inc/esl/commit/b37d55021659c6781f516641f5fc88eda77aaf39))
* **esl-select:** return min-width ([c07ceba](https://github.com/exadel-inc/esl/commit/c07ceba75b320e4bc7eaa0c4333d7cfb51ee6d43))


### Features
* **gh-pages** new demo site released
* **esl-utils** add ability to scrollIntoView to detect when scrolling stops ([d1a4845](https://github.com/exadel-inc/esl/commit/d1a48452f1fcdfd7347f86bf6d09eeeb2dc1d80a))
* **esl-alert:** ability to control initial params ([1cda5ea](https://github.com/exadel-inc/esl/commit/1cda5ea2d4d121cb73b50f2dbf7518151081db85))


## [3.4.1](https://github.com/exadel-inc/esl/compare/v3.4.0...v3.4.1) (2021-11-08)


### Bug Fixes

* **esl-utils:** scrollIntoViewAsync() method signature ([6817b31](https://github.com/exadel-inc/esl/commit/6817b31dea274bf57e271d34dcfb7625d1e9b57f))
* **esl-utils:** update dispatch parameter type ([0834a97](https://github.com/exadel-inc/esl/commit/0834a974babf59aaef1bacb753057586a433a056))

# [3.4.0](https://github.com/exadel-inc/esl/compare/v3.3.0...v3.4.0) (2021-10-21)


### Bug Fixes

* **esl-trigger:** remove debug information about incorrect target ([1b4bea9](https://github.com/exadel-inc/esl/commit/1b4bea973bd236c30d2b3654dd6979578faabf00))


### Features

* **esl-forms:** add TSX shapes for ESLSelect and ESLSelectList ([ab1c550](https://github.com/exadel-inc/esl/commit/ab1c550292f8a19bdb4deb1458e2f0b9b7a58ca3))
* **esl-scrollbar:** default inactive state for arrows in the boundary stages ([9a72663](https://github.com/exadel-inc/esl/commit/9a7266374cb3c795a7b5fd01cbff02c71b111cb5))
* **esl-utils:** add `repeatSequence` utility to call async function in chain n-th count of times ([03eff4c](https://github.com/exadel-inc/esl/commit/03eff4c08064024025a16186c57eab6d9d403028))
* **esl-utils:** add a capitalize method to `esl-utils/misc/format.ts` ([#554](https://github.com/exadel-inc/esl/issues/554)) ([a2c19fc](https://github.com/exadel-inc/esl/commit/a2c19fcfbc0bbdfbac6b28ceb01100990fed219a))

# [3.3.0](https://github.com/exadel-inc/esl/compare/v3.2.0...v3.3.0) (2021-10-08)


### Features

* **esl-scrollbar:** add at-end / at-start markers ([ce0a6fe](https://github.com/exadel-inc/esl/commit/ce0a6fecebdb7332674aa3369674c80c5937bab8))
* **esl-scrollbar:** dispatch position event ([ad7e7db](https://github.com/exadel-inc/esl/commit/ad7e7db105d75f08be2f47225b02eb1311b2ab00))
* **esl-utils:** add new groupBy utility to the array utils ([5d65b82](https://github.com/exadel-inc/esl/commit/5d65b82979113ae3020a948a56a816dbacf88a43)), closes [#503](https://github.com/exadel-inc/esl/issues/503)

# [3.2.0](https://github.com/exadel-inc/esl/compare/v3.1.0...v3.2.0) (2021-09-22)


### Bug Fixes

* **esl-trigger:**  can be of the type null ([58f0644](https://github.com/exadel-inc/esl/commit/58f0644dee92dcb37c76b86df2e5da8bb4ccdbc2))
* **esl-trigger:** error handling if the target is not an instance of togglable ([85cb6c1](https://github.com/exadel-inc/esl/commit/85cb6c17c9299c5b6e5dca0ecaff9d6586da0351))
* **esl-utils:** fix `Debounced` and `Throttled` function return types ([3d2c598](https://github.com/exadel-inc/esl/commit/3d2c59811de982156e672e874cc38a711b40b3e8))


### Features

* add ability to prevent scroll on focus ([#490](https://github.com/exadel-inc/esl/issues/490)) ([a9a8a02](https://github.com/exadel-inc/esl/commit/a9a8a02706a11327eceb52f0c5d97bef40858015))
* **esl-trigger:** add `esl:change:active` event details & fix event emmit condition ([a0237b2](https://github.com/exadel-inc/esl/commit/a0237b267fbe0a0f9fa0eaa546bac92d90d3a76a)), closes [#480](https://github.com/exadel-inc/esl/issues/480)
* **esl-utils:** add optional `throttle` and `debounce` context argument ([eb948ce](https://github.com/exadel-inc/esl/commit/eb948cead3bd3afa7138e5fb96c58e8dde389116))

# [3.1.0](https://github.com/exadel-inc/esl/compare/v3.0.3...v3.1.0) (2021-09-16)

New Exadel Smart Library version comes with extended and out-of-the-box support for TSX.
TSX Shapes updated and complete, `JSX.Element` merging no longer required, everything available OOTB.
**Default ESL tags definition no longer needed, get rid of the `IntrinsicElements` interface expansion, ESL now define everything that's required.**

### Bug Fixes

* tsx single tags allowed child definition ([10e465a](https://github.com/exadel-inc/esl/commit/10e465a268059ffe5f1e96aecd6f123f5af6cc04))


### Features

* add `ESLBaseElement` complete and independent TSX shape definition ([7517bf4](https://github.com/exadel-inc/esl/commit/7517bf40b6c53e7593e198ba4520ee467d2755b7))
* add TSX shapes for `ESLAlert` ([b2ff733](https://github.com/exadel-inc/esl/commit/b2ff733028e3fb5ac27831388bc67b73e72e9eed))
* add TSX shapes for `ESLPopup` ([180f411](https://github.com/exadel-inc/esl/commit/180f411ceef38d3b558de4c5b4c902dc1cb8a1eb))
* ootb TSX types for components & updates complete TSX shapes ([2bd409c](https://github.com/exadel-inc/esl/commit/2bd409c3f5be79df76c7745ffdcaf574f614b35a)), closes [#476](https://github.com/exadel-inc/esl/issues/476)
* add new set utilities with the following methods:
    - `intersection`  - to create a unique array intersection
    - `union`  - to create a union of the unique values
    - `complement` - to create a complement of one array to another
    - `fullIntersection` - check if the arrays have a full intersection


## [3.0.3](https://github.com/exadel-inc/esl/compare/v3.0.2...v3.0.3) (2021-09-07)


### Bug Fixes

* fix allowed children for new JSX Shapes ([aa3182b](https://github.com/exadel-inc/esl/commit/aa3182bcce565ad23802286663d54ed96b694f5e))
* fix default value for trigger ([b7c600a](https://github.com/exadel-inc/esl/commit/b7c600a24e562b15204c4223ee6a03ba592f04f7))

## [3.0.2](https://github.com/exadel-inc/esl/compare/v3.0.1...v3.0.2) (2021-09-06)


### Bug Fixes

* **esl-panel:** fix animation reflow for esl-panel ([3603609](https://github.com/exadel-inc/esl/commit/36036098be10b265324f0b3f8ecfa3464715f234))
* **esl-toggleable:** final fix for outside action handling flow ([9b3056c](https://github.com/exadel-inc/esl/commit/9b3056c85c12bfdf41f2b44a4415fb0dea6695f7))
* fix unsubscribe for outside actions ([27e9d32](https://github.com/exadel-inc/esl/commit/27e9d3242e9d2efce4b94c0ef2bd08ecaa228635))

## [3.0.1](https://github.com/exadel-inc/esl/compare/v3.0.0...v3.0.1) (2021-09-03)


### Bug Fixes

* **esl-toggleable:** fix outside action binding ([eccc2d7](https://github.com/exadel-inc/esl/commit/eccc2d75453f8d4b84167fdc10d2bcb0e1d86c3d))

# [3.0.0](https://github.com/exadel-inc/esl/compare/v2.9.1...v3.0.0) (2021-09-01)


### Bug Fixes

* **esl-footnotes:** fix broken click on back-to-note ([e66ae96](https://github.com/exadel-inc/esl/commit/e66ae967681fc2a59e71fb5c7f990d4e16dbc6c2))
* **esl-footnotes:** fix character for return to note due to its absence at fonts on some platforms ([d74788f](https://github.com/exadel-inc/esl/commit/d74788fe1efde9aed4b8a3ffdb201c5aea138e34))
* **esl-footnotes:** fix footnotes soting and reindex ([f13ba79](https://github.com/exadel-inc/esl/commit/f13ba79d72383584bf62ced35cda9d587697a677))
* **esl-footnotes:** fix IE11 issue with Map.iterator absent ([3bad82b](https://github.com/exadel-inc/esl/commit/3bad82b383a0e9fcd41d3d3bb5d6452a9673e491))
* **esl-media:** fix toggle method and process keydown event otb ([b3ad030](https://github.com/exadel-inc/esl/commit/b3ad030b42ed0e28946b73bfe5c661bd9d899d74))
* **esl-note:** fix broken connection between esl-note and esl-footnotes ([646ebbc](https://github.com/exadel-inc/esl/commit/646ebbc46d92e50e6070c5aa34b98d9623f417a4))
* **esl-note:** fix the issue with lost tooltip text after cloning of element ([882e0b0](https://github.com/exadel-inc/esl/commit/882e0b0398d16bff04e022ce994484bbdc917489))
* **esl-panel:** add missing observedAttributes method ([2bae85f](https://github.com/exadel-inc/esl/commit/2bae85f46cb81ba83d4eee08b4536d40cd1fbb58))
* **esl-panel:** fix twitchy panel animation on multiple requests ([fee25af](https://github.com/exadel-inc/esl/commit/fee25aff21b328fcf9eb61dee7a87bb80eef2a64))
* **esl-popup:** fix IE11 errors in popup behaviour ([6c7c50d](https://github.com/exadel-inc/esl/commit/6c7c50d0f88d659c399f4e38cb7b6fdbf651070d))
* **esl-popup:** fix wrong popup arrow positioning ([d127a67](https://github.com/exadel-inc/esl/commit/d127a67588d2e32230304edcf69079a0a8e58223))
* **esl-popup:** fix wrong popup positioning ([907ce47](https://github.com/exadel-inc/esl/commit/907ce4750e4b4729d5ae1634ca9e0346161408c8))
* **esl-popup:** remove position attr from popup arrow and add placed-at attr to popup element ([32d9d93](https://github.com/exadel-inc/esl/commit/32d9d937fc28209904c8f9fd7c14e0783a0c60d5))
* **esl-popup:** wrong popup position when the popup is shown at the first time ([c5195ab](https://github.com/exadel-inc/esl/commit/c5195ab7415ba4c7309879e93be8db049b61bb3e))
* **esl-popup:** wrong popup position when the popup is shown at the first time ([7533683](https://github.com/exadel-inc/esl/commit/753368395f238fe9870a92436adbb749828a325d))
* **esl-select-list:** fix IE11 scroll ([0c4bebb](https://github.com/exadel-inc/esl/commit/0c4bebb15536a2eeaaf84723928b634682f1573d))
* **esl-toggleable:** allow to register toggleable as independent component ([ac98970](https://github.com/exadel-inc/esl/commit/ac98970987dda5e2103f6e1104568d60642c0f2a))
* **esl-toggleable:** fix trackHover hideDelay inheritance from the original activator ([e67acb3](https://github.com/exadel-inc/esl/commit/e67acb38530105629cb82560246a22af795d0c39))
* **esl-toggleable:** fix trackHover precondition ([751eb76](https://github.com/exadel-inc/esl/commit/751eb7636797cb1b79f6df1b6bcf3ff5b8350fb9))
* **esl-trigger:** fix incorrect tap handling on mobile devices ([a297ff6](https://github.com/exadel-inc/esl/commit/a297ff6688c1044f62679db2136b9f442bc7bc68)), closes [#436](https://github.com/exadel-inc/esl/issues/436)
* **esl-utils:** delayed-task now accept numeric string delay representation ([d1122f4](https://github.com/exadel-inc/esl/commit/d1122f45365e3599f3a3a35fc3f8528b10d5c659))
* activator is not defined in hide handler ([6e2473e](https://github.com/exadel-inc/esl/commit/6e2473eae4a0742c0737b4d743415d4de5e207cf))
* add cleanup step for the build and start ([31dd317](https://github.com/exadel-inc/esl/commit/31dd3176c7fc4b03c06c9804046ae79f710bf4f6))
* fix twitchy scrollbar when scroll-behavior set to smooth for target ([4b9848c](https://github.com/exadel-inc/esl/commit/4b9848c9881cce9de4a4e283b61b3ffa78c9f73e)), closes [#430](https://github.com/exadel-inc/esl/issues/430)
* **esl-select:**  fix height empty space appeared with little amount of list items ([9dfadc4](https://github.com/exadel-inc/esl/commit/9dfadc410cb5f5fcbaafc3debfe64386ca0013c7))
* **esl-select:**  specify max-height for standalone list in pixels & for list in dropdown in vh ([70ed2f0](https://github.com/exadel-inc/esl/commit/70ed2f0cba83dcf2801ee6f9729fac4ce53bb114))
* **esl-utils:** deep merge: fix array case and refactor ([4191b85](https://github.com/exadel-inc/esl/commit/4191b851cb84f59ef31cf8bbb0dd29c5594fea86))
* **esl-utils:** device detector touch detection improved ([7a5956e](https://github.com/exadel-inc/esl/commit/7a5956ebf55d00bde38707c92bc921ac48c1c5ef))
* **esl-utils:** fix IE issue 'ShadowRoot is undefined' ([4a8cffc](https://github.com/exadel-inc/esl/commit/4a8cffc025441016b75a723365fec4ad7ca2d288))
* **esl-utils:** fix IE11 issue with x and y absent in DOMRect ([b64a654](https://github.com/exadel-inc/esl/commit/b64a6545048164022cfa4a180da9ae8a922a8241))
* declare global interface HTMLElementTagNameMap ([b5c96de](https://github.com/exadel-inc/esl/commit/b5c96de0e88e96b63796c7a1921774c71693cbfd))
* fix namespace types and typing placement ([c2e2ab0](https://github.com/exadel-inc/esl/commit/c2e2ab00901dc599a5c994ae16036d1ea92b3a11))
* pseudo scroll locker styles fix ([8d2cfeb](https://github.com/exadel-inc/esl/commit/8d2cfeb04525fb968a2372d86fd1cbd3f6a866b2))
* remove drafts collection from sitemap ([3dc726a](https://github.com/exadel-inc/esl/commit/3dc726a8a617bf622fedb640e41f7b1087f12d58))
* **esl-utils:** fix IE issue 'ShadowRoot is undefined' ([c354ab9](https://github.com/exadel-inc/esl/commit/c354ab9971ed82c45168b29354f1f943f3a3b4ae))
* merge changes ([ec09584](https://github.com/exadel-inc/esl/commit/ec095848cbb2efd195bc5963c8c76cb385172632))
* **esl-utils:** add hasHover device detection ([2f46dc5](https://github.com/exadel-inc/esl/commit/2f46dc593f21822cb00a883acdcead608f6ee3b7))
* **esl-utils:** fix IE pseudo scroll lock artifacts ([90961e0](https://github.com/exadel-inc/esl/commit/90961e07e8af28091245cdaac5bf7b93f8c34edc))
* **esl-utils:** fix media query empty rule payload type (null -> undefined) ([423506e](https://github.com/exadel-inc/esl/commit/423506e83ae9793518ce3e19351a56600d0d5f5d))
* **esl-utils:** fix pseudo scroll RTL support ([db23758](https://github.com/exadel-inc/esl/commit/db23758a408c1f0309c71391fc68bd30f1933f6a))
* **esl-utils:** strict types for deep merge ([04bbad4](https://github.com/exadel-inc/esl/commit/04bbad4ea68b18caf01420c6aeae05c83f23ead1))
* activator should be available after hide ([817181a](https://github.com/exadel-inc/esl/commit/817181aad59499abb15d0f2ad9a82f56e63f98cd))
* editing styles for correct display on mobile ([58a35b1](https://github.com/exadel-inc/esl/commit/58a35b104dfa96783f9bd25d43b5b3d3663bf378))
* fix esl-popup arrow position ([b0490df](https://github.com/exadel-inc/esl/commit/b0490dff03cd42dad6dfdd885ff1dbb6bb749076))
* **esl-image:** svg loading check update ([6f72a70](https://github.com/exadel-inc/esl/commit/6f72a708cf0594ff1ef5a7f2eabbc03f4164fa87))
* **esl-utils:** isRtl check updated to use computed styles instead of attribute ([89ae48d](https://github.com/exadel-inc/esl/commit/89ae48d5da35eab386d2f3cb53cdb20273e29423))
* **esl-utils:** update export list ([5b9df8b](https://github.com/exadel-inc/esl/commit/5b9df8b2733efa8fbf3999c47150b4e7e2464ad5))
* **esl-utils:** utility DeviceDetector updated to recognize iOS13 ([dc2bda2](https://github.com/exadel-inc/esl/commit/dc2bda2be9b30f89953bc5c7b79c03ae6a3fc8ea))


### Code Refactoring

* **esl-utils:** remove deprecations of version v2.0.0 ([cbd38b6](https://github.com/exadel-inc/esl/commit/cbd38b6011b790b89a243fb4b0d419b7c80907a8))


### Features

* **esl-a11y-group:** add jsx tag shape ([c469f20](https://github.com/exadel-inc/esl/commit/c469f2018989fa03b44ca300e9593a04b16ab79f))
* **esl-footnotes:** add a grouping of footnotes with non-unique text ([9890124](https://github.com/exadel-inc/esl/commit/9890124c6a65750a52e543a863c2def739504937))
* **esl-footnotes:** add a grouping of footnotes with non-unique text ([05344a0](https://github.com/exadel-inc/esl/commit/05344a0e881b15a1ff6cba67557e15fa950518bc))
* **esl-media-query:** media query v2 update ([#232](https://github.com/exadel-inc/esl/issues/232)) ([0c122e9](https://github.com/exadel-inc/esl/commit/0c122e91514355b376043f8e67dbae244dac1c81))
* **esl-note:** add highlighting for notes ([2864205](https://github.com/exadel-inc/esl/commit/2864205e2118e0aa8869913df2c3bb0daac63974))
* **esl-panel:** add jsx tag shape ([ba00085](https://github.com/exadel-inc/esl/commit/ba00085e44e8c45c9e4ae6182251e7e420857df3))
* **esl-panel-group:** allows any number of open panels for accordion mode ([3476e90](https://github.com/exadel-inc/esl/commit/3476e90f9b5b89fb8c16a92540fb799cd12ffdff))
* **esl-popup:** add bottom, left, right position and update position when parents scroll ([9242fca](https://github.com/exadel-inc/esl/commit/9242fcabded6a5f349b40ef1cc46cedda86b058a))
* **esl-popup:** add popup flipping and hiding by detection intersection side ([a213262](https://github.com/exadel-inc/esl/commit/a213262813c1ddc79d51510bbb4001cae2aeca4c))
* **esl-popup:** remake popup positioning ([2ffe381](https://github.com/exadel-inc/esl/commit/2ffe3817d990e6ed98117ece5196c286ad3f71d4))
* **esl-popup:** update esl-popup demo page ([bb0e396](https://github.com/exadel-inc/esl/commit/bb0e396a69819590db923578ddcbe1d411aa2b0e))
* **esl-popup:** update imports, move separate window helpers, remove unnecessary code ([f198295](https://github.com/exadel-inc/esl/commit/f19829520f195f787288eb21a800af23bb9c4eba))
* **esl-scrollbar:** add rtl support for horizontal scrollbar ([fa27e5d](https://github.com/exadel-inc/esl/commit/fa27e5d49f7e2f864ae8fd65816cf00bdb5035da))
* **esl-tabs:** add jsx tag shape ([4688984](https://github.com/exadel-inc/esl/commit/4688984cb00a0fabdc7322d1e4cc8d68b12dac28))
* **esl-toggleable:** add jsx tag shape ([d583f24](https://github.com/exadel-inc/esl/commit/d583f243fdb68ef02c7b711ade7c7ad360a69d10))
* **esl-tooltip:** add new action param to set up tooltip extra classes ([1b1587f](https://github.com/exadel-inc/esl/commit/1b1587fed6581997b758d5464505bdc68540123b))
* **esl-trigger:** add jsx tag shape ([2b36fae](https://github.com/exadel-inc/esl/commit/2b36fae8e1d08f11eb9311098a4763e2d432788b))
* **esl-utils:** add ability check if the memoized property create a cache ([81f2e02](https://github.com/exadel-inc/esl/commit/81f2e02fcabd20e2c6b5f59c15e3718c7e177b1d))
* **esl-utils:** add butch manipulations support for `CSSClassUtils` ([#395](https://github.com/exadel-inc/esl/issues/395)) ([3635e39](https://github.com/exadel-inc/esl/commit/3635e39507fd9227052580d07f1490f8dc8ac863))
* **esl-utils:** add new syntax options support for format utility ([#393](https://github.com/exadel-inc/esl/issues/393)) ([e44aca0](https://github.com/exadel-inc/esl/commit/e44aca01b054430fe724fc896bfb9d55ea30f959))
* **esl-utils:** range array utility ([fbeae90](https://github.com/exadel-inc/esl/commit/fbeae90ba0a2746dd7086b4d6afaf1915cd9171d))
* 'throttle' API changes ([8db7bfb](https://github.com/exadel-inc/esl/commit/8db7bfb4adbb74d595b5fe041a930edfaaa65986))
* add deepMerge utility ([11331d8](https://github.com/exadel-inc/esl/commit/11331d885c236a882e192311dc2e2848e145b4b3))
* add helpers (isScrollParent, getScrollParent and getListScrollParent) for working with scroll parents ([a4d25f9](https://github.com/exadel-inc/esl/commit/a4d25f9b4f2f381cd831192f0289bfd0d9caefe9))
* add priority tag ([43904be](https://github.com/exadel-inc/esl/commit/43904be29875f15dd563ac286ebd7797faa15f55))
* add sitemap generator ([78651ce](https://github.com/exadel-inc/esl/commit/78651ce4b9d79fc57fc908d91e8aab0e8feaeb15))
* add some tests ([25e4e01](https://github.com/exadel-inc/esl/commit/25e4e0108103ea6e172a1e34e2d73fae6e71d14f))
* create dom helpers class Rect to manage size and position of rectangles ([3343bfd](https://github.com/exadel-inc/esl/commit/3343bfd04884adb5a3cd0afb1e4fb3b7d088cce5))
* create esl-popup demo page ([b4eec2c](https://github.com/exadel-inc/esl/commit/b4eec2c911027d0d4e860b2d26c326cb956f486f))
* create helpers for working with the window as part esl-util DOM helpers ([49a58b2](https://github.com/exadel-inc/esl/commit/49a58b288c5c4f323d12c994b117467c3b01132a))
* debounced method API changes ([#402](https://github.com/exadel-inc/esl/issues/402)) ([420f8bc](https://github.com/exadel-inc/esl/commit/420f8bc8a800f4e2362b47fdf9c84c912af16ba6))
* **gh-pages:** the ability to include markdown into demo pages ([#368](https://github.com/exadel-inc/esl/issues/368)) ([7fa42fc](https://github.com/exadel-inc/esl/commit/7fa42fc9fe4fbc2ccb4c320811b922a2bcb3eec1))
* add `isPrototype` check predicate to 'misc/object' utils ([ad30d37](https://github.com/exadel-inc/esl/commit/ad30d3756ad38fe67bf2502f8eb38804fe2a314b))
* add meta tag viewport ([2994954](https://github.com/exadel-inc/esl/commit/2994954f7aa2837fc7ace328700a2ae6f6e6c73b))
* create helpers for working with the element as part esl-util DOM helpers ([2d72af1](https://github.com/exadel-inc/esl/commit/2d72af1d72542666d4d96f32a4f7db7971f31cba))
* **esl-toggleable:** add track hover params property ([50f8d77](https://github.com/exadel-inc/esl/commit/50f8d77c7bdd7470bd8ae996cda33f11a67bee43))
* **esl-toggleable:** set track hover activator to initial ([c48d182](https://github.com/exadel-inc/esl/commit/c48d182277411524024b03741dd3b4dbbdf65b2b))
* **esl-trigger:** show/hide delay override for hover on trigger ([7962eba](https://github.com/exadel-inc/esl/commit/7962eba74f01177f97f30aab68a2a9b4d4d2dc9f))
* **esl-utils:**  add copy & omit utilities ([d31b957](https://github.com/exadel-inc/esl/commit/d31b9573d271708943b0abb717952fb7d7c01ef5))
* **esl-utils:** add EventUtil stopPropagation and preventDefault stubs ([2e835f4](https://github.com/exadel-inc/esl/commit/2e835f47e310599067823f1fef8ba69035695344))
* **gh-pages:** migration of the demo-site to 11ty ([#287](https://github.com/exadel-inc/esl/issues/287)) ([61e42de](https://github.com/exadel-inc/esl/commit/61e42de87b188f4a8b7e61d89a368bfaf1313d84))
* add prefix support for random uid ([6d7e180](https://github.com/exadel-inc/esl/commit/6d7e1806390e5e1d02431e78fa9bcb98879c0f27))
* add trigger esl-tooltip to esl-note ([ff13d74](https://github.com/exadel-inc/esl/commit/ff13d7472328afd8f0fd9ccf262aa487a6a92612))
* add updating activator state to esl-tooltip ([238c744](https://github.com/exadel-inc/esl/commit/238c744c765bcd32752b6963be35c062adab1204))
* create localdev page for esl-note and esl-footnotes ([c22b192](https://github.com/exadel-inc/esl/commit/c22b192bccb8966ed64d378980ec42d3802bf436))
* esl-note replace note text with note html ([5882e71](https://github.com/exadel-inc/esl/commit/5882e71326ad3262ad62fb7f76bedbfbc5f08779))
* **esl-utils:** add parseNumber utility ([5e5fff1](https://github.com/exadel-inc/esl/commit/5e5fff12af6f16da2888f6770423e718ce9853aa))
* add resize listener to esl-popup for updating position ([c5017d5](https://github.com/exadel-inc/esl/commit/c5017d56ef5fcbda0359f35cc8d581d9ebab60ed))
* create back-to-note button at esl-footntes ([a619d73](https://github.com/exadel-inc/esl/commit/a619d73195511403c7efcd1378e537bbaa5624ab))
* extend UID utilities ([f90a1c1](https://github.com/exadel-inc/esl/commit/f90a1c178b11364d4e1424d0e0673e77cbbaf553))
* improve interconnection between esl-notes and esl-footnotes ([2e79fd0](https://github.com/exadel-inc/esl/commit/2e79fd0e224c0c04db7b5f78aede727c16e545c4))
* improved interconnection between esl-notes and esl-footnotes ([5e422d7](https://github.com/exadel-inc/esl/commit/5e422d7134df4a76b7f750b387141bbb71375c38))
* initial implementation of esl-footnotes ([042c4e7](https://github.com/exadel-inc/esl/commit/042c4e7d60916cc0eecf7a4eaaaa810d70d42498))
* initial implementation of esl-note ([d158c5a](https://github.com/exadel-inc/esl/commit/d158c5a0d9cd76926ad403948d5f53625d627f04))
* initial implementation of esl-tooltip ([4a0620b](https://github.com/exadel-inc/esl/commit/4a0620b87377a39ec8c0aaeadac51037b753878b))
* rework esl-note ([c709022](https://github.com/exadel-inc/esl/commit/c7090224b2d104f93b986e2c6dfbfdbd605cbeb9))
* rework esl-popup ([5723b38](https://github.com/exadel-inc/esl/commit/5723b38c91098088cdca6ec267dec42810bf9b70))
* share sequences between bundles ([307fe53](https://github.com/exadel-inc/esl/commit/307fe53b8ff3bb7219b1095ea50aa23126391f71))
* support mode="open" to make all panels active ([2619fe5](https://github.com/exadel-inc/esl/commit/2619fe55e63b78af237af09a30b55ec442172774))
* update esl-note after esl-trigger reimplementation ([134c020](https://github.com/exadel-inc/esl/commit/134c02010ecb1ee9649ff8ce2751316fd0f9f310))
* update esl-popup styles ([167ef0a](https://github.com/exadel-inc/esl/commit/167ef0ae54da9f593d6474b3823ca8df37e3cd8b))
* update memoization for object getter accessor with a lightweight version ([ae5614b](https://github.com/exadel-inc/esl/commit/ae5614b1e3b23876326a1656110eee42f4c26be6))
* **esl-toggleable:** automatic initial a11y ([49e30c4](https://github.com/exadel-inc/esl/commit/49e30c458e6860955718440451fe91ee7545fdc1))
* **esl-toggleable:** esl-toggleable reimplementation ([94bf814](https://github.com/exadel-inc/esl/commit/94bf8142c82fc91e91dae86440202a0450906bb0))
* **esl-toggleable:** toggleable API updated, show/hide flow refactored ([2e77654](https://github.com/exadel-inc/esl/commit/2e776541da85d1c5760cc1c622843f50577f7799))
* **esl-utils:** aggregate decorator function introduced ([0915fd6](https://github.com/exadel-inc/esl/commit/0915fd6dfad7f09405ebb71877f82fd1a0ed1a92))
* **esl-utils:** focus order utility ([bd61f99](https://github.com/exadel-inc/esl/commit/bd61f996c5138254bade5a19c40561ed075d340b))


### BREAKING CHANGES

* **esl-panel:** ESLPanelGroup is now distributed as a separate module
* decorated `debouncedMethod = debounce(fn)` call no longer returns Promise use 'debouncedMethod.promise' instead

Co-authored-by: ala'n (Alexey Stsefanovich) <astsefanovich@exadel.com>
* **esl-media-query:** - `ESLMediaQuery` no longer constructible use `ESLMediaQuery.for` and `ESLMediaQuery.from` instead
- `ESLMediaRule` - DPR and device marker no longer available
- `ESLMediaBreakpoints.addCustomBreakpoint` replaced with `ESLScreenBreakpoints.add`
- `ESLMediaBreakpoints.getBreakpoint` replaced with `ESLScreenBreakpoints.get`
- `ESLMediaQuery.ignoreBotsDpr` replaced with `ESLMediaDPRShortcut.ignoreBotsDpr`
- `ObserverCallback` removed use strict type instead
* **esl-toggleable:** * `event` property no longer available.
Alternative `track-click`/`track-hover` options provided
* `touchShowDelay` and `touchShowDelay` removed.
Use `showDelay` / `hideDelay` with ESLMediaQuery support
* Inner API changes: `showEvent`, `hideEvent` removed
* Inner API changes: `_onClick`, `_onMouseEnter`, `_onMouseLeave` handlers
* `generateUId` renamed to `randUID`
* **esl-toggleable:** onShow/onHide no longer contains inner state changes.
* **esl-utils:** `CSSUtil` from 'esl-utils/dom/styles' is removed;
`ScrollUtility` alias is no longer available use `ScrollUtils` instead;
`@override` and `@readonly` deprecated decorators are removed use `@prop` decorator instead;

# [3.0.0-beta.20](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.19...v3.0.0-beta.20) (2021-08-30)


### Bug Fixes

* **esl-panel:** add missing observedAttributes method ([2bae85f](https://github.com/exadel-inc/esl/commit/2bae85f46cb81ba83d4eee08b4536d40cd1fbb58))
* **esl-panel:** fix twitchy panel animation on multiple requests ([fee25af](https://github.com/exadel-inc/esl/commit/fee25aff21b328fcf9eb61dee7a87bb80eef2a64))
* **esl-toggleable:** fix trackHover hideDelay inheritance from the original activator ([e67acb3](https://github.com/exadel-inc/esl/commit/e67acb38530105629cb82560246a22af795d0c39))
* **esl-utils:** deep merge: fix array case and refactor ([4191b85](https://github.com/exadel-inc/esl/commit/4191b851cb84f59ef31cf8bbb0dd29c5594fea86))
* **esl-utils:** delayed-task now accept numeric string delay representation ([d1122f4](https://github.com/exadel-inc/esl/commit/d1122f45365e3599f3a3a35fc3f8528b10d5c659))
* add cleanup step for the build and start ([31dd317](https://github.com/exadel-inc/esl/commit/31dd3176c7fc4b03c06c9804046ae79f710bf4f6))
* fix twitchy scrollbar when scroll-behavior set to smooth for target ([4b9848c](https://github.com/exadel-inc/esl/commit/4b9848c9881cce9de4a4e283b61b3ffa78c9f73e)), closes [#430](https://github.com/exadel-inc/esl/issues/430)
* **esl-utils:** strict types for deep merge ([04bbad4](https://github.com/exadel-inc/esl/commit/04bbad4ea68b18caf01420c6aeae05c83f23ead1))


### Features

* **esl-utils:** add ability check if the memoized property create a cache ([81f2e02](https://github.com/exadel-inc/esl/commit/81f2e02fcabd20e2c6b5f59c15e3718c7e177b1d))
* 'throttle' API changes ([8db7bfb](https://github.com/exadel-inc/esl/commit/8db7bfb4adbb74d595b5fe041a930edfaaa65986))
* debounced method API changes ([#402](https://github.com/exadel-inc/esl/issues/402)) ([420f8bc](https://github.com/exadel-inc/esl/commit/420f8bc8a800f4e2362b47fdf9c84c912af16ba6))


### BREAKING CHANGES

* **esl-panel:** ESLPanelGroup is now distributed as a separate module
* decorated `debouncedMethod = debounce(fn)` call no longer returns Promise use 'debouncedMethod.promise' instead

Co-authored-by: ala'n (Alexey Stsefanovich) <astsefanovich@exadel.com>

## [2.9.1](https://github.com/exadel-inc/esl/compare/v2.9.0...v2.9.1) (2021-08-25)


# [3.0.0-beta.19](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.18...v3.0.0-beta.19) (2021-08-19)


### Bug Fixes

* **esl-footnotes:** fix broken click on back-to-note ([e66ae96](https://github.com/exadel-inc/esl/commit/e66ae967681fc2a59e71fb5c7f990d4e16dbc6c2))

# [3.0.0-beta.18](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.17...v3.0.0-beta.18) (2021-08-18)


### Bug Fixes

* **esl-footnotes:** fix footnotes soting and reindex ([f13ba79](https://github.com/exadel-inc/esl/commit/f13ba79d72383584bf62ced35cda9d587697a677))
* **esl-footnotes:** fix IE11 issue with Map.iterator absent ([3bad82b](https://github.com/exadel-inc/esl/commit/3bad82b383a0e9fcd41d3d3bb5d6452a9673e491))
* **esl-media:** fix toggle method and process keydown event otb ([b3ad030](https://github.com/exadel-inc/esl/commit/b3ad030b42ed0e28946b73bfe5c661bd9d899d74))
* **esl-note:** fix the issue with lost tooltip text after cloning of element ([882e0b0](https://github.com/exadel-inc/esl/commit/882e0b0398d16bff04e022ce994484bbdc917489))


### Features

* **esl-a11y-group:** add jsx tag shape ([c469f20](https://github.com/exadel-inc/esl/commit/c469f2018989fa03b44ca300e9593a04b16ab79f))
* **esl-panel:** add jsx tag shape ([ba00085](https://github.com/exadel-inc/esl/commit/ba00085e44e8c45c9e4ae6182251e7e420857df3))
* **esl-tabs:** add jsx tag shape ([4688984](https://github.com/exadel-inc/esl/commit/4688984cb00a0fabdc7322d1e4cc8d68b12dac28))
* **esl-toggleable:** add jsx tag shape ([d583f24](https://github.com/exadel-inc/esl/commit/d583f243fdb68ef02c7b711ade7c7ad360a69d10))
* **esl-trigger:** add jsx tag shape ([2b36fae](https://github.com/exadel-inc/esl/commit/2b36fae8e1d08f11eb9311098a4763e2d432788b))
* **esl-utils:** add butch manipulations support for `CSSClassUtils` ([#395](https://github.com/exadel-inc/esl/issues/395)) ([3635e39](https://github.com/exadel-inc/esl/commit/3635e39507fd9227052580d07f1490f8dc8ac863))
* **esl-utils:** add new syntax options support for format utility ([#393](https://github.com/exadel-inc/esl/issues/393)) ([e44aca0](https://github.com/exadel-inc/esl/commit/e44aca01b054430fe724fc896bfb9d55ea30f959))

# [3.0.0-beta.17](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.16...v3.0.0-beta.17) (2021-08-13)


### Features

* **esl-footnotes:** add a grouping of footnotes with non-unique text ([9890124](https://github.com/exadel-inc/esl/commit/9890124c6a65750a52e543a863c2def739504937))
* **esl-footnotes:** add a grouping of footnotes with non-unique text ([05344a0](https://github.com/exadel-inc/esl/commit/05344a0e881b15a1ff6cba67557e15fa950518bc))
* **esl-note:** add highlighting for notes ([2864205](https://github.com/exadel-inc/esl/commit/2864205e2118e0aa8869913df2c3bb0daac63974))

# [3.0.0-beta.16](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.15...v3.0.0-beta.16) (2021-08-09)


### Bug Fixes

* **esl-popup:** wrong popup position when the popup is shown at the first time ([c5195ab](https://github.com/exadel-inc/esl/commit/c5195ab7415ba4c7309879e93be8db049b61bb3e))
* **esl-popup:** wrong popup position when the popup is shown at the first time ([7533683](https://github.com/exadel-inc/esl/commit/753368395f238fe9870a92436adbb749828a325d))
* **esl-utils:** fix IE issue 'ShadowRoot is undefined' ([4a8cffc](https://github.com/exadel-inc/esl/commit/4a8cffc025441016b75a723365fec4ad7ca2d288))
* **esl-utils:** fix IE11 issue with x and y absent in DOMRect ([b64a654](https://github.com/exadel-inc/esl/commit/b64a6545048164022cfa4a180da9ae8a922a8241))
* merge changes ([ec09584](https://github.com/exadel-inc/esl/commit/ec095848cbb2efd195bc5963c8c76cb385172632))
* remove drafts collection from sitemap ([3dc726a](https://github.com/exadel-inc/esl/commit/3dc726a8a617bf622fedb640e41f7b1087f12d58))


### Features

* **esl-tooltip:** add new action param to set up tooltip extra classes ([1b1587f](https://github.com/exadel-inc/esl/commit/1b1587fed6581997b758d5464505bdc68540123b))
* **esl-utils:** promise functional declarations ([19b1e2b](https://github.com/exadel-inc/esl/commit/19b1e2b7e5b0fe2cf4431b35a06b07122108ddfb))
* add priority tag ([43904be](https://github.com/exadel-inc/esl/commit/43904be29875f15dd563ac286ebd7797faa15f55))
* add sitemap generator ([78651ce](https://github.com/exadel-inc/esl/commit/78651ce4b9d79fc57fc908d91e8aab0e8feaeb15))

# [2.9.0](https://github.com/exadel-inc/esl/compare/v2.8.2...v2.9.0) (2021-08-08)


### Features

* **esl-utils:** promise functional declarations ([19b1e2b](https://github.com/exadel-inc/esl/commit/19b1e2b7e5b0fe2cf4431b35a06b07122108ddfb))

# [3.0.0-beta.15](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.14...v3.0.0-beta.15) (2021-08-05)


### Bug Fixes

* fix namespace types and typing placement ([c2e2ab0](https://github.com/exadel-inc/esl/commit/c2e2ab00901dc599a5c994ae16036d1ea92b3a11))
* **esl-popup:** remove position attr from popup arrow and add placed-at attr to popup element ([32d9d93](https://github.com/exadel-inc/esl/commit/32d9d937fc28209904c8f9fd7c14e0783a0c60d5))
* **esl-utils:** fix IE issue 'ShadowRoot is undefined' ([c354ab9](https://github.com/exadel-inc/esl/commit/c354ab9971ed82c45168b29354f1f943f3a3b4ae))
* declare global interface HTMLElementTagNameMap ([b5c96de](https://github.com/exadel-inc/esl/commit/b5c96de0e88e96b63796c7a1921774c71693cbfd))


### Features

* **gh-pages:** the ability to include markdown into demo pages ([#368](https://github.com/exadel-inc/esl/issues/368)) ([7fa42fc](https://github.com/exadel-inc/esl/commit/7fa42fc9fe4fbc2ccb4c320811b922a2bcb3eec1))

## [2.8.2](https://github.com/exadel-inc/esl/compare/v2.8.1...v2.8.2) (2021-08-04)

# [3.0.0-beta.14](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.13...v3.0.0-beta.14) (2021-08-02)


### Bug Fixes

* **esl-footnotes:** fix character for return to note due to its absence at fonts on some platforms ([d74788f](https://github.com/exadel-inc/esl/commit/d74788fe1efde9aed4b8a3ffdb201c5aea138e34))
* **esl-note:** fix broken connection between esl-note and esl-footnotes ([646ebbc](https://github.com/exadel-inc/esl/commit/646ebbc46d92e50e6070c5aa34b98d9623f417a4))
* **esl-popup:** fix wrong popup arrow positioning ([d127a67](https://github.com/exadel-inc/esl/commit/d127a67588d2e32230304edcf69079a0a8e58223))
* **esl-popup:** fix wrong popup positioning ([907ce47](https://github.com/exadel-inc/esl/commit/907ce4750e4b4729d5ae1634ca9e0346161408c8))
* editing styles for correct display on mobile ([58a35b1](https://github.com/exadel-inc/esl/commit/58a35b104dfa96783f9bd25d43b5b3d3663bf378))
* fix esl-popup arrow position ([b0490df](https://github.com/exadel-inc/esl/commit/b0490dff03cd42dad6dfdd885ff1dbb6bb749076))


### Features

* **esl-media-query:** media query v2 update ([#232](https://github.com/exadel-inc/esl/issues/232)) ([0c122e9](https://github.com/exadel-inc/esl/commit/0c122e91514355b376043f8e67dbae244dac1c81))
* **esl-scrollbar:** add rtl support for horizontal scrollbar ([fa27e5d](https://github.com/exadel-inc/esl/commit/fa27e5d49f7e2f864ae8fd65816cf00bdb5035da))
* add `isPrototype` check predicate to 'misc/object' utils ([ad30d37](https://github.com/exadel-inc/esl/commit/ad30d3756ad38fe67bf2502f8eb38804fe2a314b))
* add deepMerge utility ([11331d8](https://github.com/exadel-inc/esl/commit/11331d885c236a882e192311dc2e2848e145b4b3))
* add meta tag viewport ([2994954](https://github.com/exadel-inc/esl/commit/2994954f7aa2837fc7ace328700a2ae6f6e6c73b))
* add some tests ([25e4e01](https://github.com/exadel-inc/esl/commit/25e4e0108103ea6e172a1e34e2d73fae6e71d14f))
* create dom helpers class Rect to manage size and position of rectangles ([3343bfd](https://github.com/exadel-inc/esl/commit/3343bfd04884adb5a3cd0afb1e4fb3b7d088cce5))
* **esl-popup:** update imports, move separate window helpers, remove unnecessary code ([f198295](https://github.com/exadel-inc/esl/commit/f19829520f195f787288eb21a800af23bb9c4eba))
* add helpers (isScrollParent, getScrollParent and getListScrollParent) for working with scroll parents ([a4d25f9](https://github.com/exadel-inc/esl/commit/a4d25f9b4f2f381cd831192f0289bfd0d9caefe9))
* create helpers for working with the element as part esl-util DOM helpers ([2d72af1](https://github.com/exadel-inc/esl/commit/2d72af1d72542666d4d96f32a4f7db7971f31cba))
* create helpers for working with the window as part esl-util DOM helpers ([49a58b2](https://github.com/exadel-inc/esl/commit/49a58b288c5c4f323d12c994b117467c3b01132a))
* **esl-popup:** add bottom, left, right position and update position when parents scroll ([9242fca](https://github.com/exadel-inc/esl/commit/9242fcabded6a5f349b40ef1cc46cedda86b058a))
* **esl-popup:** add popup flipping and hiding by detection intersection side ([a213262](https://github.com/exadel-inc/esl/commit/a213262813c1ddc79d51510bbb4001cae2aeca4c))
* **esl-popup:** remake popup positioning ([2ffe381](https://github.com/exadel-inc/esl/commit/2ffe3817d990e6ed98117ece5196c286ad3f71d4))
* **esl-popup:** update esl-popup demo page ([bb0e396](https://github.com/exadel-inc/esl/commit/bb0e396a69819590db923578ddcbe1d411aa2b0e))
* create esl-popup demo page ([b4eec2c](https://github.com/exadel-inc/esl/commit/b4eec2c911027d0d4e860b2d26c326cb956f486f))
* update memoization for object getter accessor with a lightweight version ([ae5614b](https://github.com/exadel-inc/esl/commit/ae5614b1e3b23876326a1656110eee42f4c26be6))


### BREAKING CHANGES

* **esl-media-query:** - `ESLMediaQuery` no longer constructible use `ESLMediaQuery.for` and `ESLMediaQuery.from` instead
- `ESLMediaRule` - DPR and device marker no longer available
- `ESLMediaBreakpoints.addCustomBreakpoint` replaced with `ESLScreenBreakpoints.add`
- `ESLMediaBreakpoints.getBreakpoint` replaced with `ESLScreenBreakpoints.get`
- `ESLMediaQuery.ignoreBotsDpr` replaced with `ESLMediaDPRShortcut.ignoreBotsDpr`
- `ObserverCallback` removed use strict type instead

# [2.8.1](https://github.com/exadel-inc/esl/compare/v2.8.0...v2.8.1) (2021-07-20)

# [3.0.0-beta.13](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.12...v3.0.0-beta.13) (2021-07-06)

# [2.8.0](https://github.com/exadel-inc/esl/compare/v2.7.3...v2.8.0) (2021-07-06)

### Bug Fixes

* **esl-utils:** fixed extra space ([bf0aea7](https://github.com/exadel-inc/esl/commit/bf0aea776fb05c7d3770aa0bcab7b1bfa9ee67d3))


### Features

* **esl-utils:** added delete, backspace to the keys.ts ([234d433](https://github.com/exadel-inc/esl/commit/234d433c58455e2f83612ade8b49866ebd5e40d2))

# [2.8.0](https://github.com/exadel-inc/esl/compare/v2.7.3...v2.8.0) (2021-07-06)

### Features

* **esl-utils:** added delete, backspace to the keys.ts ([234d433](https://github.com/exadel-inc/esl/commit/234d433c58455e2f83612ade8b49866ebd5e40d2))

# [3.0.0-beta.12](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.11...v3.0.0-beta.12) (2021-07-01)


### Bug Fixes

* **esl-utils:** isRtl check updated to use computed styles instead of attribute ([89ae48d](https://github.com/exadel-inc/esl/commit/89ae48d5da35eab386d2f3cb53cdb20273e29423))


### Features

* **esl-toggleable:** set track hover activator to initial ([c48d182](https://github.com/exadel-inc/esl/commit/c48d182277411524024b03741dd3b4dbbdf65b2b))
* **esl-utils:** add EventUtil stopPropagation and preventDefault stubs ([2e835f4](https://github.com/exadel-inc/esl/commit/2e835f47e310599067823f1fef8ba69035695344))
* **gh-pages:** migration of the demo-site to 11ty ([#287](https://github.com/exadel-inc/esl/issues/287)) ([61e42de](https://github.com/exadel-inc/esl/commit/61e42de87b188f4a8b7e61d89a368bfaf1313d84))

## [2.7.3](https://github.com/exadel-inc/esl/compare/v2.7.2...v2.7.3) (2021-06-30)
Dependencies versions update

# [3.0.0-beta.11](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.10...v3.0.0-beta.11) (2021-06-22)


### Bug Fixes

* **esl-toggleable:** allow to register toggleable as independent component ([ac98970](https://github.com/exadel-inc/esl/commit/ac98970987dda5e2103f6e1104568d60642c0f2a))


### Features
* **esl-footnotes:** new component released in beta
* **esl-tooltip:** new component released in beta
* **esl-popup** component reworked to v2.0.0

#### Detailed log: 
* add resize listener to esl-popup for updating position ([c5017d5](https://github.com/exadel-inc/esl/commit/c5017d56ef5fcbda0359f35cc8d581d9ebab60ed))
* add trigger esl-tooltip to esl-note ([ff13d74](https://github.com/exadel-inc/esl/commit/ff13d7472328afd8f0fd9ccf262aa487a6a92612))
* add updating activator state to esl-tooltip ([238c744](https://github.com/exadel-inc/esl/commit/238c744c765bcd32752b6963be35c062adab1204))
* create back-to-note button at esl-footntes ([a619d73](https://github.com/exadel-inc/esl/commit/a619d73195511403c7efcd1378e537bbaa5624ab))
* create localdev page for esl-note and esl-footnotes ([c22b192](https://github.com/exadel-inc/esl/commit/c22b192bccb8966ed64d378980ec42d3802bf436))
* esl-note replace note text with note html ([5882e71](https://github.com/exadel-inc/esl/commit/5882e71326ad3262ad62fb7f76bedbfbc5f08779))
* improve interconnection between esl-notes and esl-footnotes ([2e79fd0](https://github.com/exadel-inc/esl/commit/2e79fd0e224c0c04db7b5f78aede727c16e545c4))
* improved interconnection between esl-notes and esl-footnotes ([5e422d7](https://github.com/exadel-inc/esl/commit/5e422d7134df4a76b7f750b387141bbb71375c38))
* initial implementation of esl-footnotes ([042c4e7](https://github.com/exadel-inc/esl/commit/042c4e7d60916cc0eecf7a4eaaaa810d70d42498))
* initial implementation of esl-note ([d158c5a](https://github.com/exadel-inc/esl/commit/d158c5a0d9cd76926ad403948d5f53625d627f04))
* initial implementation of esl-tooltip ([4a0620b](https://github.com/exadel-inc/esl/commit/4a0620b87377a39ec8c0aaeadac51037b753878b))
* rework esl-note ([c709022](https://github.com/exadel-inc/esl/commit/c7090224b2d104f93b986e2c6dfbfdbd605cbeb9))
* rework esl-popup ([5723b38](https://github.com/exadel-inc/esl/commit/5723b38c91098088cdca6ec267dec42810bf9b70))
* update esl-note after esl-trigger reimplementation ([134c020](https://github.com/exadel-inc/esl/commit/134c02010ecb1ee9649ff8ce2751316fd0f9f310))
* update esl-popup styles ([167ef0a](https://github.com/exadel-inc/esl/commit/167ef0ae54da9f593d6474b3823ca8df37e3cd8b))

## [2.7.2](https://github.com/exadel-inc/esl/compare/v2.7.1...v2.7.2) (2021-06-18)
Dependencies versions update

# [3.0.0-beta.10](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.9...v3.0.0-beta.10) (2021-06-17)


### Bug Fixes

* **esl-utils:** fix IE pseudo scroll lock artifacts ([90961e0](https://github.com/exadel-inc/esl/commit/90961e07e8af28091245cdaac5bf7b93f8c34edc))
* **esl-utils:** fix pseudo scroll RTL support ([db23758](https://github.com/exadel-inc/esl/commit/db23758a408c1f0309c71391fc68bd30f1933f6a))


### Features

* **esl-toggleable:** add track hover params property ([50f8d77](https://github.com/exadel-inc/esl/commit/50f8d77c7bdd7470bd8ae996cda33f11a67bee43))
* **esl-utils:** add parseNumber utility ([5e5fff1](https://github.com/exadel-inc/esl/commit/5e5fff12af6f16da2888f6770423e718ce9853aa))
* add prefix support for random uid ([6d7e180](https://github.com/exadel-inc/esl/commit/6d7e1806390e5e1d02431e78fa9bcb98879c0f27))
* share sequences between bundles ([307fe53](https://github.com/exadel-inc/esl/commit/307fe53b8ff3bb7219b1095ea50aa23126391f71))

# [3.0.0-beta.9](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.8...v3.0.0-beta.9) (2021-06-16)


### Features

* **esl-trigger:** show/hide delay override for hover on trigger ([7962eba](https://github.com/exadel-inc/esl/commit/7962eba74f01177f97f30aab68a2a9b4d4d2dc9f))

# [3.0.0-beta.8](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.7...v3.0.0-beta.8) (2021-06-13)


### Bug Fixes

* pseudo scroll locker styles fix ([8d2cfeb](https://github.com/exadel-inc/esl/commit/8d2cfeb04525fb968a2372d86fd1cbd3f6a866b2))
* **esl-toggleable:** fix trackHover precondition ([751eb76](https://github.com/exadel-inc/esl/commit/751eb7636797cb1b79f6df1b6bcf3ff5b8350fb9))
* **esl-utils:** add hasHover device detection ([2f46dc5](https://github.com/exadel-inc/esl/commit/2f46dc593f21822cb00a883acdcead608f6ee3b7))
* **esl-utils:** fix media query empty rule payload type (null -> undefined) ([423506e](https://github.com/exadel-inc/esl/commit/423506e83ae9793518ce3e19351a56600d0d5f5d))


### Features

* **esl-toggleable:** automatic initial a11y ([49e30c4](https://github.com/exadel-inc/esl/commit/49e30c458e6860955718440451fe91ee7545fdc1))
* **esl-toggleable:** esl-toggleable reimplementation ([94bf814](https://github.com/exadel-inc/esl/commit/94bf8142c82fc91e91dae86440202a0450906bb0))


### BREAKING CHANGES

* **esl-toggleable:** 
  * `event` property no longer available.
Alternative `track-click`/`track-hover` options provided
  * `touchShowDelay` and `touchShowDelay` removed.
Use `showDelay` / `hideDelay` with ESLMediaQuery support
  * Inner API changes: `showEvent`, `hideEvent` removed
  * Inner API changes: `_onClick`, `_onMouseEnter`, `_onMouseLeave` handlers

## [2.7.1](https://github.com/exadel-inc/esl/compare/v2.7.0...v2.7.1) (2021-06-13)
Dependencies versions update


# [3.0.0-beta.7](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.6...v3.0.0-beta.7) (2021-06-08)


### BREACKING CHANGES:
* **esl-image**: make original mode rule meta independent
* **esl-media-query**: get rid of DPR meta
* **esl-media-query**: mobile device marker removed

# [3.0.0-beta.6](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.5...v3.0.0-beta.6) (2021-06-07)


### Bug Fixes

* **esl-utils:** device detector touch detection improved ([7a5956e](https://github.com/exadel-inc/esl/commit/7a5956ebf55d00bde38707c92bc921ac48c1c5ef))


### Features

* **esl-utils:**  add copy & omit utilities ([d31b957](https://github.com/exadel-inc/esl/commit/d31b9573d271708943b0abb717952fb7d7c01ef5))

# [3.0.0-beta.5](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.4...v3.0.0-beta.5) (2021-06-03)


### Bug Fixes

* activator should be available after hide ([817181a](https://github.com/exadel-inc/esl/commit/817181aad59499abb15d0f2ad9a82f56e63f98cd))

# [3.0.0-beta.4](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.3...v3.0.0-beta.4) (2021-06-02)


### Bug Fixes

* activator is not defined in hide handler ([6e2473e](https://github.com/exadel-inc/esl/commit/6e2473eae4a0742c0737b4d743415d4de5e207cf))


### Features

* extend UID utilities ([f90a1c1](https://github.com/exadel-inc/esl/commit/f90a1c178b11364d4e1424d0e0673e77cbbaf553))


### BREAKING CHANGES

* `generateUId` renamed to `randUID`

# [3.0.0-beta.3](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.2...v3.0.0-beta.3) (2021-05-31)


### Bug Fixes

* **esl-select:**  fix height empty space appeared with little amount of list items ([9dfadc4](https://github.com/exadel-inc/esl/commit/9dfadc410cb5f5fcbaafc3debfe64386ca0013c7))
* **esl-select:**  specify max-height for standalone list in pixels & for list in dropdown in vh ([70ed2f0](https://github.com/exadel-inc/esl/commit/70ed2f0cba83dcf2801ee6f9729fac4ce53bb114))
* jest defaults for new version ([9ba56b4](https://github.com/exadel-inc/esl/commit/9ba56b4794944f808c18f6e3e6e5002cf561d6ef))


### Features

* **esl-utils:** added alt, shift and control to the keys.ts (within hpe keycode removing) ([73580ec](https://github.com/exadel-inc/esl/commit/73580ecf60dd2abd7aebe72d7958a3539286f1b3))

# [3.0.0-beta.2](https://github.com/exadel-inc/esl/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2021-05-26)


### Bug Fixes

* **esl-utils:** utility DeviceDetector updated to recognize iOS13 ([dc2bda2](https://github.com/exadel-inc/esl/commit/dc2bda2be9b30f89953bc5c7b79c03ae6a3fc8ea))

# [3.0.0-beta.1](https://github.com/exadel-inc/esl/compare/v2.7.0-beta.2...v3.0.0-beta.1) (2021-05-24)


### Bug Fixes

* **esl-image:** svg loading check update ([6f72a70](https://github.com/exadel-inc/esl/commit/6f72a708cf0594ff1ef5a7f2eabbc03f4164fa87))


### Features

* **esl-toggleable:** toggleable API updated, show/hide flow refactored ([2e77654](https://github.com/exadel-inc/esl/commit/2e776541da85d1c5760cc1c622843f50577f7799))


### BREAKING CHANGES

* **esl-toggleable:** onShow/onHide no longer contains inner state changes.

# [2.7.0-beta.2](https://github.com/exadel-inc/esl/compare/v2.7.0-beta.1...v2.7.0-beta.2) (2021-05-20)


### Bug Fixes

* **esl-utils:** update export list ([5b9df8b](https://github.com/exadel-inc/esl/commit/5b9df8b2733efa8fbf3999c47150b4e7e2464ad5))


### Code Refactoring

* **esl-utils:** remove deprecations of version v2.0.0 ([cbd38b6](https://github.com/exadel-inc/esl/commit/cbd38b6011b790b89a243fb4b0d419b7c80907a8))


### Features

* **esl-utils:** aggregate decorator function introduced ([0915fd6](https://github.com/exadel-inc/esl/commit/0915fd6dfad7f09405ebb71877f82fd1a0ed1a92))
* **esl-utils:** focus order utility ([bd61f99](https://github.com/exadel-inc/esl/commit/bd61f996c5138254bade5a19c40561ed075d340b))


### BREAKING CHANGES

* **esl-utils:** `CSSUtil` from 'esl-utils/dom/styles' is removed;
`ScrollUtility` alias is no longer available use `ScrollUtils` instead;
`@override` and `@readonly` deprecated decorators are removed use `@prop` decorator instead;

# [2.7.0-beta.1](https://github.com/exadel-inc/esl/compare/v2.6.4...v2.7.0-beta.1) (2021-05-17)


### Features

* support mode="open" to make all panels active ([2619fe5](https://github.com/exadel-inc/esl/commit/2619fe55e63b78af237af09a30b55ec442172774))

# [2.7.0](https://github.com/exadel-inc/esl/compare/v2.6.4...v2.7.0) (2021-05-31)


### Bug Fixes

* jest defaults for new version ([9ba56b4](https://github.com/exadel-inc/esl/commit/9ba56b4794944f808c18f6e3e6e5002cf561d6ef))


### Features

* **esl-utils:** added alt, shift and control to the keys.ts (within hpe keycode removing) ([73580ec](https://github.com/exadel-inc/esl/commit/73580ecf60dd2abd7aebe72d7958a3539286f1b3))

## [2.6.4](https://github.com/exadel-inc/esl/compare/v2.6.3...v2.6.4) (2021-05-15)


### Bug Fixes

* 'Stack out of bounds' exception for memoized non static member in IE ([4493f90](https://github.com/exadel-inc/esl/commit/4493f9076f7f590fb72d7f24ee6c9bd735120c9c))

## [2.6.3](https://github.com/exadel-inc/esl/compare/v2.6.2...v2.6.3) (2021-04-29)

## [2.6.2](https://github.com/exadel-inc/esl/compare/v2.6.1...v2.6.2) (2021-04-26)


### Bug Fixes

* fix fallback animation call for esl-panel and esl-panel-group ([712f53d](https://github.com/exadel-inc/esl/commit/712f53d44198f8bbc32ed890c10a763667a61cf7))

## [2.6.1](https://github.com/exadel-inc/esl/compare/v2.6.0...v2.6.1) (2021-04-23)

# [2.6.0](https://github.com/exadel-inc/esl/compare/v2.5.2...v2.6.0) (2021-04-22)


### Bug Fixes

* remove undefined prop keys from toggleable properties merging ([3bb5d30](https://github.com/exadel-inc/esl/commit/3bb5d301e34a98d7afb5a32838d63cdbe21a2403))
* toggleable attribute change detection and extend action params with more information ([1627056](https://github.com/exadel-inc/esl/commit/16270569b3b54e55ff80f27c6f10d4c1fe13fdfc))


### Features

* copyDefinedKeys utility created ([11306c4](https://github.com/exadel-inc/esl/commit/11306c402104e3355031ee100af523664d3a2124))
* disabled options support for esl-select-item and fix list mutation detection ([53dfe01](https://github.com/exadel-inc/esl/commit/53dfe01622e07ffa196f46448b85818dd4d79f94))
* extend ToggleableDispatcher params with more information ([e8febf3](https://github.com/exadel-inc/esl/commit/e8febf394578bcb380481aff14cdc1faf78856e2))

## [2.5.2](https://github.com/exadel-inc/esl/compare/v2.5.1...v2.5.2) (2021-04-21)


### Bug Fixes

* provider type dynamic registration fix ([128b22f](https://github.com/exadel-inc/esl/commit/128b22f6d0b113608c533cc12a3164f37dca4d45))

## [2.5.1](https://github.com/exadel-inc/esl/compare/v2.5.0...v2.5.1) (2021-04-19)

# [2.5.0](https://github.com/exadel-inc/esl/compare/v2.4.1...v2.5.0) (2021-04-19)


### Features

* adjust scrollable attr ([b80a211](https://github.com/exadel-inc/esl/commit/b80a21175495927924bf4d923eb2b0dc45e4dfc0))
* body class manger feature rejection ([07ba596](https://github.com/exadel-inc/esl/commit/07ba596eec58e81108c02179f0a873a6931d7b21))
* change body class behaviour of the toggleable to support locks ([5379c65](https://github.com/exadel-inc/esl/commit/5379c65aeae9e2ec824cc366638770a63ffe00a4))
* class utils extended ([c3e7f66](https://github.com/exadel-inc/esl/commit/c3e7f660330d310a0181b59927e163acb7380bf5))

## [2.4.1](https://github.com/exadel-inc/esl/compare/v2.4.0...v2.4.1) (2021-04-15)


### Bug Fixes

* add TraversingQuery to ESL ns ([d1b2af2](https://github.com/exadel-inc/esl/commit/d1b2af2dedc17ccde818d5910029feda6deee2dc))
* disable scroll native mode fix ([2f5bb86](https://github.com/exadel-inc/esl/commit/2f5bb868647ae12af5312a4af8fd9995cb896432))
* outsideAction tracker conflicts with outside esl-triggers / activators ([b544e07](https://github.com/exadel-inc/esl/commit/b544e07f37bbb61a6b8d57166ebe5077f5585d7d))

# [2.4.0](https://github.com/exadel-inc/esl/compare/v2.3.2...v2.4.0) (2021-04-13)


### Bug Fixes

* add ability to pass custom user data trough toggleable params ([9e7af26](https://github.com/exadel-inc/esl/commit/9e7af2640be7868749184cff0fb9d489229b1dbb))


### Features

* extend Scrollable Tabs to support center position ([b3bb7d8](https://github.com/exadel-inc/esl/commit/b3bb7d8f3602a81da4f5ce7bfab6e48db73df4ac))
* override and readonly decorators deprecate and replaced with a `prop` decorator ([eb4040e](https://github.com/exadel-inc/esl/commit/eb4040e08ce7522e330faabb6696fbc1f0d25afa))

## [2.3.2](https://github.com/exadel-inc/esl/compare/v2.3.1...v2.3.2) (2021-04-08)


### Bug Fixes

* fix for the less files build ([#41](https://github.com/exadel-inc/esl/issues/41)dd93a) ([d079851](https://github.com/exadel-inc/esl/commit/d0798516a536e7a76f1a282c3ed944d1455f2286)), closes [#41dd93](https://github.com/exadel-inc/esl/issues/41dd93)

## [2.3.1](https://github.com/exadel-inc/esl/compare/v2.3.0...v2.3.1) (2021-04-08)


### Bug Fixes

* temporary npm build vix ([41dd93a](https://github.com/exadel-inc/esl/commit/41dd93a96c4e3313d55bca4d0dbbf470605c05a7))

# [2.3.0](https://github.com/exadel-inc/esl/compare/v2.2.1...v2.3.0) (2021-04-08)

### Features

* override and readonly implementation ([641da83](https://github.com/exadel-inc/esl/commit/641da83f7b43ea10711e8d64d2047582d2376ac1))

## [2.2.1](https://github.com/exadel-inc/esl/compare/v2.2.0...v2.2.1) (2021-04-02)


### Bug Fixes

* remove allow-same-version ([0016ada](https://github.com/exadel-inc/esl/commit/0016ada0a694bbc75cbaba23deb61037f9d1737e))

# [2.2.0](https://github.com/exadel-inc/esl/compare/v2.1.0...v2.2.0) (2021-04-02)


### Bug Fixes

* allow-same-version temporary set to true ([75eb9a0](https://github.com/exadel-inc/esl/commit/75eb9a052749ff394c275e8e091fff54a28158b9))
* npm members ([0b9fbae](https://github.com/exadel-inc/esl/commit/0b9fbae649c5a8cee8434db08031763bf278575f))


### Features

* npm release-ready version ([30c8624](https://github.com/exadel-inc/esl/commit/30c8624fdfc37a14fd35eafd8678633844813846))

# [2.2.0](https://github.com/exadel-inc/esl/compare/v2.1.0...v2.2.0) (2021-04-02)


### Features

* npm release-ready version ([30c8624](https://github.com/exadel-inc/esl/commit/30c8624fdfc37a14fd35eafd8678633844813846))

# [2.1.0](https://github.com/exadel-inc/esl/compare/v2.0.0...v2.1.0) (2021-04-02)


### Bug Fixes

* debounce fit to viewport ([0413596](https://github.com/exadel-inc/esl/commit/04135969988fcc5e0ff560c45f253a40279eb2cc))
* dependencies vulnerability cleanup ([7823287](https://github.com/exadel-inc/esl/commit/782328704aee31b31163f35f443ae3a8696eb21c))
* dependencies vulnerability cleanup 2 ([d335aaa](https://github.com/exadel-inc/esl/commit/d335aaac3525c0004347df21440c2add5a035753))


### Features

* ability to refresh esl-media via esl:refresh ([2419237](https://github.com/exadel-inc/esl/commit/2419237dd3ea4dfd62b9ad08fd86218aa53c92df))

# [2.0.0](https://github.com/exadel-inc/esl/compare/v1.1.0...v2.0.0) (2021-03-29)


### Bug Fixes

* a11y ([8d1085b](https://github.com/exadel-inc/esl/commit/8d1085ba0d9e8e05e2633e8e943a50539972e279))
* accordion styles animation fixes ([d59a44b](https://github.com/exadel-inc/esl/commit/d59a44bebfbe639846f4e86a0f430e4b820be8e9))
* add full ts export for scroll ([1e40678](https://github.com/exadel-inc/esl/commit/1e406783222a74d7d22a7a9ea5b26566377c4d83))
* add multiple active panels control ([c662999](https://github.com/exadel-inc/esl/commit/c6629992476a78f9469bed49faf876f261f91e13))
* adjust group control ([86286b1](https://github.com/exadel-inc/esl/commit/86286b1df18e04e9a8114be44ecf05dc2be3db67))
* allow super.register call for esl-base-element instances ([19e8e05](https://github.com/exadel-inc/esl/commit/19e8e051d413c28e1ecd74b2b636e1a3281d2d08))
* animation of single panel (w/o panel group) ([01aa5e9](https://github.com/exadel-inc/esl/commit/01aa5e92e9a5027c1fd2f2a6c42381f1e1e561f7))
* bind method hotfix ([b7d3b1c](https://github.com/exadel-inc/esl/commit/b7d3b1ca711044c3de29c872173e98bc9bb2a3bc))
* bouncing up when crossing between tabs ([ea7053b](https://github.com/exadel-inc/esl/commit/ea7053b64b97865f3768ba298d906a82da0a0e5e))
* change iframe provide scrolling to no ([b8672e3](https://github.com/exadel-inc/esl/commit/b8672e335a177c5d34768f7f145ad78c58352c1f))
* cover mode calculation for non blink browsers ([5cd6bc2](https://github.com/exadel-inc/esl/commit/5cd6bc29498b46634a74ce4885ae45c89511b47b))
* deepCompare null check fix ([8211738](https://github.com/exadel-inc/esl/commit/82117384c58911632cb3565d037bd0aedec61982))
* default export value replaced with singleton accessor ([ca323aa](https://github.com/exadel-inc/esl/commit/ca323aafb66dfe21e8fe2bee54e91ee080e9d377))
* empty alert on initiating in the animation hide time ([0b1ed7a](https://github.com/exadel-inc/esl/commit/0b1ed7a45295a59a2fd6e6a5de09d99b8759d2ce))
* esl-alert a11y and post animate cleanup ([7646ffb](https://github.com/exadel-inc/esl/commit/7646ffb70eb46bc786a5f5153b8352b18907deaa))
* esl-alert target attribute change observation fixed ([5226c96](https://github.com/exadel-inc/esl/commit/5226c9653e69547819ebe407e6a75dba9dba012c))
* fallback timer reset for panel animation ([c61c9f1](https://github.com/exadel-inc/esl/commit/c61c9f11e7bc7ee1169acb9aa32708c19506a257))
* fallback timer reset for panel-group animation ([0bb9b02](https://github.com/exadel-inc/esl/commit/0bb9b0236c56c791b181c09dd46899b302f01099))
* fix ESLMedia events prefix ([76035fe](https://github.com/exadel-inc/esl/commit/76035fea0216157ee4f68ec9a7e14d20f3a4dc1a))
* fix focus and position calculation ([815b8ad](https://github.com/exadel-inc/esl/commit/815b8ad5bd58e0814a569dd3337884417f55f790))
* fix package.json and IE compatibility problems ([68f1bb6](https://github.com/exadel-inc/esl/commit/68f1bb669d7b50acf68253cfeb795dac5b486ae1))
* fix tracking click event for Popup ([2c3bff0](https://github.com/exadel-inc/esl/commit/2c3bff00a7f129e4382eca7fac37b7e6b28f2ead))
* fix tracking click event for Popup (rename the method and arguments) ([8abd6e5](https://github.com/exadel-inc/esl/commit/8abd6e544ea49fc13379928d6b6f43f137e0bb76))
* format utility support for multiple replacements ([3d8a6e7](https://github.com/exadel-inc/esl/commit/3d8a6e7ddec1a201de90262d69f4e269c810e614))
* optimize select performance. update demo content ([9c916d6](https://github.com/exadel-inc/esl/commit/9c916d684df4a75fe5a6bcc0d75fed7ea25781f5))
* optimize UX for close outside feature ([c058400](https://github.com/exadel-inc/esl/commit/c0584007b0597b1b6c5d308592635267986f1efb))
* remove eventNs for image & scroll fix image ready event ([2f3382f](https://github.com/exadel-inc/esl/commit/2f3382f206255b85be143fbb802d6c0fa12d4ac6))
* rename loaded event of ESLImage to the load event (from spec) ([23ecb84](https://github.com/exadel-inc/esl/commit/23ecb844fe41e54c1dd9ac58ac3f9fe23917ae97))
* select a11y basic improvements ([5c1657d](https://github.com/exadel-inc/esl/commit/5c1657df7d688eb93042c15955152f8e13d9a840))
* set position relative to smart-media root for special fill-modes ([4f5bbd7](https://github.com/exadel-inc/esl/commit/4f5bbd70522c7b279063970cdecf9e1f971e7a86))
* small styling and imports updates ([3e10b5f](https://github.com/exadel-inc/esl/commit/3e10b5f0babe747df4f3cf478f5c42340c8eeb11))


### Code Refactoring

* cleanup for ESLBasePopupGroupManager ([5f68efd](https://github.com/exadel-inc/esl/commit/5f68efdff5848e4a98f0293328545d00371c244d))
* get rid of default imports and fix draft select component accessor naming ([155dbf9](https://github.com/exadel-inc/esl/commit/155dbf981d54c33a2323e2ec740400ba5b563d87))
* popup property of the trigger renamed to $target ([cdc4230](https://github.com/exadel-inc/esl/commit/cdc423072fd0ba48a311042d026e572a9457a369))
* scrollable & alert renaming ([a61e56e](https://github.com/exadel-inc/esl/commit/a61e56ebaa348a98853a08ebb33d8ae971d0ac54))


### Documentation

* esl-select fixes ([5407ac2](https://github.com/exadel-inc/esl/commit/5407ac241afce10c3991ffee7bc5e2cb939bc4b4))


### Features

* !revert back esl prefix for events ([adef294](https://github.com/exadel-inc/esl/commit/adef294f76ef6b9c9a46cd743fd26d65b45cbfdf))
* `[@ready](https://github.com/ready)` decorator and readyState listener ([6d1a32f](https://github.com/exadel-inc/esl/commit/6d1a32fd1d5b83dcb03902fb0cd874cc32b8f806))
* add ability to cancel animation ([53b3235](https://github.com/exadel-inc/esl/commit/53b32352983e94bcb6e015eacdd3094ece50de51))
* add ability to decline collapsing ([44885c7](https://github.com/exadel-inc/esl/commit/44885c77aef69ea241a43a83c5b23b222b05d3a9))
* add empty text for select. update select events and flow ([3435ae9](https://github.com/exadel-inc/esl/commit/3435ae9460853ceb64f9c51b44bb5a4e913c0afc))
* add more label format for esl-select; fix select dropdown focus ([8682ec0](https://github.com/exadel-inc/esl/commit/8682ec054fcc31685221be050750ce77e669b425))
* add separate simplified ESLBaseTrigger ([3f5500a](https://github.com/exadel-inc/esl/commit/3f5500af7a7a5b2cd9020db9a80b3b8245ac64fe))
* esl-media extended with a ready class target option ([9966b42](https://github.com/exadel-inc/esl/commit/9966b42de148c9d5fc2390e357c4ceac057416de))
* esl-scroll moved from draft to beta components ([88e6ea6](https://github.com/exadel-inc/esl/commit/88e6ea6c12ceda66dab8441577622ed257e89842))
* esl-select basic form element proxy and reset handler fix ([85f2f78](https://github.com/exadel-inc/esl/commit/85f2f788027c2572340a5ab1465cbf7b31c5e02e))
* esl-select component POC ([dd2644e](https://github.com/exadel-inc/esl/commit/dd2644eb0bd4840ad1285298f51f238e11aaa414))
* esl-select public update and support for mutations ([b297ae2](https://github.com/exadel-inc/esl/commit/b297ae2d181e6ac96536f0041a6c921467fec9d4))
* esl-select support for simple select wrap ([b6debd8](https://github.com/exadel-inc/esl/commit/b6debd8366dcf1c438676d047b18ef0afc78eeea))
* esl-trigger rewritten ([64c05f6](https://github.com/exadel-inc/esl/commit/64c05f6b4588b2526405c531031ac055e92f533f))
* extended shim for ES5 ElementConstructor ([0eabf64](https://github.com/exadel-inc/esl/commit/0eabf64896bcf6e3e61f9c08df478614d9770af3))
* filtration common pseudo-selectors ([8b4d80e](https://github.com/exadel-inc/esl/commit/8b4d80e01c7963c3e939e1cd0ae15d765406b947))
* introduce EventUtils with a set of event related utilities ([04c5368](https://github.com/exadel-inc/esl/commit/04c536884d63dce864b2427cc2f98175b5e35e39))
* introduce new BasePopupGroupManager based on events ([8f9a426](https://github.com/exadel-inc/esl/commit/8f9a4260dac3d9d4c604e7cbcf75b9628c426f87))
* optional prevent default option for triggers. Merge triggers directory ([8c6cc3c](https://github.com/exadel-inc/esl/commit/8c6cc3cf54cb0141d83de15312b41789818d66c1))
* set iframe as a default provider for valid urls ([f320d88](https://github.com/exadel-inc/esl/commit/f320d8855cb2184e3e4747aafec0e65e91fc859f))
* **memoize:** add func cash for class instances ([f4dd895](https://github.com/exadel-inc/esl/commit/f4dd895c1dbb4dbb335ff0d75403b9cdee2b3dd2))
* support for html content for alert ([86507d8](https://github.com/exadel-inc/esl/commit/86507d8d694af05337aa4d8cd4b30fa70dda8503))
* support for multiple esl-alerts ([fd99dab](https://github.com/exadel-inc/esl/commit/fd99dabb3e4ae65560c368cf847d89681f464141))
* upgrade BasePopupGroupManager ([07aa02a](https://github.com/exadel-inc/esl/commit/07aa02a65173b85bbcf6076d7861a5950fc26e63))


### Styles

* cleanup esl-tabs documentation ([fdefaa5](https://github.com/exadel-inc/esl/commit/fdefaa58a9f02e59a9f98754e60854e052f79e07))


* chore!: history fixup commit ([c9efe88](https://github.com/exadel-inc/esl/commit/c9efe88ae6f3ffeefeedde3dc9486ad3b44f4d2a))
* refactor!: cleanup for KeyboardEvent key polyfill and keys usages ([c694727](https://github.com/exadel-inc/esl/commit/c6947279ed913dd712d6df7564810068676dcb05))
* refactor!: rename ESLBasePopup ([390f8f1](https://github.com/exadel-inc/esl/commit/390f8f16c4b40e8144a49cd37297227c933ac3d0))
* feat!: refactor of Panel & PanelStack ([d819259](https://github.com/exadel-inc/esl/commit/d8192599333101b46bab930326b2b2ef8eef6292))
* feat!: add last activator feature, fix outside action ([76bd08b](https://github.com/exadel-inc/esl/commit/76bd08ba4262e68a52de2ff21bc72ca8016c17ae))
* feat!: update for tab and trigger events; fix double a11y control for tabs ([dce85b6](https://github.com/exadel-inc/esl/commit/dce85b62a4b9e3fd270e1192a75f1796275f778f))
* feat!: eventing cleanup ([22efb73](https://github.com/exadel-inc/esl/commit/22efb7308140f40c4493716c3de1e7705ef1c0ad))
* feat!: popups massive cleanup 1 ([7441e41](https://github.com/exadel-inc/esl/commit/7441e411c0f586e366df3057c9c81b58fbdeab5f))


### BREAKING CHANGES

* make esl-tab mode="show" by default
* replace `empty-text` with `placeholder` attribute
*   Rename ESLPanelStack to ESLPanelGroup

- Introduce new ESLA11yGroup component

- ESLTabsContainer renamed to ESLTabs

- ESLScrollableTabs removed functionality moved under ESLTabs scrollable feature
*  esl-alert should be registered and initialized as separate steps
 esl-alert now use target (paren by default) to listen events instead of window
*  `keycodes.ts` constants for deprecated `keycode` removed, `key` property should be used instead
*  `targetElement` renamed to `$target`
*  `popup` renamed to `$target` in the trigger
*  default imports no longer accepted for esl modules
* 'ESLBasePopup' comp rename to 'ESLToggleable'
'ESLPopupDispatcher' comp rename to 'ESLToggleableDispatcher'
* Panel Stack uses self group management.
Group attribute should be removed to reach collapsible behavior.
Panel Stack & Panel inner API changes.
*  rename ESLBasePopupGroupManager to ESLPopupGroupDispatcher
*  'outsideclick' initiator type replaced with 'outsideaction'
*  events of BasePopup now have esl prefix
('esl:hide' / 'esl:show' / 'esl:before:hide' / 'esl:before:show')

 events of Trigger now have esl prefix:  'esl:change:active'

 events of Panel now have esl prefix: 'esl:after:hide' / 'esl:after:show'
* - `transitionend` event of ESLPanel replaced with `after:show`/`after:hide`
- `statechange` event of ESLTrigger replaced with `change:active`
* - `ESLBaseElement` no longer contains eventNs and $$fireNs methods
- Whole popups based component system no longer use event namespaces
* - `ESLBasePopup` statechange events replaced with a separate `(before:)show/hide`

# [2.0.0-beta.31](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.30...v2.0.0-beta.31) (2021-03-26)


### Documentation

* esl-select fixes ([5407ac2](https://github.com/exadel-inc/esl/commit/5407ac241afce10c3991ffee7bc5e2cb939bc4b4))


### Styles

* cleanup esl-tabs documentation ([fdefaa5](https://github.com/exadel-inc/esl/commit/fdefaa58a9f02e59a9f98754e60854e052f79e07))


### BREAKING CHANGES

* make esl-tab mode="show" by default
* replace `empty-text` with `placeholder` attribute

# [2.0.0-beta.30](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.29...v2.0.0-beta.30) (2021-03-24)


### Features

* esl-trigger rewritten ([64c05f6](https://github.com/exadel-inc/esl/commit/64c05f6b4588b2526405c531031ac055e92f533f))

# [2.0.0-beta.29](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.28...v2.0.0-beta.29) (2021-03-24)


### Bug Fixes

* accordion styles animation fixes ([d59a44b](https://github.com/exadel-inc/esl/commit/d59a44bebfbe639846f4e86a0f430e4b820be8e9))


### Features

* esl-media extended with a ready class target option ([9966b42](https://github.com/exadel-inc/esl/commit/9966b42de148c9d5fc2390e357c4ceac057416de))
* optional prevent default option for triggers. Merge triggers directory ([8c6cc3c](https://github.com/exadel-inc/esl/commit/8c6cc3cf54cb0141d83de15312b41789818d66c1))

# [2.0.0-beta.28](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.27...v2.0.0-beta.28) (2021-03-17)


### Features

* add ability to cancel animation ([53b3235](https://github.com/exadel-inc/esl/commit/53b32352983e94bcb6e015eacdd3094ece50de51))
* add ability to decline collapsing ([44885c7](https://github.com/exadel-inc/esl/commit/44885c77aef69ea241a43a83c5b23b222b05d3a9))

# [2.0.0-beta.27](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.26...v2.0.0-beta.27) (2021-03-15)


### Features

* extended shim for ES5 ElementConstructor ([0eabf64](https://github.com/exadel-inc/esl/commit/0eabf64896bcf6e3e61f9c08df478614d9770af3))
* filtration common pseudo-selectors ([8b4d80e](https://github.com/exadel-inc/esl/commit/8b4d80e01c7963c3e939e1cd0ae15d765406b947))
* set iframe as a default provider for valid urls ([f320d88](https://github.com/exadel-inc/esl/commit/f320d8855cb2184e3e4747aafec0e65e91fc859f))

# [2.0.0-beta.26](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.25...v2.0.0-beta.26) (2021-03-03)


### Bug Fixes

* adjust group control ([86286b1](https://github.com/exadel-inc/esl/commit/86286b1df18e04e9a8114be44ecf05dc2be3db67))
* fallback timer reset for panel animation ([c61c9f1](https://github.com/exadel-inc/esl/commit/c61c9f11e7bc7ee1169acb9aa32708c19506a257))
* fallback timer reset for panel-group animation ([0bb9b02](https://github.com/exadel-inc/esl/commit/0bb9b0236c56c791b181c09dd46899b302f01099))

# [2.0.0-beta.25](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.24...v2.0.0-beta.25) (2021-03-02)


### Bug Fixes

* deepCompare null check fix ([8211738](https://github.com/exadel-inc/esl/commit/82117384c58911632cb3565d037bd0aedec61982))

# [2.0.0-beta.24](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.23...v2.0.0-beta.24) (2021-03-02)


### Bug Fixes

* add multiple active panels control ([c662999](https://github.com/exadel-inc/esl/commit/c6629992476a78f9469bed49faf876f261f91e13))
* animation of single panel (w/o panel group) ([01aa5e9](https://github.com/exadel-inc/esl/commit/01aa5e92e9a5027c1fd2f2a6c42381f1e1e561f7))

# [2.0.0-beta.23](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.22...v2.0.0-beta.23) (2021-02-26)


### Bug Fixes

* empty alert on initiating in the animation hide time ([0b1ed7a](https://github.com/exadel-inc/esl/commit/0b1ed7a45295a59a2fd6e6a5de09d99b8759d2ce))
* set position relative to smart-media root for special fill-modes ([4f5bbd7](https://github.com/exadel-inc/esl/commit/4f5bbd70522c7b279063970cdecf9e1f971e7a86))


### Features

* esl-select public update and support for mutations ([b297ae2](https://github.com/exadel-inc/esl/commit/b297ae2d181e6ac96536f0041a6c921467fec9d4))

# [2.0.0-beta.22](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.21...v2.0.0-beta.22) (2021-02-24)


### Bug Fixes

* change iframe provide scrolling to no ([b8672e3](https://github.com/exadel-inc/esl/commit/b8672e335a177c5d34768f7f145ad78c58352c1f))

# [2.0.0-beta.21](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.20...v2.0.0-beta.21) (2021-02-24)


### Bug Fixes

* format utility support for multiple replacements ([3d8a6e7](https://github.com/exadel-inc/esl/commit/3d8a6e7ddec1a201de90262d69f4e269c810e614))


### Features

* **memoize:** add func cash for class instances ([f4dd895](https://github.com/exadel-inc/esl/commit/f4dd895c1dbb4dbb335ff0d75403b9cdee2b3dd2))


* chore!: history fixup commit ([c9efe88](https://github.com/exadel-inc/esl/commit/c9efe88ae6f3ffeefeedde3dc9486ad3b44f4d2a))


### BREAKING CHANGES

*   Rename ESLPanelStack to ESLPanelGroup

- Introduce new ESLA11yGroup component

- ESLTabsContainer renamed to ESLTabs

- ESLScrollableTabs removed functionality moved under ESLTabs scrollable feature

# [2.0.0-beta.21](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.20...v2.0.0-beta.21) (2021-02-23)
  
### Features
- Introduce new ESLA11yGroup component ([e354d2d](https://github.com/exadel-inc/esl/commit/e354d2daef1e7368426a2b3a794189c69c0936a7))

### BREAKING CHANGES
- Rename ESLPanelStack to ESLPanelGroup ([e354d2d](https://github.com/exadel-inc/esl/commit/e354d2daef1e7368426a2b3a794189c69c0936a7))
- ESLTabsContainer renamed to ESLTabs ([e354d2d](https://github.com/exadel-inc/esl/commit/e354d2daef1e7368426a2b3a794189c69c0936a7))
- ESLScrollableTabs removed functionality moved under ESLTabs scrollable feature ([e354d2d](https://github.com/exadel-inc/esl/commit/e354d2daef1e7368426a2b3a794189c69c0936a7))

# [2.0.0-beta.20](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.19...v2.0.0-beta.20) (2021-02-22)


### Features

* esl-select basic form element proxy and reset handler fix ([85f2f78](https://github.com/exadel-inc/esl/commit/85f2f788027c2572340a5ab1465cbf7b31c5e02e))

# [2.0.0-beta.19](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.18...v2.0.0-beta.19) (2021-02-19)


### Bug Fixes

* esl-alert a11y and post animate cleanup ([7646ffb](https://github.com/exadel-inc/esl/commit/7646ffb70eb46bc786a5f5153b8352b18907deaa))

# [2.0.0-beta.18](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.17...v2.0.0-beta.18) (2021-02-18)


### Bug Fixes

* esl-alert target attribute change observation fixed ([5226c96](https://github.com/exadel-inc/esl/commit/5226c9653e69547819ebe407e6a75dba9dba012c))
* select a11y basic improvements ([5c1657d](https://github.com/exadel-inc/esl/commit/5c1657df7d688eb93042c15955152f8e13d9a840))


### Features

* support for multiple esl-alerts ([fd99dab](https://github.com/exadel-inc/esl/commit/fd99dabb3e4ae65560c368cf847d89681f464141))


* refactor!: cleanup for KeyboardEvent key polyfill and keys usages ([c694727](https://github.com/exadel-inc/esl/commit/c6947279ed913dd712d6df7564810068676dcb05))


### BREAKING CHANGES

*  esl-alert should be registered and initialized as separate steps
 esl-alert now use target (paren by default) to listen events instead of window
*  `keycodes.ts` constants for deprecated `keycode` removed, `key` property should be used instead

# [2.0.0-beta.17](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.16...v2.0.0-beta.17) (2021-02-11)


### Bug Fixes

* default export value replaced with singleton accessor ([ca323aa](https://github.com/exadel-inc/esl/commit/ca323aafb66dfe21e8fe2bee54e91ee080e9d377))
* small styling and imports updates ([3e10b5f](https://github.com/exadel-inc/esl/commit/3e10b5f0babe747df4f3cf478f5c42340c8eeb11))


### Code Refactoring

* get rid of default imports and fix draft select component accessor naming ([155dbf9](https://github.com/exadel-inc/esl/commit/155dbf981d54c33a2323e2ec740400ba5b563d87))
* popup property of the trigger renamed to $target ([cdc4230](https://github.com/exadel-inc/esl/commit/cdc423072fd0ba48a311042d026e572a9457a369))
* scrollable & alert renaming ([a61e56e](https://github.com/exadel-inc/esl/commit/a61e56ebaa348a98853a08ebb33d8ae971d0ac54))


### Features

* esl-scroll moved from draft to beta components ([88e6ea6](https://github.com/exadel-inc/esl/commit/88e6ea6c12ceda66dab8441577622ed257e89842))
* esl-select support for simple select wrap ([b6debd8](https://github.com/exadel-inc/esl/commit/b6debd8366dcf1c438676d047b18ef0afc78eeea))
* support for html content for alert ([86507d8](https://github.com/exadel-inc/esl/commit/86507d8d694af05337aa4d8cd4b30fa70dda8503))


* refactor!: rename ESLBasePopup ([390f8f1](https://github.com/exadel-inc/esl/commit/390f8f16c4b40e8144a49cd37297227c933ac3d0))


### BREAKING CHANGES

*  `targetElement` renamed to `$target`
*  `popup` renamed to `$target` in the trigger
*  default imports no longer accepted for esl modules
* 'ESLBasePopup' comp rename to 'ESLToggleable'
'ESLPopupDispatcher' comp rename to 'ESLToggleableDispatcher'

# [2.0.0-beta.16](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.15...v2.0.0-beta.16) (2021-02-08)


### Bug Fixes

* allow super.register call for esl-base-element instances ([19e8e05](https://github.com/exadel-inc/esl/commit/19e8e051d413c28e1ecd74b2b636e1a3281d2d08))

# [2.0.0-beta.15](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.14...v2.0.0-beta.15) (2021-02-04)


### Features

* add more label format for esl-select; fix select dropdown focus ([8682ec0](https://github.com/exadel-inc/esl/commit/8682ec054fcc31685221be050750ce77e669b425))

# [2.0.0-beta.14](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.13...v2.0.0-beta.14) (2021-02-04)


### Bug Fixes

* fix focus and position calculation ([815b8ad](https://github.com/exadel-inc/esl/commit/815b8ad5bd58e0814a569dd3337884417f55f790))

# [2.0.0-beta.13](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.12...v2.0.0-beta.13) (2021-02-04)


### Bug Fixes

* a11y ([8d1085b](https://github.com/exadel-inc/esl/commit/8d1085ba0d9e8e05e2633e8e943a50539972e279))


### Features

* add empty text for select. update select events and flow ([3435ae9](https://github.com/exadel-inc/esl/commit/3435ae9460853ceb64f9c51b44bb5a4e913c0afc))

# [2.0.0-beta.12](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.11...v2.0.0-beta.12) (2021-02-04)


### Bug Fixes

* add full ts export for scroll ([1e40678](https://github.com/exadel-inc/esl/commit/1e406783222a74d7d22a7a9ea5b26566377c4d83))
* optimize select performance. update demo content ([9c916d6](https://github.com/exadel-inc/esl/commit/9c916d684df4a75fe5a6bcc0d75fed7ea25781f5))


### Features

* esl-select component POC ([dd2644e](https://github.com/exadel-inc/esl/commit/dd2644eb0bd4840ad1285298f51f238e11aaa414))

# [2.0.0-beta.11](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.10...v2.0.0-beta.11) (2021-02-03)


### Bug Fixes

* bouncing up when crossing between tabs ([ea7053b](https://github.com/exadel-inc/esl/commit/ea7053b64b97865f3768ba298d906a82da0a0e5e))

# [2.0.0-beta.10](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.9...v2.0.0-beta.10) (2021-02-03)

# [2.0.0-beta.9](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.8...v2.0.0-beta.9) (2021-02-03)

# [2.0.0-beta.8](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.7...v2.0.0-beta.8) (2021-02-02)

# [2.0.0-beta.7](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.6...v2.0.0-beta.7) (2021-02-02)


* feat!: refactor of Panel & PanelStack ([d819259](https://github.com/exadel-inc/esl/commit/d8192599333101b46bab930326b2b2ef8eef6292))


### Features

* upgrade BasePopupGroupManager ([07aa02a](https://github.com/exadel-inc/esl/commit/07aa02a65173b85bbcf6076d7861a5950fc26e63))


### BREAKING CHANGES

* Panel Stack uses self group management.
Group attribute should be removed to reach collapsible behavior.
Panel Stack & Panel inner API changes.

# [2.0.0-beta.6](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2021-02-01)


### Bug Fixes

* rename loaded event of ESLImage to the load event (from spec) ([23ecb84](https://github.com/exadel-inc/esl/commit/23ecb844fe41e54c1dd9ac58ac3f9fe23917ae97))


### Code Refactoring

* cleanup for ESLBasePopupGroupManager ([5f68efd](https://github.com/exadel-inc/esl/commit/5f68efdff5848e4a98f0293328545d00371c244d))


### BREAKING CHANGES

*  rename ESLBasePopupGroupManager to ESLPopupGroupDispatcher

# [2.0.0-beta.5](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2021-02-01)


### Bug Fixes

* bind method hotfix ([b7d3b1c](https://github.com/exadel-inc/esl/commit/b7d3b1ca711044c3de29c872173e98bc9bb2a3bc))

# [2.0.0-beta.4](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2021-01-31)


### Features

* add separate simplified ESLBaseTrigger ([3f5500a](https://github.com/exadel-inc/esl/commit/3f5500af7a7a5b2cd9020db9a80b3b8245ac64fe))
* introduce EventUtils with a set of event related utilities ([04c5368](https://github.com/exadel-inc/esl/commit/04c536884d63dce864b2427cc2f98175b5e35e39))
* introduce new BasePopupGroupManager based on events ([8f9a426](https://github.com/exadel-inc/esl/commit/8f9a4260dac3d9d4c604e7cbcf75b9628c426f87))


* feat!: add last activator feature, fix outside action ([76bd08b](https://github.com/exadel-inc/esl/commit/76bd08ba4262e68a52de2ff21bc72ca8016c17ae))


### Bug Fixes

* fix package.json and IE compatibility problems ([68f1bb6](https://github.com/exadel-inc/esl/commit/68f1bb669d7b50acf68253cfeb795dac5b486ae1))


### BREAKING CHANGES

*  'outsideclick' initiator type replaced with 'outsideaction'

# [2.0.0-beta.3](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2021-01-28)


### Bug Fixes

* fix ESLMedia events prefix ([76035fe](https://github.com/exadel-inc/esl/commit/76035fea0216157ee4f68ec9a7e14d20f3a4dc1a))

# [2.0.0-beta.2](https://github.com/exadel-inc/esl/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2021-01-28)


### Features

* !revert back esl prefix for events ([adef294](https://github.com/exadel-inc/esl/commit/adef294f76ef6b9c9a46cd743fd26d65b45cbfdf))
* add originalWidth / originalHeight accessors to ESLImage ([365e31b](https://github.com/exadel-inc/esl/commit/365e31b78db67b4bbc335c17078b117459753aa4))


### BREAKING CHANGES

*  events of BasePopup now have esl prefix
('esl:hide' / 'esl:show' / 'esl:before:hide' / 'esl:before:show')

 events of Trigger now have esl prefix:  'esl:change:active'

 events of Panel now have esl prefix: 'esl:after:hide' / 'esl:after:show'

# [2.0.0-beta.1](https://github.com/exadel-inc/esl/compare/v1.0.1...v2.0.0-beta.1) (2021-01-26)


* feat!: update for tab and trigger events; fix double a11y control for tabs ([dce85b6](https://github.com/exadel-inc/esl/commit/dce85b62a4b9e3fd270e1192a75f1796275f778f))
* feat!: eventing cleanup ([22efb73](https://github.com/exadel-inc/esl/commit/22efb7308140f40c4493716c3de1e7705ef1c0ad))
* feat!: popups massive cleanup 1 ([7441e41](https://github.com/exadel-inc/esl/commit/7441e411c0f586e366df3057c9c81b58fbdeab5f))


### Bug Fixes

* fix tracking click event for Popup ([2c3bff0](https://github.com/exadel-inc/esl/commit/2c3bff00a7f129e4382eca7fac37b7e6b28f2ead))
* fix tracking click event for Popup (rename the method and arguments) ([8abd6e5](https://github.com/exadel-inc/esl/commit/8abd6e544ea49fc13379928d6b6f43f137e0bb76))
* optimize UX for close outside feature ([c058400](https://github.com/exadel-inc/esl/commit/c0584007b0597b1b6c5d308592635267986f1efb))
* remove eventNs for image & scroll fix image ready event ([2f3382f](https://github.com/exadel-inc/esl/commit/2f3382f206255b85be143fbb802d6c0fa12d4ac6))


### Features

* `[@ready](https://github.com/ready)` decorator and readyState listener ([6d1a32f](https://github.com/exadel-inc/esl/commit/6d1a32fd1d5b83dcb03902fb0cd874cc32b8f806))


### BREAKING CHANGES

* - `transitionend` event of ESLPanel replaced with `after:show`/`after:hide`
- `statechange` event of ESLTrigger replaced with `change:active`
* - `ESLBaseElement` no longer contains eventNs and $$fireNs methods
- Whole popups based component system no longer use event namespaces
* - `ESLBasePopup` statechange events replaced with a separate `(before:)show/hide`

# [1.1.0](https://github.com/exadel-inc/esl/compare/v1.0.1...v1.1.0) (2021-01-27)


### Features

* add originalWidth / originalHeight accessors to ESLImage ([365e31b](https://github.com/exadel-inc/esl/commit/365e31b78db67b4bbc335c17078b117459753aa4))

## [1.0.1](https://github.com/exadel-inc/esl/compare/v1.0.0...v1.0.1) (2021-01-18)


### Bug Fixes

* fix providerName type to allow user to extend default providers ([4b6e67e](https://github.com/exadel-inc/esl/commit/4b6e67eb2895f327fec7f45abb539d4217ba7757))

# 1.0.0 (2021-01-18)


### Bug Fixes

* Add extend draggable area for esl-scrollbar ([403cf33](https://github.com/exadel-inc/esl/commit/403cf339d165917ceb65e7e1264c264a21397a09))
* browser list term in package.json ([39426dd](https://github.com/exadel-inc/esl/commit/39426dd33c159454091f5c4e14ed26545ff7e691))
* build process updated; NPM release file-list fix ([a13bacf](https://github.com/exadel-inc/esl/commit/a13bacf053cdc6fee583965003dfd246881c1a04))
* ESL media query fix ([ca4a904](https://github.com/exadel-inc/esl/commit/ca4a9043615f672bff381cf1971356129866ab0d))
* fix linting error for scrollbar a11y pseudo-element ([4974354](https://github.com/exadel-inc/esl/commit/49743548defb74ff46886f1b2410c0189ad8dd81))
* fix strict comparison. ([5462ae3](https://github.com/exadel-inc/esl/commit/5462ae339983c98dcdb76949a938c26fd0c7ea88))
* fix youtube url regexp, typo in error and mock formatting ([1da03bd](https://github.com/exadel-inc/esl/commit/1da03bdd285da5c21cfce9d07ca45591c001ad78))
* ie-zindex-fix update ([5729f30](https://github.com/exadel-inc/esl/commit/5729f30d283ac67cbd12fe75bf46c32904a03d1b))
* native 'close on body click' feature can be prevented by outside click handlers ([853106d](https://github.com/exadel-inc/esl/commit/853106db29bd0dce0fa2dbd0f8a0290c87c8cac7))
* path for coverage test exclusions ([6c29f49](https://github.com/exadel-inc/esl/commit/6c29f490cde159ecc6fda483fc291660c02ce6d6))
* polyfill content fix ([ecb738e](https://github.com/exadel-inc/esl/commit/ecb738e8173f1834ef2a8eb8f7ed863baf3b6a1d))
* pr comments and bugfixes ([6783473](https://github.com/exadel-inc/esl/commit/6783473363c313948d924325027162f4a418bf72))
* semantic release test ([2b53b37](https://github.com/exadel-inc/esl/commit/2b53b37455d0cc96ab855a91b40b9b3783aaccca))
* Sonar code small fix. ([947c4e0](https://github.com/exadel-inc/esl/commit/947c4e097bb2858b6fe9c9064aed49c39e953184))
* test fix. ([2e09121](https://github.com/exadel-inc/esl/commit/2e09121b335da5675e7155b2a96f0cc44f044ebb))
* Tests and fix for BreakpointRegistry ([6c1b333](https://github.com/exadel-inc/esl/commit/6c1b333f3195a9e354322998faa67cd47aaa902e))
* typo fixes. ([c477f5f](https://github.com/exadel-inc/esl/commit/c477f5f8fcbdb6658978f7fecbcfcd3c8cd46885))


### Features

* add get / set utility and simple compile method ([8283bfa](https://github.com/exadel-inc/esl/commit/8283bfa34a5068d5ddadfadb4aaa64699a6b7936))
* commit-lint integration ([138c4c2](https://github.com/exadel-inc/esl/commit/138c4c237400f9fb8b1099296cd4762cb36e333a))
* commit-lint use conventional-commit rules ([03dc5cd](https://github.com/exadel-inc/esl/commit/03dc5cd7c6a982fb546a98e197c951e24d424bfb))
* ESL Scroll bar updated with unified event handling. ([5a5aa30](https://github.com/exadel-inc/esl/commit/5a5aa305e4fc214bc91b838d65c5dfe18c50fa7a))
* esl-media-query tests and fixes ([e8f554f](https://github.com/exadel-inc/esl/commit/e8f554f1470559c4a7de1836f4be7b36b7602508))
* JSX interface for ESL Scrollbar and ESL Media ([1a99746](https://github.com/exadel-inc/esl/commit/1a9974604c57174fa9f936e943815d1277d4388b))
* update ESL Alert Component ([1c047ae](https://github.com/exadel-inc/esl/commit/1c047aed767d5d4d5670e84e6d0541c6d7cac10f))

## [1.41.2](https://github.com/exadel-inc/esl/compare/v1.41.1-alpha...v1.41.2-alpha) (2021-01-13)


### Bug Fixes

* browser list term in package.json ([39426dd](https://github.com/exadel-inc/esl/commit/39426dd33c159454091f5c4e14ed26545ff7e691))
* build process updated; NPM release file-list fix ([a13bacf](https://github.com/exadel-inc/esl/commit/a13bacf053cdc6fee583965003dfd246881c1a04))

## [1.41.1](https://github.com/exadel-inc/esl/compare/v1.41.0-alpha...v1.41.1-alpha) (2021-01-13)


### Bug Fixes

* semantic release test ([2b53b37](https://github.com/exadel-inc/esl/commit/2b53b37455d0cc96ab855a91b40b9b3783aaccca))
