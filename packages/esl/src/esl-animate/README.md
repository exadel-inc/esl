# [ESL](https://exadel-inc.github.io/esl/) Animate

Version: *2.0.0*.

Authors: *Anna-Mariia Petryk*, *Feoktyst Shovchko*, *Alexey Stsefanovich (ala'n)*, *Julia Murashko*.

<a name="intro"></a>

`esl-animate` is a module that provides service and its DOM API to animate elements on their intersection with the viewport

The module consists of the JS API `ESLAnimateService`, a custom element `ESLAnimate`, and a mixin `ESLAnimateMixin`.
`ESLAnimateService` is the core: elements must be registered with the service (via its static API or the provided elements)
to receive animation classes on viewport intersection.

### Module Features:
- Add class(es) when observed elements enter the viewport area
- Animate in a group, that allows adding an animation delay for each next item in the intersection queue
- Automatic re-animation after the item exits the viewport area
- Pre-defined CSS animations
  - `esl-animate-fade`
  - `esl-animate-slide left`
  - `esl-animate-slide right`
  - `esl-animate-slide up`
  - `esl-animate-slide down`

## `ESLAnimateService`

**ESLAnimateService** provides a way to asynchronously add animation on the intersection of a target element with a viewport. It is based on [Intersection Observer Api](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and serves as a core functionality for `ESLAnimate` and `ESLAnimateMixin` elements.

### Service static and instance API:

- `ESLAnimateService.observe(targets, config)` — subscribe target element(s) for viewport-triggered animation.
  - `targets` — an Element or an array of Elements to observe
  - `config` — optional `ESLAnimateConfig` describing animation behavior for the targets
- `ESLAnimateService.unobserve(targets)` — unsubscribe target element(s) and remove internal tracking
- `ESLAnimateService.isObserved(el)` — returns `true` if the element is currently observed by the service

The static API is a convenience around a memoized shared service instance (so repeated calls operate on the same
service). You may also instantiate `ESLAnimateService` directly if you need a separate instance.

### Configuration API: `ESLAnimateConfig`
- `cls` (default: `in`) — CSS class(es) to add when an element becomes visible. Supports ESL extended class syntax
  (see [CSSClassUtils](../esl-utils/dom/class.ts)).
- `group` (boolean) — enable grouped animation: items from the visibility queue will start with `groupDelay` between
  them.
- `groupDelay` (default: `100`) — delay in milliseconds between items when `group` is enabled.
- `repeat` (boolean) — if `true`, the item will be re-animated each time it exits and re-enters the viewport.
- `force` (boolean) — when `true`, the service will remove the animation class (if present) on subscribe so the
  element can be animated again immediately after observation is attached.
- `ratio` (default: `0.4`) — intersection ratio used to consider the element visible. Typical supported values are
  0.2, 0.4, 0.6, 0.8 (the service shares a single IntersectionObserver instance configured with thresholds
  `[0.001, 0.2, 0.4, 0.6, 0.8, 1]`). Items are considered invisible when intersection is at or below ~1%.
- `disableOn` — media-query condition (used by `ESLMediaQuery`) that disables animation when matched (default: `not all`).
- `disableCls` — class applied to mark the element as having animations disabled (default: `esl-animate-inactive`).

## `ESLAnimate` custom element

**ESLAnimate** is a custom element that subscribes `ESLAnimateService` to elements from html.

To use ESLAnimate you need to include the following code:
```js
  ESLAnimate.register();
```
### `ESLAnimate` Attributes | Properties:
- `target` — target element(s) to animate, defined by [ESLTraversingQuery](../esl-traversing-query/README.md). When
  empty the `<esl-animate>` element itself is used (acts as a wrapper).
- `cls` (default: `in`) — CSS class(es) to add on visibility (supports ESL `CSSClassUtils`).
- `group` (boolean) — enable grouped animation for target items.
- `groupDelay` (default: `100`) — grouped animation delay in milliseconds.
- `repeat` (boolean) — re-animate items on each enter/exit cycle.
- `ratio` — intersection ratio to consider element visible (recommended: 0.2, 0.4, 0.6, 0.8; default: 0.4).
- `disableOn` — media-query condition that disables animation when matched (default: `not all`).
- `disableCls` — CSS class applied when animation is disabled (default: `esl-animate-inactive`).

By default, attributes `group`, `repeat`, `target`, `disableOn` and `disableCls` are observed and will trigger
reinitialization when changed. Call the instance method `reanimate()` to reinitialize observation manually; the element
will request a forced re-animation when it reattaches targets.

### Use cases
- plugin (target attribute defined)
```html
<esl-animate target="::next::child(li)"></esl-animate>
<ul>
    <li class="esl-animate-fade">...</li>
    <li class="esl-animate-fade">...</li>
    ...
</ul>
```
**Note: `<esl-animate>` hidden (`display: none`) by default when there is no content inside** 

- wrapper (no target attribute defined)
```html
<esl-animate class="esl-animate-fade" cls="in">
    ...HTML Content...
</esl-animate>
```

## `ESLAnimateMixin`

**ESLAnimateMixin** is an ESL mixin attribute that automatically subscribes `ESLAnimateService` to the element from html.

To use ESLAnimateMixin you need to include the following code:
```js
  ESLAnimateMixin.register();
```

### `ESLAnimateMixin` Attributes | Properties:
- `esl-animate-mixin` - json attribute containing following properties:
  - `cls` (`in` by default) - CSS class(es) to control animation. The control class(es) will be added to observed element(s), after they had intersected with vieport area. Service supports ESL extended class definition syntax, [CSSClassUtils](../esl-utils/dom/class.ts)
  - `repeat` (boolean) - refresh (re-animate) items when they became invisible (exit viewport)
  - `ratio` (0.2|0.4|0.6|0.8) - intersection ratio to consider an element as visible
    Only 0.2 (20%), 0.4 (40%), 0.6 (60%), 0.8 (80%) values are allowed due to sharing of the IntersectionObserver instance
    with a fixed set of thresholds defined

Apart from `ESLAnimate` module mixin doesn't observe any of the element attributes. But you can do the re-animation manually by calling instance method `reanimate()`.

### Use cases
- default declaration
```html
<div esl-animate>...HTML Content...</div>
```
- custom config
```html
<div esl-animate="{repeat: true, ratio: 0.2, cls: 'in'}">...HTML Content...</div>
```
