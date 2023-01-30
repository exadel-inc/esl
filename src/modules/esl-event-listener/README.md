# ESL Event Listener module

Version: *2.0.0*.

Authors: *Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

Starting from the 4th release ESL has a built-in mechanism to work with DOM events.
ESLEventListeners has more control and more advanced features than native DOM API.
In addition, ESLMixinElement and ESlBaseElement have even more pre-built syntax sugar
to make the consumer's code super small and clean.

One of the main advantages of ESL event listeners over the native DOM events API is the extended control of subscriptions.
All ESL listeners are saved and associated with the host element, after that,
the listener can be unhooked at any time in a variety of ways.
And most importantly, you do not need the original callback handler for this.

## Basic concepts
The ESL event listener module based on the following major terms and submodules:

### The `host`

The `host` is any object that is used as a context to associate ESL event subscriptions with.  
That's the only thing that is needed for the ESL event listener-based subscriptions.
It's recommended to use the actual consumer of the subscriptions.
The hast is the default target to apply a subscription (access native DOM Event API).
Make sure you define the target explicitly for your subscriptions in case you use custom hosts
(different from `HTMLElement`, `ESLBaseElement`, or `ESLMixinElement`).

NOTE: you can also define a `$host` property on your custom host to make ESL automatically associate it with some DOM element.

The host is also a context to call the handler function of the subscription.

### The `ESLEventListener` class and `subscription`
The subscriptions created by the ESL event listener module are instances of `ESLEventListener` class.
They are stored in the hidden property under the `host` object consists of the following major properties:
- `event` - the event that the subscription is listening to
- `handler` - reference for the function to call to handle the event
- `host` - reference for holder `host` object
- `target` - the definition of `EventTarget` element.
  (Can be an exact element(s) or can be omitted or provided by the `TraversingQuery` to find it based on the `host`
  object)
- `selector` - CSS selector to use pre-build check capabilities to use event delegation. 
- `capture` - the marker to use the capture phase of DOM event live-cycle
- `once` - the marker to destroy the subscription after the first event catch
- `auto` - the  marker for subscription created based on an auto-collectable definition of the host
  (see the definition in the `Descriptors` section)

The `ESLEventListener` as a class describes the subscription behavior as well as contains static method to create and mange subscriptions.

### Descriptors (`ESLEventDesriptor`, `ESLEventDesriptorFn`)

The event listener *Descriptor* is an object to describe future subscriptions.
The ESL event listeners module has a couple of special details regarding such objects.
A descriptor is an object that you should pass to API to create a subscription.
It contains almost the same set of keys that the `ESLEventListener` instance does (except `host` and `handler`).
In addition to that ESL allows you to combine the  `ESLEventDesriptor` data with the handler function.
`ESLEventDesriptorFn` is a function handler that is decorated with the `ESLEventDesriptor` properties.

### Automatic (collectible) descriptors

If the `ESLEventDesriptorFn` declared with the `auto` marker of the associated definition it became auto-collectable
for the ESL event listeners module. So you can make all auto-collectable descriptors to be subscribed at once.
The `ESLBaseElment` and `ESLMixinElement` do it in the `connectedCallback` ootb.
See the usage of `ESLEventUtils.initDescriptor` and `@listen` decorator for more details.


## Public API - `ESLEventUtils`

The units mentioned previously are mostly implementation details of the module.
`ESLEventUtils` is a root class for the event listener module.
It's a facade of all ESL event listeners module and collects all required public API.

Here is the `ESLEventUtils` (as well as ESL event listener module) Public API:

### ⚡ `ESLEventUtils.subscribe`
`ESLEventUtils.subscribe` - the main method to create and subscribe ESLEventListener.

- Subscribe all auto-collectable(subscribable) descriptors of the `host` object:
    ```
    ESLEventUtils.subscribe(host: object)
    ```
- Subscribe handler function to the DOM event
    ```
    ESLEventUtils.subscribe(host: object, eventType: string, handler: ESLListenerHandler)
    ```
