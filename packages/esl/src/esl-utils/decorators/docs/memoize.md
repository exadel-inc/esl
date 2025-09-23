# @memoize Decorator

Caches method return values or getter value to avoid recomputation. Works for instance (prototype) and static members.

---
## Why
Expensive pure (or effectively pure) calculations and derived state accessors are common in component logic. Re-computing them every call wastes CPU and may allocate garbage. Manual caching patterns add boilerplate and are easy to get wrong or forget to invalidate.

`@memoize` provides:
- Zero-dependency, lightweight memoization.
- Lazy per‑instance installation (prototype members) for isolation.
- Explicit cache inspection & reset helpers.

---
## Quick Start
```ts
import {memoize} from '@exadel/esl/modules/esl-utils/decorators';

class Parser {
  raw: string;
  constructor(raw: string) { this.raw = raw; }

  // Getter memoized (value cached after first access)
  @memoize()
  get ast() { return heavyParse(this.raw); }

  // Method memoized by first primitive argument only (default hash behavior)
  @memoize()
  classify(token: string) { return classifyToken(token); }
}

const p = new Parser(source);
const a1 = p.ast;      // computes
const a2 = p.ast;      // cached value
p.classify('id');      // computes & caches under key 'id'
p.classify('id');      // cached
```

---
## API
```ts
memoize(): MethodDecorator;
memoize(hashFn: MemoHashFn): MethodDecorator;
```
Where `MemoHashFn` returns `string | null | undefined`:
- `string | null` => used as cache key (`null` is a valid key)
- `undefined` => skip caching for that invocation

### Attached Helpers
```ts
memoize.clear(target, prop | prop[]);
memoize.has(target, prop, ...args?);
```

---
## Behavior Details
| Member Kind | What Happens | Cache Scope |
|-------------|--------------|-------------|
| Prototype getter | First access computes value, stores it as an own value property (descriptor replaced). | Per instance (value) |
| Prototype method | First call replaces method on that instance with a memoized wrapper function. | Per instance (function + its Map) |
| Static getter/method | Replaced by shared memoized function at class level. | Shared (class level) |

Hash function drives cache key. Default hash (`defaultArgsHashFn`):
- 0 args => key `null`
- 1 primitive (string/number/boolean) arg => its stringified value
- Otherwise => returns `undefined` (no caching)

Underlying memoized function surface:
```ts
fn.cache  // Map<null | string, ReturnType>
fn.clear() // empties cache
fn.has(...args) // true if key present (args hashed)
```

---
## Custom Hash Examples
### Multiple Params
```ts
const hash = (a: string, b: number) => a + '|' + b;
class C { @memoize(hash) mix(a: string, b: number) { /* ... */ } }
```

### Conditional Skip
```ts
const hash = (query: string) => query.length > 1000 ? undefined : query;
```
(Calls with very long queries skip caching.)

---
## Cache Control
```ts
memoize.has(instance, 'classify', 'id'); // check by hashed args
memoize.clear(instance, 'classify');     // remove function or underlying cache
memoize.clear(instance, ['ast', 'classify']); // batch
```
For getters, clearing deletes the own value property (next access recomputes). For methods, clearing removes the installed memoized function (next call reinstalls).

---
## Examples
### Getter + Method Combined
```ts
class Store {
  data: Item[] = [];

  @memoize()
  get ids() { return this.data.map(i => i.id); }

  @memoize(args => args[0] ?? undefined)
  findById(id: string) { return this.data.find(i => i.id === id); }
}
```

### Async Function
```ts
class Service {
  @memoize()
  async fetchOne(id: string) { return (await api.get(id)).payload; }
}
```
Resulting Promise is cached; rejection stays cached, so clear before retry if needed.

---
## Best Practices
- Use only for deterministic / pure (per instance) computations.
- Keep hash functions fast—avoid JSON.stringify on large objects unless necessary.
- Clear caches when underlying mutable state changes (e.g. after updating internal data arrays).
- Be careful with async methods: decide whether caching in-flight Promises is desired.

---
## Related
- `memoizeFn` – low-level function wrapper used internally.
- Other decorators: `@bind`, `@safe` (can be composed; order affects wrapping sequence).


