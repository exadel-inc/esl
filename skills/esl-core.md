# Skill: ESL Core

**Version target:** This skill is written for **ESL v6** consumer code.

**When to use:** You are writing or reviewing consumer code that uses **`@exadel/esl`** and need the core mental model of the library: base classes, registration, decorators, query helpers, events, media conditions, and built-in syntax sugar.

**Primary goal:** Generate **idiomatic ESL code** that follows the library's own patterns instead of falling back to raw DOM or framework-specific habits.

---

## Public import rules

For consumer code, import from the package public entries under `@exadel/esl/modules/...`.
Direct imports from `@exadel/esl` are also valid when the consumer project uses bundling/tree-shaking in a way that does not pull unnecessary code into the final bundle.

Typical imports:

```ts
import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {ESLMixinElement} from '@exadel/esl/modules/esl-mixin-element/core';
import {ESLTraversingQuery} from '@exadel/esl/modules/esl-traversing-query/core';
import {ESLMediaQuery, ESLMediaRuleList} from '@exadel/esl/modules/esl-media-query/core';
import {attr, boolAttr, jsonAttr, prop, listen, ready} from '@exadel/esl/modules/esl-utils/decorators';
```

Rules:
- Prefer public `core` entries.
- Root import from `@exadel/esl` is acceptable in tree-shaken setups.
- Do **not** import from internal implementation files or repository-only paths.
- For most day-to-day work inside an ESL component, prefer the built-in `$$*` shortcuts over re-wiring low-level utilities manually.

---

## ESL mental model

ESL has **two base component types** with almost the same authoring style:

| Type | Base class | What it is | Host element |
|---|---|---|---|
| Custom tag | `ESLBaseElement` | A real custom element (`<my-element>`) | `this` |
| Custom attribute / mixin | `ESLMixinElement` | Behavior attached via attribute (`<div my-mixin>`) | `this.$host` |

Shared day-to-day API:
- `$$find`, `$$findAll`
- `$$cls`
- `$$attr`
- `$$fire`
- `$$on`, `$$off`
- `$$error`
- `@listen`
- attribute decorators like `@attr`, `@boolAttr`, `@jsonAttr`

The main difference is **where those APIs act**:
- in `ESLBaseElement` they target the element itself
- in `ESLMixinElement` they target the mixin host (`$host`)

---

## `ESLBaseElement` and `ESLMixinElement`

### `ESLBaseElement`
Use when you need a **new HTML tag** with its own DOM lifecycle.

```ts
import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {attr, boolAttr, jsonAttr, listen} from '@exadel/esl/modules/esl-utils/decorators';

export class MyElement extends ESLBaseElement {
  static override is = 'my-element';

  @attr({defaultValue: ''}) public title: string;
  @boolAttr() public active: boolean;
  @jsonAttr({defaultValue: {}}) public config: Record<string, unknown>;

  protected override connectedCallback(): void {
    super.connectedCallback();
    // init logic
  }

  protected override disconnectedCallback(): void {
    // cleanup before super if needed
    super.disconnectedCallback();
  }

  @listen('click')
  protected _onClick(e: MouseEvent): void {
    // ...
  }
}

MyElement.register();
```

### `ESLMixinElement`
Use when you need to **attach behavior to an existing element** via an attribute.

```ts
import {ESLMixinElement} from '@exadel/esl/modules/esl-mixin-element/core';
import {attr, boolAttr, jsonAttr, listen} from '@exadel/esl/modules/esl-utils/decorators';

export class MyMixin extends ESLMixinElement {
  static override is = 'my-mixin';
  static override observedAttributes = ['title'];

  @attr({defaultValue: ''}) public title: string;
  @boolAttr() public active: boolean;
  @jsonAttr({defaultValue: {}}) public config: Record<string, unknown>;

  protected override connectedCallback(): void {
    super.connectedCallback();
    // init logic on this.$host
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  @listen('click')
  protected _onClick(e: MouseEvent): void {
    // this.$host is the real DOM element
  }
}

MyMixin.register();
```

### Key differences

| Topic | `ESLBaseElement` | `ESLMixinElement` |
|---|---|---|
| Registration | `customElements.define(...)` via `register()` | `ESLMixinRegistry` via `register()` |
| Host | `this` | `this.$host` |
| HTML form | `<my-element>` | `<div my-mixin>` |
| `static is` | custom tag name | activation attribute name |
| Multiple per same host | no | yes |
| Primary observation | native custom element lifecycle | attribute-driven attach/detach |

### Registration rules
- Set `static is` **before** calling `register()`.
- `ESLBaseElement.register()` optionally accepts a tag name, but the normal consumer path is defining `static is` in the class.
- Custom element tag names and mixin `is` attributes must contain a dash to comply with custom element naming rules.
- Do **not** mutate `is` after registration.

