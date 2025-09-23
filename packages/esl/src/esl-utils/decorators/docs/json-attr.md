# @jsonAttr Decorator (Current Partial Doc)

Maps a property to an HTML attribute using JSON stringification / evaluation rules ("JSON‑lite").

---
## Quick Start
```ts
import {jsonAttr} from '@exadel/esl/modules/esl-utils/decorators';

class SettingsPanel extends HTMLElement {
  // Will read the attribute value, evaluate (JSON‑like) or fall back to {}
  @jsonAttr({defaultValue: {theme: 'light', compact: false}})
  config!: {theme: string; compact: boolean};
}

// <settings-panel config='{"theme":"dark","compact":true}'></settings-panel>
// panel.config => {theme: 'dark', compact: true}
// Without attribute: panel.config => {theme: 'light', compact: false}

// Writing assigns JSON (object) => attribute updated (or removed if falsy/object empty as per internal rules)
panel.config = {theme: 'dark', compact: false};
```

---
## What It Does Today (Summary)
| Aspect | Current Behavior (v5.x) |
|--------|-------------------------|
| Mapping | Attribute string ⇄ object (or `null`) via internal evaluation (`evaluate`) + `JSON.stringify` on set |
| Default | `defaultValue` used only when attribute missing (not written to DOM) |
| Readonly | `readonly: true` -> prevents setting; still parses attribute |
| data-* | `dataAttr: true` -> uses `data-` prefixed name |
| Errors | Malformed JSON/eval logs a warning, returns `defaultValue` |

---
## When to Use @jsonAttr vs @attr
Use `@jsonAttr` for conventional object mapping with default object semantics and no need for fine‑grained custom parsing yet.
Use `@attr` with a custom parser/serializer (see `attr.md`) when you need:
- Specialized serialization rules
- Non‑object values combined inside a single attribute
- Transitional strategy before enhanced object parsing arrives

---
## Inheritance / Override Patterns
You can redeclare the property with `@prop` to freeze or replace default behavior:
```ts
class BaseCfg extends HTMLElement {
  @jsonAttr({defaultValue: {enabled: true}}) options!: {enabled: boolean};
}
class LockedCfg extends BaseCfg {
  @prop(Object.freeze({enabled: false}), {readonly: true}) override options!: {enabled: boolean};
}
```
(Overrides the dynamic attribute mapping with a fixed prototype value.)

---
## Future Expansion (ESL v6.0.0+)
Planned improvements (subject to change):
- Unified `parseObject` helper for safer / more permissive parsing
- Clearer error fallback strategy
- Potential structured cloning semantics for complex values (TBD)

Until then: keep payloads simple, valid JSON objects.

---
## Caveats (Current Version)
- Only plain objects / arrays that `JSON.stringify` can handle are fully safe.
- Functions, Dates, custom classes won’t round‑trip meaningfully.
- Large objects may bloat attributes—prefer IDs or references when possible.
- Attribute size limits still apply (browser dependent).

---
## Minimal API Reference
```ts
jsonAttr<T>(config?: {
  name?: string;
  readonly?: boolean;
  dataAttr?: boolean;
  defaultValue?: T; // used only if attribute is absent
}): PropertyDecorator;
```

---
## Related
- `@attr` (generic + custom parser/serializer) – see `attr.md`
- `@prop` – convert mapped property into static/prototype value
