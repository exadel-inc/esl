# UI Playground Source Guide

This file gives a quick orientation to the source layout and how to register components. For end‑user oriented docs start with `../docs/INTRODUCTION.md` and `core/README.md` (Core Concepts).

---
## Installation (Quick)
```bash
npm i @exadel/ui-playground --save
```
```ts
import {init} from '@exadel/ui-playground';
init();
```
Styles:
```css
@import '@exadel/ui-playground/dist/registration.css';
```

---
## Directory Map (Relevant Parts)
| Path | Purpose |
|------|---------|
| `core/` | Core elements (root, preview, internals) |
| `core/base/` | Technical internals & plugin base classes |
| `core/preview/` | Preview user guide & implementation |
| `plugins/` | Built‑in optional plugins |
| `plugins/settings/` | Settings container + setting types |
| `plugins/snippets/` | Composite snippet navigation UI |
| `types/` | Global ambient type declarations |
| `../docs/` | High‑level introduction & site images |

---
## Core Elements
- [UIP Root](core/README.md#uip-root)
- [UIP Preview](core/preview/README.md)

## Plugins
- [UIP Snippets Navigation](plugins/snippets/README.md)
- [UIP Snippets Title](plugins/snippets-title/README.md)
- [UIP Snippets List](plugins/snippets-list/README.md)
- [UIP Editor](plugins/editor/README.md)
- [UIP Settings](plugins/settings/README.md)
  - Text / Bool / Select / Slider settings (sub‑folders)
- [UIP Theme Toggle](plugins/theme/README.md)
- [UIP Direction Toggle](plugins/direction/README.md)
- [UIP Note](plugins/note/README.md)
- [UIP Copy](plugins/copy/README.md)
- [UIP Reset](plugins/reset/README.md)

All plugins are optional; only `<uip-preview>` (with `<uip-root>` and at least one snippet) is mandatory.

---
## Registration APIs
Register everything (core + plugins + settings types):
```ts
import {init} from '@exadel/ui-playground';
init();
```
Partial registration:
```ts
import {registerCore, registerPlugins, registerSettings} from '@exadel/ui-playground';
registerCore();       // root, preview, base infrastructure
registerPlugins();    // editor, snippets, note, copy, theme, direction, reset, etc.
registerSettings();   // settings container + concrete setting elements
```
Manual single component registration example:
```ts
import {UIPRoot} from '@exadel/ui-playground';
UIPRoot.register();
```

---
## Styles
Two bundles published (`registration.css` / `registration.less`). Import one to include all core + plugins styling. Individual component style imports are also possible (see build output) but rarely needed.

---
## Building Custom Plugins
See technical internals for extending `UIPPlugin`, using the state model, and event surfaces:
`core/base/README.md#uip-plugin`

---
## Minimal Markup Example
```html
<uip-root store-key="demo">
  <template uip-snippet label="Basic" active>
    <button class="btn">Click</button>
  </template>
  <uip-snippets class="uip-toolbar" dropdown-view="(max-width: 800px)"></uip-snippets>
  <uip-preview></uip-preview>
  <uip-settings collapsible target=".btn" theme-toggle dir-toggle>
    <uip-bool-setting label="Disabled" attribute="disabled"></uip-bool-setting>
  </uip-settings>
  <uip-editor collapsible copy></uip-editor>
  <uip-note collapsible></uip-note>
  <uip-reset></uip-reset>
</uip-root>
```

---
## Browser Support
Modern evergreen browsers (Chromium, Firefox, Safari, Edge). Legacy IE not supported.

---
## Further Reading
| Goal | Doc |
|------|-----|
| User concepts & lifecycle | `core/README.md` |
| Preview usage | `core/preview/README.md` |
| Intro / Doc site map | `docs/INTRODUCTION.md` |
| Build custom plugin | `core/base/README.md#uip-plugin` |

---
Happy hacking! Use the introduction and core docs for user guidance; this file is just a developer orientation inside the package.
