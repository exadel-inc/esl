---
layout: content
name: ESL v4.16.0
title: ESL v4.16.0
tags: [news]
date: 2024-04-11
link: https://github.com/exadel-inc/esl/releases/tag/v4.16.0
---

We are delighted to announce the release of ESL version `v4.16.0`. 
With this release, we are continuing to implement changes originally planned for version 5, and make them available in the 4 stable.

Here is the list of changes:

- Scroll-aware event handling for `ESLEventListener` swipe and longwheel targets. 
  Now you can easily omit swipe and longwheel events in case of content scrolling.
- Introducing the `ESLBaseTrigger` class in the `esl-trigger` module to simplify and make Trigger-Toggleable constructions more API strict in ESL.
- New possibilities for the `attr` decorator. 
  Now you can use providers to set default values and the `inherit` option to inherit the value of declared attributes from DOM parents.
- Bug fixes and improvements in the ESLShare module (update config method, migration to `ESLBaseTrigger`, etc.).
- Bug fixes for the `microtask` utility and `ESLEventListener` support for any object-like host.
