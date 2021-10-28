# UIP Settings

[UIPSettings](src/plugins/settings/settings/README.md) - custom element which stores settings ([UIPSetting](src/plugins/settings/settings/setting/README.md)).
Extends [UIPPlugin](src/core/README.md#uip-plugin).

## Description:

We use [UIPSettings](src/plugins/settings/settings/README.md) as a container for [UIPSetting](setting/README.md) elements. It serves as a link between
our standard UIP flow for change detection and settings updates.

[UIPSettings](src/plugins/settings/settings/README.md) updates settings using current state ([UIPStateModel](src/core/README.md#uip-state-model))
and vice versa (more info can be found in [UIPSetting](src/plugins/settings/settings/setting/README.md) docs)


To get updates from inner settings we listen for *uip:change* event, then pass markup updates to [UIPRoot](src/core/README.md#uip-root).

[UIPSettings](src/plugins/settings/settings/README.md) component has the following attributes:
- **label** - settings section displayed name.
- **target** - sets **target** attribute for all inner [UIPSetting](src/plugins/settings/settings/setting/README.md) elements (can be overwritten
  by own attribute value).
  
## Example:

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
