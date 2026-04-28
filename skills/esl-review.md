# Skill: ESL Review

**Version target:** This review skill is suitable for **ESL 5+** consumer code.

**When to use:** You are reviewing consumer code that uses **`@exadel/esl`** and need to check whether it follows ESL's core patterns, public API boundaries, and idiomatic component authoring style.

**Primary goal:** Catch code that technically works but ignores ESL conventions, bypasses built-in helpers, or misuses the element/mixin model.

---

## Review mindset

Review ESL code through these questions:
1. Is the correct **host model** used (`ESLBaseElement` vs `ESLMixinElement`)?
2. Are imports taken from public `@exadel/esl` entrypoints?
3. Does the code use ESL primitives (`@attr`, `@listen`, `$$find`, `$$cls`, `ESLMediaQuery`) instead of re-implementing them manually?
4. Does lifecycle code preserve ESL auto-subscription / auto-cleanup behavior?
5. Is responsive or event-driven behavior expressed in the ESL way rather than raw low-level APIs?

---

## 1. Host model correctness

### Good signals
- New custom tag extends `ESLBaseElement`.
- Attribute-driven behavior extends `ESLMixinElement`.
- Mixin code consistently works through `$host`.
- The code uses the shared `$$*` APIs instead of treating mixins as DOM nodes.

### Review questions
- Should this be a tag or a mixin?
- Is a mixin chosen only because behavior must attach to an existing element?
- Does mixin code accidentally use `this` where `this.$host` is the real DOM target?

### Common issue
A mixin is written like a custom element and manipulates `this.classList`, `this.querySelector`, or `this.dispatchEvent` directly.

### Preferred direction
Use:
- `this.$$cls(...)`
- `this.$$find(...)`
- `this.$$fire(...)`
- `this.$$attr(...)`

These already target the correct host semantics.

---

## 2. Public import boundaries

### Good signals
- Imports come from public `@exadel/esl/modules/.../core` entries or from root `@exadel/esl` in a tree-shaken setup.
- Consumer code does not reference repository internals.

### Review questions
- Is the code importing a public entry or an implementation detail?
- Is the import stable for npm consumers?

### Red flags
- imports from internal subfolders or repository-only paths
- imports that bypass public package entrypoints entirely

### Preferred direction
Use public package entries such as:

```ts
import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {ESLMixinElement} from '@exadel/esl/modules/esl-mixin-element/core';
import {attr, boolAttr, jsonAttr, prop, listen} from '@exadel/esl/modules/esl-utils/decorators';

// or, in tree-shaken setups
import {ESLBaseElement, listen} from '@exadel/esl';
```

---

## 3. Registration and lifecycle

### Good signals
- `static is` is declared in the class.
- `register()` is called.
- `super.connectedCallback()` is preserved.
- `super.disconnectedCallback()` is preserved.

### Review questions
- Was registration forgotten?
- Is lifecycle code preserving ESL auto-subscription behavior?
- Is `attributeChangedCallback` doing expensive work on redundant writes?

### Red flags
- missing `register()`
- `super.connectedCallback()` omitted
- `super.disconnectedCallback()` omitted
- custom lifecycle logic that breaks auto-subscribe / auto-unsubscribe assumptions

### Preferred direction
Guard attribute-change logic when necessary:

```ts
class Example extends ESLBaseElement {
  protected override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    // real update logic
  }
}
```

---

## 4. Attribute and property modeling

### Good signals
- `@attr` used for typed attribute-backed properties.
- `@boolAttr` used for presence booleans.
- `@jsonAttr` used for object-like config attributes.
- `@prop` used for shared constants or overriding inherited attribute mappings.

### Review questions
- Is the chosen decorator the simplest correct one?
- Should a boolean be `@boolAttr`, or is it really tri-state and better modeled with `@attr`?
- Is object config manually parsed even though `@jsonAttr` already exists?
- Is subclass behavior overriding an inherited attribute mapping in a clean way?

### Red flags
- manual `getAttribute` / `setAttribute` boilerplate for simple cases
- parsing JSON manually in component code without a strong reason
- using `@boolAttr` for a value that needs a default-enabled or explicit-false model
- using instance fields where `@prop` would better express a shared constant

### Preferred direction
- Prefer decorators over manual attribute plumbing.
- Prefer `@prop` when the goal is to replace inherited attribute-backed behavior with a fixed or provider-based value.
- Remember that `@jsonAttr` supports relaxed JSON-like config syntax, not only strict JSON.

---

## 5. Event model and listener ownership

### Good signals
- Stable class-owned listeners use `@listen`.
- Dynamic or conditional listeners use `$$on` / `$$off`.
- Listener targets and delegation are expressed declaratively when possible.

