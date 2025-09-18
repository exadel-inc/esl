**UIPDirSwitcher** - text direction switcher plugin for UIPlayground.

The text direction switcher can be added to the UIPlayground toolbar header or to the Settings toolbar
via attribute *dir-toggle*.

## Example

```html
<uip-root>
  <div class="uip-toolbar">
    <uip-snippets></uip-snippets>
    <uip-dir-toggle></uip-dir-toggle>
  </div>
    ...
</uip-root>
```
## Attribute Example

```html
<uip-settings dir-toggle resizable collapsible>
  <uip-select-setting label="Color:" attribute="class" mode="append">
    <option value="gray-clr">Dark gray</option>
    <option value="blue-clr">Blue</option>
    <option value="purple-clr">Purple</option>
  </uip-select-setting>
</uip-settings>
```
