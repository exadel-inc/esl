# AGENTS.md — ESL (Exadel Smart Library) Codebase Guide

## Architecture Overview

**ESL** is an Nx-managed monorepo of TypeScript + LESS web-component packages:

| Package | Path | Purpose | Published |
|---|---|---|---|
| `@exadel/esl` | `packages/esl` | Core web-components library | ✓ |
| `@exadel/ui-playground` | `packages/ui-playground` | Real-time code preview widget | ✓ |
| `@exadel/eslint-config-esl` | `packages/eslint-config` | Shared ESLint config | ✓ |
| `@exadel/stylelint-config-esl` | `packages/stylelint-config` | Shared Stylelint config | ✓ |
| `esl-website` | `packages/esl-website` | 11ty + webpack demo site | — internal |
| `esl-website-e2e` | `packages/esl-website-e2e` | Playwright snapshot tests | — internal |

### Core Library Component Structure (`packages/esl/src/<component>/`)
Each component — whether a custom tag (`ESLBaseElement`) or a custom attribute mixin (`ESLMixinElement`) — follows this layout:
```
esl-<name>/
  core.ts          # Public re-export barrel (only file consumers import)
  core.less        # Component styles (custom tags only)
  core/            # Implementation files
    esl-<name>.ts
    esl-<name>.shape.ts   # Tag/attribute shape (JSX typings)
  test/            # *.test.ts unit tests
```
The `core.ts` barrel is the **only** public entry — never import from `core/` subdirectory directly.

### Inheritance Chain
Custom tags: `HTMLElement` → `ESLBaseElement` (`esl-base-element`) → `ESLToggleable` → specific components (Panel, Popup, Alert, …)

Custom attribute mixins: `ESLMixinElement` (`esl-mixin-element`) → specific mixins (AnimateMixin, OpenState, …)

Both base classes auto-subscribe decorated `@listen` event listeners on `connectedCallback` and unsubscribe on `disconnectedCallback` via `ESLEventUtils`.

### Build Output
TypeScript + LESS sources in `src/` compile to `modules/` (gitignored, published). Build runs three parallel sub-tasks: `build:ts`, `build:less`, `build:docs`.

---

## Design Philosophy

ESL is a **base library** — every addition is weighed against binary size, runtime cost, and readability. Prefer compact, efficient implementations over clever abstractions; keep code approachable for downstream consumers who will read it.

---

## Key Developer Commands

```bash
npm i                                     # install (Node ≥22, npm ≥11)
npm run start                             # dev server at :3005 (esl-website)
npm run build                             # build all packages via Nx
npm run build --workspace=esl             # build only the core library
npm run test                              # type-check + vitest (all packages)
npm run lint                              # ESLint + Stylelint (all packages)
npm run pack                              # create tarballs → target/*.tgz
npm run test:e2e                          # Playwright snapshot tests
npm run test:e2e:update                   # update Playwright snapshots
```
> Nx caches task outputs — re-running `build` + `test` before a push is fast if nothing changed.

---

## Naming Conventions (enforced by ESLint)

- `_privateMember` — private class fields/methods (including event listeners like `_onSomeEvent`)
- `__privateState__` — utility/core-internal private state
- `$domElement` — class property or accessor holding a DOM element
- `_$element` — private DOM-holding property
- `UPPER_SNAKE_CASE` — true constants
- Special notations apply to **class members and global vars only** — not local variables

---

## Base Component Types

ESL has **two** base component classes with a nearly identical API:

| | `ESLBaseElement` | `ESLMixinElement` |
|---|---|---|
| Concept | Custom tag (`HTMLElement` subclass) | Custom attribute — attaches to an existing host element |
| Registration | `customElements.define` via `register()` | `ESLMixinRegistry` via own `register()` |
| Host reference | `this` (the element itself) | `this.$host` (the element the attribute is on) |
| Lifecycle | standard `connectedCallback` / `disconnectedCallback` | same names, triggered by attribute presence |

Both expose the same **`$$`-shortcut** API for day-to-day use inside component code:

| Shortcut | Delegates to |
|---|---|
| `$$on` / `$$off` | `ESLEventUtils.subscribe` / `unsubscribe` |
| `$$fire` | `ESLEventUtils.dispatch` |
| `$$cls` | `CSSClassUtils.has` / `toggle` |
| `$$attr` | `setAttr` helper |
| `$$find` / `$$findAll` | `ESLTraversingQuery.first` / `all` |
| `$$error` | default `@safe` error logger |

> **`static is` override is legacy.** Changing a registered component's `is` after `register()` breaks at minimum CSS class binding (base class adds `this.baseTagName` as a CSS class on connect). Don't override `is` on already-registered classes.

