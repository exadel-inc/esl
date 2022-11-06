# [ESL](https://exadel-inc.github.io/esl/) Animate

Version: *1.0.0*.

Authors: *Anna-Mariia Petryk*, *Alexey Stsefanovich (ala'n)*, *Julia Murashko*.

<a name="intro"></a>

## ESLAnimate

**ESLAnimate** is a custom element module used to animate items on viewport intersection, which automatically initializes `ESLAnimateService` from html.

To use ESLAnmimate you need to include the following code:
```js
  ESLAnimate.register();
```

### ESLAnimate Attributes | Properties:
- `cls` - animation process is implemented using classes. The control class will be added to element when target element is in vieport area. By the default ESLAnimate uses `in` class, bit supports other classes, aswell as ESL extended class definition syntax, [CSSClassUtils](../esl-utils/dom/class.ts)
- `repeat` - intersect animation will happen only once by default. But it's possible to enable re-animation after element has disappeared from viewport using `repeat` attribute.
- `ratio` - number of intersection ratio to consider element as visible.
Only 0.2 (20%), 0.4 (40%), 0.6 (60%), 0.8 (80%) values are allowed due to share of IntersectionObserver instance
with a fixed set of thresholds defined. Default visibility ratio is 0.4 (40%)
- `target` - target element or elements to animate, defined by [ESLTraversingQuery](../esl-traversing-query/README.md). By default target value is empty, meaning component will animate itself
- `group` - boolean value enabling group animation for items
**Note: Animation will still work for multiple items specified as a `target`, even without `group` attribute. The purpose of `group` attribute is to indicate, that `groupDelay` should be taken into account**
- `groupDelay` - number of milliseconds to delay animation in group. By default, delay is 100ms. This means animation delay will be increased by 100 miliseconds for each next item in intersection group

By default attributes `group`, `repeat` and `target` are observed, meaning animation sequence will restart once theese attributes are changed. Additionally, you can do the re-animation manually by calling instance method `reanimate()`.

Also ESL library provides pre-defined classes for animation: 
- `esl-animate-fade`
- `esl-animate-slide-left`
- `esl-animate-slide-right`
- `esl-animate-slide-up`
- `esl-animate-slide-down`

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
Note: `<esl-animate>` hidden (`display: none`) by default when there is no content inside

- wrapper (no target attribute defined)
```html
<esl-animate class="esl-animate-fade" cls="in">
    ...HTML Content...
</esl-animate>
```

## ESLAnimate mixin

**ESLAnimate mixin** is a mixin attribute that is used to animate items on viewport intersection. It's more lightweight solution than `ESLAnimate` that automatically initializes `ESLAnimateService` from html aswell. 

To use ESLAnmimateMixin you need to include the following code:
```js
  ESLAnimateMixin.register();
```

### ESLAnimate mixin Attributes | Properties:
- `options` - json attribute containing following properties:
  - `cls` - animation process is implemented using classes. The control class will be added to element when target element is in vieport area. By the default ESLAnimate uses `in` class, bit supports other classes, aswell as ESL extended class definition syntax, [CSSClassUtils](../esl-utils/dom/class.ts)
  - `repeat` - (boolean) - refresh (re-animate) items after they became invisible (exit viewport)
  - `ratio` - number of intersection ratio to consider element as visible.
  Only 0.2 (20%), 0.4 (40%), 0.6 (60%), 0.8 (80%) values are allowed due to share of IntersectionObserver instance
  with a fixed set of thresholds defined. Default visibility ratio is 0.4 (40%)

Apart from `ESLAnimate` module mixin doesn't observe any of the element attributes. But you can do the re-animation manually by calling instance method `reanimate()`.

Also ESL library provides pre-defined classes for animation: 
- `esl-animate-fade`
- `esl-animate-slide-left`
- `esl-animate-slide-right`
- `esl-animate-slide-up`
- `esl-animate-slide-down`

### Use cases
- default declaration
```html
<div esl-animate></div>
```
- custom config
```html
<div esl-animate options="{repeat: true, ratio: 0.2, cls: 'in'}"></div>
```

- wrapper (no target attribute defined)
```html
<esl-animate class="esl-animate-fade" cls="in">
    ...HTML Content...
</esl-animate>
```

**Note: ESLAnimate mixin can animate only itself**

## ESLAnimateService
ESLAnimateService is a core of esl-animate and esl-animate mixin module. Element needs to be observed by ESLAnimateService 
in order to be animated. It uses Intersection Observer under the hood

### Service API:
- `ESLAnimateService.observe(els, config)` - method to start element observation
  - `els` - Element or array of Elements to observe and animate
  - `config` - an optional ESLAnimateConfig object to describe the behavior of the animation functionality
- `ESLAnimateService.unobserve(els)` - method to unsubscribe ESLAnimateService from observing elements
- `ESLAnimateService.isObserved(el)` - check if element observed by ESLAnimateService

### ESLAnimateConfig (Configuration API)
- `cls` - CSS class or classes to control animation (`in` by default)
(supports ESL extended class definition syntax, [CSSClassUtil](../esl-utils/dom/class.ts))
- `group` (boolean) - enable group animation for items 
(item will start animation with a delay after previous item animation start)
- `groupDelay` - number of milliseconds to delay animation in group
- `repeat` (boolean) - refresh (re-animate) items when they became invisible (exit viewport)
- `force` (boolean) - if true then allows to re-animate items when ESLAnimateService subscribed 
on already animated item
- `ratio` (0.2|0.4|0.6|0.8) - intersection ratio to consider element as visible.
Only 0.2 (20%), 0.4 (40%), 0.6 (60%), 0.8 (80%) values are allowed due to share of IntersectionObserver instance
with a fixed set of thresholds defined.
