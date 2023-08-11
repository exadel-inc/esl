# UIP Editor

**UIPEditor** - custom element, code editor for changing current markup. It allows user to manually configure
the component inside [UIPPreview](src/core/README.md). Extends [UIPPlugin](src/core/README.md#uip-plugin).

## Description
**UIPEditor** is based on [Codejar](https://medv.io/codejar/) editor. We also use [Prism.js](https://prismjs.com/) for highlighting.

You can pass an optional `editor-config` attribute to configure editor's behaviour:

```typescript
interface EditorConfig {
  wrap?: number;
}
```

- **wrap** option specifies characters limit by line. If the number of characters is greater than **wrap**, then the line is splitted into multiple ones, each shorter than **wrap** characters. By default there is no limit. We apply this transformation only on markup changes from snippets/settings.

## Example
```html
<uip-editor editor-config="{wrap: 60}"></uip-editor>
```