---

## esl-utils

`packages/esl/src/esl-utils/` is a self-contained toolkit consumed by every component. Check here before writing custom helpers:

- `decorators/` — TS decorators (see below)
- `dom/` — `attr`, `events` (`ESLEventUtils`), `class` (`CSSClassUtils`), `scroll`, `focus`, …
- `async/` — `debounced`, `throttled`, `promisified`, `delayed` task helpers
- `misc/` — format/parse helpers, object utils
- `environment/` — feature-detection, `ExportNs` decorator for namespace exports
- `abstract/` — shared interfaces (`ESLBaseComponent`, `ESLDomElementRelated`)

---

## TypeScript Decorators

All decorators live in `packages/esl/src/esl-utils/decorators/` and are imported from `@exadel/esl/modules/esl-utils/decorators`:

| Decorator | Purpose |
|---|---|
| `@attr` | Map property ↔ HTML / `data-*` attribute (with parsing, serialization, default, inheritance) |
| `@boolAttr` | Boolean presence attribute (`true` = attribute exists) |
| `@jsonAttr` | JSON attribute ↔ object mapping |
| `@prop` | Prototype-level static or provider-backed property; used to redeclare `@attr` in subclasses |
| `@listen` | Declarative event listener — auto-subscribed on `connectedCallback`, removed on `disconnectedCallback` |
| `@bind` | Lazy per-instance method binding (avoids constructor arrow overhead) |
| `@decorate` | Wrap a method with any HOF (e.g. `debounce`) lazily per instance |
| `@memoize` | Cache getter/method result; supports custom hash and manual cache clearing |
| `@ready` | Defer execution until the DOM is ready (`DOMContentLoaded`) and the next task |
| `@safe` | Wrap method/getter with `try/catch`; calls `$$error` on failure |

---

## esl-event-listener

The event system (`packages/esl/src/esl-event-listener/`) is a first-class citizen used **everywhere** in the library. It is much more capable than raw DOM `addEventListener`.

### `@listen` descriptor keys

```ts
class Example extends ESLBaseElement {
  @listen({
    event: 'click',                         // one or more space-separated event types
    target: '::parent',                     // string TraversingQuery, EventTarget, or PropertyProvider
    selector: 'button.action',              // CSS selector for event delegation (e.$delegate on the event)
    condition: (that) => that.enabled,      // boolean or PropertyProvider — skip subscription if false
    once: true,                             // auto-unsubscribe after first call
    capture: true,                          // use capture phase
    passive: false,                         // passive by default for wheel/touch events
    group: 'my-group',                      // logical group for bulk unsubscribe
    auto: false,                            // false = manual subscription only (default for @listen is true)
  })
  _onClick(e: DelegatedEvent<MouseEvent>) { /* ... */ }
}
```

`target` accepts: a `TraversingQuery` string (`'::parent'`, `'window'`, `'#id::find(.btn)'`), a direct `EventTarget` reference, or any ESL synthetic `EventTarget` (incl. `ESLMediaQuery`). For dynamic values use `PropertyProvider`: `target: (host) => host.$container`.

Unsubscribing never requires the original callback — use event name, handler reference, or group:
```ts
this.$$off('click');                      // by event type
this.$$off(this._onClick);               // by handler
ESLEventUtils.unsubscribe(host, {group: 'my-group'});  // by group
```

### Synthetic EventTarget adapters (built-in)

| Adapter | Factory | Synthetic event | Notes |
|---|---|---|---|
| `ESLDecoratedEventTarget` | `.for(target, decorator, ...args)` | same as original | Wraps any target with debounce / throttle; result is **cached** |
| `ESLResizeObserverTarget` | `.for(el)` | `resize` | `ResizeObserver` as `EventTarget`; singleton per element |
| `ESLSwipeGestureTarget` | `.for(el, settings?)` | `swipe` | pointer-based swipe detection; `threshold`, `timeout` settings |
| `ESLWheelTarget` | `.for(el, settings?)` | `longwheel` | inertial / long wheel detection; `distance`, `timeout` settings |
| `ESLIntersectionTarget` | `.for(el, settings?)` | `intersection` | `IntersectionObserver` as `EventTarget`; event implements `IntersectionObserverEntry` |

```ts
class Example extends ESLBaseElement {
  // throttle window scroll per 250 ms — shared cached instance
  @listen({event: 'scroll', target: ESLDecoratedEventTarget.for(window, throttle, 250)})
  _onScroll() {}

  // react to element resize
  @listen({event: 'resize', target: (host) => ESLResizeObserverTarget.for(host.$container)})
  _onResize() {}

  // swipe gesture on host element
  @listen({event: 'swipe', target: (host) => ESLSwipeGestureTarget.for(host)})
  _onSwipe() {}
}
```

