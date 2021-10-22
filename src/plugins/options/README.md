# UIP Options

[UIPOptions](src/plugins/options/README.md) - custom element which provides visual controls for changing UIP visual appearance.
Extends [UIPPlugin](src/core/README.md#uip-plugin).

## Description:

[UIPOptions](src/plugins/options/README.md) component supports two settings: **theme** and **mode**.

- **Theme** option has two values: *light* (default) and *dark*. It sets color theme for other elements.
- **Mode** option also has two values: *vertical* (default) and *horizontal*. It controls UIP container's layout.

These options can be manually set (and observed) with corresponding *theme* and *mode* attributes:

```html
<uip-options label="Options:" mode="horizontal" theme="dark"></uip-options>
```

[UIPOptions](src/plugins/options/README.md) element doesn't produce or observe UIPStateModel changes.

## Example:
```html
<uip-options label="Options:"></uip-options>
```
