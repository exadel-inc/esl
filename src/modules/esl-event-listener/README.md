# ESL Event Listener module

Version: _2.1.0_.

Authors: _Alexey Stsefanovich (ala'n)_.

<a name="intro"></a>

Starting from the 4th release ESL has a built-in mechanism to work with DOM events.
ESL event listeners have more control and advanced features than native DOM API.
Besides, the [`ESLBaseElement`](../esl-base-element/README.md) and the [`ESLMixinElement`](../esl-mixin-element/README.md)
have even more pre-built syntax sugar to make the consumer's code briefer.

One of the main advantages of ESL listeners is the extended control of subscriptions.
All ESL listeners and their declarations are saved and associated with the host element.
It means that ESL listeners can be subscribed or unsubscribed at any time in various ways.
And most importantly, you do not need the original callback handler to do this.

---

## Basic concepts

The ESL event listener module is based on the following major terms and classes:

### <a name="the-host">The `host`</a>

Everything that happens with ESL event listeners should be associated with a `host` object.
The `host` is an object that "owns" (registers / deletes) the subscription.

By default, the `host` is used as an `EventTarget` (or an object implementing `EventTarget` interface) to subscribe.
But the `host` object is not necessarily related to an `EventTarget`.
We have at least two options to change the target. First of all, you can define the target explicitly.
Another way is to specify the default DOM target of the host object by providing a special `$host` key
(see `ESLMixinElement` implementation).

The `host` object is also used as a context to call the handler function of the subscription.

### <a name="the-handler">The `handler`</a>

The `handler` is a function that is used to process the subscription event.
ESL declares a generic type to describe such functions - `ESLListenerHandler`;

```typescript
export type ESLListenerHandler<EType extends Event = Event> = (
  event: EType
) => void;
```

### <a name="the-esleventlistener-class-and-subscription">The `ESLEventListener` class and _subscription_</a>

The subscriptions created by the ESL event listener module are instances of `ESLEventListener` class.
All active subscriptions are stored in a hidden property of the `host` object.

`ESLEventListener` has the following basic properties:

- `event` - event type that the subscription is listening to;
- `handler` - reference for the function to call to handle the event (see [The handler](#the-handler));
- `host` - reference for the object that holds the subscription (see [The host](#the-host));
- `target` - definition of `EventTarget` element (or string `TraversingQuery` to find it, see details in [`ESLEventDesriptor`](#descriptors-esleventdesriptor-esleventdesriptorfn));
- `selector` - CSS selector to use built-in event delegation;
- `capture` - marker to use the capture phase of the DOM event life-cycle;
- `passive` - marker to use passive (non-blocking) subscription of the native event (if supported);
- `once` - marker to destroy the subscription after the first event catch.
- `group` - auxiliary property to group subscriptions. Does not affect the subscription behavior. Can be used for filtering and bulk operations.

All of the `ESLEventListener` instance fields are read-only; the subscription can't be changed once created.

The `ESLEventListener`, as a class, describes the subscription behavior and
contains static methods to create and manage subscriptions.

### <a name="descriptors-esleventdesriptor-esleventdesriptorfn">Descriptors (`ESLEventDesriptor`, `ESLEventDesriptorFn`)</a>

The event listener _Descriptor_ is an object to describe future subscriptions.
The ESL event listeners module has a few special details regarding such objects.

A simple descriptor is an object that is passed to ESL event listener API to create a subscription.
It contains almost the same set of keys as the `ESLEventListener` instance.

In addition to that, ESL allows you to combine the `ESLEventDesriptor` data with the handler function.
`ESLEventDesriptorFn` is a function handler that is decorated with the `ESLEventDesriptor` properties.

Here is the list of supported keys of `ESLEventDesriptor`:

- #### `event` key

  <u>Type:</u> `string | PropertyProvider<string>`  
  <u>Description:</u> the event type for subscription.
  Can be provided as a string or via provider function that will be called right before the subscription.

  The event string (as a literal, or returned by `PropertyProvider`) can declare multiple event types separated by space.
  ESL will create a subscription (`ESLEventListener` object) for each event type in this case.

- #### `target` key

  <u>Type:</u> `string | EventTarget | EventTarget[] | PropertyProvider<string | EventTarget | EventTarget[]>`  
  <u>Default Value:</u> `host` object itself or `$host` key of the `host` object  
  <u>Description:</u> the key to declare exact EventTarget for the subscription.
  In case the `target` key is a string it is considered as a [`TraversingQuery`](../esl-traversing-query/README.md).
  The query finds a target relatively to `host | host.$host` object, or in bounds of the DOM tree if it is absolute.
  The `target` key also supports an exact reference for `EventTarget`(s).

  ⚠ Any `EventTarget` or even ESL `SynteticEventTarget` (including [`ESLMediaQuery`](../esl-media-query/README.md))
  can be a target for listener API.

  ⚠ See [OOTB Extended Event Targets](#extended-event-targets) of ESL to know how to optimize handling of frequent events.

  The `target` property can be declared via `PropertyProvider` as well.

- #### `selector` key

  <u>Type:</u> `string | PropertyProvider<string>`  
  <u>Default Value:</u> `null`  
  <u>Description:</u> the CSS selector to filter event targets for event delegation mechanism.

  ⚠ If you want to get the currently delegated event target, you can access the `$delegate` key under the received event 
  instance. In order to have access to `$delegate` strictly typed use the `DelegatedEvent<EventType>` type decorator.

  E.g.:
  ```typescript
  @listen({ event: 'click', selector: 'button' })
  onClick(e: DelegatedEvent<MouseEvent> /* instead of MouseEvent */) {
    const delegate = e.$delegate; //instaead of e.target && e.target.closest('button');
    ...
  }
  ```

  Supports `PropertyProvider` to declare the computed value as well.

- #### `condition` key
  
  <u>Type:</u> `bollean | PropertyProvider<boolean>`
  <u>Default Value:</u> `true`  
  <u>Description:</u> the function predicate or boolean flag to check if the subscription should be created. Resolves right before the subscription.
    
  Useful in combination with `@listen` decorator to declare subscriptions.

  ```typescript
    class MyEl extends ESLBaseElement {
        @attr() enabled = true;     
  
        @listen({event: 'click', condition: (that) => that.enabled})
        onClick(e) {}
  
        attributeChangedCallback(name, oldValue, newValue) {
          if (name === 'enabled') {
              ESLEventUtils.unsubscribe(this, this.onClick);
              ESLEventUtils.subscribe(this, this.onClick);
          }
        }
    }
  ```

- #### `capture` key

  <u>Type:</u> `boolean`  
  <u>Default Value:</u> `false`  
  <u>Description:</u> marker to use capturing phase of the DOM event to handle.

- #### `passive` key

  <u>Type:</u> `boolean`  
  <u>Default Value:</u> `true` if the event type is `wheel`, `mousewheel`, `touchstart` or `touchmove`
  <u>Description:</u> marker to use passive subscription to the native event.

  ⚠ ESL uses passive subscription by default for `wheel`, `mousewheel`, `touchstart`, `touchmove` events.
  You need to declare `passive` key explicitly to override this behavior.

- #### `once` key

  <u>Type:</u> `boolean`  
  <u>Default Value:</u> `false`  
  <u>Description:</u> marker to unsubscribe the listener after the first successful handling of the event.


- #### `group` key
  <u>Type:</u> `string`  
  <u>Description:</u> auxiliary property to group subscriptions. Does not affect the subscription behavior. Can be used for filtering and bulk operations.
  
  E.g.:
  ```typescript
    ESLEventUtils.subscribe(host, {event: 'click', group: 'group'}, handler1);
    ESLEventUtils.subscribe(host, {event: 'click', group: 'group'}, handler2);
    // ...
    ESLEventUtils.unsubscribe(host, {group: 'group'}); // Unsubscribes all subscriptions with the 'group' key
  ```

- #### `auto` key (for `ESLEventDesriptorFn` declaration only)
  <u>Type:</u> `boolean`  
  <u>Default Value:</u> `false` for `ESLEventUtils.initDescriptor`, `true` for `@listen` decorator
  <u>Description:</u> marker to make an auto-subscribable descriptor. See [Automatic (collectable) descriptors](#automatic-collectable-descriptors).
- #### `inherit` key (for `ESLEventDesriptorExt` only)
  <u>Type:</u> `boolean`  
  <u>Description:</u> available in extended version of `ESLEventDesriptor` that is used in the descriptor declaration API.
  Allows to inherit `ESLEventDesriptor` data from the `ESLEventDesriptorFn` from the prototype chain.
  See [`initDescriptor`](#-esleventutilsinitdescriptor) usages example.


### <a name="automatic-collectable-descriptors">Automatic (collectable) descriptors</a>

Auto-collectable (or auto-subscribable) descriptors can be subscribed at once during the initialization of the `host` object.

To make an `ESLEventDesriptorFn` auto-collectable, the consumer should declare it with the `auto` marker using
`ESLEventUtils.initDescriptor` or `@listen` decorator.

⚠ `ESLEventUtils.initDescriptor` (or `@listen`) stores the auto-collectable descriptors in the internal collection on the `host`.

The `ESLBaseElment` and the `ESLMixinElement` subscribes all auto-collectable descriptors in the `connectedCallback`.
See the usage of [`ESLEventUtils.subscibe`](#-esleventutilssubscribe) for more details.

### `PropertyProvider` for `event`, `selector`, or `target`

The descriptor declaration usually happens with the class declaration when the instance and its subscription
do not exist. We might have a problem if we want to pass subscription parameters that depend on the instance.

To resolve such a case, the `event`, `selector`, and `target` keys of ESL event listener API support
`PropertyProvider` mechanism:

```typescript
type PropertyProvider<T> = (this: unknown, that: unknown) => T;
```

See examples in the [ESLEventUtils.initDescriptor](#-esleventutilsinitdescriptor) section.

---

## Public API (`ESLEventUtils`)

The units mentioned earlier are mostly implementation details of the module.

`ESLEventUtils` is a facade for all ESL event listener module capabilities.

Here is the module Public API:

<a name="-esleventutilssubscribe"></a>

### ⚡ `ESLEventUtils.subscribe`

Creates and subscribes an `ESLEventListener`.

- Subscribes all auto-collectable (subscribable) descriptors of the `host` object:
  ```typescript
  ESLEventUtils.subscribe(host: object)
  ```
- Subscribes `handler` function to the DOM event declared by `eventType` string:
  ```typescript
  ESLEventUtils.subscribe(host: object, eventType: string, handler: ESLListenerHandler)
  ```
- Subscribes `handler` instance of `ESLEventDescriptorFn` using embedded meta-information:
  ```typescript
  ESLEventUtils.subscribe(host: object, handler: ESLEventDescriptorFn)
  ```
- Subscribes `handler` function using `ESLEventDescriptor`:
  ```typescript
  ESLEventUtils.subscribe(host: object, descriptor: ESLEventDescriptor, handler: ESLListenerHandler)
  ```
- Subscribes `handler` instance of `ESLEventDescriptorFn` with `ESLEventDescriptor` overriding meta-data:
  ```typescript
  ESLEventUtils.subscribe(host: object, descriptor: ESLEventDescriptor, handler: ESLEventDescriptorFn)
  ```

**Parameters**:

- `host` - host element to store subscription (event target by default);
- `eventType` - string DOM event type;
- `descriptor` - event description data (`ESLEventDescriptor`);
- `handler` - function callback handler or instance of `ESLEventDescriptorFn`

Examples:

- `ESLEventUtils.subscribe(host);` -
  subscribes all auto-subscriptions of the `host`;
- `ESLEventUtils.subscribe(host, handlerFn);` -
  subscribes `handlerFn` method (decorated as an `ESLEventDescriptorFn`) to the `handlerFn.target`;
- `ESLEventUtils.subscribe(host, 'click', handlerFn);` -
  subscribes `handlerFn` function with the passed event type;
- `ESLEventUtils.subscribe(host, {event: 'scroll', target: window}, handlerFn);` -
  subscribes `handlerFn` function with the passed additional descriptor data.

<a name="-esleventutilsunsubscribe"></a>

### ⚡ `ESLEventUtils.unsubscribe`

Allows unsubscribing existing subscriptions.

```typescript
unsubscribe(host: HTMLElement, ...criteria: ESLListenerCriteria[]): ESLEventListener[];
```

**Parameters**:

- `host` - host element to find subscriptions;
- `criteria` - optional set of criteria to filter listeners to remove.

Examples:

- `ESLEventUtils.unsubscribe(host);` - unsubscribes everything bound to the `host`
- `ESLEventUtils.unsubscribe(host, handlerFn);` - unsubscribes everything that is bound to the `host` and is handled by the `handlerFn`
- `ESLEventUtils.unsubscribe(host, 'click');` - unsubscribes everything bound to the `host` and processing `click` event
- `ESLEventUtils.unsubscribe(host, 'click', handlerFn);` - unsubscribes everything that is bound to the `host`, processing `click` event and is handled by the `handlerFn`
- There can be any number of criteria.

<a name="-esleventutilsiseventdescriptor"></a>

### ⚡ `ESLEventUtils.isEventDescriptor`

Predicate to check if the passed argument is a type of `ESLListenerDescriptorFn = ESLEventHandler & Partial<ESLEventDescriptor>`.

```typescript
ESLEventUtils.isEventDescriptor(obj: any): obj is ESLListenerDescriptorFn;
```

<a name="-esleventutilsdescriptors"></a>

### ⚡ `ESLEventUtils.descriptors`

Gathers auto-subscribable (collectable) descriptors from the passed object.

Note: the method is going to be updated in the next release to support the `criteria` parameter. 
It's strongly recommended to pass criteria `{auto: true}` already to have no issues with the future update.

```typescript
// Note: deprecated in current version due to the future update
ESLEventUtils.descriptors(host?: any): ESLListenerDescriptorFn[]

// Recommended usage
ESLEventUtils.descriptors(host?: any, criteria: {auto: true}): ESLListenerDescriptorFn[]
```

**Parameters**:

- `host` - object to get auto-collectable descriptors from;


<a name="-esleventutilsgetautodescriptors"></a>

### ⚡ `ESLEventUtils.getAutoDescriptors`

Gathers auto-subscribable (collectable) descriptors from the passed object.

Deprecated: prefer using `ESLEventUtils.descriptors` with the `{auto: true}` criteria. As the `getAutoDescriptors` method is going to be removed in 6th release.

```typescript
ESLEventUtils.getAutoDescriptors(host?: any): ESLListenerDescriptorFn[]
```

**Parameters**:

- `host` - object to get auto-collectable descriptors from;


<a name="-esleventutilsinitdescriptor"></a>

### ⚡ `ESLEventUtils.initDescriptor`

Decorates the passed key of the host object as `ESLEventDescriptorFn`

```typescript
ESLEventUtils.initDescriptor<T extends object>(
  host: T,
  key: keyof T & string,
  desc: ESLEventDescriptorExt
): ESLEventDescriptorFn;
```

**Parameters**:

- `host` - host object holder of decorated function;
- `key` - key of the `host` object that contains a function to decorate;
- `desc` - `ESLEventDescriptor` (extended) meta information to describe future subscriptions.

The extended `ESLEventDescriptor` information allows passing `inherit` marker to create a new descriptor instance
based on the descriptor declared in the prototype chain for the same key.

⚠ If such a key is not found, a `ReferenceError` will be thrown.

Example:
 ```typescript
 class MyElement {
   onEvent() {} 
 }
 ESLEventUtils.initDescriptor(MyElement.prototype, 'onEvent', {event: 'event'});
```

#### `@listen` decorator

The `@listen` decorator (available under `esl-utils/decorators`) is syntax sugar above `ESLEventUtils.initDescriptor` method.
It allows you to declare class methods as an `ESLEventDescriptorFn` using TS `experimentalDecorators` feature.

Listeners described by `@listen` are auto-subscribable if they are not inherited and not declared as manual explicitly.
In case of inheritance the `auto` marker will be inherited from the parent descriptor.

Example:

```typescript
class MyEl extends ESLBaseElement {
  private event: string;
  private selector: string;
  // Shortcut with just an event type
  @listen('click')
  onClick() {}
  // Shortcut with event type declared by PropertyProvider
  @listen((that: MyEl) => that.event)
  onEventProvided() {}
  // Full list of options is available
  @listen({event: 'click', target: 'body', capture: true})
  onBodyClick(e) {}
  // Property Providers example
  @listen({
    event: (that: MyEl) => that.event,
    seletor: (that: MyEl) => that.selector
  })
  onEventProvidedExt(e) {}
  // Will not subscribe authomatically
  @listen({event: 'click', auto: false})
  onClickManual(e) {}
}
```

<a name="-esleventutilslisteners"></a>

### ⚡ `ESLEventUtils.listeners`

Gathers listeners currently subscribed to the passed `host` object.

```typescript
ESLEventUtils.listeners(host: object, ...criteria: ESLListenerCriteria[]): ESLEventListener[];
```

**Parameters**:

- `host` - object that stores and relates to the handlers;
- `criteria` - optional set of criteria to filter the listeners list.

<a name="-esleventutilsdispatch"></a>

### ⚡ `ESLEventUtils.dispatch`

Dispatches custom DOM events.
The dispatched event is bubbling and cancelable by default.

```typescript
ESLEventUtils.dispatch(
  el: EventTarget,
  eventName: string,
  eventInit?: CustomEventInit
): boolean;
```

**Parameters**:

- `el` - `EventTarget` to dispatch event;
- `eventName` - name of the event to dispatch;
- `eventInit` - object that specifies characteristics of the event.

### Listeners Full Showcase Example

```typescript
class TestCases {
  bind() {
    // Subcribes all auto descriptors (onEventAutoDescSugar and onEventAutoDesc)
    ESLEventUtils.subscribe(this);

    // Subscribes onEventManualFn on click
    ESLEventUtils.subscribe(this, 'click', this.onEventManualFn);

    // Subscribes onEventManualFn on window resize
    ESLEventUtils.subscribe(this, {event: 'resize', target: window}, this.onEventManualFn);

    // Subscribes onEventManualDesc using embeded information
    ESLEventUtils.subscribe(this, this.onEventManualDesc);

    // Subscribes onEventManualDesc using merged embeded and passed information
    ESLEventUtils.subscribe(this, {target: window}, this.onEventManualDesc);
  }

  unbind() {
    // Unsubcribes all subscriptions
    ESLEventUtils.unsubscribe(this);

    // Unsubcribes just onEventAutoDesc
    ESLEventUtils.unsubscribe(this, this.onEventAutoDesc);
  }

  @listen('event')
  onEventAutoDescSugar() {}

  onEventAutoDesc() {}

  onEventManualFn() {}

  onEventManualDesc() {}
}

ESLEventUtils.initDescriptor(TestCases.prototype, 'onEventAutoDesc', {event: 'event', auto: true});
ESLEventUtils.initDescriptor(TestCases.prototype, 'onEventManualDesc', {event: 'event'});
```

---

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


---

## <a name="embedded-behavior-of-eslbaseelement-eslmixinelement">Embedded behavior of `ESLBaseElement` / `ESLMixinElement`</a>

### Shortcuts

All the inheritors of `ESLBaseElement` and `ESLMixinElement` contain the short aliases for some `ESLEventUtils` methods.
The host parameter of the shortcut methods is always targeting the current element/mixin.

- `$$on` ~ `ESLEventUtils.subscribe(this, ...)`
- `$$off` ~ `ESLEventUtils.unsubscribe(this, ...)`
- `$$fire` ~ `ESLEventUtils.dispatch(this, ...)`

Example:

```typescript
this.$$on('click', this.onClick); // ESLEventUtils.subscribe(this, 'click', this.onClick)
this.$$off('click'); // ESLEventUtils.unsubscribe(this, 'click')
```

### Auto-subscription / Auto-unbinding

All the inheritors of `ESLBaseElement` and `ESLMixinElement` automatically subscribe to all declared auto-subscribable descriptors
of their prototype chain.

They also unsubscribe all own listeners attached via ESL automatically on `disconnectedCallback`.

The following short snippet of code describes a listener that will automatically subscribe and unsubscribe
on connected/disconnected callback inside `ESLBaseElement`:

```typescript
class MyEl extends ESLBaseElement {
  // connectedCallback() {
  //   super.connectedCallback(); // - already contains ESLEventUtils.subscribe(this) call
  // }

  // Will be subscribed automatically on connectedCallback and unsubscribed on disconnectedCallback
  @listen('click')
  onClick(e) {
    //...
  }
}
```

You can manage the subscription manually and link the whole meta information or part of it with the handler itself

```typescript
class MyEl extends ESLBaseElement {
  @listen({event: 'click', auto: false}) // Won`t be subscribed automatically
  onClick(e) {
    // ...
  }

  myMethod() {
    this.$$on(this.onClick); // Manual subscription
    this.$$on({target: 'body'}, this.onClick); // Manual subscription with parameters (will be merged)
    this.$$off(this.onClick); // Unsubscribes this.onClick method
  }
}
```
