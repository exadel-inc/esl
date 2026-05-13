---
layout: content
name: ESL v6.1.0
title: ESL v6.1.0
tags: [news, blogs]
order: 11
date: 2026-05-13
link: https://github.com/exadel-inc/esl/releases/tag/v6.1.0
---

ESL v6.1.0 is now available!

This release brings improvements to accessibility, utility APIs, and TypeScript compatibility across the ESL ecosystem.
We’ve replaced the legacy `no-inert` hook in `esl-carousel` with a proper `focus-policy` feature, expanded the built-in `sanitize` utility to support DOM Elements, and introduced the `no-implicit-this` rule for strict `eslint-config-esl` setups.

The update also includes a number of typing improvements and refinements, with more precise coverage, better test support, and improved compatibility with newer TypeScript versions.
Additionally, we fixed JSX children support in `esl-carousel` and corrected parsing logic for `none` time values in `esl-utils`.
