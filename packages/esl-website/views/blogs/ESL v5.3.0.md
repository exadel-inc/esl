---
layout: content
name: ESL v5.3.0
title: ESL v5.3.0
tags: [news]
date: 2025-03-27
link: https://github.com/exadel-inc/esl/releases/tag/v5.3.0
---

The ESL Tech Release v5.3.0 is now available.

The repository has been completely migrated to a classic monorepo structure and now uses Lerna for package management.
This change does not affect ESL consumers - NPM packages remain 100% compatible with previous versions.

Here is the list of regular release changes:
- Updtae the `eslint-config-esl` import plugin: `eslint-import-resolver-typescript` is now built-in.
- Retired the `isBot` check, as it is no longer functional or supported.
