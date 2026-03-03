# UI Playground – Introduction

A flexible, plugin‑driven playground to present and experiment with UI components (HTML, JS, styling, attributes) directly in the browser.

This introduction orients you and links to focused guides. If you already want to build examples, jump to Core Concepts.

---

## Installation (Quick)

```bash
npm i @exadel/ui-playground --save
```

Initialize (register all core + bundled plugins):

```ts
import {init} from '@exadel/ui-playground';
init();
```

Import styles (CSS bundle):

```css
@import "@exadel/ui-playground/dist/registration.css";
```

Minimal markup:

```html
<uip-root>
  <template uip-snippet label="Basic" active>
    <button class="btn">Click</button>
  </template>
  <uip-preview></uip-preview>
</uip-root>
```

---

## Choosing What to Include

Only three things are strictly required: `<uip-root>`, at least one `<template uip-snippet>`, and `<uip-preview>`. Every other element is an optional plugin (navigation, editor, settings, theme toggle, etc.).

| Goal                          | Plugins to Use                                   |
|-------------------------------|--------------------------------------------------|
| Show multiple variants         | `uip-snippets` (or `uip-snippets-list` + `uip-snippets-title`) |
| Let users tweak attributes     | `uip-settings` + setting elements                |
| Live edit markup / JS         | `uip-editor` (optionally `copy`, `reset`)      |
| Provide documentation text     | `uip-note` + snippet note script blocks         |
| Theme / direction toggles     | `uip-theme-toggle`, `uip-dir-toggle` or attributes on settings panel |

---

## Snippet Declaration (Quick Recap)

```html
<template uip-snippet label="Card" anchor="card" active>...</template>
<script id="card-js" type="text/plain" uip-snippet-js>/* optional JS */</script>
<script id="card-note" type="text/plain" uip-snippet-note>Optional note text</script>
```

Add `uip-isolated` for iframe sandboxing. Full details: `src/core/README.md#2-declaring-snippets`.

---

## Persistence

Add `store-key="your-id"` to `<uip-root>` to cache user edits (HTML/JS/Note) for 12h per snippet. Remove the attribute or use the Reset plugin to discard.

---

## Example (Typical Layout)

```html
<uip-root store-key="demo" dark-theme>
  <template uip-snippet label="Default" active><button class="btn">Default</button></template>
  <template uip-snippet label="Isolated" uip-isolated><div class="box">Sandbox</div></template>

  <div class="uip-toolbar">
    <uip-snippets></uip-snippets>
    <uip-theme-toggle></uip-theme-toggle>
    <uip-dir-toggle></uip-dir-toggle>
  </div>

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

## When to Use Isolation

Use `uip-isolated` on a snippet if:

- Global CSS in snippet would bleed into others
- You need a fresh script execution context each switch
- You demonstrate conflicting resets or animations

Otherwise keep snippets inline for speed.

---

## Next Steps

1. Read Core Concepts
2. Add Preview & a few snippets
3. Layer in navigation (`uip-snippets`) & Editor/Settings
4. Explore Advanced plugins as needed
5. Dive into Technical Internals if you plan to build custom plugins

Happy experimenting!
