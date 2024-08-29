# UIP Settings

**UIPSettings** - custom element which stores settings (**UIPSetting**).
Extends [UIPPlugin](src/core/README.md#uip-plugin).

## Description

We use **UIPSettings** as a container for **UIPSetting** elements. It serves as a link between
our standard UIP flow for change detection and settings updates.

# UIP Setting

**UIPSetting** - custom element to manipulate elements' attributes. Custom settings should extend
*UIPSetting* class if you want them to be connected with *UIPSettings* properly.

## Description

- Processes markup to update own value via *updateFrom()* (uses [UIPStateModel](src/core/README.md#uip-state-model) by default).
- Updates markup with *applyTo()* (uses [UIPStateModel](src/core/README.md#uip-state-model) by default).
- Dispatches *uip:change* event to let *UIPSettings* know about setting changes.

These things have default implementation. Also, there are *isValid()* and *setInconsistency()* methods to deal with
incorrect setting states. *isValid()* can be used to add custom validation and *setInconsistency()* is used to somehow
let user know about inconsistent state (when there are multiple setting values, no target, etc.).

Methods needed to be implemented:
- **getDisplayedValue()** to get value from custom setting.
- **setValue()** to set setting's value.

The following attributes used:
- **label** - setting's displayed name.
- **target** - sets target to which the setting is attached. If you want to set the same target for all settings, use *target* attribute on *UIPSettings*. 
- **attribute** - attribute of the *target* which is changed by the setting.
- **hideable** - hides settings tab when no active settings inside

You can see the examples of custom settings here (these are distributed together with other *UIP* elements):
- [UIPTextSetting](src/plugins/text-setting/README.md)
- [UIPBoolSetting](src/plugins/bool-setting/README.md)
- [UIPSelectSetting](src/plugins/select-setting/README.md)
- [UIPSliderSetting](src/plugins/slider-setting/README.md)
  
## Example

```html
<uip-settings hideable target=".esl-media">
  <!--Bool Setting-->
  <uip-bool-setting label="Controls" attribute="controls"></uip-bool-setting>
  <!--Text Setting-->
  <uip-text-setting label="Media id" attribute="media-id"></uip-text-setting>
  <!--Select Setting-->
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
