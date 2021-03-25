# [ESL](../../../../README.md) Select

Version: *1.0.0*.

Authors: *Alexey Stsefanovich (ala'n)*.

ESLSelect - is a custom element, for customized select element.

ESLSelect is HTML5 form compatible as it decorates the native HTMLSelectElement under the hood.
HTMLSelectElement is used as model for ESLSelect.

### Attributes / Properties

- `empty-text` - placeholder text for element

- `has-value-class` - class(es) to mark not empty state

- `has-focus-class` - class(es) for focused state. Select focused also if the dropdown list is opened

- `select-all-label` - select all options text

- `more-label-format` - text to add when not enough space to show all selected options inline. 
  Supports `{rest}`, `{length}` and `{limit}` placeholders
  
- `open` - dropdown open marker

- `disabled` - disabled state marker

- `pin-selected` - marker to top pin selected items to top in dropdown

### Example

```html
<esl-select class="form-group"
            pin-selected
            empty-text="Color"
            select-all-label="All Colors">
  <label for="color_field" class="form-label">Color</label>
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
</esl-select>
```
