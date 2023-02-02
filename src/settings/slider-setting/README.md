# UIP Slider Setting

**UIPSliderSetting** - custom setting for changing attribute within range of values.
Extends [UIPSetting](src/plugins/settings/README.md).

## Description

Setting behaves like 'range' input with value displayed below. It has the
following attributes:

- *min* - minimum range value (default: 0).
- *max* - maximum range value (default: 0).
- *step* - step between range's values (default: 0).

## Example

```html
<uip-settings label="Settings">
  <uip-slider-setting label="Width" attribute="width" target=".demo-img" min="0" max="1000"></uip-slider-setting>
</uip-settings>
```
