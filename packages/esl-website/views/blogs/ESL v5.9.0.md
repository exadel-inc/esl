---
layout: content
name: ESL v5.9.0
title: ESL v5.9.0
tags: [news]
date: 2025-07-12
link: https://github.com/exadel-inc/esl/releases/tag/v5.9.0
---

We’ve just released ESL v5.9.0!
Here’s a quick summary of what’s new:
- Improved `esl-carousel`: reworked state API, enhanced and reworked navigation syntax.
- Introduced basic support for free-mode carousels with new public property `offset` and `move` event.
- Added viewport visibility control for the `esl-carousel-autoplay` plugin.
- Fix `esl-carousel-relate-to` to follow the initial spec (plugin now out of beta).
- Extended `esl-carousel-wheel` to work with free-mode carousels.
- Enhanced and fixed `play-in-viewport` in `esl-media` to work properly with a stopped video.
- `esl-trigger` now stops handled `click` and `keydown` events from bubbling by default.
