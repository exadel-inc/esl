# UIP Bool Setting

**UIPBoolSetting** - custom setting for adding/removing attributes or appending values to attribute.
Extends [UIPSetting](src/plugins/settings/README.md).

## Description

**UIPBoolSetting** represents a checkbox. It has *value* attribute for adding/removing this *value*
from attributes.

This setting can exist in two modes: **replace** and **append**.

**replace** mode is used by default. There are two ways to interpret it: when there is a *value* attribute
specified and when it's not. When it's not specified, the setting adds/removes attribute specified in *attribute*.
If we define *value*, the setting sets *attribute* value to it.

The idea of **append** mode is to add/discard *value* (must be specified for this mode) to the *attribute*.
For example, it can be useful for adding *css* classes (see example below).

## Example

```html
<uip-settings label="Settings" target=".demo-img">
  <!--  Replace mode -->
  <uip-bool-setting label="Linked image" attribute="linked"></uip-bool-setting>
  <!--  Append mode -->
  <uip-bool-setting label="Save ratio" attribute="class" value="save-ratio-class"></uip-bool-setting>
</uip-settings>
```
