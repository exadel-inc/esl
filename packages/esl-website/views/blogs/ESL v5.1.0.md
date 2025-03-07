---
layout: content
name: ESL v5.1.0
title: ESL v5.1.0
tags: [news]
date: 2025-03-06
link: https://github.com/exadel-inc/esl/releases/tag/v5.1.0
---

ESL version 5.1.0 is now available on NPM. Explore the enhancements in the latest release:

- New `ESLLazyTemplate` mixin to lazy load html/svg fragments ([See more](/components/esl-lazy-template))
- Major backward-compatible update for `ESLMedia` component:
    - `ESLMedia.manager` API to control all media instances
    - `esl:media:before:play` hook-event and support for play restrictions
    - autostop/autoplay inside esl-togglable instances
    - updated paly-in-viewport functionality (more reliable and customizable)
- `ESLEventListener` fix a bunch subscription on static targets
- RTL utils were simplified and optimized according to the actual browser support
- Updated ESL ESlint/Stylelint shared configurations
