---
layout: content
name: ESL v4.10.0
title: ESL v4.10.0
tags: [news]
date: 2023-08-10
link: https://github.com/exadel-inc/esl/releases/tag/v4.10.0
---

The ESL v4.10.0 just released. In the latest version you can find the following updates:

- New approach for ESLToggleable and ESLTrigger marker attributes: now you can use `0` and `false` values to set 
attributes to `false` state
- `toBooleanAttribute` serializer was created to support mentioned attribute behavior in custom components
- Rework scroll lock functionality: 
    - `pseudo` scroll lock now uses padding hack instead of flexbox on the HTML level
    - Add new `background` mode, that repeats `pseudo` but with a much lower default z-index for the scrollbar stub
- Fixes for ESLFootnotes and ESLToggleable components
