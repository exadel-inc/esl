---
layout: content
name: ESL v4.15.0
title: ESL v4.15.0
tags: [news, draft]
date: 2023-12-18
link: https://github.com/exadel-inc/esl/releases/tag/v4.15.0
---

The ESL v4.15.0 just released. In the latest version you can find the following updates:

- Introducing the new `ESLWheelTarget` proxy target designed to handle "long" wheel user actions.
- Introducing the `ESLOpenState` mixin, facilitating automatic open/close actions based on media query changes for toggleable components.
- Enhanced flexibility with the addition of support for `extraClass` and `extraStyle` parameters for instances of `ESLPopup`.
- Out-of-the-box configuration for `ESLShare` now includes Skype, Tumblr, Viber, and WhatsApp share buttons. 
  Additionally, the ability to update `ESLShareConfig` using list query syntax, along with accessibility and internal structural improvements.
- Significant improvements to the `ESLToggleable` API, now featuring `shouldShow` and `shouldHide` internal methods instead 
  of the previous `onBeforeShow` and `onBeforeHide` callbacks.
- Bug fix: Default target for `ESLTrigger` is empty now instead of `::next` previously. 
  This correction ensures logical consistency and eliminates unexpected behavior.
- Enhanced types compatibility, debugging, and delegation bug-fixing for `ESLEventListener`.
- Immutable `Rect` reimplementation for `esl-utils` module.