### Lifecycle rules
- Always call `super.connectedCallback()`.
- Always call `super.disconnectedCallback()`.
- `@ready` is optional. It does **not** define component readiness; it defers method execution until the DOM is ready (`DOMContentLoaded`) and the next task, which is useful when DOM lookup must wait for the parsed tree.
- `attributeChangedCallback` reacts only to observed attributes.
- For `ESLBaseElement`, that means attributes listed in `static observedAttributes`.
- For `ESLMixinElement`, that means attributes listed in `static observedAttributes`, plus the primary mixin `is` attribute, which is always observed.
- When triggered, `attributeChangedCallback` may still run on **every write**, not only on actual value change.
- Guard expensive reactions when needed:

```ts
class Example extends ESLBaseElement {
  protected override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    // real change handling
  }
}
```

---

## Shared component API (`$$*` shortcuts)

Inside both `ESLBaseElement` and `ESLMixinElement` you can use:

| API | Meaning |
|---|---|
| `$$find(sel)` | `ESLTraversingQuery.first(sel, host)` |
| `$$findAll(sel)` | `ESLTraversingQuery.all(sel, host)` |
| `$$cls(cls, value?)` | read/toggle CSS classes on host |
| `$$attr(name, value?)` | read/set/remove host attribute |
| `$$fire(name, init?)` | dispatch custom event |
| `$$on(...)` | subscribe with ESL event system |
| `$$off(...)` | unsubscribe with ESL event system |
| `$$error(err, key)` | default logger used by `@safe` |

Use these helpers first. They already encode ESL conventions.

---

## `ESLTraversingQuery`

`ESLTraversingQuery` extends normal CSS selection with **relative traversal syntax**. It powers `$$find` and `$$findAll`.

This section describes the behavior and conventions expected in **ESL v6** consumer code.

### Why it matters
It is used everywhere in ESL because many components need to resolve targets **relative to the current host**, not only by global CSS selectors.

### Important syntax
- plain CSS selector: `'.item.active'`
- empty query `''` — returns the current base element / host
- `::next` — next sibling
- `::prev` — previous sibling
- `::parent` — direct parent
- `::parent(.panel)` — closest parent matching selector
- `::closest(.panel)` — closest ancestor including current element
- `::child(button)` — direct child elements
- `::find(.item)` — descendants
- `::first`, `::last`, `::nth(2)` — result limiting
- `::visible` — visible elements only
- `::not([hidden])` — post-filtering
- `::filter(:first-child)` — post-filtering

### Examples

```ts
this.$$find('');                   // current host: this for element, this.$host for mixin
this.$$find('::parent');
this.$$find('::closest(esl-panel)');
this.$$find('::find(button, a)::not([hidden])');
this.$$findAll('::find(.row)::visible');
```

### Difference from `querySelector`
- can start from the current host without repeating selectors
- supports traversal tokens like `::parent`, `::closest`, `::next`
- is designed for component-relative targeting, not just document-wide CSS lookup

Important nuance:
- `this.$$find('button')` is a plain CSS query and behaves like a normal scoped/global selector lookup for the current query scope.
- If you want an explicitly host-relative descendant search, prefer `this.$$find('::find(button)')` or `this.$$findAll('::find(button)')`.

Do **not** treat `$$find` / `$$findAll` as a ban on native DOM APIs:
- `this.querySelector(...)` / `this.querySelectorAll(...)` are still completely valid inside `ESLBaseElement` when a normal element-scoped CSS query is enough.
- Prefer `$$find` / `$$findAll` when you need ESL traversing syntax, when the selector comes from component API, or when you want richer relative targeting such as `::parent`, `::closest(...)`, or `::find(...)`.

Prefer `$$find` / `$$findAll` in ESL components instead of raw `querySelector` when the target is part of the component relationship model.

---

## Attribute and property decorators

These decorators are **host-aware**:
- in an element they work on `this`
- in a mixin they work on `this.$host`

That means the same decorator patterns are reusable in both component types.

### `@attr`
Generic property-to-attribute mapping.

Use it for:
- strings
- numbers
- tri-state booleans
- inherited values
- custom parsing/serialization

```ts
import {attr} from '@exadel/esl/modules/esl-utils/decorators';

class Example extends ESLBaseElement {
  @attr({defaultValue: ''}) public title: string;

  @attr({
    defaultValue: true,
    parser: (v) => v !== 'false',
    serializer: (v) => v ? '' : null,
  })
  public closable: boolean;
}
```

Capabilities:
- custom attribute name
- `data-*` attributes
- `readonly`
- `defaultValue`
- custom parser/serializer
- inheritance from ancestors

### `@boolAttr`
Boolean presence attribute.

