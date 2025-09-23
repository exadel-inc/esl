# @attr Decorator

Maps a class property to an HTML attribute with optional parsing, serialization, inheritance and a JS‑side default fallback.

---
## Why
HTML attributes are always strings (or presence/absence). Component logic often needs typed values (boolean, number, object, list) plus sensible defaults and inheritance across nested elements. Manual `getAttribute` / `setAttribute` boilerplate is repetitive and error‑prone. `@attr` centralizes:
- Name resolution (auto kebab‑case + optional `data-` prefix)
- One-way or two-way mapping (readonly vs read/write)
- Typed parsing / serialization
- Optional inheritance up the DOM tree
- Default (or provider) when attribute is absent (without mutating DOM)
- Works with host wrapper objects exposing `$host` (e.g. `ESLMixinElement`), not only direct `HTMLElement` subclasses

---
## Quick Start
```ts
import {attr} from '@exadel/esl/modules/esl-utils/decorators';

class Modal extends HTMLElement {
  // Simple string (default parser: parseString) – empty string when attribute missing
  @attr() title!: string;

  // Tri-state boolean (default true, explicit false via attribute value)
  @attr({defaultValue: true, parser: parseBoolean, serializer: toBooleanAttribute}) closable!: boolean;

  // Number with fallback when attribute missing / unparsable
  @attr({parser: (v) => v == null ? 0 : parseFloat(v)}) delay!: number;
}
```

---
## Host Resolution (Non-HTMLElement Support)
`@attr` (and other attribute decorators) internally resolve the target element using a utility that first checks:
1. If the decorated object itself is an `Element`
2. Else if it has a `$host` property that is an `Element`

This enables usage in composition / mixin patterns where logic lives in a helper class referencing a real DOM host via `$host`.

```ts
class SizeBehaviour { // not an HTMLElement
  constructor(public $host: HTMLElement) {}
  @attr({parser: parseNumber, defaultValue: 0}) width!: number; // reads/writes $host attribute
}

const el = document.createElement('div');
const behavior = new SizeBehaviour(el);
behavior.width = 250; // sets attribute on the underlying element
```
Notes:
- No special configuration required; `$host` is picked up automatically.
- If `$host` is absent or null, reads yield default logic (null → defaultValue), writes are ignored.

---
## API
```ts
attr<T = string>(config?: AttrConfig<T>): PropertyDecorator;
```
Where:
```ts
interface AttrConfig<T> {
  name?: string;                 // custom attribute name (kebab-cased by default)
  readonly?: boolean;            // getter only (no attribute updates)
  inherit?: boolean | string;    // inherit from nearest ancestor attribute (same or alternate name)
  dataAttr?: boolean;            // prefix with data-
  defaultValue?: T | ((this: any, that: any) => T); // JS fallback when attribute absent
  parser?: (raw: string | null) => T; // raw attr -> typed
  serializer?: (value: T) => string | boolean | null; // typed -> attr representation
}
```

---
## Behavior Summary
| Operation | What Happens |
|-----------|--------------|
| Read | Find local attribute; if absent and `inherit` enabled search ancestor; if still absent and `defaultValue` provided resolve it (call provider each access); pass resulting string/null to `parser` (default: `parseString`). |
| Write | If not `readonly`, pass value through `serializer` (or identity) and call `setAttr`. Return rules below. |
| Remove | Setting serializer result to `null`, `false`, or `undefined` removes attribute. |
| Boolean serializer | Returning `true` sets an empty attribute (`attr=""`). |
| Provider default | Not written to DOM; purely JS fallback. |
| Inheritance (`inherit: true`) | Uses same attribute name; if local missing, climbs ancestors. |
| Inheritance (string) | Uses local name first, then alternate provided name on ancestors. |

---
## Parser / Serializer Patterns
Below are common recipes and how they differ from dedicated decorators.

### 1. Tri‑State Boolean (Contrast with `@boolAttr`)
```ts
@attr({defaultValue: true, parser: parseBoolean, serializer: toBooleanAttribute}) enabled!: boolean;
```
States:
- No attribute: property = `true` (from `defaultValue`)
- `enabled="false"`: property = `false`
- Other attribute forms (`""`, `"true"`, absence of falsey markers): property = `true`
Difference vs `@boolAttr`: `@boolAttr` is binary (attribute present -> true, absent -> false). Tri‑state pattern enables a semantic default without setting DOM attribute.

