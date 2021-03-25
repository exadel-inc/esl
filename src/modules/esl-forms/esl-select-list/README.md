# [ESL](../../../../README.md) Select List

Version: *1.0.0*.  

Authors: *Alexey Stsefanovich (ala'n)*.

ESLSelectList - is a custom element, for customized selectable list representation.

ESLSelectList is HTML5 form compatible as it decorates the native HTMLSelectElement under the hood.
HTMLSelectElement is used as model for ESLSelect.

### Attributes / Properties

- `select-all-label` - select all options text

- `disabled` - disabled state marker

- `pin-selected` - marker to top pin selected items to top in dropdown

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
