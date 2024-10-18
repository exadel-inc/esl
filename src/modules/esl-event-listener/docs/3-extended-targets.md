## <a name="extended-event-targets">Extended `EventTarget`s and standard optimizations</a> <i class="badge badge-sup badge-warning">beta</i>

<a name="-esleventutilsdecorate"></a>

### ⚡ `ESLDecoratedEventTarget.for`

In cases where the original event of the target happens too frequently to be handled every time,
it might be helpful to limit its processing. In purpose to do that ESL allows the creation of decorated `EventTargets`.
The decorated target will process the original target events dispatching with the passed async call decoration function
(such as debounce or throttle).

The `ESLDecoratedEventTarget.for` creates an instance that decorates passed original `EventTarget` event emitting.
The instances of `ESLDecoratedEventTarget` are lazy and do not subscribe to the original event
until they have their own subscriptions of the same event type.

⚠ Note `ESLDecoratedEventTarget.for` method is cached, so created instances will be reused if the inner cache does not
refuse additional arguments of the decorator. The cache does not handle multiple and non-primitive arguments.

```typescript
ESLDecoratedEventTarget.for(
  target: EventTarget,
  decorator: (fn: EventListener, ...args: any[]) => EventListener,
  ...args: any[]
): ESLDecoratedEventTarget;
```

**Parameters**:

- `target` - original `EventTarget` to consume events;
- `decorator` - decoration function to decorate original target `EventListener`s;
- `args` - optional arguments to pass to `decorator`.

**Example:**
```typescript
class Component {
  @listen({
    event: 'scroll', 
    target: ESLDecoratedEventTarget.for(window, throttle)
  })
  onScroll() {}
}
```

#### Sharing of the decorated targets

As was mentioned above, the method `ESLDecoratedEventTarget.for` works with
a cache for simple cases. But in some cases, we might be interested in creating wrappers with a complex
param, or we want to limit params usage across the project.

It might sound obvious, but there are no restrictions on sharing exact instances instead of using the method cache.

```typescript
// shared-event-targets.ts
export const DEBOUNCED_WINDOW = ESLDecoratedEventTarget.for(window, debounce, 1000);
```

```typescript
// module.ts
class Component {
  @listen({event: 'resize', target: DEBOUNCED_WINDOW})
  onResize() {}
}
```

#### Optimize `window.resize` handling with debouncing

```typescript
import {debounce} from '.../debounce';

ESLEventUtils.subscribe(host, {
  event: 'resize',
  target: /* instead just window */ ESLDecoratedEventTarget.for(window, debounce, 250)
}, onResizeDebounced);
```

The sample above allows you to reuse debounced by 250 milliseconds version of the window,
to receive fewer `resize` events
(same as any other event types observed on debounced window version)

#### Optimize `window.scroll` handling with throttling

```typescript
import {throttle} from '.../throttle';

ESLEventUtils.subscribe(host, {
  event: 'scroll',
  target: /* instead just window */ ESLDecoratedEventTarget.for(window, throttle, 250)
}, onScrollThrottled);
```

The sample above allows you to reuse throttled by 250 milliseconds version of the window,
to receive no more than one event per 250 milliseconds `scroll` events
(same as any other event types observed on debounced window version)

<a name="-esleventutilsresize"></a>

### ⚡ `ESLResizeObserverTarget.for`

