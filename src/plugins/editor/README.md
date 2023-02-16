# UIP Editor

**UIPEditor** - custom element, code editor for changing current markup. It allows user to manually configure
the component inside [UIPPreview](src/core/README.md). Extends [UIPPlugin](src/core/README.md#uip-plugin).

## Description
**UIPEditor** is based on [ACE](https://ace.c9.io/) editor. It supports Ace's basic features like shortcuts, syntax
highlighting, etc.

### Useful links
1) [Ace playgroung](https://ace.c9.io/build/kitchen-sink.html)
2) [Shortcuts](https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts)
3) [Themes](https://github.com/ajaxorg/ace/tree/master/src/theme)

## Customization
To make customization easier, we defined the following interface:

```typescript
interface EditorConfig {
  theme: string;
  printMarginColumn: number;
  wrap?: number | boolean;
  minLines? : number;
  maxLines? : number;
}

```
- **Theme** allows you to change editor's appearance. You can play with themes [here]((https://ace.c9.io/build/kitchen-sink.html)).
- **PrintMarginColumn** is used for setting the position of the vertical line for wrapping. Set the value to **-1** to
   remove the line.
- **Wrap** number sets the limit of characters before wrapping. Set to **0** to remove wrapping or **true** for wrapping
  on the container's width.
- **MinLines** is a minimum number of lines to be displayed.
- **MaxLines** is a maximum number of lines to be displayed. If the number of lines exceeds this limit, vertical scrool will appear.

We think that these options are the most common, so we made their configuration easier. All you need is to pass an object
to the editor's attribute *editor-config*, like in the example below:

```html
<uip-editor editor-config="{wrap: 70}"></uip-editor>
```

If you don't specify it, the default one will be used:

```typescript
defaultConfig: EditorConfig = {
    theme: 'ace/theme/chrome',
    printMarginColumn: -1,
    wrap: true,
    minLines: 8,
    maxLines: 22,
  };
```

## Example
```html
<uip-editor></uip-editor>
```