```ts
import {boolAttr} from '@exadel/esl/modules/esl-utils/decorators';

class Example extends ESLBaseElement {
  @boolAttr() public disabled: boolean;
}
```

Semantics:
- attribute present → `true`
- attribute absent → `false`

Use `@attr`, not `@boolAttr`, when you need a default-enabled or tri-state boolean.

### `@jsonAttr`
Object mapping decorator.

```ts
import {jsonAttr} from '@exadel/esl/modules/esl-utils/decorators';

class Example extends ESLBaseElement {
  @jsonAttr({defaultValue: {theme: 'light'}})
  public config: {theme: string};
}
```

Important: in current ESL it supports not only strict JSON but a **relaxed object syntax** suitable for HTML attributes.

Examples it can parse:

```html
<my-element config='{"theme":"dark"}'></my-element>
<my-element config="{theme: 'dark', compact: true}"></my-element>
<my-element config="theme: 'dark'; compact: true"></my-element>
```

Think of it as **JSON-like / config-like object syntax**, not just strict JSON.

### `@prop`
Prototype-level shared property or provider-backed property.

Use it to:
- define shared constants
- define provider-backed values
- override inherited `@attr` / `@boolAttr` / `@jsonAttr` mappings in subclasses

```ts
import {attr, prop} from '@exadel/esl/modules/esl-utils/decorators';

class BasePanel extends ESLBaseElement {
  @attr({defaultValue: 'info'}) public kind: string;
}

class WarningPanel extends BasePanel {
  @prop('warning', {readonly: true}) public override kind: string;
}
```

### Property providers
A provider is a function that receives the host as both `this` and argument.

```ts
(that) => that.someValue
```

Providers are important in ESL because they allow a value to be resolved **from the current component context**, including cases where a mixin reads from its host state.

Most common provider use cases:
- `@listen` fields such as dynamic `event`, `target`, `selector`, or `condition`
- `@attr({defaultValue: (...) => ...})`
- `@prop((that) => ...)`

This is also the main way to pass the current instance into decorator configuration.

---

## Event model: `@listen` vs `$$on` / `$$off`

### `@listen`
Use `@listen` for **class-level declarative event listeners**.

```ts
import {listen} from '@exadel/esl/modules/esl-utils/decorators';

class Example extends ESLBaseElement {
  @listen('click')
  protected _onClick(e: MouseEvent): void {}

  @listen({event: 'keydown', target: 'window'})
  protected _onKeydown(e: KeyboardEvent): void {}

  @listen({event: 'click', selector: '.btn'})
  protected _onBtnClick(e: MouseEvent): void {}
}
```

Key idea:
- metadata is declared on the method
- ESL auto-subscribes on connect
- ESL auto-unsubscribes on disconnect

Use `@listen` by default for stable listeners that belong to the component class.

### `$$on` / `$$off`
Use them for **manual or dynamic subscription control**.

```ts
class Example extends ESLBaseElement {
  @listen({event: 'resize', target: 'window', auto: false})
  protected _onResize(): void {}

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.$$on(this._onResize);
  }

  protected override disconnectedCallback(): void {
    this.$$off(this._onResize);
    super.disconnectedCallback();
  }
}
```

Use manual API when:
- the listener is conditional
- the target changes at runtime
- the event type changes at runtime
- you need to temporarily re-bind a handler

### Mental split
- `@listen` = declarative class contract
- `$$on` / `$$off` = imperative runtime control

---

## `esl-event-listener` ecosystem

ESL event handling is more powerful than raw `addEventListener` / `removeEventListener`.

### Why it matters
It supports:
- declarative listeners
- delegation
- target indirection
- bulk unsubscribe by criteria
- subscriptions without keeping the original callback manually
- EventTarget adapters for observers and gestures

### Important concepts
- descriptors are attached to handlers
- listeners are stored relative to a host object
- unsubscription can use criteria like event name, handler, target, or group

### Useful targets/adapters
These can be used directly in `@listen` or manual subscriptions:

- `ESLDecoratedEventTarget.for(target, decorator, ...args)`
  - wraps an `EventTarget` with debounce/throttle-like behavior
- `ESLResizeObserverTarget.for(el)`
  - gives `resize` events from `ResizeObserver`
- `ESLIntersectionTarget.for(el, settings?)`
  - gives `intersection` events from `IntersectionObserver`
- `ESLSwipeGestureTarget.for(el, settings?)`
  - gives `swipe` events
- `ESLWheelTarget.for(el, settings?)`
  - gives `longwheel` events

Example:

```ts
import {listen} from '@exadel/esl/modules/esl-utils/decorators';
import {ESLMediaQuery} from '@exadel/esl/modules/esl-media-query/core';

class Example extends ESLBaseElement {
  @listen({event: 'change', target: ESLMediaQuery.for('@-sm')})
  protected _onViewportChange(): void {}
}
```

