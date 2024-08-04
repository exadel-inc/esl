# UIP Theme Toggle

**UIPThemeSwitcher** - theme switcher plugin for UI Playground.

The theme switcher can be added to the UI Playground toolbar header or to the Settings toolbar 
via attribute *theme-toggle*.

## Example 1
 
```html
<uip-root>
  <div class="uip-toolbar">
    <uip-snippets></uip-snippets>
    <uip-theme-toggle></uip-theme-toggle>
  </div>
    ...
</uip-root>
```
## Example 2

```html
<uip-settings theme-toggle resizable collapsible>
  <uip-select-setting label="Color:" attribute="class" mode="append">
    <option value="gray-clr">Dark gray</option>
    <option value="blue-clr">Blue</option>
    <option value="purple-clr">Purple</option>
  </uip-select-setting>
</uip-settings>
```
