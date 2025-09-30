---
layout: content
name: ESL v5.8.0
title: ESL v5.8.0
tags: [news, blogs]
date: 2025-06-16
link: https://github.com/exadel-inc/esl/releases/tag/v5.8.0
---

This update adds built-in support for the no-target attribute in `esl-tab` and `esl-trigger`, 
which now hide inactive elements by default. We’ve also introduced the public `ESL.version` property 
for easier diagnostics and tooling (make sure to include `lib.ts` to access it).
The `esl-carousel` received several updates: 
a more consistent rendering flow, extended proactive event handling, 
and improved support for dynamic `container-class` behaviors via the [`esl-carousel-class-behavior`](/components/esl-carousel/container-class) plugin.