Prefer ESL event adapters when the library already exposes the observer/gesture model you need.

---

## `CSSClassUtils` and `$$cls`

`$$cls` is the component-facing shortcut for host class management.

### Basic use

```ts
this.$$cls('active');        // check
this.$$cls('active', true);  // add
this.$$cls('active', false); // remove
```

### Supported token behavior
`CSSClassUtils` supports:
- space-separated class lists: `'a b c'`
- inversion with `!token`
- locker-aware low-level class management in the utility itself

Examples:

```ts
this.$$cls('open selected', true);
this.$$cls('hidden', false);

// inversion example on the low-level utility
CSSClassUtils.add($el, '!hidden');    // removes 'hidden'
CSSClassUtils.remove($el, '!hidden'); // adds 'hidden'
```

Key distinction from raw `classList`:
- component code can work with token strings instead of multiple separate operations
- the same syntax is used pervasively across ESL code

For component authoring, `$$cls(...)` is usually the shortest and most ergonomic host-level API, especially when class tokens come from configuration or component API.

If you are operating on non-host elements, using `CSSClassUtils` directly is also fully valid.

---

## `ESLMediaQuery` and `ESLMediaRuleList`

### `ESLMediaQuery`
Extended media condition object compatible with the event system.

Features:
- native media query conditions
- breakpoint shortcuts like `@xs`, `@md`, `@+lg`, `@-sm`
- DPR shortcuts like `@x2`
- environment shortcuts like `@mobile`, `@ios`, `@safari`
- dynamic shortcuts through the media shortcut registry
- tolerant parsing for logical combinations
- works as `EventTarget`
- dispatches change events with media/match information when the condition changes

Example:

```ts
import {ESLMediaQuery} from '@exadel/esl/modules/esl-media-query/core';

const mq = ESLMediaQuery.for('@md and @desktop');
if (mq.matches) {
  // desktop medium-and-up behavior
}
```

And with listeners:

```ts
class Example extends ESLBaseElement {
  @listen({event: 'change', target: ESLMediaQuery.for('@-sm')})
  protected _onMediaChange(): void {}
}
```

Practical example: a component can listen to a reduced-motion-related shortcut or condition and adapt animation behavior to user preferences without wiring raw `matchMedia` listeners manually.

### `ESLMediaRuleList`
Maps media rules to values.

Useful when one attribute/config value should change by media condition.

Examples:

```ts
ESLMediaRuleList.parse('default | @xs => compact | @+md => full');
ESLMediaRuleList.parse('@xs => {gap: 8} | @+md => {gap: 16}', ESLMediaRuleList.OBJECT_PARSER);

// tuple format: values and queries are passed separately
ESLMediaRuleList.parse('1|2|3', '@xs|@md|@lg');
```

Use `ESLMediaRuleList` when the problem is not just “does this query match?” but “what value should be active under current conditions?”.

It supports both:
- arrow-rule format: `default | @xs => compact | @+md => full`
- tuple format: `values`, `queries`

---

## Related decorators worth knowing

These are not the main focus of ESL Core, but often appear in real code:
- `@ready` — defer execution until the DOM is ready (`DOMContentLoaded`) and the next task
- `@bind` — lazy per-instance method binding
- `@decorate` — wrap methods with debounce/throttle-like decorators
- `@memoize` — cache getter/method results
- `@safe` — catch sync errors and report through `$$error`

---

## Common mistakes to avoid

- Importing from repository internals instead of public `@exadel/esl/modules/.../core` paths.
- Treating `ESLBaseElement` and `ESLMixinElement` as separate ecosystems instead of one shared model with different hosts.
- Forgetting `register()`.
- Forgetting `super.connectedCallback()` / `super.disconnectedCallback()`.
- Using plain CSS lookup where ESL traversing syntax would better express a component relationship or a user-provided target API.
- Using raw `addEventListener` for static class-owned listeners instead of `@listen`.
- Using `@boolAttr` when a tri-state or inherited value actually requires `@attr`.
- Assuming `@jsonAttr` accepts only strict JSON.
- Forgetting that mixin logic acts on `$host`, not on the mixin instance as a DOM node.

---

## Practical rule of thumb

When generating ESL consumer code:
1. Choose the host model first: tag or mixin.
2. Import from public `core` entrypoints.
3. Use decorators for attribute/state mapping.
4. Use `@listen` for stable listeners.
5. Use `$$on` / `$$off` for dynamic listeners.
6. Use `$$find` / `$$findAll` for component-relative lookup.
7. Use `$$cls` / `$$attr` for host state reflection.
8. Reach for `ESLMediaQuery` / `ESLMediaRuleList` when responsiveness is part of the API.
