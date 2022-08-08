---
layout: content
name: ESL Event Listeners (ESL 4.0.0)
title: ESL Event Listeners (ESL 4.0.0)
tags: [blogs, draft]
date: 2022-07-01
---

This ESL update heavily targeted events and everything involved with them, that means developing advanced event handling API, if to be more correct.

### ⚡ 1.0 Low Level API

Now besides `EventUtils.dispatch` there are new methods `EventUtils.subscribe` and `EventUtils.unsubscribe`.

The mechanism of their work as follows:
With the help of `EventUtils.subscribe` you can subscribe to an event using following syntax:
- `EventUtils.subscribe($host, handlerFn);` or
- `EventUtils.subscribe($host, 'click', handlerFn);` or
- `EventUtils.subscribe($host, {event: 'click', select: 'button'}, handlerFn);` or
- `EventUtils.subscribe($host, {event: 'scroll', target: window}, handlerFn);`
as well as many other ways.

In order to process subscriptions made by `Event utils` class, the `ESLEventListener` class is being used. API of [`ESLEventListener`](https://esl-ui.com/core/esl-event-utils/#listener is public and you can use it for your low-level event handling aswell!
Detailed technical description is available [`EventUtils` here](https://esl-ui.com/core/esl-event-utils/#eUtils)

One of the main advantages of `EventUtils` over the native addEventListener is the extended control of subscriptions.
All of the ESL listeners are saved and associated with the host element, after that, the listener can be unhooked at any time in a variety of ways.
And most importantly, you do not need to have the original callback handler for this.

- `EventUtils.unsubscribe($host);` will unsubscribe everything bound to $host
- `EventUtils.unsubscribe($host, handlerFn);` will unsubscribe everything that is bound to $host and is handled by handlerFn
- `EventUtils.unsubscribe($host, 'click');` will unsubscribe everything bound to $host and process 'click'
- `EventUtils.unsubscribe($host, 'click', handlerFn);` will unsubscribe everything that is bound to $host, processes 'click' event and handles handlerFn
- There can be any number of criteria.

Now, the most important and pleasant thing related to this feature, everything that was described above is only Low Level API.
There is a lot of syntactic sugar on top...

### ⚡ 1.1 Extended ESLBaseElement
All of the inheritors of ESLBaseElement now have `$$on` and `$$off` methods,
which still have the same capabilities but only set the current element as the host.

```typescript
this.$$on('click', this.onClick);
this.$$off('click'); // или this.$$off(this.onClick)
```

### ⚡ 1.2 Auto-unbind
All of the inheritors of ESLBaseElement unsubscribe from events attached via ESL automatically on disconnectedCallback.

An option to quickly turn off such behavior is still being discussed (feel free to share your thoughts with the ESL Team ;) ).

### ⚡ 1.3 Decorator `@listen`
A new `@listen` decorator is now available in ESL, which makes it even easier to work with events

- The next listener will automatically subscribe and unsubscribe on connected/disconnected callback
 ```typescript
 @listen('click')
 onClick(e) { ... }
 ```
- Additional options are available aswell
 ```typescript
 @listen({event: 'click', target: 'body', capture: true})
 onBodyClick(e) { ... }
 ```
- You can manage the subscription manually and link the whole meta information or part of it with the handler itself
 ```typescript
 @listen({event: 'click', auto: false}) // Won`t be subscribed automatically
 onClick(e) { ... }

 myMethod() {
    this.$$on(this.onClick); // Manual subscription
    this.$$on({target: 'body'}, this.onClick); // Manual subscription with parameters (will be merged)
    this.$$off(this.onClick); // The same behavior as in the examples above

    EventUtils.subscribe($host, this.onClick); // Low-level API support
 }
 ```

### ⚡ 1.4 Synthetic event target
Exadel Smart Library now provides mechanism to emulate event target elements. The class `SyntheticEventTarget` was created for this purpose, and it has an API similar to `EventTarget`'s one, but only with some sugar added to it.

```typescript
const et = new SyntheticEventTarget();
et.addEventListener(listener); // Event listener will be added to 'change' event, if event type is not provided
et.addEventListener('change', listener); // The same behavior as in the example above
```
Same story with removing event listeners
```typescript
et.removeEventListener(listener);
```
You won't find much difference with dispatching event though
```typescript
et.dispatchEvent(new CustomEvent('change'));
```
You can find more detailed explanation [`SyntheticEventTarget` here](https://esl-ui.com/core/esl-event-utils/#target)
