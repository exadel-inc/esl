---
layout: content
name: ESL v4.17.0
title: ESL v4.17.0
tags: [news]
date: 2024-06-01
link: https://github.com/exadel-inc/esl/releases/tag/v4.17.0
---

ESL version 4.17.0 is now available on NPM. It's probably the last minor release before 5.0.0. 
Explore the latest fixes and enhancements:

- Major enhancements to `ESLEventListener`:
    - Added a group key to process batch subscription operations.
    - Reworked the event listener system to provide more accurate and strict warnings.
    - Added separate intersection in/out events.
    - Fixed issues with re-subscription when a `condition` is used.
    - Improved types and documentation.

- Updates to `ESLMedia`:
    - Support for initial position (start time).
    - Decreased tolerance for `play-in-viewport` to 50%.
    - Fixed the YouTube video `seekTo` method.

- Added ESLPopup refresh event handler and fixed the possibility to set `offset-arrow` to 0.
- Added the ability to reject promisifyEvent using `AbortSignal`.
- Fixed the initial `ESLPanel` animation state markers.
- Added provider function support for the `@prop` decorator.
- Extended ESL ESLint Plugin rules with checks for deprecated import paths.
- Small fixes in `ESLAnimateMixin` (attribute observation) and ESL Utils (signatures and types).


