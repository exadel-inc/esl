---
layout: content
name: ESL v6.0.0
title: ⚡ ESL v6.0.0 is out! ⚡
tags: [news, blogs, draft]
date: 2026-04-27
order: 11
link: https://github.com/exadel-inc/esl/releases/tag/v6.0.0
---

ESL 6.0.0 is now available on npm.

This major release focuses on cleanup: safer parsing, long-postponed API removals, pragmatic component polish, and a more predictable base for what comes next in the ESL ecosystem.  

#### What stands out in v6

- **Safer config parsing.** `evaluate` is gone; `parseObject` / `parseObjectSafe` are now the supported, explicit path.
- **Legacy cleanup finally lands.** Deprecated utilities and compatibility aliases are removed across the library.
- **Core components get practical polish.** Popup alignment is clearer, anchor-nav is more explicit, line-clamp gets new helpers, and carousel / footnotes / toggleables are refined.
- **Tooling moves forward.** ESL linting is centered on `@exadel/eslint-config-esl`, Stylelint config is on v17, and website e2e now runs on Playwright.  

#### Ecosystem updates around the release

- `@exadel/eslint-plugin-esl` is no longer the recommended path; use `@exadel/eslint-config-esl` instead.
- UI Playground makes a one-time jump from `1.0.0` to `6.0.0` to align with the monorepo; future public modules are expected to version more independently.  

#### Upgrade and migration

If you are upgrading from a late v5 release, the move is usually straightforward — but this is still a good release to review once with the overview and migration notes at hand.  

#### What is next

Next up: AI Skills on the website and broader agent-friendly adaptation across the library (targeted for 6.1.0), TypeScript 6 migration work, and cleaner CSS asset distribution on the path to v7.

So while v6 is primarily a stability and cleanup milestone, it also clears the way for the next wave of platform work.

---

→ [Read the ESL v6.0.0 Overview & Migration Guide](./ESL%20v6.0.0%20Migration%20Guide.md)

