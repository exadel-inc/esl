# [ESL](https://exadel-inc.github.io/esl/) Animate

Version: *1.0.0*.

Authors: *Anna-Mariia Petryk*, *Feoktyst Shovchko*, *Alexey Stsefanovich (ala'n)*, *Julia Murashko*.

<a name="intro"></a>

`esl-animate` is a module for element animation on it's intersection with the viewport

### Module Features:
- Add class(es) when observed elements enter viewport area
- Group animation support, allowing to add animation delay for each next item in the intersection queue
- Pre-defined animations
  - `esl-animate-fade`
  - `esl-animate-slide-left`
  - `esl-animate-slide-right`
  - `esl-animate-slide-up`
  - `esl-animate-slide-down`
- Automatic re-animation after item exits viewport area
- JS API `ESLAnimateService` + Custom element `ESLAnimate` + Mixin element `ESLAnimateMixin` - Plugin for simple initialization
ESLAnimateService is a core of esl-animate module. Element needs to be observed by ESLAnimateService 
in order to be animated.

## ESLAnimateService

**ESLAnimateService** provides a way to asynchronously add animation on the intersection of a target element with a viewport. It is based on [Intersection Observer Api](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and serves as a core functionality for `ESLAnimate` and `ESLAnimateMixin` elements.

### Service static API:
- `ESLAnimateService.observe(els, config)` - method to start element observation
  - `els` - element or array of elements to observe and animate
  - `config` - optional ESLAnimateConfig object to describe the behavior of the animation functionality
- `ESLAnimateService.unobserve(els)` - method to unsubscribe ESLAnimateService from observing elements
- `ESLAnimateService.isObserved(el)` - check if element observed by ESLAnimateService

Also you can create the animate service instance by calling its constructor:
```js
  const service = new ESLAnimateService();
```

### Service instance API:
- `service.observe(el, config)` - method to start element observation
  - `els` - element to observe and animate
  - `config` - optional ESLAnimateConfig object to describe the behavior of the animation functionality
- `service.unobserve(el)` - method to unsubscribe ESLAnimateService from observing elements

### ESLAnimateConfig (Configuration API)
- `cls` (`in` by default) - CSS class(es) to control animation. The control class(es) will be added to observed element(s), after they had intersected with vieport area. Service supports ESL extended class definition syntax, [CSSClassUtils](../esl-utils/dom/class.ts)
- `group` (boolean) - enable group animation for items, hence, take `groupDelay` value into account while performing animation
(item will start animation with a delay after previous item animation start)
- `groupDelay` (`100` by default) - number of milliseconds animation delay in group
- `repeat` (boolean) - refresh (re-animate) items when they became invisible (exit viewport)
- `force` (boolean) - allows to re-animate items when ESLAnimateService subscribed 
on already animated item if set to true
- `ratio` (0.2|0.4|0.6|0.8) - intersection ratio to consider element as visible
Only 0.2 (20%), 0.4 (40%), 0.6 (60%), 0.8 (80%) values are allowed due to share of IntersectionObserver instance
with a fixed set of thresholds defined

## ESLAnimate

**ESLAnimate** is a custom element, which automatically initializes `ESLAnimateService` from html.

To use ESLAnimate you need to include the following code:
```js
  ESLAnimate.register();
```

### ESLAnimate Attributes | Properties:
- `target` - target element(s) to animate, defined by [ESLTraversingQuery](../esl-traversing-query/README.md). By default target value is empty, meaning component will animate itself
- `cls` (`in` by default) - CSS class(es) to control animation. The control class(es) will be added to observed element(s), after they had intersected with vieport area. Service supports ESL extended class definition syntax, [CSSClassUtils](../esl-utils/dom/class.ts)
- `group` (boolean) - enable group animation for items, hence, take `groupDelay` value into account while performing animation
(item will start animation with a delay after previous item animation start)
- `groupDelay` (`100` by default) - number of milliseconds animation delay in group
- `repeat` (boolean) - refresh (re-animate) items when they became invisible (exit viewport)
- `force` (boolean) - allows to re-animate items when ESLAnimateService subscribed 
on already animated item if set to true
- `ratio` (0.2|0.4|0.6|0.8) - intersection ratio to consider element as visible
Only 0.2 (20%), 0.4 (40%), 0.6 (60%), 0.8 (80%) values are allowed due to share of IntersectionObserver instance
with a fixed set of thresholds defined

By default attributes `group`, `repeat` and `target` are observed, meaning animation sequence will restart once theese attributes are changed. Additionally, you can do the re-animation manually by calling instance method `reanimate()`.

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

## ESLAnimate mixin

**ESLAnimate mixin** is a mixin attribute that automatically initializes `ESLAnimateService` from html, and it's more lightweight solution than `ESLAnimate` custom element.

To use ESLAnimateMixin you need to include the following code:
```js
  ESLAnimateMixin.register();
```

### ESLAnimate mixin Attributes | Properties:
- `options` - json attribute containing following properties:
  - `cls` (`in` by default) - CSS class(es) to control animation. The control class(es) will be added to observed element(s), after they had intersected with vieport area. Service supports ESL extended class definition syntax, [CSSClassUtils](../esl-utils/dom/class.ts)
  - `repeat` (boolean) - refresh (re-animate) items when they became invisible (exit viewport)
  - `ratio` (0.2|0.4|0.6|0.8) - intersection ratio to consider element as visible
  Only 0.2 (20%), 0.4 (40%), 0.6 (60%), 0.8 (80%) values are allowed due to share of IntersectionObserver instance
  with a fixed set of thresholds defined

Apart from `ESLAnimate` module mixin doesn't observe any of the element attributes. But you can do the re-animation manually by calling instance method `reanimate()`.

### Use cases
- default declaration
```html
<div esl-animate>...HTML Content...</div>
```
- custom config
```html
<div esl-animate options="{repeat: true, ratio: 0.2, cls: 'in'}">...HTML Content...</div>
```
