# Skill: Creating a Custom Element with ESLBaseElement

**When to use:** You need a new **custom HTML tag** (`<my-element>`) that owns its own DOM lifecycle,
holds state, and participates in the ESL component ecosystem.

**Import path:** `@exadel/esl/modules/esl-base-element/core`

---

## Minimal template

```ts
import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {attr, boolAttr, jsonAttr, listen} from '@exadel/esl/modules/esl-utils/decorators';

export class MyElement extends ESLBaseElement {
  /** Tag name — set before calling register() */
  static override is = 'my-element';

  // --- Attribute-mapped properties ---

  /** Maps to <my-element my-label="..."> */
  @attr({defaultValue: ''}) public myLabel: string;

  /** Maps to <my-element active> presence attribute */
  @boolAttr() public active: boolean;

  /** Maps to <my-element my-config='{"speed":200}'> */
  @jsonAttr({defaultValue: {}}) public myConfig: Record<string, unknown>;

  // --- Lifecycle ---

  protected override connectedCallback(): void {
    super.connectedCallback(); // required — subscribes @listen decorators, adds CSS class
    // your init logic here
  }

  protected override disconnectedCallback(): void {
    // cleanup before super — super unsubscribes all listeners
    super.disconnectedCallback();
  }

  protected override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // called on every write access to observed attribute, even if value didn't change
  }

  // --- Event listeners (auto-subscribed on connect, auto-removed on disconnect) ---

  @listen('click')
  protected _onClick(e: MouseEvent): void { /* ... */ }

  @listen({event: 'keydown', target: 'window'})
  protected _onKeyDown(e: KeyboardEvent): void { /* ... */ }

  @listen({event: 'click', selector: '.btn', auto: false})
  protected _onBtnClick(e: MouseEvent): void { /* manual subscription only */ }
}

// Register once per app (idempotent — safe to call multiple times with same args)
MyElement.register();
```

---

## Static API

| Member | Description |
|---|---|
| `static is` | Tag name. Set before `register()`. Immutable after registration. |
| `static observedAttributes` | Attributes that trigger `attributeChangedCallback`. |
| `static register(tagName?)` | Defines the custom element. Optional override of tag name. |
| `static registered` | `Promise<CustomElementConstructor>` — resolves when registered. |
| `static create()` | Creates an instance via `document.createElement(this.is)`. |

## Instance API

| Member | Description |
|---|---|
| `baseTagName` | Returns `(this.constructor as typeof ESLBaseElement).is` |
| `connected` | `true` after `connectedCallback` ran |
| `$$find(sel)` | `ESLTraversingQuery.first(sel, this)` — supports `::parent`, `::find(...)` etc. |
| `$$findAll(sel)` | `ESLTraversingQuery.all(sel, this)` |
| `$$cls(cls, value?)` | Get/toggle CSS classes using `+cls`, `-cls`, `!cls` mini-language |
| `$$attr(name, value?)` | Get/set attribute; `null` removes it, `false` removes it, `true` sets it |
| `$$fire(name, init?)` | Dispatch custom event |
| `$$on(...)` | Subscribe event listener (see esl-event-listener skill) |
| `$$off(...)` | Unsubscribe event listener |

## Key rules

- Always call `super.connectedCallback()` **first** and `super.disconnectedCallback()` **last**.
- `attributeChangedCallback` fires on every write, not just actual changes — guard with `if (oldValue === newValue) return`.
- `@attr` / `@boolAttr` / `@jsonAttr` work on `$host` (the element itself). Attribute name defaults to `kebab-case` of the property name.
- On `connectedCallback`, base class adds `this.baseTagName` as a CSS class on the element.
- Do **not** override `static is` after calling `register()` — it's frozen and will throw.
- Use `@listen({..., auto: false})` + manual `this.$$on(this._handler)` when subscription needs to be conditional or deferred.

## Real examples in ESL codebase

- `packages/esl/src/esl-trigger/core/esl-trigger.ts` — simple component with `@attr`, `@ready`, `$$find`, `$$on`/`$$off` for dynamic target subscription
- `packages/esl/src/esl-panel/core/esl-panel.ts` — component with `@attr`, `@boolAttr`, `@jsonAttr`, `@listen`, `$$fire`, `$$on` with `once`

## Global type augmentation (optional but recommended)

```ts
declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
```

This enables typed `document.querySelector('my-element')` and JSX/Nunjucks shapes.

