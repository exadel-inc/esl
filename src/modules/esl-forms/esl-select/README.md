# [ESL](../../../../) Select

Version: *1.1.0*

Authors: *Alexey Stsefanovich (ala'n)*

<a name="intro"></a>

**ESLSelect** is a component on top of native select that brings more customization features.
Uses "select with dropdown" view. Supports both single and multiple selection.

### Attributes / Properties

- `placeholder` - placeholder text for element

- `has-value-class` - class(es) to mark not empty state

- `has-focus-class` - class(es) for focused state. Select ia also focused if the dropdown list is opened

- `dropdown-class` - class(es) for select dropdown

- `select-all-label` - select all options text

- `more-label-format` - text to add when there is not enough space to show all selected options inline. 
  Supports `{rest}`, `{length}` and `{limit}` placeholders
  
- `open` - dropdown open marker

- `disabled` - disabled state marker

- `pin-selected` - marker for selecting items to be pinned to the top of the dropdown

### Example

```html
<esl-select class="form-group"
            pin-selected
            placeholder="Color"
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
