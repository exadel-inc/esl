# @safe Decorator

Lightweight resilience decorator for methods and getters. It wraps the original implementation in a synchronous `try/catch` and returns a predefined (or lazily provided) fallback value instead of throwing, while optionally delegating the error to a centralized logger hook `$$error`.

---
## Why
In UI component code a lot of accessors and small helper methods may occasionally fail (uninitialized state, missing DOM, parsing issues) where throwing an exception is undesirable and a neutral fallback value suffices. Repeating local `try/catch` blocks:
- Adds noise / decreases readability.
- Is easy to forget.
- Causes inconsistent logging.

`@safe` offers:
- Tiny implementation (no deps, minimal runtime overhead).
- Consistent optional logging via `this.$$error`.
- Declarative fallback semantics (static value or lazy provider).

---
## Quick Start
```ts
import {safe} from '@exadel/esl/modules/esl-utils/decorators/safe';

class ProfileCard {
  data?: {name: string};

  // Static fallback value
  @safe('Unknown')
  get name(): string {
    if (!this.data) throw new Error('No data');
    return this.data.name;
  }

  // Lazy fallback provider (executed only when an error occurs)
  @safe(() => [])
  collectTags(): string[] {
    // may throw synchronously
    return computeTags(this.data!);
  }

  // Optional centralized error logger (receives the thrown error, method name and original fn reference)
  $$error(err: unknown, name: string, original: Function) {
    console.error('[safe]', name, err);
  }
}
```

---
## API
```ts
function safe<Fallback = null>(fallback?: Fallback | (() => Fallback)): MethodDecorator;
```
Applied to:
- Class methods
- Get accessors

Resulting wrapped signature:
```
Original: (...args) => R
Wrapped : (...args) => R | Fallback
```
(Getters: `() => T` becomes `() => T | Fallback`)

### Parameters
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `fallback` | `Fallback` \| `() => Fallback` | `null` | Static value or provider invoked with instance context (`this`) only when an error is caught. |

### Logger Hook
If an instance defines:
```ts
$$error(error: unknown, methodName: string, original: Function): void
```
it is invoked before returning the fallback. Rethrow inside `$$error` if you need to abort.

---
## Fallback Semantics
1. Call proceeds normally: original return value is passed through.
2. Synchronous throw occurs: `fallback` is resolved:
   - If function: invoked with `this` context (no arguments).
   - Else: used as-is.
3. Return the resolved fallback; no rethrow (unless you rethrow inside `$$error`).

Note: Asynchronous errors (Promise rejections) are NOT intercepted unless they are thrown before the first `await` (i.e. still synchronous part of the function body).

---
## Examples
### Getter with static fallback
```ts
@safe('n/a')
get title(): string {
  if (!this.source) throw new Error('missing');
  return this.source.title;
}
```

### Method with lazy fallback
```ts
@safe(() => [])
items(): Item[] {
  // may throw (invalid cache, parse error, etc.)
  return this.cache!.list();
}
```

### Combine with other decorators
`@safe` can stack with memoization, binding, etc. (Order matters with decorators that wrap execution.)

```ts
class Example {
  @memoize()
  @safe(() => 0)
  computeHeavy(): number {
    if (!this.ready) throw new Error('not ready');
    return heavyCalc();
  }
}
```
(Here `@safe` runs inside the memoized wrapper because it is applied after `@memoize`.)

### Centralized Logger
```ts
$$error(err: unknown, name: string) {
  sendToTelemetry({component: this.baseTagName, name, message: String(err)});
}
```

---
## Limitations
| Aspect | Status | Rationale |
|--------|--------|-----------|
| Async rejections | Not caught | Keeps wrapper lean; use local try/catch inside async functions. |
| Error-aware fallback (receives error) | Not supported | Avoids extra function shape / overhead; consider manual try/catch if needed. |
| Setter decoration | Not supported | Current scope is methods & getters only. |
| Type narrowing after fallback | Not attempted | Simplicity; consumer can refine manually. |

---
## Typing Notes
The returned type is a union: `OriginalReturn | FallbackType`.
If you provide `@safe(undefined)` TypeScript still widens to `R | undefined`. Choose explicit neutral sentinels where clarity matters.

---
## Best Practices
- Keep fallbacks simple and side-effect free.
- Use lazy providers only for non-trivial allocations (arrays, objects) to avoid paying the cost on success path.
- Log selectively: high‑volume silent recoveries may be normal; consider sampling or suppression logic inside `$$error`.
- Don’t mask programming errors you truly care about—rethrow inside `$$error` when appropriate (e.g. in development builds).
