# Skill: Creating a Custom Attribute (Mixin) with ESLMixinElement

**When to use:** You need to **attach behavior to an existing element via a custom attribute** — without
introducing a new tag. Multiple mixins can coexist on the same element.

```html
<!-- custom tag (ESLBaseElement) -->
<my-element my-label="hello"></my-element>

<!-- mixin (ESLMixinElement) — attaches to any existing element -->
<div my-mixin-attr my-label="hello"></div>
```

**Import path:** `@exadel/esl/modules/esl-mixin-element/core`

---

## Minimal template

```ts
import {ESLMixinElement} from '@exadel/esl/modules/esl-mixin-element/core';
import {attr, boolAttr, jsonAttr, listen, ready} from '@exadel/esl/modules/esl-utils/decorators';

export class MyMixin extends ESLMixinElement {
  /** Activation attribute name. Must contain a dash. */
  static override is = 'my-mixin';

  /** Additional attributes to observe beyond the primary `is` attribute */
  static override observedAttributes = ['my-label'];

  // --- Attribute-mapped properties (on $host element) ---

  /** Maps to <... my-label="..."> on the host element */
  @attr({defaultValue: ''}) public myLabel: string;

  /** Maps to <... active> boolean attribute on the host element */
  @boolAttr() public active: boolean;

  /** Maps to JSON in <... my-config='{"speed":200}'> */
  @jsonAttr({defaultValue: {}}) public myConfig: Record<string, unknown>;

  // --- Lifecycle ---

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback(); // required — subscribes @listen decorators, starts attribute observation
    // your init logic here
  }

  @ready
  protected override disconnectedCallback(): void {
    // cleanup before super — super unsubscribes all listeners and stops attribute observation
    super.disconnectedCallback();
  }

  protected override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // triggered for primary attribute + anything in observedAttributes
    // called on every write access, even if value didn't change
  }

  // --- Event listeners (auto-subscribed on connect, auto-removed on disconnect) ---

  @listen('click')
  protected _onClick(e: MouseEvent): void {
    // `this.$host` is the element the attribute is on
  }

  @listen({event: 'keydown', target: 'window'})
  protected _onKeyDown(e: KeyboardEvent): void { /* ... */ }
}

// Register the mixin
MyMixin.register();
```

HTML usage:
```html
<div my-mixin my-label="hello" my-config='{"speed": 300}'>Content</div>
```

---

## Key difference from ESLBaseElement

| | ESLBaseElement | ESLMixinElement |
|---|---|---|
| Host ref | `this` | `this.$host` |
| `$$cls`, `$$attr`, `$$fire`, `$$find` | operate on `this` | operate on `this.$host` |
| Multiple per element | No (one tag, one element) | Yes |
| Primary attribute | tag name | `static is` attribute |

---

## Static API

| Member | Description |
|---|---|
| `static is` | Primary activation attribute name. Must contain a dash. |
| `static observedAttributes` | Additional attributes to observe. The `is` attribute is **always** observed. |
| `static register()` | Registers the mixin in `ESLMixinRegistry`. |
| `static get($el, name?)` | Returns mixin instance attached to an element. |
| `static getAll($el)` | Returns all mixin instances attached to an element. |

## Instance API

| Member | Description |
|---|---|
| `$host` | The DOM element the mixin attribute is placed on. **Read-only.** |
| `$$find(sel)` | `ESLTraversingQuery.first(sel, this.$host)` |
| `$$findAll(sel)` | `ESLTraversingQuery.all(sel, this.$host)` |
| `$$cls(cls, value?)` | Get/toggle CSS classes on `$host` using `+cls`, `-cls`, `!cls` |
| `$$attr(name, value?)` | Get/set attribute on `$host` |
| `$$fire(name, init?)` | Dispatch custom event from `$host` |
| `$$on(...)` | Subscribe event listener |
| `$$off(...)` | Unsubscribe event listener |

---

## Key rules

- Mixin `is` attribute **must contain a dash** (`my-mixin`, not `mymixin`).
- Primary `is` attribute is **always observed** regardless of `observedAttributes`.
- Always call `super.connectedCallback()` **first** and `super.disconnectedCallback()` **last**.
- Use `@ready` on `connectedCallback` / `disconnectedCallback` to guard against calls before the host element is fully initialized.
- All `$$*` shortcuts target `$host`, not the mixin instance — this is the critical distinction from `ESLBaseElement`.
- `@attr`-decorated properties read/write attributes on `$host`. Use `name` option to set explicit attribute name: `@attr({name: 'my-mixin'})` reads the same attribute as the mixin's activation attribute.

## Real examples in ESL codebase

- `packages/esl/src/esl-animate/core/esl-animate-mixin.ts` — mixin with `@jsonAttr`, `@ready`, attribute-change handling
- `packages/esl/src/esl-open-state/core/esl-open-state.ts` — mixin using `@attr` with custom parser, `@listen` targeting `ESLMediaQuery` as synthetic EventTarget

