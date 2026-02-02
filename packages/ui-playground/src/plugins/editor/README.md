**UIPEditor** is a plugin for the UI Playground that provides a live code editor for modifying the HTML or JavaScript of the currently active snippet. It is built on top of [CodeJar](https://medv.io/codejar/) for editing and uses [Prism.js](https://prismjs.com/) for syntax highlighting.

---

## What It Does
- Allows users to edit the HTML or JavaScript of the active snippet directly in the browser
- Automatically updates the preview when changes are made
- Supports syntax highlighting for better readability
- Provides optional copy and reset functionality for convenience
- Adapts to the snippet's state, such as readonly mode for JavaScript snippets

Required minimum markup:

```html
   <uip-root>
     <uip-preview></uip-preview>
     <uip-editor copy collapsible></uip-editor>
   </uip-root>
```

---
## Common Attributes & Options

| Attribute / Prop | Type    | Default | Description                                   |
|------------------|---------|---------|-----------------------------------------------|
| `source`         | string  | `html`  | Specifies the source type (`html` or `js`)    |
| `label`          | string  |         | Label for the editor, customizable per source |
| `copy`           | boolean | `false` | Enables the copy button in the toolbar        |
| `editable`       | boolean | `true`  | Toggles the editor's readonly mode            |

---
## Events

| Event                  | Target       | Description                                    |
|------------------------|--------------|------------------------------------------------|
| `uip:change`           | `<uip-root>` | Triggered when the editor content changes      |
| `uip:snippet:change`   | `<uip-root>` | Triggered when the active snippet changes      |

---
## Patterns & Tips

| Goal                          | Pattern                                                                |
|-------------------------------|------------------------------------------------------------------------|
| Enable live editing            | Add `<uip-editor>` to your layout                                      |
| Prevent editing for JS snippets| Use the `uip-js-readonly` attribute on the snippet or un-isolated mode |
| Add copy functionality         | Use the `copy` attribute on `<uip-editor>`                             |

---
## Advanced Customization

The `UIPEditor` can be extended or customized for advanced use cases. For example:

- **Custom Toolbar**: Override the `$toolbar` property to add custom buttons or functionality
- **Custom Highlighting**: Replace the `highlight` method with your own implementation

---
## Troubleshooting

| Symptom                        | Cause                                                                                                        | Fix                                                         |
|--------------------------------|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------|
| Editor is readonly unexpectedly| Note that the JS editing is enabled only in isolated mode, when your snippet is running in independed iframe | Enable `isolated` mode to have scripts live editing enabled |

---
## Example
