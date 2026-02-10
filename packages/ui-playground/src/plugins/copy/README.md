# UIP Copy

**UIPCopy** - button plugin to copy the current snippet (HTML + optionally JS) to the clipboard.

Can appear standalone in a toolbar or be enabled inside the Editor via the `copy` attribute.

The plugin can be added to the [UIP Editor](../editor/README.md) toolbar header via attribute `copy`.
**UIPCopy** dispatches a success alert / message on completion.

---
## Minimal Example (Editor Toolbar)
```html
<uip-root>
  <uip-preview></uip-preview>
  <uip-editor copy></uip-editor>
</uip-root>
```

## Standalone Toolbar Button
```html
<uip-root>
  <div class="uip-toolbar">
    <uip-snippets></uip-snippets>
    <uip-copy></uip-copy>
  </div>
  <uip-preview></uip-preview>
</uip-root>
```

---
## Behavior
| Action | Result |
|--------|--------|
| Click copy (inline) | Copies current HTML (and JS if present) |
| Click copy (isolated) | Same – underlying stored sources are used |

JS included only if a snippet JS source exists.

---
## Related
| Goal | Plugin |
|------|--------|
| Reset changes | `uip-reset` (../reset/README.md) |
| Edit code | `uip-editor` (../editor/README.md) |

Return to [Core Concepts](../../core/README.md).
