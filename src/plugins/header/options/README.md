# UIP Options

**UIPOptions** - custom element which provides visual controls for changing UIP visual appearance.
Extends [UIPPlugin](src/core/base/README.md#uip-plugin).

## Description

**UIPOptions** component supports four options:

- **Theme** option toggles *light/dark* theme for UIP components. It uses root's *dark-theme* attribute and
can be hidden with *hide-theme* options' attribute.
- **Direction** option is used to change [UIPPreview](src/core/preview/README.md) content direction (*rtl/ltr*). It uses root's *rtl-direction* attribute and can be hidden with *hide-direction* options' attribute.
- **Settings** option collapses/expands [UIPSettings](src/plugins/settings/README.md) plugin. It uses root's *settings-collapsed*
attribute and can be hidden with *hide-settings* options' attribute.
- **Editor** option collapses/expands [UIPEditor](src/plugins/editor/README.md) plugin. It uses root's *editor-collapsed*
attribute and can be hidden with *hide-editor* options' attribute.

These options can be manually set (and observed) with corresponding attributes:

```html
<uip-root rtl-direction dark-theme></uip-root>

```

**UIPOptions** element doesn't produce or observe UIPStateModel changes.

## Example
```html
<uip-options hide-theme hide-settings></uip-options>
```
