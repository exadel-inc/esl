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