- Subscribes `ESLEventDescriptorFn` by embedded meta-information
    ```
    ESLEventUtils.subscribe(host: object, descriptorFn: ESLEventDescriptorFn)
    ```
- Subscribes `handler` function by `ESLEventDescriptor` meta
    ```
    ESLEventUtils.subscribe(host: object, descriptorFn: ESLEventDescriptor, handler: ESLListenerHandler)
    ```
- Subscribes `handler` type of `ESLEventDescriptorFn` with `ESLEventDescriptor` overriding meta-data
    ```
    ESLEventUtils.subscribe(host: object, descriptorFn: ESLEventDescriptor, handler: ESLEventDescriptorFn)
    ```

**Parameters**:
- `host` - host element to store subscription (event target by default);
- `eventDesc` - Event type or object of event description data;
- `handler` - Callback handler. See [ESLListenerHandler](#listenerHandler).

Examples:
- `ESLEventUtils.subscribe($host);` -
subscribes all decorated auto-subscriptions;
- `ESLEventUtils.subscribe($host, handlerFn);` - 
subscribes decorated `handlerFn` method to the `target`;
- `ESLEventUtils.subscribe($host, 'click', handlerFn);` - 
subscribes `handlerFn` function with the passed event type;
- `ESLEventUtils.subscribe($host, {event: 'scroll', target: window}, handlerFn);` - 
subscribes `handlerFn` function with the passed additional descriptor data.


### ⚡ `ESLEventUtils.unsubscribe`

Method of the `ESLEventUtils` interface that allows unsubscribing existing subscriptions.

```typescript
unsubscribe(host: HTMLElement, ...criteria: ESLListenerCriteria[]): ESLEventListener[];
```

**Parameters**:
- `host` - The host element to find subscriptions;
- `criteria` - An optional set of criteria to filter listeners to remove.

Examples:
- `ESLEventUtils.unsubscribe($host);` will unsubscribe everything bound to $host
- `ESLEventUtils.unsubscribe($host, handlerFn);` will unsubscribe everything that is bound to $host and is handled by handlerFn
- `ESLEventUtils.unsubscribe($host, 'click');` will unsubscribe everything bound to $host and processes 'click' event
- `ESLEventUtils.unsubscribe($host, 'click', handlerFn);` will unsubscribe everything that is bound to $host, processes 'click' event and handles handlerFn
- There can be any number of criteria.

### ⚡ `ESLEventUtils.isEventDescriptor`
Predicate to check if the passed argument is type of `ESLListenerDescriptorFn = ESLEventHandler & Partial<ESLEventDescriptor>`.

```typescript
ESLEventUtils.isEventDescriptor(obj: any): obj is ESLListenerDescriptorFn;
```

### ⚡ `ESLEventUtils.getAutoDescriptors`
Method of the `ESLEventUtils` interface that gathers auto-subscribable(collectable) descriptors from the passed object.

```typescript
ESLEventUtils.descriptors(host?: any): ESLListenerDescriptorFn[]
```

**Parameters**:
- `host` - An object to get descriptors from;

### ⚡ `ESLEventUtils.descriptors`
Deprecated alias for `ESLEventUtils.getAutoDescriptors`

### ⚡ `ESLEventUtils.listeners`
Method of the `ESLEventUtils` interface that gathers listeners currently subscribed to the host.

```typescript
ESLEventUtils.listeners(host: HTMLElement, ...criteria: ESLListenerCriteria[]): ESLEventListener[];
```

**Parameters**:
- `host` - an object that stores and relates to the handlers;
- `criteria` - an optional set of criteria to filter the listeners list.

### ⚡ `ESLEventUtils.dispatch`

Method of the `ESLEventUtils` interface that is used to dispatch custom DOM events.
The event that is being dispatched is bubbling and cancelable by default.

```typescript
ESLEventUtils.dispatch(
  el: EventTarget,
  eventName: string,
  eventInit?: CustomEventInit
): boolean;
```

**Parameters**:
- `el` - EventTarget to dispatch event;
- `eventName` - name of the event to dispatch;
- `eventInit` - object that specifies characteristics of the event.
  This parameter can be used to overwrite the default behavior of bubbling and being cancelable.


### Decorator `@listen`
The `@listen` decorator is a sugar above `ESLEventUtils.initDescriptor` method, it allows you to declare class methods 
as an `ESLEventDescriptorFn`.

Listeners described by `@listen` are auto-subscribable by default if they are not inherited (than the type is inherited) 
or declared manual explicitly (`{auto: false}`).


### Listeners Showcase Example
```typescript
class TestCases {
  bind() {
    // subcribes all auto descriptors (onEventAutoDescSugar and onEventAutoDesc)
    ESLEventUtils.subscribe(this); 

    // Simply subscribe onEventManualFn on click
    ESLEventUtils.subscribe(this, 'click', this.onEventManualFn);

    // Subscribe onEventManualFn on window resize
    ESLEventUtils.subscribe(this, {event: 'resize', target: window}, this.onEventManualFn);

    // Simply subscribe onEventManualFn on click
    ESLEventUtils.subscribe(this, 'click', this.onEventManualFn);

    // Subscribe onEventManualDesc by embeded information
    ESLEventUtils.subscribe(this, this.onEventManualDesc);

    // Subscribe onEventManualDesc by merged embeded and passed information
    ESLEventUtils.subscribe(this, {target: window}, this.onEventManualDesc); 
  }

  unbind() {
    // unsubcribes all subscription
    ESLEventUtils.unsubscribe(this);

    // unsubcribes just onEventAutoDesc
    ESLEventUtils.unsubscribe(this, this.onEventAutoDesc);
  }
  
  @listen('event')
  onEventAutoDescSugar() {}

  onEventManualFn() {}
  onEventAutoDesc() {}
  onEventManualDesc() {}
}
ESLEventUtils.initDescriptor(TestCases.prototype, 'onEventAutoDesc', {event: 'event', auto: true});
ESLEventUtils.initDescriptor(TestCases.prototype, 'onEventManualDesc', {event: 'event'});
```

## Embedded behaviour of `ESLBaseElement` / `ESLMixinElement`

### Shortcuts
All the inheritors of `ESLBaseElement` and `ESLMixinElement` contain the short aliases for `ESLEventUtils` methods.
The host parameter of the shortcut methods are always targeting current element/mixin.

- `$$on` ~ `ESLEventUtils.subscribe(this, ...)`
- `$$off` ~ `ESLEventUtils.unsubscribe(this, ...)`
- `$$fire` ~ `ESLEventUtils.dispatch(this, ...)`

```typescript
this.$$on('click', this.onClick); // ESLEventUtils.subscribe(this, 'click', this.onClick)
this.$$off('click'); // ESLEventUtils.unsubscribe(this, 'click')
```

### Auto-subscription / Auto-unbinding

All the inheritors of `ESLBaseElement` and `ESLMixinElement` subscribe to all declared auto-subscribable descriptors 
of their prototype chain.

All the inheritors of `ESLBaseElement` and `ESLMixinElement` unsubscribe all own listeners attached via ESL 
automatically on `disconnectedCallback`.

The following short snippet of code describes a listener that will automatically subscribe and unsubscribe
on connected/disconnected callback inside `ESLBaseElement` or `ESLMixinElement`:
 ```typescript
class MyEl extends ESLBaseElement {
  // connectedCallback() {
  //   super.connectedCallback(); // - already contains ESLEventUtils.subscribe(this); call
  // }

  // Will be subscribed automatically on connectedCallback and unsubscribed on disconnectedCallback
  @listen('click')
  onClick(e) { 
    //... 
  }
}
 ```

Full descriptor options are available with decorator
 ```typescript
class MyEl extends ESLBaseElement {
  @listen({event: 'click', target: 'body', capture: true})
  onBodyClick(e) {
    // ...
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
    this.$$off(this.onClick); // The same behavior as in the examples above

    ESLEventUtils.subscribe($host, this.onClick); // Low-level API support
  }
}
 ```
