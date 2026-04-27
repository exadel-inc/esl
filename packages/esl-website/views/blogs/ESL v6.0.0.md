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

This is a major cleanup release: fewer legacy APIs, safer configuration parsing, a more predictable component surface, and better foundations for what comes next in the ESL ecosystem.  

#### What stands out in v6

- **Safer parsing and stricter defaults.** `evaluate` is removed, `parseObject` / `parseObjectSafe` become the supported path, and config parsing across ESL is now more explicit and predictable.
- **Long-postponed API cleanup.** Deprecated utilities and compatibility aliases are finally removed, making v6 the point where legacy migration debt is paid off.
- **Focused component updates.** Popup alignment API is cleaned up, anchor-nav becomes more explicit, line-clamp gets new helpers, carousel CSS renderers improve, and footnotes / toggleables receive practical fixes.
- **Tooling and ecosystem alignment.** ESL linting is consolidated around `@exadel/eslint-config-esl`, stylelint config moves to Stylelint 17, and website e2e coverage is rebuilt on Playwright.  

#### Ecosystem updates around the release

- The old snapshot-based website e2e setup is replaced with a Playwright-based flow.
- `@exadel/eslint-plugin-esl` is no longer the recommended path; use `@exadel/eslint-config-esl` instead.
- UI Playground makes a one-time version jump from `1.0.0` to `6.0.0` to align with the rest of the monorepo.

This version jump is intentional, but it is also the last “global alignment” style step: going forward, public project modules are expected to version more independently.  

#### Upgrade and migration

ESL 6.0.0 also removes a broad set of deprecated APIs across core and utils.

If you are upgrading from a late v5 release, review:
- deprecated util aliases and helper classes,
- popup alignment attributes,
- dynamic object parsing usage,
- anchor-nav selector customization,
- `ESLNoteIgnore.noteSelector`,
- `ESLToggleableManager` naming and imports.  

#### What is next

A few adjacent initiatives are already in motion, but they are **not** the core payload of 6.0.0 itself:
- AI Skills on the website and broader agent-friendly adaptation across the library; (targeted for 6.1.0)
- TypeScript 6 migration work;
- a move toward cleaner CSS asset distribution in the v7 cycle.

So while v6 is primarily a stability and cleanup milestone, it also opens the door for the next wave of platform work.

---

→ [Read the ESL v6.0.0 Overview & Migration Guide](/blogs/ESL%20v6.0.0%20Migration%20Guide/)