---

## Universal Syntactic Utilities

These are used **across virtually every component** — learn them to read ESL component code fluently:

- **`ESLTraversingQuery`** (`esl-traversing-query`) — extended CSS selector engine. Supports `::parent`, `::next`, `::prev`, `#id::find(selector)`, and other relative traversal tokens. Used wherever a component accepts a target selector (e.g. `target`, `container` attributes).
- **`ESLMediaQuery` + `ESLMediaRuleList`** (`esl-media-query`) — reactive responsive conditions. `ESLMediaRuleList` parses attribute values like `"default | @xs => sm"` into a list of media-conditional rules. Powers breakpoint-aware attributes in most components.
- **`CSSClassUtils`** (`esl-utils/dom/class`) — CSS class utility used by `$$cls` and several components. Supports space-separated class tokens, `!cls` inversion in the low-level API, and locker-aware class state management.

---

## Code Patterns

### Component Registration
Every `ESLBaseElement` / `ESLMixinElement` subclass declares a `static is` (tag or attribute name) and calls `register()`. `is` must be set **before** `register()` is called — either inside the class body (preferred) or as an assignment immediately before the call:

```ts
export class MyElement extends ESLBaseElement {
  static override is = 'my-element';
  // ...
}
MyElement.register();
```

**Do not mutate `is` on ESL's own built-in components** (`ESLPanel`, `ESLToggleable`, `ESLLineClamp`, etc.) — they carry their own styles and internal expectations tied to their tag name. If you need a customised variant, subclass it and give the subclass its own `is`:

```ts
class MyPanel extends ESLPanel {
  static override is = 'my-panel'; // owns its own styles; won't pollute the global ESLPanel
}
MyPanel.register();
```

See [`skills/esl-core.md`](./skills/esl-core.md) and [`skills/esl-review.md`](./skills/esl-review.md) for consumer-focused AI assistant guidance on ESL usage and review.

### Event Listeners
Use the `@listen` decorator (from `esl-event-listener`) instead of manual `addEventListener`; the base class handles subscribe/unsubscribe lifecycle automatically.

### Imports
Prefer **named exports**; default exports are avoided. ESL is tree-shakable — consumers import individual `core.ts` barrels, not `all.ts`.

---

## Commit Convention (commitlint enforced)

Format: `<type>(<scope>): <subject>` — subject in imperative, lowercase, no trailing dot.

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `revert`, `style`, `ci`, `perf`  
Breaking change: append `!` to type → `feat!(esl-panel): …`

---

## Website & Templates

- Demo site uses **11ty** (Eleventy) + **Nunjucks** (`.njk`) templates in `packages/esl-website/views/`.
- 11ty plugins: any `*.js` in `packages/esl-website/11ty/` is auto-loaded; files prefixed `_*.js` are skipped.
- Scripts/styles for the site are bundled via **webpack** (`packages/esl-website/webpack.config.js`).

---

## AI Skills for ESL Consumers

Self-contained skill files for projects that **use** `@exadel/esl` (not develop it).
Each file is independent — copy relevant ones into your project's AI config.

### Available skills (`skills/`)

| File | When to use |
|---|---|
| [`skills/esl-core.md`](./skills/esl-core.md) | Writing or reviewing ESL consumer code with the main mental model of base classes, decorators, traversal, events, and media APIs |
| [`skills/esl-review.md`](./skills/esl-review.md) | Reviewing ESL consumer code for host model, imports, lifecycle, decorators, events, and responsive patterns |

### How to use in your project

Copy relevant files into your AI configuration:
```text
# Cursor
.cursor/rules/esl-core.md

# Windsurf / other agents using .ai/rules
.ai/rules/esl-core.md

# GitHub Copilot
.github/copilot-instructions.md  (append content)

# Any agent supporting AGENTS.md
AGENTS.md  (append or reference)
```

---

## Key Reference Files

- `packages/esl/src/esl-base-element/core/esl-base-element.ts` — root base class
- `packages/esl/src/esl-event-listener/` — event listener decorator system
- `packages/esl/src/esl-utils/` — shared DOM, async, and decorator utilities
- `packages/esl/src/esl-toggleable/` — toggleable base for Panel, Popup, Alert
- `packages/esl/src/all.ts` / `all.less` — full library bundle entry points
- `docs/CODE_CONVENTIONS.md` — naming rules
- `docs/COMMIT_CONVENTION.md` — commit message rules
- `docs/DEVELOPMENT.md` — full dev setup guide
