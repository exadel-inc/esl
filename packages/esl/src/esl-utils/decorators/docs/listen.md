# @listen Decorator

Declarative sugar for defining ESL Event Listener descriptors directly on class methods. Adds auto‑subscription metadata and integrates with the ESL Event Listener system (`ESLEventUtils`).

For deep background (descriptor structure, extended targets, bulk operations) refer to the ESL Event Listener module docs:
- Overview: `../../../esl-event-listener/docs/1-overview.md`
- Public API (`ESLEventUtils`): `../../../esl-event-listener/docs/2-public-api.md`
- Extended targets & optimizations: `../../../esl-event-listener/docs/3-extended-targets.md`
- Core element / mixin support: `../../../esl-event-listener/docs/4-core-support.md`

---
## Why
Manual event wiring scatters logic: `addEventListener`, remembering to `removeEventListener`, handling delegation and multiple targets, supporting inheritance overrides. `@listen` condenses common cases:
- Co-locate handler and subscription metadata
- Auto-subscribe (for `ESLBaseElement` / `ESLMixinElement` descendants)
- Declarative delegation, capture, once, passive, etc. (through descriptor keys)
- Inheritance-aware overrides (`inherit: true` merges metadata)
- PropertyProvider support for dynamic `event`, `target`, `selector`

---
## Dynamic Updates (Changing event / selector / target / condition at runtime)
Descriptors are resolved (providers executed) only at subscription time. If a provider-driven field (`event`, `selector`, `target`, `condition`) changes later, you must explicitly refresh the subscription.

1. If the EVENT STRING itself may change (provider returns a new token set):
   - First remove old subscriptions: `this.$$off(this.onSomething)` (handler reference criterion)
   - Then re-subscribe: `this.$$on(this.onSomething)`

2. If only `selector`, `target` or `condition` logic changes but `event` tokens remain the same:
   - A simple re-subscribe with `this.$$on(this.onSomething)` is usually enough (the old ones matching the same handler are replaced automatically after explicit unsubscribe or can be force-cleared with `$$off`).

Example:
```ts
class DynamicList extends ESLBaseElement {
  mode: 'click' | 'pointerdown' = 'click';

  @listen(() => this.mode)
  onInteract(e: Event) {
    /* ... */
  }

  switchMode(next: 'click' | 'pointerdown') {
    if (this.mode === next) return;
    // Remove subscriptions created with the old event name(s)
    this.$$off(this.onInteract);
    this.mode = next;
    // Create new subscription(s) for updated event tokens
    this.$$on(this.onInteract);
  }

  updateTarget() {
    // Example when target provider depends on some state.
    // Remove & re-add to resolve fresh provider values.
    this.$$off(this.onInteract);
    this.$$on(this.onInteract);
  }
}
```
Notes:
- Use handler reference (`this.onInteract`) as the simplest unsubscription criterion.
- For bulk dynamic refresh (e.g. many handlers) group them via `group` and call `this.$$off({group: 'name'})` then `this.$$on({group: 'name'})` style patterns (see core docs for group usage).
- Avoid calling `$$on` without first clearing when the `event` token set changes; you would accumulate stale subscriptions.

---
## Quick Start (Short Form)
```ts
import {listen} from '@exadel/esl/modules/esl-utils/decorators';

class MyButton extends ESLBaseElement {
  @listen('click')
  onClick(e: MouseEvent) {
    // handler logic
  }
}
```
Short form is equivalent to `@listen({event: 'click'})`.

---
## Descriptor Form
```ts
class Dialog extends ESLBaseElement {
  @listen({
    event: 'keydown',            // multiple: 'keydown keyup'
    target: 'window',            // TraversingQuery or direct EventTarget
    selector: 'button.close',    // enables delegation
    once: false,
    passive: true,
    capture: false,
    group: 'kbd',
    auto: true                   // (default when not inheriting)
  })
  onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') this.close();
  }
}
```
(Advanced field semantics are documented in `../../../esl-event-listener/docs/1-overview.md`.)

---
## Delegation & Strong Typing
Providing a `selector` activates built‑in delegation. Use `DelegatedEvent<T>` if you need `e.$delegate` with strict typing.
```ts
import type {DelegatedEvent} from '@exadel/esl/modules/esl-event-listener/core';

class List extends ESLBaseElement {
  @listen({event: 'click', selector: 'li'})
  onItemClick(e: DelegatedEvent<MouseEvent>) {
    const li = e.$delegate; // already the matched element
    li.classList.add('active');
  }
}
```
If you omit `DelegatedEvent`, you can still use `e.target instanceof Element && e.target.closest('li')` manually.

---
## Multiple Events in One Descriptor
Separate event names with spaces:
```ts
@listen({event: 'focus blur'})
onFocusChange(e: FocusEvent) {}
```
Creates two underlying subscriptions sharing the same handler and metadata.

---
## Dynamic Event / Selector / Target (PropertyProviders)
Use a function to defer resolution to subscription time:
```ts
class Dynamic extends ESLBaseElement {
  mode: 'click' | 'pointerdown' = 'click';
  @listen(() => this.mode)        // short form provider for event
  onPrimary(e: Event) {}

  @listen({
    event: 'click',
    selector: () => this.computeSelector(),
    target: () => this.externalTarget  // could be a Window, Document, Element, or ESL synthetic target
  })
  onDynamic(e: Event) {}
}
```
Providers receive the instance (`this`) as both call context and argument (see core docs for `PropertyProvider`).

