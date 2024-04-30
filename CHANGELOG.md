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