### Review questions
- Should this listener be declarative?
- Is manual subscription really necessary here?
- Does the code rely on raw DOM event wiring where ESL already gives a better abstraction?
- Are re-subscriptions handled correctly when target/event/selector is dynamic?

### Red flags
- raw `addEventListener` / `removeEventListener` for stable component listeners
- manual cleanup forgotten
- `@listen({auto: false})` declared but never actually subscribed
- dynamic event/target/selector changes without unsubscribe + resubscribe

### Preferred direction
- `@listen` for stable listeners.
- `$$on` / `$$off` for runtime control.
- Use handler-reference unsubscription when refreshing dynamic listeners.

---

## 6. Traversal and target resolution

### Good signals
- `$$find` / `$$findAll` used for component-relative queries.
- `ESLTraversingQuery` syntax is used when the relationship is structural (`::parent`, `::closest`, `::find`, `::next`, `::prev`).

### Review questions
- Is this really a plain CSS lookup, or is it a component-relative relationship?
- Would `$$find` with traversing syntax make the intent clearer?

### Red flags
- verbose `closest` / `parentElement` / `querySelector` chains for patterns already expressible via `ESLTraversingQuery`
- mixing global document lookup into code that should stay host-relative

### Preferred direction
Prefer concise traversing queries for component relationships.

---

## 7. Host state reflection

### Good signals
- `$$cls` is used for component-driven class reflection.
- `$$attr` is used for direct attribute reflection when decorators are not the right fit.
- State naming and reflection are consistent.

### Review questions
- Is this host-state reflection part of the component contract?
- Would `$$cls` / `$$attr` express the intent more clearly than raw DOM mutation?

### Red flags
- repetitive `classList.add/remove` or `setAttribute/removeAttribute` sequences for simple component state
- class reflection scattered across unrelated methods without a clear model

### Preferred direction
Use `$$cls` and `$$attr` where the code is expressing component state on the host.

---

## 8. Media and responsive logic

### Good signals
- `ESLMediaQuery` is used when responsiveness is part of the component behavior.
- `ESLMediaRuleList` is used when media conditions map to values/configs.
- media conditions are treated as observable sources through the ESL event layer.

### Review questions
- Is responsive behavior manually reimplemented with window resize checks?
- Should this value be modeled as a media-rule list instead of imperative if/else code?

### Red flags
- manual `matchMedia` plumbing where `ESLMediaQuery` would be clearer
- manual resize logic for value switching that belongs to `ESLMediaRuleList`
- component code hardcoding breakpoint logic in many places instead of centralizing it

### Preferred direction
Prefer `ESLMediaQuery` / `ESLMediaRuleList` when responsiveness is part of the API rather than a one-off imperative detail.

---

## 9. `esl-event-listener` ecosystem usage

### Good signals
- observer/gesture behavior uses ESL adapters where available
- event targets are reused through built-in wrappers
- the code takes advantage of `EventTarget` compatibility

### Review questions
- Is the code manually managing `ResizeObserver`, `IntersectionObserver`, swipe, or wheel state where ESL already exposes an adapter?
- Could the listener become simpler if an ESL target wrapper was used?

### Red flags
- custom wrapper code around observers already supported by ESL
- bespoke debounce/throttle event target logic instead of `ESLDecoratedEventTarget`

### Preferred direction
Prefer existing ESL adapters such as:
- `ESLResizeObserverTarget`
- `ESLIntersectionTarget`
- `ESLSwipeGestureTarget`
- `ESLWheelTarget`
- `ESLDecoratedEventTarget`

---

## Short review checklist

Before approving ESL consumer code, verify:
- [ ] Correct host model: `ESLBaseElement` vs `ESLMixinElement`
- [ ] Public imports only
- [ ] `static is` and `register()` are correct
- [ ] Lifecycle preserves `super.connectedCallback()` / `super.disconnectedCallback()`
- [ ] Attribute state uses decorators instead of unnecessary manual plumbing
- [ ] Stable listeners use `@listen`
- [ ] Dynamic listeners use `$$on` / `$$off`
- [ ] DOM lookup uses `$$find` / `$$findAll` where component-relative traversal matters
- [ ] Host state reflection uses `$$cls` / `$$attr` where appropriate
- [ ] Responsive logic uses `ESLMediaQuery` / `ESLMediaRuleList` when it is part of the component model
- [ ] No unnecessary reimplementation of existing ESL utilities

---

## Practical rule of thumb

If the code looks like generic DOM code with a thin ESL wrapper on top, it is usually worth asking:

**Which ESL primitive should own this behavior instead?**

Most of the time the answer is one of:
- `@attr` / `@boolAttr` / `@jsonAttr`
- `@listen`
- `$$find` / `$$findAll`
- `$$cls` / `$$attr`
- `ESLMediaQuery` / `ESLMediaRuleList`
- an existing `esl-event-listener` target adapter
