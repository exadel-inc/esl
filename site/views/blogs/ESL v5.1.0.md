---
layout: content
name: ESL v5.1.0
title: ESL v5.1.0
tags: [news]
date: 2025-02-26
link: https://github.com/exadel-inc/esl/releases/tag/v5.1.0
---

ESL version 5.1.0 is now available on NPM. Explore the enhancements in the latest release:

- New `ESLLazyTemplate` mixin to lazy load html/svg fragments ([See more](/components/esl-lazy-template))
- Major backward-copatible update for `ESLMedia` component:
    - system pause marker
    - autostop/autoplay inside esl-togglable instances
    - `ESLMedia.manager` API to control all media instances
    - `esl:media:before:play` event, support for paly restrictions
- `ESLEventListener` fix a bunch subscription on static targets
- RTL utils simplified and optimized according to the actual browser support

