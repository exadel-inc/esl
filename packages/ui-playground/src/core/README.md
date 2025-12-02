# Core Concepts (UI Playground)

This document is the user‑facing guide to the **core layer** of UI Playground: the root container, snippet declaration model, preview basics, and how built‑in plugins fit around them.
For internal architecture & API extension details see: `./base/README.md` (Technical Internals).

---
## 1. What Is the Core?
Core = minimal set required to render interactive examples:
- `<uip-root>` – orchestrates snippets, state, theme & persistence
- Snippet sources – `<template uip-snippet>` (+ optional JS & Note script blocks)
- `<uip-preview>` – renders the active snippet (inline or isolated)
Everything else (editor, settings, navigation UI, toggles, notes, copy, etc.) is a plugin layered on top.

Required minimum markup:
```html
<uip-root>
  <template uip-snippet label="Basic" active>
    <button class="btn">Click</button>
  </template>
  <uip-preview></uip-preview>
</uip-root>
```
Initialization:
```ts
import {init} from '@exadel/ui-playground';
init();
```
Styles:
```css
@import '@exadel/ui-playground/dist/registration.css';
```

---
## 2. Declaring Snippets
A snippet is a self‑contained example (HTML + optional JS + optional Note). Multiple snippets let users switch between variants.

### 2.1 Basic Snippet
```html
<template uip-snippet label="Card" active>
  <div class="card">Card body</div>
</template>
```
`active` marks the default if no URL hash chooses something else.

### 2.2 With JS and Note
```html
<template uip-snippet label="Interactive" anchor="card-int" uip-snippet-js="card-js" uip-snippet-note="card-note">
  <div class="card">Click me</div>
</template>
<script id="card-js" type="text/plain" uip-snippet-js>
  document.querySelector('.card')?.addEventListener('click', ()=>console.log('Clicked'));
</script>
<script id="card-note" type="text/plain" uip-snippet-note>
  This card logs clicks.
</script>
```

### 2.3 Isolated Snippet (Iframe Sandbox)
```html
<template uip-snippet label="Sandbox" anchor="sandbox" uip-isolated>
  <style>.box{padding:8px;background:#eee}</style>
  <div class="box">Isolated scope</div>
</template>
```
Add `uip-isolated` to avoid global style bleed or when script side‑effects must reset cleanly.

### 2.4 Snippet Attributes Quick Reference
| Attribute | Purpose | Notes |
|----------|---------|-------|
| `label` | Display name shown in navigation/title plugins | Required for good UX |
| `active` | Preferred initial snippet | Ignored if URL anchor resolves |
| `anchor` | Deep link slug (`#anchor`) | Enables direct linking |
| `uip-snippet-js` | ID of `<script type="text/plain" uip-snippet-js>` | JS runs (isolated always; inline reused) |
| `uip-snippet-note` | ID of `<script type="text/plain" uip-snippet-note>` | Consumed by note plugin |
| `uip-isolated` | Force iframe rendering | Each change rebuilds internally (batched) |
| `isolated-template` | Named iframe HTML shell | Advanced theming |
| `uip-js-readonly` | Disallow JS editing | Auto‑true if not isolated |

---
## 3. `<uip-root>` Essentials
Root ties everything together and dispatches public events (`uip:root:ready`, `uip:change`, `uip:snippet:change`, `uip:theme:change`).

| Attribute | Type | Effect |
|-----------|------|--------|
| `dark-theme` | boolean | Switch to dark UI theme |
| `store-key="id"` | string | Enable persistence of edited HTML/JS/Note (12h TTL) |

Recommended: provide a unique `store-key` per page or logical playground so local edits do not collide across examples.

### 3.1 Activation Order
1. URL hash (`#anchor`) matches snippet `anchor`
2. First `active` snippet
3. First declared snippet

### 3.2 Basic Layout & Plugin Placement
Children order inside `<uip-root>` is also visual stacking order. Typical pattern:
```html
<uip-root store-key="btn-demo" dark-theme>
  <!-- Snippets -->
  <template uip-snippet label="Default" active>...</template>
  <template uip-snippet label="Primary">...</template>

  <!-- Toolbar (navigation + quick toggles) -->
  <div class="uip-toolbar">
    <uip-snippets></uip-snippets>
    <uip-theme-toggle></uip-theme-toggle>
    <uip-dir-toggle></uip-dir-toggle>
  </div>

  <!-- Core preview -->
  <uip-preview></uip-preview>

  <!-- Optional side panels -->
  <uip-settings collapsible target=".button"></uip-settings>
  <uip-editor collapsible copy></uip-editor>
  <uip-note collapsible></uip-note>
</uip-root>
```
All plugins are optional except `<uip-preview>`.

---
## 4. Basic Processes (Lifecycle Cheat Sheet)
| Stage | What Happens |
|-------|--------------|
| Connect | Root collects snippet templates & builds state model |
| Ready | Initial snippet chosen (hash > active > first) → `uip:root:ready` |
| Edit | Editor/settings call model mutation → microtask batch → `uip:change` |
| Switch Snippet | Model swaps sources; preview refresh (inline or iframe) → `uip:snippet:change` + `uip:change` |
| Persist | If `store-key` present, batched changes saved (12h expiry) |
| Reset | Reset plugin or manual call reverts HTML/JS to original snippet source |

### 4.1 Editing Flow
1. User changes code or setting
2. Model queues change(s)
3. Single `uip:change` event emitted (even for multiple rapid mutations)
4. Preview & other listeners update once

### 4.2 Isolation Refresh Rules
- New snippet with `uip-isolated` always triggers iframe refresh
- Forced refresh: `force-update` on `<uip-preview>` or `setHtml(..., true)` from custom plugin
- Non‑isolated (inline) updates patch DOM fragment only

---
## 5. Root & Snippet Settings (User-Facing)
| Goal | How |
|------|-----|
| Dark theme | Toggle `dark-theme` on `<uip-root>` or use `<uip-theme-toggle>` |
| RTL test | Set `dir="rtl"` on `<uip-preview>` or use `<uip-dir-toggle>` |
| Persist edits | Add `store-key` to `<uip-root>` |
| Deep link example | Provide `anchor` on snippet and link to `#anchor` |
| Start with specific snippet | Use `active` attribute |
| Clean test environment | Add `uip-isolated` |

---
## 6. FAQ
| Question | Answer |
|----------|--------|
| Do I need all plugins? | No, only `<uip-preview>` is mandatory. |
| Can I link to a specific example? | Yes, add `anchor` to snippet and link with `#anchor`. |
| How do I reset edited code? | Use `<uip-reset>` or clear persistence (remove `store-key`). |
| How do I avoid CSS bleed? | Use `uip-isolated` on the snippet. |
| Can I reorder panels? | Yes, change DOM order inside `<uip-root>`. |
