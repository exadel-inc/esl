# [ESL](../../../) Match Height

Version: *1.0.0*

Authors: *Feoktyst Shovchko*, *Alexey Stsefanovich (ala'n)*

<a name="intro"></a>

## ESL Match Height Mixin

`ESLMatchHeight` (`esl-match-height`) is a custom mixin element that equalizes heights of child elements within a container.
It automatically groups elements by their vertical position (row) and sets each group to the maximum height found in that group.

### Configuration

The mixin uses a primary attribute `esl-match-height` with the value being a CSS selector to identify target child elements.
An optional `esl-match-height-order` attribute allows specifying priority ordering for element grouping.

**Attributes:**
- `esl-match-height` (string) - CSS selector to find child elements that should be height-equalized.
  Default value: `[match-height]`
- `esl-match-height-order` (string) - pipe-separated list of CSS selectors defining group priority order.
  Elements matching earlier selectors are grouped before those matching later ones. A wildcard `*` is always appended as the final matcher.

### Usage

Basic usage with default selector:
```html
<div esl-match-height>
  <div match-height>Card 1 content</div>
  <div match-height>Card 2 content (taller)</div>
  <div match-height>Card 3 content</div>
</div>
```

Custom selector:
```html
<div esl-match-height=".card">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>
```

With ordering priority:
```html
<div esl-match-height=".card"
     esl-match-height-order=".card-primary | .card-secondary">
  <div class="card card-primary">Primary card</div>
  <div class="card card-secondary">Secondary card</div>
  <div class="card">Regular card</div>
</div>
```

### Behavior

- On initialization, the mixin queries all matching child elements and equalizes their heights per row.
- The mixin automatically recalculates heights on container resize and font load events.
- Height updates are throttled (200ms) for performance.

### Registration

```javascript
import { ESLMatchHeightMixin } from '@exadel/esl';

ESLMatchHeightMixin.register();
```
