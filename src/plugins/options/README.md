# UIP Options

**UIPOptions** - custom element which provides visual controls for changing UIP visual appearance.
Extends [UIPPlugin](src/core/base/README.md#uip-plugin).

## Description:

**UIPOptions** component supports three settings: **theme**, **mode** and **direction**.

- **Theme** can be *light* (default) and *dark*. It sets color theme for other elements.
- **Mode** can be *vertical* (default) and *horizontal*. It controls UIP container's layout.
- **Direction** can be *ltr* (default) and *rtl*. It changes the direction of preview's content.

These options can be manually set (and observed) with corresponding attributes:

```html
<uip-root mode="horizontal" theme="dark" direction="rtl"></uip-root>
```

**UIPOptions** element doesn't produce or observe UIPStateModel changes.

## Example:
```html
<uip-options label="Options:"></uip-options>
```
