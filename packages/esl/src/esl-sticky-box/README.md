# [ESL](../../../) StickyBox

Version: *1.0.0*.

Authors: *Dmytro Shovchko*.

<a name="intro"></a>

## ESL Sticky Box Mixin

**ESLStickyBoxMixin** (`esl-sticky-box`) is a custom mixin attribute that tracks the sticky state of an element positioned via CSS `position: sticky`.

Native CSS sticky positioning does not provide a way to detect whether an element is currently "stuck" to the edge of its scroll container. The mixin fills this gap: it applies the `position: sticky` styling to its host element and uses an `IntersectionObserver`-based sentinel to detect and expose the stuck state as the `stuck` boolean attribute, so it can be styled or reacted to.

### Configuration

The mixin uses a primary attribute `esl-sticky-box`, with optional configuration passed as a JSON attribute value.

**Configuration options:**
- `root` (string) - CSS selector or [ESLTraversingQuery](../esl-traversing-query/README.md) to define the scrollable container to observe the sticky state relative to. If not set or the target can not be resolved, the browser viewport (`window`) is used

**Attributes:**
- `esl-sticky-box` - primary mixin attribute; its presence attaches the mixin to the host element, and its optional JSON value carries the configuration described above
- `stuck` - boolean state attribute set by the mixin on the host element when the box is currently stuck

### Styling

Once attached, the mixin makes the host a block-level element with `position: sticky` and `top: var(--esl-sticky-box-offset, 0)`. Use the `--esl-sticky-box-offset` CSS variable to control the offset from the top of the scroll container at which the element becomes stuck (this value is also used internally to correctly detect the stuck state).

Internally, the mixin creates a sentinel element right before the host in the DOM to track the intersection state. The sentinel is styled automatically and does not require additional configuration.

### Usage

To use the mixin, apply the `esl-sticky-box` attribute to the element that should become sticky.
The element becomes stuck once it reaches the top of the browser viewport:

```html
<div esl-sticky-box>
  <!-- content to keep sticky -->
</div>
```

Track the stuck state relative to a custom scrollable container instead of the browser viewport by passing a `root` option through the JSON attribute value:

```html
<div class="scroll-container">
  <div esl-sticky-box="{root: '::parent(.scroll-container)'}">
    <!-- content to keep sticky -->
  </div>
</div>
```

Style the element differently once it becomes stuck, and offset it from the top edge:

```css
[esl-sticky-box] {
  --esl-sticky-box-offset: 20px;
}
[esl-sticky-box][stuck] {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.scroll-container {
  height: 300px;
  overflow: auto;
}
```

### Registration

```javascript
import {ESLStickyBoxMixin} from '@exadel/esl';

ESLStickyBoxMixin.register();
```

