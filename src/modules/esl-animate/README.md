# [ESL](https://exadel-inc.github.io/esl/) Animate

Version: *2.0.0*.

Authors: *Anna-Mariia Petryk*, *Feoktyst Shovchko*, *Alexey Stsefanovich (ala'n)*, *Julia Murashko*.

<a name="intro"></a>

`esl-animate` is a module that provides service and its DOM API to animate elements on their intersection with the viewport

The module consists of JS API `ESLAnimateService`, Custom element `ESLAnimate`, and Mixin element `ESLAnimateMixin`.
ESLAnimateService is a core of the `esl-animate` module. Element needs to be observed by ESLAnimateService in order to be
animated.

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

- `ESLAnimateService.observe(els, config)` - method to start element observation
  - `els` - element or array of elements to observe and animate
  - `config` - optional ESLAnimateConfig object to describe the behavior of the animation functionality
- `ESLAnimateService.unobserve(els)` - method to unsubscribe ESLAnimateService from observing elements
- `ESLAnimateService.isObserved(el)` - check if the element is observed by ESLAnimateService

You can also create a separate (from global) `ESLAnimateService` instance by calling its constructor.

### Configuration API: `ESLAnimateConfig`
- `cls` (`in` by default) - CSS class(es) to control animation.
  The control class(es) will be added to the observed element(s) after they had intersected with the viewport area.
  Service supports ESL extended class definition syntax, [CSSClassUtils](../esl-utils/dom/class.ts)
- `group` (boolean) - enable group animation for items, hence take `groupDelay` value into account while performing
  animation (item will start the animation with a delay after the previous item's animation start)
- `groupDelay` (`100` by default) - number of milliseconds animation delay in group
- `repeat` (boolean) - refresh (re-animate) items when they became invisible (exit viewport)
- `force` (boolean) - allows to re-animate items when ESLAnimateService subscribed 
on already animated item if set to true
- `ratio` (0.2|0.4|0.6|0.8) - intersection ratio to consider an element as visible
  Only 0.2 (20%), 0.4 (40%), 0.6 (60%), 0.8 (80%) values are allowed due to sharing of IntersectionObserver instance
  with a fixed set of thresholds defined

## `ESLAnimate` custom element

**ESLAnimate** is a custom element that subscribes `ESLAnimateService` to elements from html.

To use ESLAnimate you need to include the following code:
```js
  ESLAnimate.register();
```

### `ESLAnimate` Attributes | Properties:
- `target` - target element(s) to animate, defined by [ESLTraversingQuery](../esl-traversing-query/README.md). By default target value is empty, meaning component will animate itself
- `cls` (`in` by default) - CSS class(es) to control animation. The control class(es) will be added to observed element(s), after they had intersected with vieport area. Service supports ESL extended class definition syntax, [CSSClassUtils](../esl-utils/dom/class.ts)
- `group` (boolean) - enable group animation for items, hence take `groupDelay` value into account while performing
  animation (item will start the animation with a delay after the previous item's animation start)
- `groupDelay` (`100` by default) - number of milliseconds animation delay in group
- `repeat` (boolean) - refresh (re-animate) items when they became invisible (exit viewport)
- `force` (boolean) - allows to re-animate items when ESLAnimateService subscribed 
  on already animated item if set to true
- `ratio` (0.2|0.4|0.6|0.8) - intersection ratio to consider an element as visible
  Only 0.2 (20%), 0.4 (40%), 0.6 (60%), 0.8 (80%) values are allowed due to the share of the IntersectionObserver instance
  with a fixed set of thresholds defined

By default, attributes `group`, `repeat`, and `target` are observed, meaning the animation sequence will restart once
theese attributes are changed. Additionally, you can do the re-animation manually by calling the instance method `reanimate()`.

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
