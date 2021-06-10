# UIP Editor

UIPEditor - custom element, editor for changing current markup.

---
### Notes:

- Extends [UIPPlugin](../core/README.md).
- Uses [ACE](https://ace.c9.io/) editor under the hood. 
- Can be configured through **editor-config** attribute (see *EditorConfig* interface).

---

### EditorConfig interface
```typescript
interface EditorConfig {
  theme: string;
  mode: string;
  printMarginColumn: number;
  wrap: number;
}
```

---

### Example:
```html
<uip-editor label="Editor" editor-config="{wrap: 70}"></uip-editor>
```
