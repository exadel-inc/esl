# @prop Decorator

Defines a prototype-level property (static value or provider-backed) with optional `readonly` and `enumerable` flags, allowing controlled override semantics and lazy instance-side value assignment.

---
## Why
Standard class field initializers assign values directly to each instance. Sometimes you want:
- A shared constant value on the prototype (memory efficient)
- A derived/computed per-access value without manually writing a getter
- A configurable property that can be overridden once per instance when first written
- A lightweight alternative to accessor boilerplate (`get`/`set` definitions)

`@prop` provides a declarative way to do that while preserving clear override rules.

---
## Quick Start
```ts
import {prop} from '@exadel/esl/modules/esl-utils/decorators';

class Config {
  // Static prototype value (shared) — writable by default
  @prop('v1') version!: string;

  // Computed each access — provider form
  @prop((self: Config) => self.version + ':' + Date.now())
  buildTag!: string;

  // Readonly constant (non-writable, non-overridable)
  @prop('fixed', {readonly: true}) stable!: string;
}

const c = new Config();
console.log(c.version);      // 'v1'
c.version = 'v2';            // overrides value on the instance only
console.log(c.buildTag);     // fresh computation each access
```

---
## API
```ts
prop(value?: any | ((this: any, that: any) => any), config?: {readonly?: boolean; enumerable?: boolean;}): PropertyDecorator;
```

### Parameters
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `any` \| `PropertyProvider<T>` | `undefined` | Static value or provider function. Provider is invoked as `provider.call(this, this)` every access. |
| `config.readonly` | `boolean` | `false` | When true: static value made non-writable OR provider setter becomes a no-op. |
| `config.enumerable` | `boolean` | `false` | Controls `enumerable` flag of the defined descriptor. |

### Provider Semantics
Provider form installs a getter that evaluates on every access. Unless `readonly` is set to `true`, a write to the property replaces the accessor on that instance with a normal data property holding the assigned value.

---
## Behavior Matrix
| Form | Readonly? | Access | Write | After Write (non-readonly) |
|------|-----------|--------|-------|----------------------------|
| Static value | false | returns prototype value | defines own value property | Instance shadow overrides prototype |
| Static value | true  | returns prototype value | ignored (no change) | Remains prototype lookup |
| Provider     | false | invokes provider each time | defines own value (replaces getter) | Subsequent reads return stored value |
| Provider     | true  | invokes provider each time | ignored | Always computed, never overridden |

---
## Examples
### 1. Redeclare an attribute‑mapped property as static / hidden in a subclass
When a base component exposes a property via an attribute decorator (`@attr`, `@boolAttr`, `@jsonAttr`), you can redeclare it in a derived component with `@prop` to:
- Lock the value (ignore any HTML attribute changes)
- Provide a fixed default without the attribute mapping
- Avoid TypeScript conflicts using `override`

```ts
import {attr, boolAttr, jsonAttr, prop} from '@exadel/esl/modules/esl-utils/decorators';

class BasePanel extends HTMLElement {
  @attr({defaultValue: 'info'}) kind!: string;        // <base-panel kind="warning"> supported
  @boolAttr() disabled!: boolean;                     // reflects presence of attribute
}

// Variant forces kind to a constant value (attribute no longer affects it)
class WarningPanel extends BasePanel {
  @prop('warning', {readonly: true}) public override kind!: string; // constant & non-writable
}

// Variant hides attribute control but still allows programmatic change
class FixedPanel extends BasePanel {
  @prop('detail') public override kind!: string; // writable via instance.kind = '...' but not via attribute
}

// Boolean attribute locked to true
class AlwaysDisabledPanel extends BasePanel {
  @prop(true, {readonly: true}) public override disabled!: boolean;
}
```
Why it works:
- Redeclaring with `@prop` installs a new descriptor on the subclass prototype; the original attribute mapping lives on the base prototype and is shadowed.
- Attribute mutations no longer route to the property because the getter/setter from `@attr` is not used on the subclass prototype chain.
- Using `override` keeps TypeScript satisfied about the redeclaration.

### 2. Shared event name (override per instance)
Define event/channel names once on the prototype; override for special instances (e.g. for namespacing in tests or embedded contexts).
```ts
import {prop} from '@exadel/esl/modules/esl-utils/decorators';

class MyWidget extends HTMLElement {
  @prop('widget:ready') READY_EVENT!: string;
  @prop('widget:change') CHANGE_EVENT!: string;

  connectedCallback() {
    this.dispatchEvent(new CustomEvent(this.READY_EVENT));
  }
  notifyChange(detail: any) {
    this.dispatchEvent(new CustomEvent(this.CHANGE_EVENT, {detail}));
  }
}

const w = new MyWidget();
w.READY_EVENT = 'alt:ready'; // per-instance override
w.connectedCallback(); // dispatches 'alt:ready'
```
Why this pattern:
- Avoids reallocating the same strings per instance (prototype storage)
- Keeps names discoverable and override-friendly
- Facilitates subclassing (`@prop('sub:ready') public override READY_EVENT!: string;`)

### 3. Shared constants
```ts
class FeatureFlags {
  @prop(Object.freeze({beta: false, darkMode: true}), {readonly: true}) FLAGS!: Readonly<Record<string, boolean>>;
}
```

---
## Error Conditions
| Condition | Throws |
|-----------|-------|
| Decorating when the prototype already has an own property with same name | `TypeError("Can't override own property")` |

---
## Typing Notes
- The decorator doesn't change declared TypeScript type; declare a definite assignment (`!:`) when needed.
- Provider return type drives the property’s read type; writes (non-readonly) can still change value shape unless you restrict via TypeScript field type.

---
## Best Practices
- Use `readonly` for constants or always-derived getters to prevent accidental shadowing.
- Use provider only when repeated recalculation is cheap or desired every access. If you want one-time lazy init, combine with manual write after first computation.
- Freeze or deep-freeze complex static objects to avoid unintended shared mutation.

---
## Related
- `@attr` / `@boolAttr` / `@jsonAttr` – attribute-to-property bindings
- `@listen` – event listener binding
- `@safe`, `@memoize` – functional method wrappers
