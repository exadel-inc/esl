# [ESL](https://esl-ui.com/) Utils

<a name="intro"></a>

ESL Utils is a module that contains a set of common utilities for working with DOM, BOM, and other simple but handy
things that are used by ESL components, but can also be used in client code.

All ESL Utils helpers are super simple and atomic, be sure that none of the utilities requires the whole library. 
Even if you use the whole utils module, it is still tiny.

---

## Modules

- #### Abstract

  - ##### <a href="./abstract/observable.ts" target="_blank">Observable</a> - a small base class that implements observable pattern. 


- #### Async
  
  - ##### <a href="./async/aggregate.ts" target="_blank">Aggregate</a> - a throttle function decorator with aggregation.
    Limits decorated function calls to one call in passed `time`. The decorated function `callback` will be called once 
    at the end of the timeout with the list of the first arguments in the calls.

  - ##### <a href="./async/debounce.ts" target="_blank">Debounce</a> - a debounce function decorator.
    Debouncing is a pattern commonly used for rate-limiting function calls with a timeout.

  - ##### <a href="./async/delayed-task.ts" target="_blank">Delayed Task</a> - a common helper to plan task (function) to be executed with or without a timeout.
    New task planning request cancels the previous task in a DelayedTask instance in case it has not happened yet. 

  - ##### <a href="./async/promise.ts" target="_blank">Promise Utils</a> - a set of Promise helpers.
    Allows converting DOM Events, timeouts, pooling checks, etc. to ES6 Promise or create a Deferred object
    that allows to resolve or reject related Promise.

  - ##### <a href="./async/raf.ts" target="_blank">RAF(Rendering callback) Utils</a> - Request Animation Frame common helpers.
    Includes RAF Decorator that postpones multiple function calls to a single one before rendering.
    Also includes `afterNextRender` deferring function.

  - ##### <a href="./async/throttle.ts" target="_blank">Throttle</a> - a throttling function decorator.
    Throttling is a pattern that allows limiting function calls to one execution per timeout.


- #### TS Decorators

    - ##### <a href="./decorators/attr.ts" target="_blank">@attr</a> - a TS decorator to create a property reflected to a DOM element attribute.

    - ##### <a href="./decorators/bind.ts" target="_blank">@bind</a> - a TS decorator to bind method context to current class instance.

    - ##### <a href="./decorators/bool-attr.ts" target="_blank">@boolAttr</a> - a TS decorator to create a boolean property reflected to a DOM element attribute-marker.

    - ##### <a href="./decorators/decorate.ts" target="_blank">@decorate</a> - a TS decorator to decorate and bind class method.

    - ##### <a href="./decorators/jsonAttr.ts" target="_blank">@jsonAttr</a> - a TS decorator to create an object property reflected to a DOM element attribute with JSON value.

    - ##### <a href="./decorators/listen.ts" target="_blank">@listen</a> - a TS decorator to transform method into event listener descriptor.

    - ##### <a href="./decorators/memoize.ts" target="_blank">@memoize</a> - a TS decorator to make method or get accessor memoized.

    - ##### <a href="./decorators/prop.ts" target="_blank">@prop</a> - a TS decorator to define a field on the prototype level.

    - ##### <a href="./decorators/ready.ts" target="_blank">@ready</a> - a TS decorator to postpone method execution until DOM is ready.
      See `esl-utils.dom.ready#onDocumentReady` utility function for details.

- #### DOM Helpers

    - ##### <a href="./dom/api.ts" target="_blank">DOM API Utils</a> - a basic dom api helpers.

    - ##### <a href="./dom/attr.ts" target="_blank">Attributes</a> - utility to work with Element attributes.

    - ##### <a href="./dom/class.ts" target="_blank">CSSClass</a> - a utility to work with CSS classes. 
      Supports JQuery-like enumeration, inversion syntax, and locks.

    - ##### <a href="./dom/events.ts" target="_blank">Event Utils</a> - utils to check, dispatch or listen events.

    - ##### <a href="./dom/focus.ts" target="_blank">Focus</a> - a focus order helpers.

    - ##### <a href="./dom/keys.ts" target="_blank">Keys</a> - a keyboard keys constants.

    - ##### <a href="./dom/ready.ts" target="_blank">Ready</a> - a utility to postpone callback to the task after DOM Ready.

    - ##### <a href="./dom/rect.ts" target="_blank">Rect</a> - a rectangle utility class to provide position calculations.

    - ##### <a href="./dom/rtl.ts" target="_blank">RTL Utils</a> - Utils to detect RTL and RTL-specific browsers behavior.

    - ##### <a href="./dom/sanitize.ts" target="_blank">Sanitize</a> - utility to sanitizes html string from malicious attributes, values, and scripts.
      Can also filter elements at the top nesting level by tag names. 
    
    - ##### <a href="./dom/script.ts" target="_blank">Scripts</a> - a script loading utility to limit and track loading.
  
    - ##### <a href="./dom/scroll.ts" target="_blank">Scroll</a> - a scroll utility methods like locking, traversing for closest scrollable, etc. 
      *Note: uses <a href="./dom/scroll.less" target="_blank">scroll.less</a> styles.*
  
    - ##### <a href="./dom/traversing.ts" target="_blank">DOM Traversing</a> - a set of utils to find DOM elements or check their relations.

    - ##### <a href="./dom/visible.ts" target="_blank">Visible</a> - utility to check whether an element is visible or not.

    - ##### <a href="./dom/window.ts" target="_blank">Window</a> - a browser window object utils.
  
- #### Environment
  
    - ##### <a href="./environment/device-detector.ts" target="_blank">Device Detector</a> - a set of user agent based checks such as engine or device type.

- #### Fixes

    - ##### <a href="./fixes/viewport.ts" target="_blank">ESLVSizeCSSProxy</a> - an utility to produce device normalized CSS properties for 100vw and 100vh.

- #### Miscellaneous Utils

    - ##### <a href="./misc/array.ts" target="_blank">Array</a> - an array utils (uniq, flat, wrap, etc.).
  
    - ##### <a href="./misc/set.ts" target="_blank">Set</a> - a set or an array with uniq values utils.

    - ##### <a href="./misc/format.ts" target="_blank">Format</a> - string format utils.
  
    - ##### <a href="./misc/functions.ts" target="_blank">Function</a> - simple functions and types.
  
    - ##### <a href="./misc/memoize.ts" target="_blank">Memoize</a> - a memoization function decorator. 
      Memoization pattern allows executing pure function once and then uses the cached result.
  
    - ##### <a href="./misc/object.ts" target="_blank">Object</a> - object common utils.
  
    - ##### <a href="./misc/uid.ts" target="_blank">UID</a> - unique identifier generation utils.
