# @ready Decorator

Defers a method's execution until the DOM is ready (DOMContentLoaded) and then schedules it into the next macrotask (`setTimeout(…, 0)`). Each call to the method queues a deferred execution; nothing runs immediately.

---
## Why
Some initialization logic must wait for the DOM to finish parsing (e.g. querying elements, measuring layout) but you still want to express it as a simple method call without sprinkling readiness checks. `@ready` removes boilerplate and guarantees consistent defer semantics.

---
## Quick Start
```ts
import {ready} from '@exadel/esl/modules/esl-utils/decorators';

class Widget {
  @ready
  initDom() {
    // Safe: DOM is parsed here
    this.el = document.querySelector('#root');
  }
}

const w = new Widget();
w.initDom(); // Schedules execution; returns immediately (undefined)
```

---
## API
```ts
function ready(target: object, key: string, descriptor: TypedPropertyDescriptor<(...args:any[])=>void>): void;
```
Applies only to class prototype methods (void or ignored return). If the original method returned a value it becomes unreachable (call always returns `undefined`).

---
## Behavior
| Situation | Effect |
|-----------|--------|
| Document still loading | Callback queued for `DOMContentLoaded`, then re-queued via `setTimeout`. |
| Document already ready | Callback queued via `setTimeout` only. |
| Multiple calls before ready | All are queued (order preserved). |
| Exception inside original | Thrown asynchronously (cannot be caught by caller). |

---
## Examples
### Multiple Deferred Calls
```ts
class Tracker {
  calls: number = 0;
  @ready bump() { this.calls++; }
}
const t = new Tracker();
t.bump();
t.bump(); // After DOM ready => calls = 2
```

---
## Best Practices
- Use only for idempotent or safe-to-repeat initialization code.
- Avoid heavy synchronous work inside deferred method; consider splitting long tasks.
- If you need result propagation use an internal Promise pattern instead of `@ready` or wrap logic in a Promise-returning method that resolves after readiness.

---
## Related
- `onDocumentReady` – underlying utility.
- Other decorators: `@bind`, `@safe`, `@memoize` (can be composed; apply `@ready` outermost if you want the deferral to wrap other behaviors).


