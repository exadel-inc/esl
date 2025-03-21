# [ESL](../../../) Drag to Scroll

Version: *1.0.0*

Authors: *Anna Barmina*, *Alexey Stsefanovich (ala'n)*

<a name="intro"></a>

## ESL Drag To Scroll Mixin

`ESLDragToScrollMixin` (`esl-drag-to-scroll`) is a custom attribute that enables drag-to-scroll functionality for any scrollable container element.
This mixin enhances user experience by allowing intuitive drag-based scrolling, making it easier to navigate through content.

### Configuration
The mixin uses a primary attribute, `esl-drag-to-scroll`, with optional configuration passed as a JSON attribute value.

**Configuration options:**
- `axis` (string) - determines the scrolling axis to control. Possible values:
  - `'both'` - both horizontal and vertical scrolling (by default);
  - `'x'` - horizontal scrolling only;
  - `'y'` - vertical scrolling only.
- `cls` (string) - class to apply to the element during dragging to indicate the drag state.
  By default, the class `dragging` is applied.
- `tolerance` (number) - a minimum distance to move before the drag action starts.
  By default, the value is 10.
- `selection` (boolean) - Determines whether the text should prevent the drag-scroll action. The default value is true.

**Default Configuration"**
The default configuration for the mixin is as follows:
```json
{
    "axis": "both",
    "cls": "dragging",
    "tolerance": 10,
    "selection": true
}
```

### Usage

To use the mixin, apply the `esl-drag-to-scroll` attribute to your scrollable container element.
```html
<div class="esl-scrollable-content" esl-drag-to-scroll>
  <!-- Content here -->
</div>
```

You can also provide **custom configuration** through the JSON attribute.
For example, to enable horizontal scrolling only, disable text selection, and use a custom class `is-dragging` during the drag.
```html
<div class="esl-scrollable-content" esl-drag-to-scroll="{axis: 'x', cls: 'is-dragging', selection: false}">
  <!-- Content here -->
</div>
```
