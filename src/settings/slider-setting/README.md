# UIP Slider Setting

**UIPSliderSetting** - custom setting for changing attribute within range of values.
Extends [UIPSetting](src/settings/setting/README.md).

## Description:

Setting behaves like 'range' input with value displayed below. It has the
following attributes:

- *min* - minimum range value.
- *max* - maximum range value.
- *step* - step between range's values.

## Example:

```html
<uip-settings label="Settings">
  <uip-slider-setting label="Width" attribute="width" target=".demo-img" min="0" max="1000"></uip-slider-setting>
</uip-settings>
```
