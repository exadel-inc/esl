---
name: esl
description: Use when writing, reviewing, or refactoring consumer code that uses @exadel/esl / Exadel Smart Library. Covers ESLBaseElement, ESLMixinElement, decorators, host model, public module imports, event listeners, traversing queries, media rules, and idiomatic ESL web component patterns.
package: '@exadel/esl'
packageVersion: '6.3.0'
---
# ESL Consumer Code
You are generating or reviewing consumer code that uses `@exadel/esl`.
Your goal is to produce idiomatic ESL code that uses the library primitives instead of raw DOM boilerplate.
Use this skill for:
- custom elements based on `ESLBaseElement`
- mixins based on `ESLMixinElement`
- code using `@exadel/esl/modules/...`
- ESL decorators such as `@attr`, `@boolAttr`, `@jsonAttr`, `@listen`
- ESL event, traversal, media, and utility APIs
If available, use reference docs in this skill package for deeper API details:
- `references/esl-core.md`
- `references/esl-review.md`
## Public import rules
For consumer projects, prefer public module entrypoints:
```ts
import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {ESLMixinElement} from '@exadel/esl/modules/esl-mixin-element/core';
import {ESLMediaQuery, ESLMediaRuleList} from '@exadel/esl/modules/esl-media-query/core';
import {attr, boolAttr, jsonAttr, prop, listen, ready} from '@exadel/esl/modules/esl-utils/decorators';
```
Rules:
1. Prefer `@exadel/esl/modules/.../core` public entries.
2. Root import from `@exadel/esl` is acceptable only when the consumer setup supports tree-shaking appropriately.
3. Do not import from ESL internal implementation paths.
4. Do not invent private paths when a public `core` entry exists.
## Choose the correct host model first
Before writing code, decide the host model:
1. Use `ESLBaseElement` for a new custom tag:
```html
<my-element></my-element>
```
2. Use `ESLMixinElement` for behavior attached to an existing element by attribute:
```html
<div my-mixin></div>
```
Hard rule:
- In `ESLBaseElement`, the DOM host is `this`.
- In `ESLMixinElement`, the DOM host is `this.$host`.
Do not treat a mixin instance as the DOM element. For mixins, read and mutate the real element through `this.$host` or host-aware ESL helpers.
## Registration and lifecycle
Every ESL component or mixin must follow registration and lifecycle contracts:
```ts
export class MyElement extends ESLBaseElement {
  static override is = 'my-element';
  protected override connectedCallback(): void {
    super.connectedCallback();
  }
  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
  }
}
MyElement.register();
```
Rules:
1. Set `static is` before calling `register()`.
2. Call `register()` once for the class.
3. Always call `super.connectedCallback()`.
4. Always call `super.disconnectedCallback()`.
5. Do not mutate `static is` after registration.
6. Custom element and mixin names should contain a dash.
## Prefer ESL decorators
Use decorators for attribute, property, and event wiring.
Prefer:
- `@attr` for string, number, inherited, custom, default-enabled, or tri-state values
- `@boolAttr` for boolean presence attributes only
- `@jsonAttr` for object-like config attributes
- `@prop` for prototype-level constants or provider-backed values
- `@listen` for stable class-owned event listeners
- `@ready` only when logic must wait for DOM readiness
Do not manually write repetitive `getAttribute`, `setAttribute`, `hasAttribute`, `addEventListener`, or `removeEventListener` logic when an ESL decorator or helper expresses the same behavior.
Use `@attr`, not `@boolAttr`, when the value is not a simple presence boolean.
## Use host-aware ESL helpers
Inside `ESLBaseElement` and `ESLMixinElement`, prefer host-aware shortcuts:
- `this.$$find(selector)`
- `this.$$findAll(selector)`
- `this.$$cls(className, state?)`
- `this.$$attr(name, value?)`
- `this.$$fire(eventName, init?)`
- `this.$$on(...)`
- `this.$$off(...)`
- `this.$$error(error, key?)`
These helpers target the correct host:
- `this` for `ESLBaseElement`
- `this.$host` for `ESLMixinElement`
Use `this.$$cls(...)` and `this.$$attr(...)` for host state reflection instead of direct `classList` or attribute operations on the host.
## Event handling
Default choice:
- use `@listen` for stable listeners that belong to the class
```ts
@listen('click')
protected _onClick(e: MouseEvent): void {
}
```
Use `$$on` / `$$off` when:
- the listener is conditional
- the target changes at runtime
- the event type changes at runtime
- you need manual subscription control
```ts
@listen({event: 'resize', target: 'window', auto: false})
protected _onResize(): void {
}
protected override connectedCallback(): void {
  super.connectedCallback();
  this.$$on(this._onResize);
}
protected override disconnectedCallback(): void {
  this.$$off(this._onResize);
  super.disconnectedCallback();
}
```
Do not use raw `addEventListener` / `removeEventListener` for stable component-owned listeners when `@listen` can be used.
## Traversing and DOM lookup
Use `$$find` / `$$findAll` when lookup is component-relative or user-configurable.
ESL traversing syntax can express relationships such as:
- `''` current host
- `::parent`
- `::closest(.selector)`
- `::child(button)`
- `::find(.item)`
- `::next`
- `::prev`
- `::visible`
Examples:
```ts
this.$$find('');
this.$$find('::closest(esl-panel)');
this.$$find('::find(button, a)::not([hidden])');
this.$$findAll('::find(.item)::visible');
```
Native `querySelector` is allowed when a simple element-scoped CSS lookup is enough, but prefer ESL traversing when the selector represents component relationships.
## Media and responsive behavior
Prefer ESL media utilities over raw `matchMedia` wiring:
- use `ESLMediaQuery` when the code needs to react to a media condition
- use `ESLMediaRuleList` when a config value changes by media condition
```ts
import {ESLMediaQuery} from '@exadel/esl/modules/esl-media-query/core';
@listen({event: 'change', target: ESLMediaQuery.for('@-sm')})
protected _onSmallViewportChange(): void {
}
```
Use `ESLMediaRuleList` for values like:
```ts
'default | @xs => compact | @+md => full'
```
Do not manually implement breakpoint parsing or media listener cleanup when ESL media utilities fit the problem.
## Attribute change handling
When overriding `attributeChangedCallback`, guard expensive logic:
```ts
protected override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
  if (oldValue === newValue) return;
  super.attributeChangedCallback(name, oldValue, newValue);
}
```
Remember:
- `ESLBaseElement` observes attributes listed in `static observedAttributes`
- `ESLMixinElement` observes `static observedAttributes` plus its own activation attribute
## Common anti-patterns
Avoid:
1. Importing from ESL internal implementation files.
2. Choosing `ESLBaseElement` when behavior should be a mixin.
3. Choosing `ESLMixinElement` but mutating `this` instead of `this.$host`.
4. Forgetting `register()`.
5. Forgetting `super.connectedCallback()` or `super.disconnectedCallback()`.
6. Using raw event listeners for stable class-owned events.
7. Using `@boolAttr` for default-enabled or tri-state values.
8. Assuming `@jsonAttr` accepts only strict JSON.
9. Reimplementing class, attribute, traversal, media, or event helpers already provided by ESL.
10. Making public API depend on internal ESL repository paths.
## Minimal good examples
Custom element:
```ts
import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {attr, boolAttr, listen} from '@exadel/esl/modules/esl-utils/decorators';
export class AppCard extends ESLBaseElement {
  static override is = 'app-card';
  @attr({defaultValue: ''}) public heading: string;
  @boolAttr() public selected: boolean;
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.$$cls('app-card-ready', true);
  }
  @listen('click')
  protected _onClick(): void {
    this.$$fire('app-card:click');
  }
}
AppCard.register();
```
Mixin:
```ts
import {ESLMixinElement} from '@exadel/esl/modules/esl-mixin-element/core';
import {attr, listen} from '@exadel/esl/modules/esl-utils/decorators';
export class AppTrackClick extends ESLMixinElement {
  static override is = 'app-track-click';
  @attr({defaultValue: ''}) public eventName: string;
  @listen('click')
  protected _onClick(): void {
    this.$$fire('app-track-click:trigger', {
      detail: {eventName: this.eventName}
    });
  }
}
AppTrackClick.register();
```
## Final checklist
Before returning ESL code, verify:
1. Correct host model is used:
   - custom tag → `ESLBaseElement`
   - attribute behavior → `ESLMixinElement`
2. Mixins use `this.$host` or host-aware `$$*` helpers for DOM host operations.
3. Imports use public `@exadel/esl/modules/...` entries.
4. `static is` is defined before `register()`.
5. `register()` is present.
6. Lifecycle overrides call `super`.
7. Attributes/properties use ESL decorators where appropriate.
8. Stable listeners use `@listen`.
9. Dynamic listeners use `$$on` / `$$off` with cleanup.
10. Component-relative lookup uses `$$find` / `$$findAll` where appropriate.
11. Responsive logic uses `ESLMediaQuery` or `ESLMediaRuleList` where appropriate.
12. No internal ESL implementation paths are used.
13. No raw DOM boilerplate duplicates an ESL primitive.
14. The code is small, readable, and easy for a consumer project to extend.
