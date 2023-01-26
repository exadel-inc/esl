# UIP Settings

**UIPSettings** - custom element which stores settings (**UIPSetting**).
Extends [UIPPlugin](src/core/base/README.md#uip-plugin).

## Description

We use **UIPSettings** as a container for **UIPSetting** elements. It serves as a link between
our standard UIP flow for change detection and settings updates.

**UIPSettings** updates settings using current state ([UIPStateModel](src/core/base/README.md#uip-state-model))
and vice versa


To get updates from inner settings we listen for *uip:change* event, then pass markup updates to [UIPRoot](src/core/base/README.md#uip-root).

**UIPSettings** component has the following attributes:
- **label** - settings section displayed name.
- **target** - sets **target** attribute for all inner **UIPSetting** elements (can be overwritten
  by own attribute value).

# UIP Setting

**UIPSetting** - custom element for manipulating with elements attributes. Custom settings should extend
*UIPSetting* class if you want them to be connected with [UIPSettings] properly.

## Description

- Processes markup to update own value via **updateFrom()** (uses [UIPStateModel](src/core/base/README.md#uip-state-model) by default).
- Updates markup with **applyTo()** (uses [UIPStateModel](src/core/base/README.md#uip-state-model) by default).
- Dispatches **uip:change** event to let *UIPSettings* know about setting changes.

These things have default implementation. Also, there are **isValid()** and **setInconsistency()** methods to deal with
incorrect setting states. **isValid()** can be used to add custom validation and **setInconsistency()** is used to somehow
let user know about inconsistent state (when there are multiple setting values, no target, etc.).

Methods needed to be implemented:
- **getDisplayedValue()** for getting value from custom setting.
- **setValue()** for setting setting value.

The following attributes used:
- **label** - setting displayed name.
- **target** - sets target to which the setting is attached.
- **attribute** - attribute of the **target** which is changed by the setting.

You can see the examples of custom settings here (these are distributed together with other *UIP* elements):
- [UIPTextSetting](src/settings/text-setting/README.md)
- [UIPBoolSetting](src/settings/bool-setting/README.md)
- [UIPSelectSetting](src/settings/select-setting/README.md)
  
## Example

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
