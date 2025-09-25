# @bind Decorator

Lazily binds a class prototype method to the instance (`this`) the first time it is accessed, avoiding the need for manual constructor binding while preserving prototype memory efficiency.

---
## Why
Common patterns like passing methods as callbacks (event listeners, timers, Promise chains) require stable `this` binding. Manual solutions:
- Binding in constructor (`this.onClick = this.onClick.bind(this)`) creates an extra function per instance eagerly.
- Using arrow properties (`onClick = () => { ... }`) also allocates per instance and hides the method from the prototype (costs memory, harder to spy/patch).

`@bind` offers a declarative, lazy alternative:
- Prototype still holds a single original function.
- First access through an instance installs a bound copy directly onto that instance.
- Subsequent calls are zero‑cost (direct property hit). 

---
## Quick Start
```ts
import {bind} from '@exadel/esl/modules/esl-utils/decorators';

class ButtonController {
  clicks = 0;

  @bind
  handleClick(evt: Event) {
    this.clicks++;
  }

  attach(el: HTMLElement) {
    el.addEventListener('click', this.handleClick); // always correctly bound
  }
}
```

---
## API
```ts
function bind(target: object, key: string, descriptor: TypedPropertyDescriptor<Function>): TypedPropertyDescriptor<Function>;
```
Applied to: class prototype methods (not getters, not setters, not fields).

### Result
The original descriptor is replaced with an accessor descriptor:
- `get`: returns original function when accessed through the prototype; otherwise installs & returns a bound version on the instance.
- `set`: supports reassignment; the new value is defined as a normal writable value property.

---
## Behavior Details
1. Decoration phase: method value captured (`originalFn`).
2. A getter is defined. On first instance access:
   - Detects access via instance (not prototype).
   - Binds `originalFn` with `this`.
   - Defines the bound function directly on the instance (overwriting the accessor at instance level only).
3. Future accesses hit the already bound instance property (no more indirection).
4. Access using `Class.prototype.method` still returns the unbound original (useful for testing or chaining decorators).

---
## Examples
### Event Handler
```ts
class Modal {
  @bind onEsc(e: KeyboardEvent) { if (e.key === 'Escape') this.close(); }
  open() { document.addEventListener('keydown', this.onEsc); }
  close() { document.removeEventListener('keydown', this.onEsc); }
}
```

### With Other Decorators
Order matters when stacking decorators that wrap execution (e.g. memoization). `@bind` only adjusts access / binding and does not change the call semantics of the wrapped function itself. Place `@bind` outermost (lowest in code) if the method result should reflect wrapper transforms before binding.
```ts
class Service {
  @bind
  @memoize()
  heavy() { /* ... */ }
}
```
(Here the memoized wrapper is what gets bound.)

---
## Limitations
| Aspect | Status | Rationale |
|--------|--------|-----------|
| Getters/Setters | Not supported | Binding semantics differ; omitted for clarity. |
| Fields / Arrow props | Not supported | They aren’t on the prototype; binding unnecessary. |
| Re-binding after prototype mutation | Not handled | Complexity vs low practical need. |
| Symbol method names | Works | Standard property descriptor handling. |

---
## Typing Notes
The decorator preserves the original method signature. No return type widening occurs. Works with `this` typing as originally declared.

---
## Best Practices
- Use for callback-style methods passed around frequently.
- Prefer over constructor binding to reduce startup cost in large component trees.
- Keep method logic independent of decoration (test original via `Class.prototype.method`).
- Combine with performance decorators (e.g. `@memoize`) by placing `@bind` last (closest to the method) if you want the bound version to be the final wrapped function.

