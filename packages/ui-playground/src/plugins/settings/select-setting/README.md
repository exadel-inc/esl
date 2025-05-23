# UIP Select Setting

**UIPSelectSetting** - custom setting to select attribute's value. Extends [UIPSetting](src/plugins/settings/README.md).

**UIPSelectSetting** is rendered as [ESLSelect](https://github.com/exadel-inc/esl/tree/main/src/modules/esl-forms/esl-select) element.

Select setting has two modes: **replace** and **append**. The first one (is used by default) replaces the attribute
value with selected, and the second one appends selected value to the attribute.

**UIPSelectSetting** also supports **multiple** attribute to allow selecting multiple values.

## Example

```html
<uip-settings>
  <uip-select-setting label="Resolution" attribute="class" mode="append">
    <option value="img-64">64x64</option>
    <option value="img-128">128x128</option>
    <option value="img-256">256x256</option>
    <option value="">None</option>
  </uip-select-setting>
  <uip-select-setting label="Items orientation" attribute="direction">
    <option value="vertical">Vertical</option>
    <option value="horizontal">Horizontal</option>
  </uip-select-setting>
  <uip-select-setting label="Display modifiers" attribute="class" mode="append" multiple>
    <option value="items-aligned-class">Align items</option>
    <option value="centered-content-class">Center content</option>
    <option value="wrap-class">Wrap items</option>
  </uip-select-setting>
</uip-settings>
```