---
## Target Resolution Defaults
If no `target` is specified:
1. Use the instance if it is an `EventTarget` (e.g. custom element)
2. Else, if it has a `$host` property that is an `Element`, use that
3. Otherwise, the descriptor will not attach until a valid target is available (see core docs for advanced cases)

---
## Inheritance & Override Patterns
```ts
class Base extends ESLBaseElement {
  @listen({event: 'click', selector: '.item'})
  onItem(e: DelegatedEvent<MouseEvent>) {}
}

// Replace metadata completely
class Replaced extends Base {
  @listen({event: 'mouseenter'})
  override onItem(e: MouseEvent) {}
}

// Merge metadata (keep selector, override event)
class Merged extends Base {
  @listen({inherit: true, event: 'focus blur'})
  override onItem(e: FocusEvent) {}
}

// Inherit original descriptor (no changes)
class Same extends Base {
  @listen({inherit: true})
  override onItem(e: MouseEvent) {}
}

// Remove listener completely by redefining method without decorator
class Removed extends Base {
  override onItem(e: MouseEvent) {}
}
```
Rules:
- No decorator on override => original descriptor dropped
- `inherit: true` => copy parent descriptor then shallow‑merge specified keys
- Fresh descriptor without `inherit` => completely replaces metadata
- Duplicate `@listen` on the same method (stacked) is not allowed (throws)

---
## Auto vs Manual Subscription
By default (unless `auto: false` or using `inherit` override), descriptors get `auto: true` and are subscribed automatically by `ESLBaseElement` / `ESLMixinElement` during lifecycle (e.g. `connectedCallback`).

Disable auto for manual control:
```ts
class Manual extends ESLBaseElement {
  @listen({event: 'resize', target: 'window', auto: false})
  onResize() {}
  connectedCallback() {
    super.connectedCallback();
    ESLEventUtils.subscribe(this, this.onResize); // explicit
  }
  disconnectedCallback() {
    ESLEventUtils.unsubscribe(this, this.onResize);
  }
}
```
Querying descriptors:
```ts
ESLEventUtils.descriptors(instance, {auto: true}); // auto-subscribable only
```

---
## Mixing with Other Decorators
`@listen` only registers metadata; it does NOT wrap or replace the function. So order with method wrappers (`@safe`, `@memoize`, `@decorate`, `@bind`) does not change invocation semantics (wrapper runs, and inside subscription handler is the same function reference). Avoid changing handler identity after subscription (re-subscribe if replaced).

---
## Common Pitfalls
| Issue | Explanation | Fix |
|-------|-------------|-----|
| Overriding a decorated method without `@listen` | Descriptor is removed | Re-add `@listen` or use `inherit: true` |
| Expecting default `true` for non-present boolean attribute controlling conditional handler logic | Attribute mapping defaults to false | Use `@attr` tri-state boolean pattern for condition or a provider condition key |
| Using stacked `@listen` on one method | Not supported (throws) | Use multi-event string or separate methods |
| Forgetting to call `ESLEventUtils.subscribe` for manual (`auto: false`) descriptors | No active listener | Explicitly subscribe/unsubscribe in lifecycle hooks |
| Accessing `e.$delegate` without delegation | Undefined | Provide `selector` and optionally use `DelegatedEvent<T>` |

---
## Minimal Field Reference (Decorator Focus)
| Field | Kind | Notes |
|-------|------|-------|
| `event` | string / provider | Space separated => multiple subscriptions |
| `target` | query / EventTarget / provider | Defaults to instance or `$host` |
| `selector` | CSS / provider | Enables delegation + `$delegate` |
| `condition` | boolean / provider | Skip subscription if falsy at subscribe time |
| `once` | boolean | Auto unsubscribe after first run |
| `passive` | boolean | Defaults based on event type (see core docs) |
| `capture` | boolean | Capture phase subscription |
| `group` | string | For bulk operations (`ESLEventUtils.unsubscribe(host, {group:'x'})`) |
| `auto` | boolean | Default `true` for decorator (unless `inherit` or explicitly set) |
| `inherit` | boolean | Merge/keep parent descriptor |

Full semantics: see `../../../esl-event-listener/docs/1-overview.md`.

---
## Best Practices
- Prefer short form for common single-event handlers (`@listen('click')`).
- Group related manual listeners with a `group` key for batch unsubscription.
- Use multi-event strings for symmetric behavior (e.g. `'focus blur'`).
- Keep handlers side-effect free except for the intended reaction; heavy logic may warrant `@safe` or throttling via `@decorate` wrappers.
- Re-run `ESLEventUtils.subscribe` (`this.$$on` for ESLBaseElement/ESLBaseMixin) after changing dynamic provider-dependent state that affects `event` / `selector` / `target`.

---
## Related
- Core README: `../../../esl-event-listener/README.md`
- `ESLEventUtils` API: `../../../esl-event-listener/docs/2-public-api.md`
- `@attr`, `@boolAttr` – often used for condition flags in `condition` providers
- `DelegatedEvent` type: improves delegation typing clarity