### 2. Boolean Presence Only (`@boolAttr` Equivalent Light)
```ts
@attr({parser: (v) => v !== null, serializer: (v) => !!v}) active!: boolean;
```
Mirrors `@boolAttr` but less explicit—prefer `@boolAttr` unless combining with inheritance or advanced naming.

### 3. Numeric Attribute
```ts
@attr({parser: (v) => v == null ? 0 : parseFloat(v)}) timeout!: number; // NaN guarded
```
Or using existing helper:
```ts
@attr({parser: (v) => v == null ? 0 : parseNumber(v, 0)}) timeout!: number; // parseNumber returns fallback for NaN
```
Choose `parseFloat` for raw NaN signaling or `parseNumber` for controlled fallback.

### 4. JSON-like Data (Equivalent to `@jsonAttr`)
Current preferred approach for object mapping is `@jsonAttr`, but you can emulate:
```ts
@attr({
  parser: (v) => v ? JSON.parse(v) : {},
  serializer: (val) => (val && Object.keys(val).length) ? JSON.stringify(val) : false,
  defaultValue: () => ({})
}) config!: Record<string, any>;
```
Upcoming (`ESL v6.0.0`) helper `parseObject` will simplify the parser:
```ts
// Future (planned)
@attr({parser: parseObject, serializer: (o) => JSON.stringify(o)}) data!: SomeShape;
```
For now, use `@jsonAttr` when you want standard JSON + default object semantics.

### 5. Token List (Custom Rule)
```ts
@attr({
  parser: (v) => (v ?? '').split(/\s+/).filter(Boolean),
  serializer: (arr) => arr.length ? arr.join(' ') : null,
  defaultValue: () => []
}) classes!: string[];
```

### 6. Inherited Override
```ts
@attr({inherit: true, parser: parseBoolean, defaultValue: false}) muted!: boolean;
```
If an ancestor defines `muted` attribute, its value cascades; local attribute overrides; absence yields `false` (default provider).

---
## Serialization Rules (Detailed)
| Serializer Return | DOM Result |
|-------------------|------------|
| `null`, `undefined`, `false` | Attribute removed |
| `true` | Empty attribute written (`attr=""`) |
| `''` (empty string) | Attribute set to empty string |
| `'value'` | Attribute set to provided string |

---
## Default Value Clarification
`defaultValue` (or provider) is only applied when no (local + inherited) attribute is found. It does NOT create or mutate the HTML attribute. A provider executes each time the getter runs while the attribute remains absent (no memoization).

---
## Inheritance Examples
```ts
// Same-name cascade
@attr({inherit: true}) theme!: string; // climbs for `theme`

// Alternate ancestor name
@attr({inherit: 'global-theme'}) theme!: string; // local `theme` first, else ancestor `global-theme`
```

---
## Readonly Mapping
```ts
@attr({readonly: true}) mode!: string; // Reflects attribute but writes are ignored
```
Useful when DOM updates come from outside (e.g., server-rendered or managed by another system) and internal code should not mutate the attribute.

---
## Comparing Decorators
| Decorator | Type Focus | Default Handling | Boolean Semantics | Object Handling | Extras |
|-----------|------------|------------------|-------------------|-----------------|--------|
| `@attr` | Generic (string → any via parser) | `defaultValue`/provider (JS only) | Configurable (tri-state possible) | Custom parser needed | Inheritance, custom serializer |
| `@boolAttr` | Presence toggle | Absent = false | Binary (presence) | N/A | Simpler, optimized |
| `@jsonAttr` | Object (JSON) | Default object literal | N/A | Built-in JSON parse/stringify | Simpler config |

---
## Error / Edge Considerations
- Malformed JSON in custom parser: wrap in try/catch to prevent uncaught errors.
- Provider default returning complex objects: you may want to clone to prevent shared mutation.
- Inheritance cycles are naturally bounded by DOM tree; no special guard required.

---
## Best Practices
- Always supply a deterministic parser; avoid throwing—return a safe fallback instead.
- For expensive default providers, cache manually on first use if attribute remains unset.
- Avoid heavy parsing on every access; consider caching derived values in another property if frequently read.

---
## Related
- `@boolAttr` – presence-based boolean mapping
- `@jsonAttr` – JSON serialization mapping
- `@prop` – prototype default / override pattern
