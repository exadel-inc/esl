## UIP Slider Setting

**UIPSliderSetting** - custom setting to change attribute within a range of values.
Extends [UIPSetting](src/plugins/settings/README.md).

Setting behaves like a range input with a value displayed below. It has the following attributes:

- **min** - minimum range value (default: 0).
- **max** - maximum range value (default: 0).
- **step** - step between range's values (default: 0).

### Example

```html
<uip-settings>
  <uip-slider-setting label="Width" attribute="width" target=".demo-img" min="0" max="1000"></uip-slider-setting>
</uip-settings>
```
