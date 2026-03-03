# UIPlayground

<p align="center">
  <img width="150" height="150" src="https://github.com/exadel-inc/ui-playground/blob/main/docs/images/uip-logo.png?raw=true" alt="UI Playground Logo">
</p>

<br/>

[![npm](https://img.shields.io/npm/v/@exadel/ui-playground?style=for-the-badge)](https://www.npmjs.com/package/@exadel/ui-playground)
[![version](https://img.shields.io/github/package-json/v/exadel-inc/ui-playground?style=for-the-badge)](https://github.com/exadel-inc/ui-playground/releases/latest)
[![build](https://img.shields.io/github/actions/workflow/status/exadel-inc/ui-playground/lint.yml?style=for-the-badge)](https://github.com/exadel-inc/ui-playground/actions/workflows/lint.yml)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](./README.md)

**UIPlayground** is a lightweight, extensible, standards‑based playground for presenting and experimenting with your Web Components / UI patterns directly in the browser.

Only three core pieces are required: `<uip-root>`, at least one `<template uip-snippet>`, and `<uip-preview>`. Everything else (editor, settings, navigation, notes, copy, reset, theme & direction toggles) is layered via optional plugins.

---
## Installation
```bash
npm i @exadel/ui-playground --save
```
Initialize (registers core + bundled plugins + settings):
```ts
import {init} from '@exadel/ui-playground';
init();
```
Styles (bundle):
```css
@import '@exadel/ui-playground/dist/registration.css';
```

---
## Minimal Markup
```html
<uip-root>
  <template uip-snippet label="Basic" active>
    <button class="btn">Click</button>
  </template>
  <uip-preview></uip-preview>
</uip-root>
```

---
## Documentation Map
| Need | Read |
|------|------|
| Overview & site structure | [Introduction](docs/INTRODUCTION.md) |
| Core concepts (root, snippets, lifecycle) | [Core Concepts](src/core/README.md) |
| Live preview usage & isolation | [Preview Guide](src/core/preview/README.md) |
| Snippet navigation (tabs/dropdown) | [Snippets Navigation](src/plugins/snippets/README.md) |
| Live editor | [Editor](src/plugins/editor/README.md) |
| Settings & setting types | [Settings](src/plugins/settings/README.md) |
| Note / Copy / Reset plugins | [Note](src/plugins/note/README.md) · [Copy](src/plugins/copy/README.md) · [Reset](src/plugins/reset/README.md) |
| Theme / Direction toggles | [Theme](src/plugins/theme/README.md) · [Direction](src/plugins/direction/README.md) |
| Technical internals & custom plugins | [Internals](src/core/base/README.md#technical-internals) |

A more detailed “Basic vs Advanced Usage” grouping lives in `docs/INTRODUCTION.md`.

---
## Typical Layout Example
```html
<uip-root store-key="demo" dark-theme>
  <!-- Snippets -->
  <template uip-snippet label="Default" active>
    <button class="btn">Default</button>
  </template>
  <template uip-snippet label="Sandbox" uip-isolated>
    <div class="panel">Isolated environment</div>
  </template>

  <!-- Toolbar -->
  <div class="uip-toolbar">
    <uip-snippets dropdown-view="(max-width: 900px)"></uip-snippets>
    <uip-theme-toggle></uip-theme-toggle>
    <uip-dir-toggle></uip-dir-toggle>
    <uip-copy></uip-copy>
    <uip-reset></uip-reset>
  </div>

  <!-- Core preview & panels -->
  <uip-preview></uip-preview>
  <uip-settings collapsible target=".btn" theme-toggle dir-toggle>
    <uip-bool-setting label="Disabled" attribute="disabled"></uip-bool-setting>
  </uip-settings>
  <uip-editor collapsible copy></uip-editor>
  <uip-note collapsible></uip-note>
</uip-root>
```

---
## Key Features
- Multiple snippets with deep‑link anchors
- Inline or iframe‑isolated rendering per snippet
- Live HTML & JS editing (CodeJar + Prism)
- Attribute/property tweaking via structured settings
- Persistence (time‑boxed) via `store-key`
- Dark/light theme toggle & RTL direction toggle
- Copy & Reset utilities, per‑snippet notes
- Extensible plugin API (minimal base + state model events)

---

## License

Distributed under the MIT License. See [LICENSE](https://github.com/exadel-inc/ui-playground/blob/HEAD/CLA.md)
for more information.

---

**Exadel, Inc.**

[![](docs/images/exadel-logo.png)](https://exadel.com)
