# UIP Editor

**UIPEditor** - custom element, code editor for changing current markup. It allows user to manually configure
the component inside [UIPPreview](src/core/README.md). Extends [UIPPlugin](src/core/README.md#uip-plugin).

## Description
**UIPEditor** based on [ACE](https://ace.c9.io/) editor, which means you can use this editor's API for
customization. You can change theme, mode, shortcuts, etc.

To see the full power of [ACE](https://ace.c9.io/) editor you can click [here](https://ace.c9.io/build/kitchen-sink.html)
and play with its settings. [Here](https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts) you can find the full list of shortcuts.

## Customization
To make customization easier, we defined the following interface:

```typescript
interface EditorConfig {
  theme: string;
  mode: string;
  printMarginColumn: number;
  wrap: number;
}
```

1) **Theme** allows you to change editor's appearance. To see the full list you can use the same
   [demo](https://ace.c9.io/build/kitchen-sink.html) page mentioned above.
2) **Mode** stands for the language (*html*, *js*, *css*, *xml*, etc.) you use inside the editor. Provides you with
   suitable syntax highlighting and other things. The full list of modes, again, can be found
   [here](https://ace.c9.io/build/kitchen-sink.html).
3) **PrintMarginColumn** is used for setting the position of the vertical line for wrapping. Set the value to **-1** to
   remove the line.
4) **Wrap** number sets the limit of characters before wrapping. Set to **0** to remove wrapping or **true** for wrapping
  on the container's width.

We think that these options are the most common, so we made their configuration easier. All you need is to pass an object
to the editor's attribute *editor-config*, like in the example below:

```html
<uip-editor label="Editor" editor-config="{wrap: 70}"></uip-editor>
```

If you don't specify it, the default one will be used:

```typescript
defaultOptions = {
  theme: 'ace/theme/chrome',
  mode: 'ace/mode/html',
  printMarginColumn: -1,
  wrap: true,
};
```

You can set settings inside the code (in case you want to specify something special):
```typescript
this.editor.setOption('useSoftTabs', true);
this.editor.setOption('theme', 'ace/theme/tomorrow-night');
```

## Example
```html
<uip-editor label="Editor"></uip-editor>
```
