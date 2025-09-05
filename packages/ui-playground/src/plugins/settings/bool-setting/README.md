## UIP Bool Setting

**UIPBoolSetting** - custom setting to add/remove attributes or append values to an attribute.
Extends [UIPSetting](src/plugins/settings/README.md).

**UIPBoolSetting** represents a checkbox. It has a *value* attribute to add/remove this *value*
from attributes.

The setting can exist in two modes: **replace** and **append**.

**replace** mode is used by default. There are two ways to interpret it: when there is a *value* attribute
specified and when it's not. When it's not specified, the setting adds/removes attribute specified in *attribute*.
If we define *value*, the setting sets *attribute* value to it.

The idea of **append** mode is to add/discard *value* (must be specified for this mode) to the *attribute*.
For example, it can be useful for adding css classes (see example below).

### Example

```html
<uip-settings target=".demo-img">
  <!--Replace mode-->
  <uip-bool-setting label="Linked image" attribute="linked"></uip-bool-setting>
  <!--Append mode-->
  <uip-bool-setting label="Save ratio" attribute="class" value="save-ratio-class"></uip-bool-setting>
</uip-settings>
```
