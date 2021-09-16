# [ESL](https://exadel-inc.github.io/esl/) A11yGroup

Version: *1.0.0*

Authors: *Julia Murashko*

<a name="intro"></a>

ESLA11yGroup - a helper custom element that adds a11y group behavior to targets.
ESLA11yGroup tracks keyboard to loop focus of the targeting elements (with arrow keyboard keys navigation). 

### Attributes / Properties

- `targets` - property to declare targets for the group using [TraversingQuery](https://exadel-inc.github.io/esl/utils/esl-traversing-query/) syntax. Use group parent element as a base element.
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
