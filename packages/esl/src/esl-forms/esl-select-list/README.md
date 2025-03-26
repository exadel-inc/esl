# [ESL](../../../../) Select List

Version: *1.0.0*

Authors: *Alexey Stsefanovich (ala'n)*

<a name="intro"></a>

**ESLSelectList** is a component to show selectable list of items. Decorates native `HTMLSelectElement`
`ESLSelectList` is HTML5 form compatible. Uses `HTMLSelectElement` as a data model.

### Attributes / Properties

- `select-all-label` - select all options text

- `disabled` - disabled state marker

- `pin-selected` - marker for selecting items to be pinned to the top of the list

### Example

```html
<esl-select-list class="form-control" select-all-label="Select All Colors">
  <select esl-select-target
          multiple
          id="color_field"
          name="color_field"
          class="form-control">
    <option value="#f00">Red</option>
    <option value="#0f0">Green</option>
    <option value="#00f">Blue</option>
    <option value="#ff0">Yellow</option>
    <option value="#0ff">Light Blue</option>
    <option value="#f0f">Purple</option>
  </select>
</esl-select-list>
```
