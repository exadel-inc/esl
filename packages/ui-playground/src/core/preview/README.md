# UIPPreview

User-facing live rendering area of the playground. It shows the currently selected snippet’s markup (and runs its JS when isolated). This document focuses on usage and light customization. For deep internal details see the [Technical Internals](../base/README.md#preview-integration).

---
## What It Does
- Displays the active snippet instantly (inline mode)
- Optionally sandboxes a snippet inside an iframe for style/script isolation (`uip-isolated` on the snippet)
- Automatically updates when you switch snippets or edit code
- Can adapt to right‑to‑left layout testing (`dir` attribute)
- Smoothly resizes to fit content (when configured)

Only one preview element is required per `<uip-root>` and it must be present for the playground to work.

Required minimum markup:

```html
<uip-root>
  <template uip-snippet label="Inline" active>
    <p>Hello inline world</p>
  </template>
  <template uip-snippet label="Isolated" uip-isolated>
    <style>.box{padding:8px;background:#eee}</style>
    <div class="box">Iframe content</div>
  </template>
  <uip-preview></uip-preview>
</uip-root>
```

Switch between snippets with a snippets list plugin or by adding `anchor` to a snippet and navigating via URL hash.

---
## Inline vs Isolated Rendering
| Mode | How to Get It | When to Use | Pros | Trade‑offs |
|------|---------------|------------|------|------------|
| Inline | Default (no `uip-isolated`) | Normal component examples | Fast, shared styles | Global CSS/JS can leak across snippets |
| Isolated | `uip-isolated` on snippet template | Complex styles, global resets, script side‑effects | Full sandbox, predictable | Slight delay, iframe overhead |

Most snippets should stay inline. Use isolation when demonstrating global CSS, shadow resets, or when you need a clean DOM each refresh.

---
## Common Attributes & Options
| Target | Attribute / Prop | Purpose | Typical Value |
|--------|------------------|---------|---------------|
| `<uip-preview>` | `dir` | Switch text direction for preview content | `rtl` or `ltr` |
| `<uip-preview>` | `resizable` (if panelized) | Allow user to resize preview panel (layout theme dependent) | present / absent |
| `<uip-preview>` | `force-update` | Force the next update to rebuild isolated iframe fully | boolean |
| `<uip-preview>` | `refresh-delay` | Delay (ms) before showing rebuilt isolated iframe | `150` |
| `<template uip-snippet>` | `uip-isolated` | Requests isolated iframe mode | present |
| `<template uip-snippet>` | `isolated-template` | Named HTML shell for iframe rendering | e.g. `default` |

Most user projects will only set `dir` occasionally and rely on snippet attributes for isolation.

---
## Attributes & Properties (Expanded)
| Attribute / Prop | Type | Default | Applies To | Effect |
|------------------|------|---------|-----------|--------|
| `dir` | string | inherited | `<uip-preview>` | Direction of rendered snippet content (LTR/RTL) |
| `force-update` | boolean | false | `<uip-preview>` | Forces full iframe rebuild on next change (isolated mode) |
| `refresh-delay` | number | 150 | `<uip-preview>` | Delay (ms) before showing rebuilt iframe to reduce flicker |
| `resizable` | boolean | false | panel wrapper variant | Enables user resize handle (theme/layout dependent) |

---
## Events
| Event | Target | When |
|-------|--------|------|
| `uip:dirchange` | `<uip-preview>` | `dir` attribute mutated (manual or plugin) |
| `uip:change` | `<uip-root>` | Underlying state changed (HTML/JS/Note) – preview listens |
| `uip:snippet:change` | `<uip-root>` | Active snippet switched (always implies preview update) |

---
## Advanced Customization
You can specify a named HTML shell for isolated snippets via `isolated-template` on the snippet. Provide a corresponding `<template>` in the document (or injected by your build) that includes `<!--uip-content-->` placeholder where snippet HTML will be injected.

```html
<!-- Global template definition (once per page) -->
<template id="uip-iso-default">
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>UIP Isolated</title>
  <link rel="stylesheet" href="/playground-shared.css" />
</head>
<body>
  <main class="preview-wrapper"><!--uip-content--></main>
</body>
</html>
</template>

<!-- Snippet referencing the template -->
<template uip-snippet label="Styled" uip-isolated isolated-template="uip-iso-default">
  <div class="card">Card with shared isolated shell styles</div>
</template>
```
If `isolated-template` is absent a built‑in minimal HTML shell is used.

---
## Using Preprocessors

UIPPreview supports built-in preprocessors for text and content generation. These preprocessors allow you to dynamically generate content such as text, paragraphs, or other elements within your snippets.
```html
<script type="text/html" uip-snippet-js="snippet-js-1" uip-snippet uip-resizable label="Text preprocessors example">
  <h2><!-- text --></h2>
  <div class="text">
    Hello text
    <!-- paragraph x2 -->
  </div>
  <button type="button">
    <!-- text x5 -->
  </button>
</script>
```

---
## Patterns & Tips
| Goal | Pattern |
|------|---------|
| Avoid flicker on heavy isolated snippet rebuilds | Increase `refresh-delay` slightly (200–250ms) |
| Force rebuild after large structural HTML edit | Temporarily set `force-update` attribute or call `setHtml(..., modifier, true)` |
| Start in RTL for all snippets | Add `dir="rtl"` to `<uip-preview>` or root page element |
| Combine with Settings for layout toggles | Bind a setting to preview wrapper classes instead of editing snippet HTML |
| Use preprocessors for dynamic content | Add `<!-- text -->` or `<!-- paragraph xN -->` in your snippet to generate content dynamically. |

---
## Performance Notes
- Inline mode minimal overhead: only inner DOM diff replaced via full string set; attribute mutations use model utilities instead of manual DOM edits.
- Isolated mode caches iframe until a force scenario; minor HTML edits patch body unless a rebuild is required (snippet switch / forced update / isolated mode transition).
- Avoid embedding large external scripts in isolated snippets if rapid switching is expected; pre‑load resources globally when feasible.

---
## Working with Edits
If you include the editor plugin, updating HTML or JS:
1. Updates the internal state model
2. Triggers a single batched refresh
3. Rerenders preview (inline or isolated variant)

Isolated mode may hide updated content until the internal refresh delay elapses; this prevents visible flicker during iframe rebuild.

---
## Resetting the Preview
Use the reset plugin (`<uip-reset>`) or remove persisted state (`store-key`) to revert edited HTML/JS back to the original snippet source.

---
## Light Customization Patterns
| Goal | Approach |
|------|----------|
| Start in RTL | Add `dir="rtl"` to `<uip-preview>`. |
| Disable sandbox for a snippet | Remove `uip-isolated`. |
| Ensure clean script execution each snippet switch | Mark snippet with `uip-isolated`. |
| Force full reload after significant HTML change | Set `force-update` temporarily or call `setHtml(..., modifier, true)` from a custom plugin. |
| Remove resizing affordance | Omit `resizable` attribute (or don’t use a panel wrapper). |

---
## Troubleshooting (User-Focused)
| Symptom | Cause | Fix |
|---------|-------|-----|
| Content doesn’t reflect edits | Editor/plugin not mounted or edits bypass model | Ensure `<uip-editor>` present or mutate via provided UI. |
| Flicker on big changes | Inline mode + heavy global CSS reflow | Use `uip-isolated` to sandbox. |
| Iframe stays blank briefly | Isolation refresh delay | Lower `refresh-delay` attribute or avoid force update. |
| Unexpected scrollbars | Large content + no resizing style adjustments | Add your own container CSS or enable panel resizing. |

---
## Going Deeper
Need to script dynamic updates or build a custom preview-like plugin? See:
- [State Model Internals](../base/README.md#uip-state-model)
- [Snippet Representation](../base/README.md#uip-snippet)
- [Preview Integration Details](../base/README.md#preview-integration)

These sections cover batching, change attribution, and the rendering lifecycle.

