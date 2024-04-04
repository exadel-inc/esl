---
layout: content
name: ESL v4.15.0
title: ESL v4.15.0
tags: [news]
date: 2024-04-05
link: https://github.com/exadel-inc/esl/releases/tag/v4.15.0
---

ESL v5.0.0 is still in progress and currently under beta channel.
But we decided to release a couple of minor versions of ESL v4 to allow you to be more up to date with the upcoming 5th version.

---

So, the ESL v4.15.0 has just been released. The following updates have been included in this release:

- Introducing the new `ESLWheelTarget` proxy target designed to handle "long" wheel user actions.
- Introducing the `ESLOpenState` mixin, facilitating automatic open/close actions based on media query changes for toggleable components.
- Enhanced flexibility with the addition of support for `extraClass` and `extraStyle` parameters for instances of `ESLPopup`.
- Out-of-the-box configuration for `ESLShare` now includes Skype, Tumblr, Viber, and WhatsApp share buttons. 
  Additionally, the ability to update `ESLShareConfig` using list query syntax, along with accessibility and internal structural improvements.
- Significant improvements to the `ESLToggleable` API, now featuring `shouldShow` and `shouldHide` internal methods instead 
  of the previous `onBeforeShow` and `onBeforeHide` callbacks.
- Enhanced types compatibility, debugging, and delegation bug-fixing for `ESLEventListener`.
- Immutable `Rect` reimplementation for `esl-utils` module. Rect is going to become immutable by type in upcoming versions.
- `ESLPopup` updated with autofocus, `PopupActionParams.extraClass`, and `PopupActionParams.extraStyle` support.
- Bug fix: `ESLEventListener` delegation fixes for non-DOM targets and containers handling.
