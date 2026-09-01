# [ESL](../../../) Image Migration Guide

<a name="intro"></a>

Guide and cheat sheet for migrating from the deprecated `<esl-image>` component to modern native HTML (`<img>`, `<picture>`), CSS, and ESL utility modules (`esl-image-utils`, `esl-lazy-template`).

---

## Overview

Starting with ESL version **7.0.0**, `<esl-image>` is no longer supported or distributed.

Modern browsers natively support:
- Native lazy loading via the `loading="lazy"` attribute on `<img>`.
- Responsive image selection via `<picture>`, `<source media="...">`, and `srcset` / `sizes`.
- CSS sizing and framing via `aspect-ratio`, `object-fit`, and `object-position`.
- Lazy inline SVG insertion via `<template esl-lazy-template="...">` (`ESLLazyTemplate`).

To handle container-level load state classes and CSS helpers, use the lightweight [`@exadel/esl/modules/esl-image-utils`](../README.md) module.

---

## Migration Cheat Sheet

| Feature / Mode in `<esl-image>` | Modern Alternative |
|---|---|
| Basic image: `<esl-image data-src="..."/>` | `<img src="..." alt="..."/>` |
| Lazy loading: `<esl-image lazy data-src="..."/>` | `<img loading="lazy" src="..." alt="..."/>` |
| `mode="cover"` | `<div class="img-container" esl-image-container><img class="img-cover" loading="lazy" src="..." alt="..."/></div>` |
| `mode="fit"` | `<div class="img-container" esl-image-container><img class="img-contain" loading="lazy" src="..." alt="..."/></div>` |
| `mode="save-ratio"` | `<div class="img-container img-container-16-9" esl-image-container><img class="img-cover" loading="lazy" src="..." alt="..."/></div>` (or CSS `aspect-ratio`) |
| `mode="origin"` | `<img loading="lazy" src="..." alt="..."/>` |
| `mode="inner-svg"` | `<template esl-lazy-template="path/to/image.svg"></template>` |
| Breakpoints: `data-src="@XS => ... \| @MD => ..."` | `<picture><source media="(min-width: ...)" srcset="..."><img loading="lazy" src="..." alt="..."/></picture>` |
| Ready/Error classes (`container-class`) | `esl-image-container` mixin (`ESLImageContainerMixin`) on container or `img` |
| Fade-in on load | `.img-fade` class (`esl-image-utils.fade.css`) inside `esl-image-container` |

---

## Migration Examples

### 1. Responsive & Lazy Loading

#### Before (`<esl-image>`):
```html
<esl-image lazy
  data-src="@XS => /assets/nature/forest-sm.jpg | @MD => /assets/nature/forest-md.jpg | @LG => /assets/nature/forest-lg.jpg"
  alt="Forest">
</esl-image>
```

#### After (Native `<picture>` + `esl-image-container`):
```html
<picture class="img-container img-container-16-9" esl-image-container>
  <source media="(min-width: 992px)" srcset="/assets/nature/forest-lg.jpg" />
  <source media="(min-width: 768px)" srcset="/assets/nature/forest-md.jpg" />
  <img loading="lazy" src="/assets/nature/forest-sm.jpg" alt="Forest" class="img-cover img-fade" />
</picture>
```

---

### 2. Sizing, Aspect Ratios & Modes

#### Before (`<esl-image>`):
```html
<!-- Cover mode -->
<esl-image mode="cover" data-src="/assets/nature/forest.jpg" alt="Forest"></esl-image>

<!-- Save-ratio mode -->
<esl-image mode="save-ratio" data-src="/assets/nature/forest.jpg" alt="Forest"></esl-image>
```

#### After (`esl-image-utils` CSS classes or native CSS):
```html
<!-- Cover mode with 16:9 container -->
<div class="img-container img-container-16-9" esl-image-container>
  <img loading="lazy" src="/assets/nature/forest.jpg" alt="Forest" class="img-cover" />
</div>

<!-- Contain (fit) mode with 4:3 container -->
<div class="img-container img-container-4-3" esl-image-container>
  <img loading="lazy" src="/assets/nature/forest.jpg" alt="Forest" class="img-contain" />
</div>

<!-- Or using pure modern CSS -->
<img loading="lazy" src="/assets/nature/forest.jpg" alt="Forest" style="aspect-ratio: 16 / 9; object-fit: cover; width: 100%;" />
```

---

### 3. Inline SVGs

#### Before (`<esl-image>`):
```html
<esl-image lazy mode="inner-svg" data-src="/assets/icons/cat.svg"></esl-image>
```

#### After (`ESLLazyTemplate` / `esl-lazy-template`):
```html
<template esl-lazy-template="/assets/icons/cat.svg"></template>
```
```typescript
import { ESLLazyTemplate } from '@exadel/esl';
ESLLazyTemplate.register();
```

---

### 4. Container State Tracking & Load Callbacks

#### Before (`<esl-image>`):
```html
<esl-image
  lazy
  container-class="image-is-loaded"
  container-class-target="::parent"
  data-src="/assets/nature/forest.jpg">
</esl-image>
```

#### After (`ESLImageContainerMixin`):
```html
<div class="img-container" esl-image-container="{readyCls: 'image-is-loaded', errorCls: 'image-error'}">
  <img loading="lazy" src="/assets/nature/forest.jpg" alt="Forest" class="img-cover img-fade" />
</div>
```
```typescript
import { ESLImageContainerMixin } from '@exadel/esl';
ESLImageContainerMixin.register();
```

---

### 5. Styles Setup

Include `esl-image-utils` styles in your project:
```css
/* All container, ratio, and fade helpers */
@import '@exadel/esl/modules/esl-image-utils/all.css';

/* Or individual stylesheets */
@import '@exadel/esl/modules/esl-image-utils/core/esl-image-utils.container.css';
@import '@exadel/esl/modules/esl-image-utils/core/esl-image-utils.ratios.css';
@import '@exadel/esl/modules/esl-image-utils/core/esl-image-utils.fade.css';
```

