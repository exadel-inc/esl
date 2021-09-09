# [ESL](../../../README.md) Utils

<a name="intro"></a>

ESL Utils - is a module that contains a set of common utilities for working with DOM, BOM and other simple but handy things that are used by ESL components, but can also be used in client code.

All ESL Utils helpers are super simple and atomic, be sure that none of the utilities requires the whole library. 
Even if you use the whole utils module, it is still tiny.

---

## Modules

- #### Abstract

  - ##### [Observable](./abstract/observable.ts) - small base class that implements observable pattern. 


- #### Async
  
  - ##### [Aggregate](./async/aggregate.ts) - throttle function decorator with aggregation.
    Limits decorated function calls to one call in passed `time`. The decorated function `callback` will be called once 
    at the end of the timeout with the list of the first arguments in the calls.

  - ##### [Debounce](./async/debounce.ts) - debounce function decorator.
    Debouncing is a pattern commonly used for rate limiting function calls with a timeout.

  - ##### [Delayed Task](./async/delayed-task.ts) - common helper to plan task (function) to be executed with or without a timeout.
    New task planning request cancels the previous task in a DelayedTask instance in case it has not happened yet. 

  - ##### [Promise Utils](./async/promise.ts) - a set of Promise helpers.
    Allows converting DOM Events, timeouts, pooling check, etc. to ES6 Promise or create a Deferred object 
    that allows to resolve or reject related Promise.

  - ##### [RAF(Rendering callback) Utils](./async/raf.ts) - Request Animation Frame common helpers.
    Includes RAF Decorator that postpones multiple function calls to a single one before rendering. 
    Also includes `afterNextRender` deferring function.

  - ##### [Throttle](./async/throttle.ts) - throttling function decorator.
    Throttling is a pattern that allows to limit function call to one execution per timeout.


- #### TS Decorators

    - ##### [@bind](./decorators/bind.ts) - TS decorator to bind method context to current class instance.

    - ##### [@memoize](./decorators/memoize.ts) - TS decorator to make method or get accessor memoized.

    - ##### [@prop](./decorators/prop.ts) - TS decorator to define a field on the prototype level.

    - ##### [@ready](./decorators/ready.ts) - TS decorator to postpone method execution until DOM is ready 
      See `esl-utils.dom.ready#onDocumentReady` utility function for details

- #### DOM Helpers

    - ##### [DOM API Utils](./dom/api.ts) - basic dom api helpers

    - ##### [CSSClass](./dom/class.ts) - is a utility to work with CSS classes. 
      Supports JQuery-like enumeration, inversion syntax and locks.  

    - ##### [Focus](./dom/focus.ts) - focus order helpers.

    - ##### [Keys](./dom/keys.ts) - keyboard keys constants.

    - ##### [Ready](./dom/ready.ts) - utility to postpone callback to the task after DOM Ready.

    - ##### [Rect](./dom/rect.ts) - rectangle utility class to provide position calculations.

    - ##### [RTL Utils](./dom/rtl.ts) - Utils to detect RTL and RTL-specific browsers behavior.
  
    - ##### [Scripts](./dom/script.ts) - script loading utility to limit and track loading.
  
    - ##### [Scroll](./dom/scroll.ts) - scroll utility methods like locking, traversing for closest scrollable, etc. 
      *Note: uses [scroll.less](./dom/scroll.less) styles.*
  
    - ##### [DOM Traversing](./dom/traversing.ts) - a set of utils to find DOM elements or check their relations.

    - ##### [Window](./dom/window.ts) - browser window object utils.
  
- #### Environment
  
    - ##### [Device Detector](./environment/device-detector.ts) - set of user agent based checks such as engine or device type.

- #### Miscellaneous Utils

    - ##### [Array](./misc/array.ts) - array utils (uniq, flat, wrap, etc.).
  
    - ##### [Set](./misc/set.ts) - set/array with uniq values utils

    - ##### [Format](./misc/format.ts) - string format utils.
  
    - ##### [Function](./misc/functions.ts) - simple functions and types.
  
    - ##### [Memoize](./misc/memoize.ts) - memoization function decorator. 
      Memoization patten allows executing pure function once and then use the cached result.
  
    - ##### [Object](./misc/object.ts) - object common utils.
  
    - ##### [UID](./misc/uid.ts) - unique identifier generation util.
