# AGENTS.md — ESL (Exadel Smart Library) Codebase Guide

## Architecture Overview

**ESL** is an Nx-managed monorepo of TypeScript + LESS web-component packages:

| Package | Path | Purpose |
|---|---|---|
| `@exadel/esl` | `packages/esl` | Core web-components library |
| `@exadel/ui-playground` | `packages/ui-playground` | Real-time code preview widget |
| `esl-website` | `packages/esl-website` | 11ty + webpack demo site |
| `esl-website-e2e` | `packages/esl-website-e2e` | Playwright snapshot tests |
| `@exadel/eslint-config-esl` | `packages/eslint-config` | Shared ESLint config |
| `@exadel/stylelint-config-esl` | `packages/stylelint-config` | Shared Stylelint config |

### Core Library Component Structure (`packages/esl/src/<component>/`)
Each component follows this layout:
```
esl-<name>/
  core.ts          # Public re-export barrel (only file consumers import)
  core.less        # Component styles
  core/            # Implementation files
    esl-<name>.ts
    esl-<name>.shape.ts   # Tag shape (JSX/Nunjucks typings)
  test/            # *.test.ts unit tests
```
The `core.ts` barrel is the **only** public entry — never import from `core/` subdirectory directly.

### Inheritance Chain
`HTMLElement` → `ESLBaseElement` (`esl-base-element`) → `ESLToggleable` → specific components (Panel, Popup, Alert, …)

`ESLBaseElement` auto-subscribes decorated `@listen` event listeners on `connectedCallback` and unsubscribes on `disconnectedCallback` via `ESLEventUtils`.

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
| `@ready` | Defer execution until the component reaches its "ready" lifecycle point |
| `@safe` | Wrap method/getter with `try/catch`; calls `$$error` on failure |

---

## esl-event-listener

The event system (`packages/esl/src/esl-event-listener/`) is a first-class citizen used **everywhere** in the library. It is much more capable than raw DOM `addEventListener`.

### `@listen` descriptor keys

```ts
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
_onClick(e: DelegatedEvent<MouseEvent>) { ... }
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
// throttle window scroll per 250 ms — shared cached instance
@listen({event: 'scroll', target: ESLDecoratedEventTarget.for(window, throttle, 250)})
_onScroll() {}

// react to element resize
@listen({event: 'resize', target: (host) => ESLResizeObserverTarget.for(host.$container)})
_onResize() {}

// swipe gesture on host element
@listen({event: 'swipe', target: (host) => ESLSwipeGestureTarget.for(host)})
_onSwipe() {}
```

---

## Universal Syntactic Utilities

These are used **across virtually every component** — learn them to read ESL component code fluently:

- **`ESLTraversingQuery`** (`esl-traversing-query`) — extended CSS selector engine. Supports `::parent`, `::next`, `::prev`, `#id::find(selector)`, and other relative traversal tokens. Used wherever a component accepts a target selector (e.g. `target`, `container` attributes).
- **`ESLMediaQuery` + `ESLMediaRuleList`** (`esl-media-query`) — reactive responsive conditions. `ESLMediaRuleList` parses attribute values like `"default | @xs => sm"` into a list of media-conditional rules. Powers breakpoint-aware attributes in most components.
- **`CSSClassUtils`** (`esl-utils/dom/class`) — CSS class query mini-language that handles `+cls`, `-cls`, `!cls` (toggle) tokens in a single string. Used by `@@cls` shortcut and several attributes.

---

## Code Patterns

### Component Registration
Every ESLBaseElement subclass has a static `is` property (tag name) and must call `ESLBaseElement.register()` (or the component's own `register()`) to define the custom element:
```ts
ESLPanel.is = 'esl-panel';
ESLPanel.register();
```

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

## Key Reference Files

- `packages/esl/src/esl-base-element/core/esl-base-element.ts` — root base class
- `packages/esl/src/esl-event-listener/` — event listener decorator system
- `packages/esl/src/esl-utils/` — shared DOM, async, and decorator utilities
- `packages/esl/src/esl-toggleable/` — toggleable base for Panel, Popup, Alert
- `packages/esl/src/all.ts` / `all.less` — full library bundle entry points
- `docs/CODE_CONVENTIONS.md` — naming rules
- `docs/COMMIT_CONVENTION.md` — commit message rules
- `docs/DEVELOPMENT.md` — full dev setup guide
