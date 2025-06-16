# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
