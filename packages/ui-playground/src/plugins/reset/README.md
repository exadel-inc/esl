# UIP Reset

**UIPReset** – button plugin that restores the currently active snippet's HTML and/or JS (and note) back to its original source.

Works with or without persistence (`store-key`). When persistence is active it also clears the cached edited state for that snippet.

---
## When to Use
Use the reset control whenever you allow live editing (Editor / Settings) and want a quick way to revert user changes.

---
## Minimal Usage
```html
<uip-root store-key="demo">
  <template uip-snippet label="Basic" active>
    <button class="btn">Click</button>
  </template>
  <uip-preview></uip-preview>
  <uip-editor copy></uip-editor>
  <uip-reset></uip-reset>
</uip-root>
```

### With Toolbar Grouping
```html
<uip-root>
  <div class="uip-toolbar">
    <uip-snippets></uip-snippets>
    <uip-reset></uip-reset>
  </div>
  <uip-preview></uip-preview>
</uip-root>
```

---
## Behavior
| Action | Result |
|--------|--------|
| Click Reset (inline snippet) | Replaces edited HTML in place; JS restored if edited |
| Click Reset (isolated snippet) | Forces iframe rebuild with original content |
| Persistence enabled | Clears stored edited state entry for the active snippet |

If no changes were made the button is still operable; state just re-syncs.

---
## Accessibility
Button carries an accessible label (localized / attribute driven depending on build). You may wrap it in a toolbar container for grouped navigation semantics.

---
## Styling
Uses standard playground button styling; override via CSS:
```css
uip-reset { /* custom styles */ }
```

---
## Related
| Goal | Plugin |
|------|--------|
| Copy edited code | `uip-copy` |
| Edit code | `uip-editor` |
| Change attributes | `uip-settings` |

---
Return to the [Core Concepts](../../core/README.md) or see [Editor](../editor/README.md).

