# [ESL](../../../) StickyBox

Version: *1.0.0*.

Authors: *Dmytro Shovchko*.

<a name="intro"></a>

**ESLStickyBox** (`esl-sticky-box`) is a lightweight custom element that tracks the sticky state of an element positioned via CSS `position: sticky`.

Native CSS sticky positioning does not provide a way to detect whether an element is currently "stuck" to the edge of its scroll container. `ESLStickyBox` fills this gap: it applies the `position: sticky` styling itself and uses an `IntersectionObserver`-based sentinel to detect and expose the stuck state as the `stuck` boolean attribute, so it can be styled or reacted to.

### Attributes / Properties

- `root` - CSS selector or [ESLTraversingQuery](../esl-traversing-query/README.md) to define the scrollable container to observe the sticky state relative to. If not set or the target cannot be resolved, the browser viewport (`window`) is used
- `stuck` - boolean state attribute set by the component when the box is currently stuck

### Configuration

`ESLStickyBox` renders as a block-level element with `position: sticky` and `top: var(--esl-sticky-box-offset, 0)`. Use the `--esl-sticky-box-offset` CSS variable to control the offset from the top of the scroll container at which the element becomes stuck (this value is also used internally to correctly detect the stuck state).

Internally, the component creates a sentinel element right before itself in the DOM to track the intersection state. The sentinel is styled automatically and does not require additional configuration.

### Usage

Basic usage - the element becomes stuck once it reaches the top of the browser viewport:

```html
<esl-sticky-box>
  <!-- content to keep sticky -->
</esl-sticky-box>
```

Track the stuck state relative to a custom scrollable container instead of the browser viewport:

```html
<div class="scroll-container">
  <esl-sticky-box root="::parent(.scroll-container)">
    <!-- content to keep sticky -->
  </esl-sticky-box>
</div>
```

Style the element differently once it becomes stuck, and offset it from the top edge:

```css
esl-sticky-box {
  --esl-sticky-box-offset: 20px;
}
esl-sticky-box[stuck] {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.scroll-container {
  height: 300px;
  overflow: auto;
}
```
