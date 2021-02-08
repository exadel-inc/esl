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
