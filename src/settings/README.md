# UIP Settings

[UIPSettings](README.md) - custom element which stores settings ([UIPSetting](setting/README.md)).

---

### Notes:
- Extends [UIPPlugin](../core/README.md).
- Parses markup using [UIPStateModel](../utils/state-model/state-model.ts), distributes changes among inner
  [UIPSetting](setting/README.md) components and vice versa.
- Listens for *uip:change* event to pass markup updates to [UIPRoot](../core/root/README.md).

The following attributes used:
- **label** - settings section displayed name.
- **target** - sets **target** attribute for all inner [UIPSetting](setting/README.md) elements (can be overwritten
  by own attribute value).

---

### Example:

```html
<uip-settings label="Settings" target=".esl-media">
  <!--  Bool Setting-->
  <uip-bool-setting label="Controls" attribute="controls"></uip-bool-setting>
  <!--  Text Setting-->
  <uip-text-setting label="Media id" attribute="media-id"></uip-text-setting>
  <!--  List Setting-->
  <uip-select-setting label="Fill mode" attribute="fill-mode">
    <option value="auto">Auto mode</option>
    <option value="cover">Cover mode</option>
    <option value="inscribe">Inscribe mode</option>
  </uip-select-setting>
  <uip-select-setting label="Font" target=".card" attribute="class" mode="append">
    <option value="italic-class">Italic</option>
    <option value="bold-class">Bold</option>
  </uip-select-setting>
</uip-settings>
```
