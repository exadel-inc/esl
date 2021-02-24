# UIP Settings, UIP Setting

UIPSettings - custom element which stores settings. UIPSetting - custom element (setting) that changes component's attribute in
the markup.

---

### Notes:

- UIPSettings:
  - Listens for '*state:change*' event of parent [UIP Root](../core/README.md).
  - Parses markup and distributes changes among child settings components and vice versa.


- UIPSetting:
  - There are 3 types of settings:
    - input
    - list
    - checkbox
    - class
  - UIPSetting has required attribute 'selector' that determines to which elements setting should be applied.
  - UIPSetting has required attribute 'name' that refers to attribute name which should be changed.
  - UIPListSetting, UIPClassSetting should contain <uip-list-item>. <uip-list-item> has setting name in text content, while value stores
    in the attribute 'value'.

---

### Example:

```html
<uip-settings>
  <!--  Check Setting-->
  <uip-check-setting name="controls" for="esl-media"></uip-check-setting>
  <!--  Input Setting-->
  <uip-text-setting name="media-id" for="esl-media"></uip-text-setting>
  <!--  List Setting-->
  <uip-list-setting name="fill-mode" for="esl-media">
    <uip-list-item value="auto">Auto mode</uip-list-item>
    <uip-list-item value="cover">Cover mode</uip-list-item>
    <uip-list-item value="inscribe">Inscribe mode</uip-list-item>
  </uip-list-setting>
  <!--  Class setting-->
  <uip-class-setting name="font" selector=".card">
    <uip-list-item value="italic">italic</uip-list-item>
    <uip-list-item value="bold">bold</uip-list-item>
  </uip-class-setting>
</uip-settings>
```
