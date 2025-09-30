---
layout: content
name: ESL v5.14.0
title: ESL v5.14.0
tags: [news, blogs]
order: 10
date: 2025-09-30
link: https://github.com/exadel-inc/esl/releases/tag/v5.14.0
---

ESL 5.14.0 is out now on npm – a focused release streamlining linting adoption, strengthening interactive components, and expanding JSX / TSX ergonomics.

- Unified linting: `@exadel/eslint-config-esl` now embeds ESL migration & support rules. `@exadel/eslint-plugin-esl` is deprecated from this version and will be removed in 6.0.0 – switch to the config to stay current.
- JSX / TSX DX: global `ESLIntrinsicElements` declarations and an extended TSX guide with full decorator documentation accelerate component authoring.
- Interactive components: Carousel gains configurable autoplay restriction logic; Popup exposes lightweight param access with automatic cleanup; Trigger now consistently emits the `esl:change:action` event; deprecated action param aliases removed across components.
- Site & docs: refreshed navigation & sidebar UX, new decorator docs set, TSX guide, and general cleanup (unused assets & tags removed) for a leaner footprint.

Upgrade notes: adopt the unified ESL ESLint config to prepare for v6, and review carousel / popup configuration if you rely on custom autoplay or popup parameter handling.
