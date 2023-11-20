# [ESL](../../../) A11yGroup

Version: *2.0.0*.

Authors: *Julia Murashko*.

<a name="intro"></a>

**ESLA11yGroup** - a helper custom element that adds a11y group behavior to targets.

ESLA11yGroup tracks the keyboard to loop focus on the targeting elements (with arrow keyboard keys navigation).

### Attributes / Properties

- `targets` - property to declare targets for the group using [ESLTraversingQuery](../esl-traversing-query/README.md) syntax. Use group parent element as a base element
- `activate-selected` - activates the element using `click` event on selection change via esl-a11y-group
- `prevent-scroll` - prevents scroll when the target receives focus

### Example

```html
<div class="container">
  <esl-a11y-group targets="::child(.target)"></esl-a11y-group>
  <button class="target"></button>
  <button class="target"></button>
  <button class="target"></button>
</div>
```
