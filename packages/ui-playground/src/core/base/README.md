<a id="uip-plugin"></a>
<a id="uip-root"></a>
<a id="uip-state-model"></a>
<a id="uip-snippet"></a>
<a id="uip-state-storage"></a>
<a id="technical-internals"></a>

# UI Playground Technical Internals (Consolidated)

This document consolidates all internal technical details that were previously split across multiple files
(`plugin.md`, `root.md`, `state-model.md`, `snippet.md`, `state-storage.md`).

Legacy anchors are preserved for backward compatibility:
- `#uip-plugin`, `#uip-root`, `#uip-state-model`

Use the higher-level user guide at `../README.md` for consumer-facing information. This file targets authors
extending or integrating deeply with UI Playground.

---
## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Event Surface](#event-surface)
3. [UIPRoot](#uip-root)
4. [UIPPlugin Base](#uip-plugin)
5. [State Model (UIPStateModel)](#uip-state-model)
6. [Snippet Representation](#uip-snippet)
7. [Persistent State (UIPStateStorage)](#uip-state-storage)
8. [Preview Integration Notes](#preview-integration)
9. [Attribute Mutation API](#attribute-mutation-api)
10. [Lifecycle Timeline](#lifecycle-timeline)
11. [Extensibility & Best Practices](#extensibility)
12. [Performance Considerations](#performance)
13. [Theme & Direction Handling](#theme-and-direction)
14. [Glossary](#glossary)

---
## Architecture Overview
```
<uip-root>
 ├─ Template/script snippet holders (uip-snippet, uip-snippet-js, uip-snippet-note)
 ├─ UIPPreview (required) ← listens to uip:change, snippet switches
 ├─ Plugins (UIPPlugin descendants: editor, settings, list, etc.)
 │    └─ Read model via root.model
 │    └─ Mutate state via setHtml / setJS / changeAttribute / reset
 └─ UIPStateModel (html, js, note, snippet registry, change queue)
       └─ Emits internal events: uip:model:change / uip:model:snippet:change
       └─ Normalization & rendering preprocessors
       └─ Optional UIPStateStorage persistence
```

Flow summary:
1. Plugin triggers a mutation on `UIPStateModel`.
2. Model batches changes (microtask) and fires `uip:model:change`.
3. `UIPRoot` wraps it into `UIPChangeEvent` → `uip:change`.
4. Preview & other plugins react; preview may inline-render or iframe-refresh.
5. Storage saves updated html/js/note if enabled.

---
## Event Surface
| Public Event | Dispatcher | Payload | Purpose |
|--------------|-----------|---------|---------|
| `uip:root:ready` | `UIPRoot` | none | Root initialized, initial snippet applied. |
| `uip:change` | `UIPRoot` | `UIPChangeEvent` | Batched state change (html/js/note). |
| `uip:snippet:change` | `UIPRoot` | `{ detail: UIPStateModel }` | Active snippet changed. |
| `uip:theme:change` | `UIPRoot` | `{ detail: boolean }` | `dark-theme` toggled. |
| `uip:dirchange` | `UIPPreview` | none | `dir` attribute updated on preview. |

Internal (do not rely externally unless extending core):
- `uip:model:change` (target: `UIPStateModel`)
- `uip:model:snippet:change` (target: `UIPStateModel`)

`UIPChangeEvent` convenience API:
- `changes: UIPChangeInfo[]`
- `force: boolean`
- `jsChanges / htmlChanges`
- `isOnlyModifier(modifier)`

---
## UIPRoot
Responsibilities:
- Collect snippet template/script holders.
- Resolve initial active snippet (URL hash > explicit `active` > first).
- Expose shared `model` (memoized instance of `UIPStateModel`).
- Mediate internal model events → stable public events.
- Manage theme (`dark-theme` attribute) & optionally persistence via `store-key`.

Attributes:
| Attribute | Type | Meaning |
|-----------|------|---------|
| `dark-theme` | boolean | Dark UI theme state. Emits `uip:theme:change`. |
| `store-key` | string | Enables persistence storage namespace. |
| `ready` | boolean (readonly) | Set true after initial snippet applied. |

Getters / Properties:
- `model: UIPStateModel` (memoized)
- `$snippets: UIPSnippetTemplate[]` raw DOM snippet holders
- `storage?: UIPStateStorage` active only if `store-key` present

Lifecycle key points:
1. Connect → optionally construct storage.
2. Assign `model.snippets`.
3. Apply current snippet (`anchor` > `active` > index 0).
4. Mark `ready` and dispatch `uip:root:ready`.
5. Scroll into view if anchor-based activation.
6. Disconnect → clear model snippets.

---
## UIPPlugin
Abstract base for all plugins.

Key features:
- Adds `uip-plugin` class on connect.
- Provides `$root` memoized reference via traversing query in `root` attribute.
- Provides `model` getter delegating to `$root.model`.

Attributes:
| Attr | Default | Purpose |
|------|---------|---------|
| `label` | '' | Human-readable label, mirrored to `aria-label`. |
| `root` | `::parent(uip-root)` | Traversal query to resolve nearest root. |

Overridable hooks: standard CustomElement lifecycle plus attribute changes.

Recommended event subscription pattern:
```ts
@listen({event: 'uip:change', target: (that: MyPlugin) => that.$root})
_onChange(e: UIPChangeEvent) { /* react */ }
```

Guidelines:
- Always pass `this` as modifier in model mutations for self-change filtering.
- Avoid direct DOM mutation of preview output; use state model.
- Use microtask batching naturally (multiple sequential mutations collapse into one event).

---
## UIPStateModel
State container for: current html/js/note, snippet registry, and batched change metadata.

Public getters:
| Getter | Type | Notes |
|--------|------|-------|
| `html` | string | Current normalized HTML inner markup. |
| `js` | string | Current normalized JS. |
| `note` | string | Current normalized note content. |
| `snippets` | `UIPSnippetItem[]` | All snippet wrappers. |
| `activeSnippet` | `UIPSnippetItem?` | Active snippet wrapper. |
| `anchorSnippet` | `UIPSnippetItem?` | Snippet resolved by URL hash. |

Mutation API:
| Method | Purpose |
|--------|---------|
| `setHtml(markup, modifier, force?)` | Update current HTML (optional full refresh flag). |
| `setJS(js, modifier)` | Update JS (forces preview rebuild when isolated). |
| `setNote(text, modifier)` | Update note. |
| `changeAttribute(cfg)` | Batch attribute updates across selected nodes. |
| `getAttribute(selector, attr)` | Collect attribute values from live HTML mirror. |
| `reset(source, modifier)` | Reset `html` or `js` to original snippet content. |
| `applySnippet(snippet, modifier)` | Switch active snippet; fires snippet change event. |
| `applyCurrentSnippet(modifier)` | Helper to choose resolved active snippet.
| `isHTMLChanged()` / `isJSChanged()` | Compare current edited vs original snippet. |

Batching: `_changes` array collects metadata; `dispatchChange` (microtask) flushes once per tick.

Change attribution: `modifier` object allows plugins to ignore self-generated updates (`e.isOnlyModifier(this)`).

Normalization:
- HTML: extracts `<style>` tags from `<head>` and injects at top of body (reverse order).
- JS / Note: passes through configured preprocessors (e.g., trimming, indentation fixes).

---
## Snippet Representation
A snippet comprises:
- Template or script element marked `uip-snippet` (HTML body)
- Optional JS container: `<script type="text/plain" id="..." uip-snippet-js>` referenced by ID attribute on template
- Optional note container: `<script type="text/plain" id="..." uip-snippet-note>`

Snippet attributes:
| Attr | Meaning |
|------|---------|
| `label` | Display name. |
| `active` | Preferred initial active snippet if no anchor. |
| `anchor` | Deep link slug (#hash). |
| `uip-snippet-js` | ID of JS source holder. |
| `uip-snippet-note` | ID of note holder. |
| `uip-isolated` | Forces iframe rendering. |
| `isolated-template` | Named template key for iframe HTML wrapper. |
| `uip-js-readonly` | Disables JS editing (auto true if not isolated). |

`UIPSnippetItem` exposes memoized getters: `html`, `js`, `note`, `isolated`, `isolatedTemplate`, `label`, `anchor`, `active (get/set)`, `isJsReadonly`.

Activation priority: URL hash > element with `active` > first snippet.

---
## Persistent State (UIPStateStorage)
Optional layer keyed by combination of `store-key` + original snippet HTML to avoid collisions after snippet content updates.

Key characteristics:
| Aspect | Description |
|--------|-------------|
| Storage bucket | `localStorage['uip-editor-storage']` JSON map |
| Entry schema | `{ ts, snippets }` where `snippets` holds serialized `{ js, html, note }` |
| Expiration | 12 hours (entry dropped on access if stale) |
| Load trigger | `uip:model:snippet:change` |
| Save trigger | `uip:model:change` |

Public methods: `loadState()`, `saveState()`, `resetState(source)`.

Reset flow invalidates entry then calls `model.reset(source, this)`.

---
## Preview Integration
Preview listens to `uip:change` and renders HTML either inline or via iframe for isolated snippets.

Isolated mode distinctions:
- Full refresh scenarios: snippet switch (`force`), `force-update` attribute, explicit `force` flag in `setHtml` call.
- Incremental update: modifies existing iframe body root content.
- Resize loop: rAF-based content height mirroring (gated by intersection visibility & `resizeLoop` flag).

For user-focused behaviors (attributes & usage) see `../preview/README.md`.

---
## Attribute Mutation API
`changeAttribute(cfg: ChangeAttrConfig)` enables structured modifications within the current HTML mirror without reparsing full markup.

`ChangeAttrConfig`:
```ts
{
  target: string;          // CSS selector
  attribute: string;       // Attribute to set/toggle
  modifier: object;        // Initiator (plugin instance)
} & (
  { value: string | boolean } | { transform: (current: string | null) => string | boolean | null }
);
```

Semantics:
- Boolean results from `transform` set/remove attribute presence.
- `null` result leaves attribute untouched for that element.
- Pushes an `html` change entry and schedules batched dispatch.

---
## Lifecycle Timeline
1. **DOM Construction**: Snippet templates and plugin elements appended inside `<uip-root>`.
2. **Root Connected**: Storage (optional) created; snippet collector runs.
3. **Initial Snippet Apply**: Model populated, events batched → `uip:root:ready`.
4. **User Interaction**: Plugins mutate model; preview & others update.
5. **Snippet Switch**: `applySnippet` sets html/js/note and triggers refresh logic.
6. **Disconnect**: Root clears snippet registry (preventing stale mutations).

---
## Extensibility & Best Practices <a id="extensibility"></a>
| Goal | Recommendation |
|------|---------------|
| Add new tool panel | Extend `UIPPlugin` or existing panel abstraction; subscribe to `uip:change`. |
| Apply style variants | Use root-level theme class toggles; avoid inline style mutations of preview DOM. |
| Track self vs external changes | Use `e.isOnlyModifier(this)` on `uip:change`. |
| Complex multi-step edits | Chain model mutations sequentially; rely on microtask batching. |
| Undo/redo | Maintain external stack keyed off `UIPChangeEvent.changes`. |
| Large snippet sets | Lazy inject snippet templates before they are needed; then re-run snippet assignment if dynamic. |

Avoid:
- Direct `innerHTML` writes to preview output outside model (causes divergence).
- Long-running synchronous processors (blocks microtask flush & UI responsiveness).

---
## Performance Considerations <a id="performance"></a>
- Microtask batching ensures multiple rapid mutations group into one paint-impacting cycle.
- Iframe resize loop stops when preview scrolled out (intersection gating) minimizing layout thrash.
- Normalization pre-processors should remain O(n) and stateless; customize sparingly.
- Attribute changes via `changeAttribute` avoid serializing full markup string repeatedly.

---
## Theme & Direction Handling <a id="theme-and-direction"></a>
| Concern | Mechanism |
|---------|-----------|
| Dark mode | Toggle `dark-theme` attribute on `<uip-root>` → event consumers can react (`uip:theme:change`). |
| Text direction | Set `dir` on `<uip-preview>` (mirrors to inner container) → `uip:dirchange`. |

Plugins should prefer CSS variables / contextual classes over inline style rewrites for theme adjustments.

---
## Glossary <a id="glossary"></a>
| Term | Meaning |
|------|--------|
| Snippet | Self-contained example (HTML + optional JS + note). |
| Isolated Snippet | Snippet rendered inside an iframe sandbox. |
| Modifier | Object passed to model mutation APIs to identify change origin. |
| Force Refresh | A change requiring full iframe rebuild (e.g., snippet switch). |
| Storage Key | User-provided namespace enabling persistence. |

---
## Migration Notes
All previous per-topic markdown files now redirect here. External links will continue working via legacy anchors. For the user-facing overview see `../README.md`.

---
Return to the [User Overview](../README.md) or inspect the [Preview User Guide](../preview/README.md).
