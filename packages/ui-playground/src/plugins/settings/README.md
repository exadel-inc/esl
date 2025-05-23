# UIP Settings

**UIPSettings** - custom element which stores settings (**UIPSetting**).
Extends [UIPPlugin](src/core/README.md#uip-plugin).

**UIPSettings** is used as a container for **UIPSetting** elements. It serves as a link between
our standard UIP flow for change detection and settings updates.
**UIPSettings** provides active internal settings items and updates them when the state changes.

**UIPSettings** has also its own toolbar where the theme or text direction for UIPlayground can be specified using the *theme-toggle* and *dir-toggle* attributes.

# UIP Setting

**UIPSetting** - custom element for manipulating element attributes. Custom settings should extend
*UIPSetting* class.

**UIPSetting** processes markup to update own value via *updateFrom()* and updates it with *applyTo()*.
**UIPSetting** dispatches *uip:change* event to let **UIPSettings** know about setting changes.

These things have default implementation. 
There are also *isValid()* and *setInconsistency()* methods to handle incorrect setting states. 
*isValid()* can be used to add custom validation and *setInconsistency()* is used to let user know about inconsistent state (when there are multiple setting values, no target, etc.).

Methods needed to be implemented:
- **getDisplayedValue()** to get value from custom setting.
- **setValue()** to set setting's value.

The following attributes used:
- **label** - setting's displayed name.
- **target** - sets target to which the setting is attached. If you want to set the same target for all settings, use *target* attribute on *UIPSettings*. 

Examples of existing custom settings:
- [UIPTextSetting](src/plugins/text-setting/README.md)
- [UIPBoolSetting](src/plugins/bool-setting/README.md)
- [UIPSelectSetting](src/plugins/select-setting/README.md)
- [UIPSliderSetting](src/plugins/slider-setting/README.md)
  
## Example

```html
<uip-settings resizable collapsible theme-toggle dir-toggle target=".esl-media">
  <!--Bool Setting-->
  <uip-bool-setting label="Controls" attribute="controls"></uip-bool-setting>
  <!--Text Setting-->
  <uip-text-setting label="Media id" attribute="media-id"></uip-text-setting>
  <!--Slider Setting-->
  <uip-slider-setting label="Width:" attribute="width" min="50" max="150"></uip-slider-setting>
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
