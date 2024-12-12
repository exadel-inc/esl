---
layout: content
name: ESL v5.0.0 Migration Guide
title: Migrating from ESL v4.*.* to ESL v5.0.0
tags: [news, blogs, draft]
date: 2024-10-31
---

The ESL version 5.0.0 has just been released and it comes with a lot of new features and improvements. 
This guide will help you to migrate your existing ESL v4.\*.* project to ESL v5.0.0.

---

## Preparation
We recommend you to consider using ESL ESLint plugin to check your codebase for ESL v5.0.0 compatibility.
It will help you to find and fix most of the issues before you start the migration process.
The points not marked with `🔧` in the breaking changes section are covered by the ESLint plugin checks and could be fixed automatically.

---

## Breaking Changes

- ### Browser Support
  ESL v5.0.0 no longer supports IE11 and ES5 target. 
  ESL UI site renderer and ESL polyfills no longer support Edge old versions and ES6 polyfils.
  In case for some reason you still need to support IE11 or ES5 target you should use proper transpilation and polyfilling tools on your side.

- ### ESL Core / ESL Utils
  - #### Direct imports changes
    - 🔧 `prop`, `attr`, `boolAttr`, `jsonAttr`, `listen` are no longer available in `esl-base-element` and `esl-mixin-element` exports,
    to use them you should import them from `esl-utils/decorators` directly or from the library root.
  - #### ESL Utils API Changes
    - `Rect` utility object is now immutable, so you can't change its properties directly. 
    If you modify the `Rect` object trough builtin methods, you will get a new object with the updated properties.
  - #### ESL Utils Retired Functionality
    - `DeviceDetector.TOUCH_EVENTS` and `TOUCH_EVENTS` are retired from the `device-detector` module.
    - Note that the `DeviceDetector` class is now deprecated. Use direct checks instead.
    - `createZIndexIframe` and `is-fixes` module are no longer available due to drop of IE11 support.
    - `RTLUtils` and `TraversingUtils` are retired. Use separate methods instead.
    - 🔧 `TraversingQuery` is retired as alias. Use `ESLTraversingQuery` instead.
    - 🔧 `deepCompare` is retired as alias. Use `isEqual` instead.
    - 🔧 `generateUId` is retired as alias. Use `randUID` instead.
    - 🔧 `EventUtils` is retired as alias. Use `ESLEventUtils` instead.
  - #### `SynteticEventTarget` API Changes
    - `addListener` and `removeListener` shorthand are no longer supported. Use `addEventListener` and `removeEventListener` instead.
    - `dispatchEvent` no longer accepts the target argument. 
      You can override the target using `overrideEvent` method from `esl-utils/dom/events`.
    - 🔧 `ESLEventUtils.descriptors` alias of `ESLEventUtils.getAutoDescriptors` is no longer supported, use full method name instead.
  - #### ESL Media Query
    - ESL Media Query consume functionality of `SynteticEventTarget` so `addListener` and `removeListener` shorthand are no longer supported. 
    Use `addEventListener` and `removeEventListener` instead.

- ### ESL Toggleables and Triggers
  - #### ESL Toggleables API Changes
    - `ToggleableActionParams` alias of `ESLToggleableActionParams` is no longer supported.
    - `onBeforeShow` and `onBeforeHide` have retired. The constraint now inside `shouldShow`/`shouldHide` methods. 
      Note that `activator` property change now is the part of main toggleable flow.
    - `this.open` of Toggleables doesn't update until super.onShow/super.onHide is called. 
      Make sure you update `this.open` synchronously or manually notify consumers in case the super call of `onShow/onHide` should be postponed.
  - #### A11y improvements and focus management (affects ESlPopup)
    - `a11y` option introduced and now used to control the focus management and a11y for `esl-popup`, `esl-tooltip` (footnotes), `esl-share`, `esl-select` (dropdown).
      Option available on `ESLToggleable` level and controls focus flow and close on outside action feature.
  - #### ESL Triggers API Changes
    - `ESLTrigger` does not have target defined to `::next` by default. You should always define the target explicitly.
  - #### ESL Panel and Panel Group
    - `fallback-duration` is no longer in the JSX shape of `ESLPanel` and `ESLPanelGroup`.
  - #### ESL Popup
    - Attribute `disable-arrow` no longer supported. Use class `disable-arrow` instead.

- ### ESL Footnotes
  - `ESLNote` now based on `ESLBaseTrigger` so active marker now called `active` instead of `tooltip-shown`.

- ### ESL Image
  - CSS aspect-ratio styles are no longer distributed with ESL Image. 
    You should define them in your project styles or use a separate package for that.
  - Note that ESL Image is now deprecated. Consider using native Image element with optional help from `esl-image-utils` module. 

- ### ESL Media
  - `load-cls-target`, `load-cls-accepted` and `load-cls-declined` use `load-condition-class` and `load-condition-class-target` instead.
  - `disabled` marker is no longer supported, use `lazy="manual"` instead (the `force` option of `play` method works the same way with the new lazy option).
