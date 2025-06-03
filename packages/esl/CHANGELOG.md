# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
