---
layout: content
name: ESL v4.14.0
title: ESL v4.14.0
tags: [news]
date: 2023-11-24
link: https://github.com/exadel-inc/esl/releases/tag/v4.14.0
---

New ESL version *v4.14.0* released and available on NPM! Discover what's new in the latest ESL:

- We are pleased to announce the release of `@exadel/eslint-plugin-esl`, a tool designed to ensure continuous support for ESL, 
  keeping you in sync with ESL updates and best practices. The plugin's versioning is synchronized with ESL, 
  simplifying the process of finding the compatible version for your ESL setup.  
  See the [plugin's installation guide](/core/esl-eslint-plugin/) for more information.

- In our journey towards the release of the production-ready `esl-share`, the current beta version is stable and won't undergo significant changes. 
  Explore the latest module structure, featuring:
    - A separate `esl-share-list` component tailored for users who prefer a simple list of share buttons without the popup.
    - The `esl-share` custom element now utilizes the esl-share-popup implementation.

- We've introduced a new static property, `DEFAULT_PARAMS`, to the `esl-toggleable` instances. 
  This addition makes it effortless to set default show/hide parameters for toggleable based modules.

- Introducing the new `esl-random-text` component, designed to assist in populating your test pages with dummy content.

- iOS bugfixes related to the native scroll for `esl-tabs` module
