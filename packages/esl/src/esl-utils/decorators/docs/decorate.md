# @decorate Helper Decorator

Bridges existing higher‑order function wrappers (e.g. `debounce(fn, wait)`, `throttle(fn)`, `rafDecorator(fn)`, tracing / metrics wrappers) into a declarative TypeScript method decorator with lazy, per‑instance installation.

---
## Why
If you already have reusable function wrappers, turning each into a full TS decorator repeats plumbing: descriptor validation, prototype vs instance handling, binding, property copying. 
`@decorate` centralizes that. Provide a wrapper function and its params—get a proper method decorator.

Benefits:
- Works with most common function -> function wrapper decoration
- Lazy: decoration applied only on first instance access (no upfront cost)
- Keeps prototype method intact (good for testing & composition)
- Safe reassignment supported (setter preserves semantics)
- Can stack with other decorators intentionally

---
## Quick Start
```ts
import {decorate} from '@exadel/esl/modules/esl-utils/decorators';
import {debounce} from '@exadel/esl/modules/esl-utils/async';

class SearchBox {
  term = '';

  @decorate(debounce, 250)
  onType(e: Event) {
    this.term = (e.target as HTMLInputElement).value;
    this.performSearch();
  }

  performSearch() {/* expensive I/O */}
}
```
First access to `instance.onType` installs the debounced, bound version.

---
## API
```ts
function decorate<Args extends any[], Fn>(
  decorator: (fn: Fn, ...params: Args) => Fn,
  ...args: Args
): MethodDecorator;
```

### Parameters
| Name | Type | Description |
|------|------|-------------|
| `decorator` | `(fn: Fn, ...params: Args) => Fn` | Higher‑order wrapper receiving the already bound original method. Must return a callable of (nominally) the same signature. |
| `...args` | `Args` | Extra parameters forwarded to `decorator` after the bound original method. |

### Throws
`TypeError` if applied to a non-method (getters, setters, fields unsupported).

---
## Behavior Details
1. Decoration time: captures original function value.
2. Replaces descriptor with accessor (getter/setter).
3. First instance access:
   - Detects instance vs prototype access.
   - Binds original (`originalFn.bind(this)`).
   - Calls `decorator(bound, ...args)` to get wrapped function.
   - Copies enumerable own props from original to wrapped.
   - Defines wrapped as own value property (future accesses are direct & fast).
4. Prototype access returns the original unwrapped function.
5. Setter allows reassignment; new value replaces accessor for that instance.

Static methods behave analogously (first access via the constructor installs the wrapped static function).

---
## Composition Order
Decorator order (top to bottom) corresponds to wrapper nesting (bottom applied first). Examples:
```ts
class Example {
  @decorate(timer)        // 3rd wrapper (outermost)
  @decorate(trace, 'db')  // 2nd
  @decorate(debounce, 50) // 1st (innermost – closest to method)
  load() { /* ... */ }
}
```
Result call stack: `timer(trace(debounce(original)))`.

When mixing with other decorators:
- `@bind` after `@decorate` => binds already wrapped function.
- `@decorate` after `@bind` => wrapper sees bound original (often desired for debounce/throttle).
- `@memoize` interplay depends on what you want cached: place nearer original to cache raw results, further out to cache post‑wrapped behavior.

---
## Examples
### Throttle
```ts
@decorate(throttle, 100)
onScroll() { /* lightweight diff logic */ }
```

### Animation frame batching
```ts
@decorate(rafDecorator)
render() { /* DOM writes */ }
```

### Custom instrumentation
```ts
function instrument(fn: Function, label: string) {
  return function(this: any, ...args: any[]) {
    const t0 = performance.now();
    try { return fn.apply(this, args); }
    finally { console.log(label, performance.now() - t0); }
  } as any;
}

class C {
  @decorate(instrument, 'op')
  op(x: number) { return x * x; }
}
```

---
## Typing Notes
Generic `Fn` is preserved. If your wrapper changes the call signature (e.g. adds parameters), cast explicitly or declare an overload for your wrapper then use `as const` assertions appropriately.

---
## Best Practices
- Keep wrappers pure; avoid hidden state unless intentional.
- Prefer placing side‑effect wrappers (logging, timing) outermost for full coverage.
- Debounce/throttle typically should see the bound method (place `@decorate` after `@bind` if using both).
- Test original logic through `Class.prototype.method` when needed (remains accessible).

