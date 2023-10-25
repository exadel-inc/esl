---
layout: content
name: ESL v4.13.0
title: ESL v4.13.0
tags: [news]
date: 2023-10-25
link: https://github.com/exadel-inc/esl/releases/tag/v4.13.0
---

Upgrade to ESL version *v4.13.0*, now available on NPM! Discover the latest features and bug fixes:

- In the `esl-event-listener` module, we've introduced a new `condition` descriptor property, providing a legal means to prevent subscriptions.
  Additionally, we've added the [`ESLIntersectionTarget`](/core/esl-event-listener/#-esleventutilintersection) adapter utility, 
  enabling you to manage IntersectionObserver subscriptions through event listeners.

- The `esl-share` module is progressing towards a non-beta version, with several massive updates including the introduction of the `esl-share-list` component,
  a revamped `esl-share-popup` implementation, out-of-the-box share config defaults, and more.

- In the `esl-popup` module, we've resolved a bug related to updating the popup position when the activator changes.

- The `esl-media` module has received a bugfix addressing issues with the Brightcove provider's autoplay marker.

- The `esl-scrollbar` module now includes a bugfix for handling situations where the browser creates dimensions with floating-point values, ensuring correct handling of `at-start/at-end` positions.
