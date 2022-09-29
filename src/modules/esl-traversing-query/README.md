# [ESL](../../../) Traversing Query

Version: *1.0.0*.

Authors: *Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

**ESLTraversingQuery** is a utility to find elements via an extended selector query.

Extended query supports:
 - plain CSS selectors
 - relative selectors  
NOTE: Selectors that don't start from a plain selector will use passed base Element as a root
 - `::next` and `::prev` sibling pseudo-selectors
 - `::parent`, `::closest` and `::child` pseudo-selectors
 - `::find` pseudo-selector
 - `::first`, `::last` and `:nth(#)` limitation pseudo-selectors

---

### Query examples and explanation

- `#id .class [attr]` - find by CSS selector in a current document
- ` ` (empty query) - returns current base element
- `::next` - get next sibling element
- `::prev` - get previous sibling element
- `::parent` - get base element parent
- `::parent(#id .class [attr])` - find the closest parent, matching passed selector
- `::closest(#id .class [attr])` - find the closest ancestor including base element that matches passed selector
- `::child(#id .class [attr])` - find direct child element(s) that match passed selector
- `::find(#id .class [attr])` - find child element(s) that match passed selector
- `::parent::child(some-tag)` - find direct child element(s) that match tag 'some-tag' in the parent
- `#id .class [attr]::parent` - find parent of element matching selector '#id .class [attr]' in document
- `::find(.row)::last::parent` - find parent of the last element matching selector '.row' from the base element subtree

### API

Find one (first element that describes a query):
```typescript
  ESLTraversingQuery.first(query: string, base?: Element, scope?: Element): Element | null;
```

Find all elements that describes a query:
```typescript
  ESLTraversingQuery.all(query: string, base?: Element, scope?: Element): Element[];
```

Params: 
- `query` - query sting
- `base` - describes a base for relative query.
- `scope` - define a scope to find global query (`document` by default)
