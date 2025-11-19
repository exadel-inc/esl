# [ESL](../../../) Incremental Scroll

Version: *1.0.0-beta*.

Authors: *Dmytro Shovchko*.

***Important Notice: this component is in beta. It has been thoroughly tested and is ready for use; however, its API may undergo some changes.***

<a name="intro"></a>

**ESL Incremental Scroll** is a utility module that provides smooth, adaptive scrolling to elements with dynamic content support.

Unlike standard scrolling methods, incremental scroll recalculates the target position on every animation frame, making it ideal for pages with animations, transformations, or dynamically changing content. The scroll automatically adjusts to content changes during the animation, ensuring the element reaches the correct final position.

### Key Features:

- **Incremental positioning** - recalculates target position on each frame to handle dynamic content and animations
- **Promise-based API** - returns a Promise that resolves when scroll completes
- **AbortController support** - allows canceling scroll operations
- **Flexible alignment strategies** - built-in strategies for positioning elements (top, middle, bottom, left, center, right)
- **Custom scroll containers** - works with both window and custom scrollable containers
- **Configurable defaults** - set global default options for consistent behavior across your application

---

## Getting Started

```typescript
import {incrementalScrollTo, alignToTop, alignToMiddle} from '@exadel/esl/modules/esl-incremental-scroll';

// Simple scroll to element
await incrementalScrollTo(element);

// Scroll with alignment
await incrementalScrollTo(element, {
  alignment: {
    y: alignToMiddle
  }
});
```

---

## ESLIncrementalScrollTo API

`ESLIncrementalScrollTo(element, options)` - main function to perform incremental scroll.

**Parameters:**
- `element` - target HTMLElement to scroll to, or `null` to page scroll based on alignment strategy only
- `options` - optional configuration object

**Returns:** `Promise<void>` that resolves when scroll completes or rejects if aborted

**Example:**
```typescript
const $target = document.querySelector('.target');

// Basic usage with default options
await ESLIncrementalScrollTo($target);

// With options
await ESLIncrementalScrollTo($target, {
  alignment: {
    y: alignToTop
  },
  offset: 30,
  timeout: 3000,
  stabilityThreshold: 300
});

// With AbortController
const controller = new AbortController();
ESLIncrementalScrollTo($target, {signal: controller.signal});
// Later: controller.abort();
```

---

## Configuration Options

- `alignment` - alignment strategies for x and y axes
  - `x` - horizontal alignment strategy (default: `keepPosition`)
  - `y` - vertical alignment strategy (default: `keepPosition`)
- `offset` - additional offset in pixels
  - Can be a number (applied to both axes) or object `{x?: number, y?: number}` (`0` by default)
- `scrollContainer` - custom scrollable container element (`window` by default)
- `stabilityThreshold` - time in milliseconds to ensure content stops shifting before completing scroll (default: `500`)
- `timeout` - maximum scroll duration in milliseconds (`4000` by default)
- `signal` - AbortSignal to cancel the scroll operation

---

## Alignment Strategies

Alignment strategies determine how the element should be positioned relative to the viewport or scroll container.

**Important:** Alignment strategies are not included in the default export to keep your bundle size minimal and enable effective tree-shaking. You need to explicitly import only the strategies you actually use in your application.

### Vertical Alignment

- `alignToTop` - positions element at the top
- `alignToMiddle` - centers element vertically
- `alignToBottom` - positions element at the bottom

### Horizontal Alignment

- `alignToLeft` - positions element at the left edge
- `alignToCenter` - centers element horizontally
- `alignToRight` - positions element at the right edge

### No Alignment

- `keepPosition` - keeps current scroll position unchanged (default for both axes)

**Example:**
```typescript
import {
  ESLIncrementalScrollTo,
  alignToTop,
  alignToMiddle,
  alignToCenter
} from '@exadel/esl/modules/esl-incremental-scroll';

// Align to top with offset
await ESLIncrementalScrollTo(element, {
  alignment: {
    y: alignToTop
  }
});

// Center both axes
await ESLIncrementalScrollTo(element, {
  alignment: {
    x: alignToCenter,
    y: alignToMiddle
  }
});
```

---

## Setting Default Options

You can configure global default options that will be applied to all scroll operations.

`setESLIncrementalScrollDefaults(overrides)` - sets default options for incremental scroll. Only defined values will be applied.

**Example:**
```typescript
import {setESLIncrementalScrollDefaults, alignToMiddle, ESLIncrementalScrollTo} from '@exadel/esl/modules/esl-incremental-scroll';

// Set global defaults
setESLIncrementalScrollDefaults({
  alignment: {
    y: alignToMiddle({})
  },
  offset: 20,
  stabilityThreshold: 300,
  timeout: 3000
});

// Now all scrolls will use these defaults
await ESLIncrementalScrollTo(element); // Will center vertically with 20px offset
```

`getESLIncrementalScrollDefaults()` - returns a copy of current default options.

---
