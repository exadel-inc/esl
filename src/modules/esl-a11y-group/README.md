# [ESL](../../../README.md) A11yGroup

Version: *1.0.0*

Authors: *Julia Murashko*

ESL A11y Group - helper custom element that adds a11y group behavior to targets.
ESL A11y Group tracks keyboard to loop focus of the targeting elements (with arrow keyboard keys navigation). 

### Attributes / Properties

- `targets` - property to declare targets for the group using [TraversingQuery](../esl-traversing-query/README.md) syntax. Use group parent element as a base element.
- `activate-selected` - activate the element using `click` event on selection change via esl-a11y-group

### Example
```html
<div class="container">
  <esl-a11y-group targets="::find(.target)"></esl-a11y-group>
  <button class="target"></button>
  <button class="target"></button>
  <button class="target"></button>
</div>
```
