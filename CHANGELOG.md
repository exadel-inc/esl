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
