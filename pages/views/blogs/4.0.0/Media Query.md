---
layout: content
name: ESL Media Query 3.0.0 (ESL 4.0.0)
title: ESL Media Query 3.0.0 (ESL 4.0.0)
tags: [blogs, draft]
date: 2021-07-01
---

ESL Media Query - is an extended version of the query to check Media Features on the device. 
In addition, the module provides ample opportunities not only for condition control, 
but also for building rules and conditional values.
ESLMediaQuery has been widely used in the attributes of ESL library components.

Previous major release already provides ESL Media Query module that has:
 - Extended support of conditions (logical operators, no limit on operator 'not')
 - Extendable system of query preprocessing to support shortcuts
 - Centralized control and support of screen size breakpoints
 - Support of the DPR shortcuts based on the new preprocessors system
 - Support of popular browsers and engines check

The 4th major release of ESL made this utility even more powerful. 
Let's review the migration process new capabilities and 
review final use-cases and quick recipe to use the ESLMediaQuery module

## New features and technical side of the update

Starting from ESL release 4.0.0 ESL Media Query module got the following list of extensions:

### 1. EventTarget interface support

Media conditions may not be static, so the native MediaQueryList supports listening of the query changes. But the
ESLMediaQuery module fell into the same mistake as native MediaQueryList object standard, and supported only the
custom `addListener` / `removeListner`. 
In the 4th release of ESL, the whole module starts implementing EventTarget
interface. 
```typescript
    const condition = ESLMediaQuery.for('@xs or @sm');
    const onChange = () => {/*...*/};

    condition.addEventListener('change', onChange);
    condition.removeEventListener('change', onChange);
```

So now it is completely compatible with features that uses native event listener mechanism under the hood, 
including ESLListeners:

```typescript
class MyComponent extends ESLBaseElement {
  @listen({
    name: 'change',
    target: ESLMediaQuery.for('@xs or @sm')
  })
  protected onMediaChange(e: ESLMediaChangeEvent) {
    // e.matches - current state of the query
  }
}
```
or

```typescript
EventUtils.subscribe(target, {
  name: 'change',
  target: ESLMediaQuery.for('@xs or @sm')
}, () => {
  // .. onMediaChange
});
```

Due to technical purposes ESLMediaQuery module uses `SyntaticEventTarget` implementation instead of native one.
However, this provides additional features from the API point of view as well. 
ESLMediaQuery allows skipping event name if the truthful `EventTarget` interface is not required:  
```typescript
    ESLMediaQuery.for('@xs or @sm').addEventListener(onChange); // the same as addEventListener('change', onChange);
    ESLMediaQuery.for('@xs or @sm').removeEventListener(onChange); // the same as removeEventListener('change', onChange);
```

The legacy way to subscribe on changes is still presented but deprecated for usage with ESLMediaQuery.
```typescript
    ESLMediaQuery.for('@xs or @sm').addListener(onChange);
    ESLMediaQuery.for('@xs or @sm').removeListener(onChange);
```

`ESLMediaRuleList` (the object that supports conditional values) implements the `EventTarget` interface as well:

```typescript
const rl = ESLMediaRuleList.parse('@xs => 1 | @sm => 2');
rl.addEventListener('change', onChange);

// or

class MyComponent extends ESLBaseElement {
  @listen({
    name: 'change',
    target: ESLMediaRuleList.parse('@xs => 1 | @sm => 2')
  })
  protected onMediaChange(e: ESLMediaRuleListEvent) {
     // e.previous - previous value
     // e.current - current value
  }
}
```

### 2. ESLMediaRuleList API changes

The API of `ESLMediaRuleList` had a more significant update recently. 
First, there are no longer default rules defined by an empty query. 
In the current version of `ESLMediaRuleList` all the standalone values converted to the permissive rule `all => <value>`.

**Breaking Change 1:** Default rule related API was retired.
**Breaking Change 2:** The order of default rules now critical for `ESLMediaRuleList`. 
If the empty value mentioned in the end of rule query, it will always override other values mentioned earlier.

**Breaking Change 3:** Value access API changes:
- `ESLMediaRuleList.prototype.active` - array of active (matched) rules
- `ESLMediaRuleList.prototype.activeValue` - payload of the last of active rules or `undefined`
- `ESLMediaRuleList.prototype.activeValues` - array of active rules payloads
- `ESLMediaRuleList.prototype.value` - active (merged) value of `ESLMediaRuleList` object
- `ESLMediaRuleList.prototype.computedValue` - always computed (non-cached) merged active value

`ESLMediaRuleList` supports two type of syntax's:
 - "Classic" syntax - rules separated by `|` symbol, query and value separated by `=>` for each rule, query is optional.
 - "Tuple" syntax - ruleset represented by two strings: tuple of queries and tuple of values, both separated via `|` symbol
 
Changes in parsing API:
 - `ESLMediaRuleList.parse` - support both syntax types
 - `ESLMediaRuleList.parseTuple` - parses tuple syntax
 - `ESLMediaRuleList.parseQuery` - parses classic syntax

[//]: # (## Migrating to ESL Media Query &#40;Release 4.0.0&#41;)

[//]: # (## Use cases and Recipes)
