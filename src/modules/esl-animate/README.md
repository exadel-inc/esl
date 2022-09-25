# [ESL](https://exadel-inc.github.io/esl/) Animate

Version: *1.0.0*.

Authors: *Anna-Mariia Petryk*, *Alexey Stsefanovich (ala'n)*, *Julia Murashko*.

**_Important Notice: the component is under beta version, it is tested and ready to use but be aware of its potential critical API changes._**

<a name="intro"></a>

ESL Animate is a module to animate items on viewport intersecting.

Features:
- Add class(es) when observed elements enter viewport area
- Support group animation that allows item delay its animation on the passed time after previously animated item
- Support forward and backward animations directions
- Support automatic re-animate after item exit viewport area
- JS API (Service) + Custom Element - Plugin for simple initialization

## ESLAnimateService
ESLAnimateService is a core of esl-animate module. Element needs to be observed by ESLAnimateService 
in order to be animated.

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

## ESLAnimate
ESLAnimate (`<esl-animate>`) - custom element to automatically initialize ESLAnimateService from html

### Element API
- `target` - target element or elements to animate, defined by [ESLTraversingQuery](../esl-traversing-query/README.md)  
Default: empty (animates itself)
- `cls` - CSS class or classes to control animation (`in` by default)
(supports ESL extended class definition syntax, [CSSClassUtil](../esl-utils/dom/class.ts))
- `group` (boolean) - enable group animation for items
(item will start animation with a delay after previous item animation start)
- `group-delay` - number of milliseconds to delay animation in group
- `repeat` (boolean) - refresh (re-animate) items when they became invisible (exit viewport)
- `ratio` - number of intersection ratio to consider element as visible
Only 0.2 (20%), 0.4 (40%), 0.6 (60%), 0.8 (80%) values are allowed due to share of IntersectionObserver instance
with a fixed set of thresholds defined.

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
