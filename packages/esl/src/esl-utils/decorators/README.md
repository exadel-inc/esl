# ESL Utility Decorators

Centralized collection of lightweight TypeScript decorators used across ESL components and mixins. Each decorator focuses on a single behavior (binding, attribute/property mapping, event subscription, error containment, memoization, lifecycle readiness, etc.) and is designed to be composable.

Detailed guides live in the `docs/` subfolder. This top-level README is a quick map + high‑level overview.

---
## Index
| Decorator | Purpose | Full Doc | Notes |
|-----------|---------|----------|-------|
| `@attr` | Map a property to an HTML (or `data-*`) attribute with parsing, serialization, inheritance & default provider | [docs/attr.md](./docs/attr.md) | Supports tri‑state boolean via custom parser/serializer; `$host` aware |
| `@boolAttr` | Presence ↔ boolean (attribute exists = true) | [docs/bool-attr.md](./docs/bool-attr.md) | Binary only; for tri‑state see `@attr` pattern |
| `@jsonAttr` | JSON‑lite attribute ↔ object mapping | [docs/json-attr.md](./docs/json-attr.md) | Partial doc (will expand with `parseObject` in ESL v6) |
| `@prop` | Define prototype-level static or provider-backed property (override / freeze attribute-mapped properties) | [docs/prop.md](./docs/prop.md) | Handy for redeclaring `@attr` / `@boolAttr` in subclasses |
| `@bind` | Lazy first-access method binding to instance | [docs/bind.md](./docs/bind.md) | Memory friendly vs constructor binding |
| `@decorate` | Adapt an arbitrary higher-order function (e.g. debounce) into a method decorator | [docs/decorate.md](./docs/decorate.md) | Wraps lazily per instance |
| `@memoize` | Cache getter / method results (hash-based) | [docs/memoize.md](./docs/memoize.md) | Supports custom hash; helpers for clearing |
| `@ready` | Defer method execution until component is "ready" (lifecycle sync point) | [docs/ready.md](./docs/ready.md) | Useful for async init staging |
| `@safe` | Wrap method/getter with try/catch + fallback + optional `$$error` hook | [docs/safe.md](./docs/safe.md) | Only synchronous errors caught |
| `@listen` | Declarative event listener descriptor (auto subscription, delegation, inheritance) | [docs/listen.md](./docs/listen.md) | See event listener core docs for advanced targets |

---
## Related Modules
- Event system: `esl-event-listener`
- Traversal / query utilities: `esl-traversing-query`
- Formatting / parsing helpers: `esl-utils/misc/format`


