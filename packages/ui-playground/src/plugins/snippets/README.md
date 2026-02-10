**UIPSnippets** – composite navigation plugin that presents available snippets (declared via `<template uip-snippet>`). It can render as a tab bar or collapse into a dropdown based on a media query.

Internally it coordinates:
- [`UIPSnippetsList`](../snippets-list/README.md) – the list / dropdown UI
- [`UIPSnippetsTitle`](../snippets-title/README.md) – current snippet label display

To declare snippets, see the [Snippet Declaration](../../core/README.md#snippet-declaration).

---
## Display Modes
| Mode | How | Typical Use |
|------|-----|-------------|
| Tabs | Default (no `dropdown-view`) | Desktop / wide layouts |
| Dropdown | `dropdown-view="all"` | Mobile / always compact |
| Responsive | `dropdown-view="(max-width: 768px)"` | Switch to dropdown under breakpoint |

`dropdown-view` accepts any ESL media query expression the design system supports.

Required minimum markup:

### Tabs
```html
<uip-root>
  <uip-snippets class="uip-toolbar"></uip-snippets>
  <uip-preview></uip-preview>
</uip-root>
```
### Always Dropdown
```html
<uip-root>
  <uip-snippets class="uip-toolbar" dropdown-view="all"></uip-snippets>
  <uip-preview></uip-preview>
</uip-root>
```
### Responsive Switch
```html
<uip-root>
  <uip-snippets class="uip-toolbar" dropdown-view="(max-width: 900px)"></uip-snippets>
  <uip-preview></uip-preview>
</uip-root>
```

---
## Toolbar Composition
Combine with other quick‑action plugins inside a wrapper (order = visual order):
```html
<div class="uip-toolbar">
  <uip-snippets dropdown-view="(max-width: 800px)"></uip-snippets>
  <uip-theme-toggle></uip-theme-toggle>
  <uip-dir-toggle></uip-dir-toggle>
</div>
```
You can also use Settings panel attributes (`theme-toggle`, `dir-toggle`) instead of separate toolbar buttons.

---
## Attributes (User-Focused)
| Attribute | Element | Purpose |
|-----------|---------|---------|
| `dropdown-view` | `<uip-snippets>` | Media query (or `all`) enabling dropdown mode |
| `class="uip-toolbar"` | Host wrapper (optional) | Conventional styling hook for header/toolbar layout |

---
## Accessibility
- Tab list exposes appropriate roles when in tab mode
- Dropdown mode renders a native select (or list) for keyboard & screen reader friendly navigation
- Current snippet label provided via `UIPSnippetsTitle`

---
## Troubleshooting
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| No snippets shown | Missing `<template uip-snippet>` children in root | Add at least one snippet before init |
| Wrong default active | Another snippet has `active` or URL hash selects different anchor | Remove extra `active` or update hash |
| Dropdown never appears | Media query invalid | Validate `dropdown-view` expression |

---
