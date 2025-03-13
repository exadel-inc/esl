# [ESL](../../../) Traversing Query

Version: *1.0.0*.

Authors: *Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

**ESLTraversingQuery** is a utility module that extends the capabilities of CSS selectors for traversing and selecting elements in the Document Object Model (DOM). It provides an enhanced querying syntax for more flexible and powerful element selection, traversal, and filtering.

Extended query supports:
 - plain CSS selectors
 - relative selectors
NOTE: Selectors that don't start from a plain selector will use passed base Element as a root
 - `::next` and `::prev` sibling pseudo-selectors
 - `::parent`, `::closest` and `::child` pseudo-selectors
 - `::find` pseudo-selector
 - `::first`, `::last` and `:nth(#)` limitation pseudo-selectors
 - `::visible` visible element pseudo-selector
 - `::not`, `::filter` filtration pseudo-selectors

---

### Query examples and explanation

- `#id .class [attr]` - find by CSS selector in a current document
- ` ` (empty query) - returns current base element
- `::next` - get next sibling element
- `::prev` - get previous sibling element
- `::parent` - get base element parent
- `::parent(#id .class [attr])` - find the closest parent, matching passed selector
- `::closest(#id .class [attr])` - find the closest ancestor including base element that matches passed selector
- `::closest`, `::find` - without 'arguments' returns current base element
- `::child(#id .class [attr])` - find direct child element(s) that match passed selector
- `::find(#id .class [attr])` - find child element(s) that match passed selector
- `::find(buttons, a)::not([hidden])` - find all buttons and anchors that don't have hidden attribute
- `::find(buttons, a)::filter(:first-child)` - find all buttons and anchors that are first child in container
- `::parent::child(some-tag)` - find direct child element(s) that match tag 'some-tag' in the parent
- `#id .class [attr]::parent` - find parent of element matching selector '#id .class [attr]' in document
- `::find(.row)::last::parent` - find parent of the last element matching selector '.row' from the base element subtree
- `::find(.row)::visible` - find element(s) matching selector '.row' from the base element subtree and filter visible elements.

### Notes
- The utility operates within a specified scope, which is by default the document object. You can provide a different scope by passing an optional scope parameter to the query functions.
- `::next, ::prev, ::child, ::parent, ::closest, ::find` - works with and without 'arguments'
- `::filter, ::not, ::nth` - works with 'arguments' only
- `::visible` - works without 'arguments' only
### API

Find one (first element that describes a query):
```typescript
  ESLTraversingQuery.first(query: string, base?: Element, scope?: Element | Document): Element | null;
```

Find all elements that describes a query:
```typescript
  ESLTraversingQuery.all(query: string, base?: Element, scope?: Element | Document): Element[];
```

Params: 
- `query` - query string
- `base` - describes a base for relative query.
- `scope` - defines a scope to find global query (`document` by default)

---

With the ESL Traversing Query, you can harness the power of extended selector queries to perform complicated DOM traversals and element selections. Whether you're targeting specific elements, navigating the DOM tree, or filtering results, this utility simplifies complex tasks and enhances your ability to manipulate the webpage's structure and content.