When you deal with responsive interfaces, you might need to observe an element resizes instead of
responding to the whole window change. There is a tool for this in the native DOM API - `ResizeObserver'.
The only problem is that it does not use events, while in practice, we work with it in the same way.

`ESLResizeObserverTarget.for` creates cached `ResizeObserver` adaptation to `EventTarget` (`ESLResizeObserverTarget`)
that allows you to get `resize` events when the observed element changes its size.

```typescript
ESLResizeObserverTarget.for(el: Element): ESLResizeObserverTarget;
```

**Parameters**:

- `el` - `Element` to observe size changes.

`ESLResizeObserverTarget` creates itself once for an observed object with a weak reference-based cache.
So any way of creating `ESLResizeObserverTarget` will always produce the same instance.

`ESLResizeObserverTarget.for(el) /**always*/ === ESLResizeObserverTarget.for(el)`
So there is no reason to cache it manually.

Usage example:

```typescript
ESLEventUtils.subscribe(host, {
  event: 'resize',
  target: ESLResizeObserverTarget.for(el)
}, onResize);
// or
ESLEventUtils.subscribe(host, {
  event: 'resize',
  target: (host) => ESLResizeObserverTarget.for(host.el)
}, onResize);
```

<a name="-esleventutilswipe"></a>

### ⚡ `ESLSwipeGestureTarget.for` <i class="badge badge-sup badge-success">new</i>

`ESLSwipeGestureTarget.for` is a simple and easy-to-use way to listen for swipe events on any element.

`ESLSwipeGestureTarget.for` creates a synthetic target that produces `swipe` events. It detects `pointerdown` and
`pointerup` events and based on the distance (`threshold`) between start and end points and time (`timeout`) between
`pointerdown` and `pointerup` events, triggers `swipe` event on the target element.

```typescript
ESLSwipeGestureTarget.for(el: Element, settings?: ESLSwipeGestureSetting): ESLSwipeGestureTarget;
```

**Parameters**:

- `el` - `Element` to listen for swipe events on.
- `settings` - optional settings (`ESLSwipeGestureSetting`)

Usage example:

```typescript
ESLEventUtils.subscribe(host, {
  event: 'swipe',
  target: ESLSwipeGestureTarget.for(el)
}, onSwipe);
// or
ESLEventUtils.subscribe(host, {
  event: 'swipe',
  target: (host) => ESLSwipeGestureTarget.for(host.el, {
    threshold: '30px',
    timeout: 1000
  })
}, onSwipe);
```

<a name="-esleventutilwheel"></a>

### ⚡ `ESLWheelTarget.for` <i class="badge badge-sup badge-success">new</i>

`ESLWheelTarget.for` is a simple way to listen for 'inert' (long wheel) scrolls events on any element.
This utility detects `wheel` events, and based on the total amount (distance) of `wheel` events and time (`timeout`) between the first and the last events, it triggers `longwheel` event on the target element.

```typescript
ESLWheelTarget.for(el: Element, settings?: ESLWheelTargetSetting): ESLWheelTarget;
```

**Parameters**:

- `el` - `Element` to listen for long wheel events
- `settings` - optional settings (`ESLWheelTargetSetting`)

The `ESLWheelTargetSetting` configuration includes these optional attributes:
- `distance` - the minimum distance to accept as a long scroll in pixels (400 by default)
- `timeout` - the maximum duration of the wheel events to consider it inertial in milliseconds (100 by default)

Usage example:

```typescript
ESLEventUtils.subscribe(host, {
  event: 'longwheel',
  target: ESLWheelTarget.for(el)
}, onWheel);
// or
ESLEventUtils.subscribe(host, {
  event: 'longwheel',
  target: (host) => ESLWheelTarget.for(host.el, {
    threshold: 30,
    timeout: 1000
  })
}, onWheel);
```

<a name="-esleventutilintersection"></a>

### ⚡ `ESLIntersectionTarget.for` <i class="badge badge-sup badge-success">new</i>

`ESLIntersectionTarget.for` is a way to listen for intersections using Intersection Observer API but in an EventTarget
way.

`ESLIntersectionTarget.for` creates a synthetic target that produces `intersection` events. It detects intersections by
creating `IntersectionObserver` instance, created using passed `settings: IntersectionObserverInit`.

Note: `ESLIntersectionTarget` does not share `IntersectionObserver` instances unlike caching capabilities of adapters
mentioned above.

```typescript
ESLIntersectionTarget.for(el: Element | Element[], settings?: IntersectionObserverInit): ESLIntersectionTarget;
```

**Parameters**:
- `el` - `Element` or `Element[]` to listen for intersection events on;
- `settings` - optional settings (`ESLIntersectionSetting`)

Event API:
Throws `ESLIntersectionEvent` that implements `IntersectionObserverEntry` original interface.

