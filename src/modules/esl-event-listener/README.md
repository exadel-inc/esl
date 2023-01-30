# ESL Event Listener module

Version: *2.0.0*.

Authors: *Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

Starting from the 4th release ESL has a built-in mechanism to work with DOM events.
ESL event listeners have more control and more advanced features than native DOM API has.
Besides, the [`ESlBaseElement`](../esl-base-element/README.md) and [`ESLMixinElement`](../esl-mixin-element/README.md)
have even more pre-built syntax sugar to make the consumer's code small and concise.

One of the main advantages of ESL listeners over the native DOM events API is the extended control of subscriptions.
All ESL listeners and their declarations are saved and associated with the host element, so the
ESL listeners can be created or unhooked at any time in a variety of ways.
And most importantly, you do not need the original callback handler to do this.

## Basic concepts

The ESL event listener module is based on the following major terms and classes:

### The `host`

Everything that happens with ESL event listeners should be associated with the `host` object.
The `host` object is not necessarily related to EventTarget, it's the object "owner"(consumer) of the subscription,

The `host` is an EventTarget to subscribe by default (access native DOM Event API using host).
But API has at least two options to change the target. First of all you can define the target explicitly.
Another way is to specify the default DOM target of the host object by providing a special `$host` key
(the same as `ESLMixinElement` does).

The `host` object is also used as a context to call the handler function of the subscription.

### The `handler`

`handler` is a function that is used to process subscription event.
ESL declares a generic type to describe such functions - `ESLListenerHandler`;

```typescript
export type ESLListenerHandler<EType extends Event = Event> = (event: EType) => void;
```

### The `ESLEventListener` class and `subscription`

The subscriptions created by the ESL event listener module are instances of `ESLEventListener` class.
All active subscriptions are stored in the hidden property under the `host` object.
All of them consists of the following major properties:
- `event` - the event that the subscription is listening to;
- `handler` - reference for the function to call to handle the event;
- `host` - reference for holder `host` object;
- `target` - the definition of `EventTarget` element
  (Can be an exact element(s), or it can be omitted or provided by the `TraversingQuery` 
   to find the target in DOM based on the `host` object);
- `selector` - CSS selector to use pre-build check capabilities to use event delegation; 
- `capture` - the marker to use the capture phase of the DOM event live-cycle;
- `passive` - use passive (non blocking) subscription of the native event (if supported);
- `once` - the marker to destroy the subscription after the first event catch;
- `auto` - the  marker for subscription created based on an auto-collectable definition of the host
  (see [Automatic (collectible) descriptors](#automatic-collectible-descriptors));

All of the `ESLEventListener` instance fields are readonly, the subscription can't be changed when it's created. 

The `ESLEventListener`, as a class, describes the subscription behavior as well as
contains static methods to create and manage subscriptions.

### Descriptors (`ESLEventDesriptor`, `ESLEventDesriptorFn`)

The event listener *Descriptor* is an object to describe future subscriptions.
The ESL event listeners module has a couple of special details regarding such objects.

A simple descriptor is an object that you should pass to API to create a subscription.
It contains almost the same set of keys that the `ESLEventListener` instance does.

In addition to that ESL allows you to combine the  `ESLEventDesriptor` data with the handler function.
`ESLEventDesriptorFn` is a function handler that is decorated with the `ESLEventDesriptor` properties.

Here is the list of supported keys of `ESLEventDesriptor`:
- #### `event` key
Type: `string | PropertyProvider<string>`  
Description: the event type for subscription. 
Can be provided as a string or via provider function that will be called in the runtime before exact subscription.

The event sting (as literal or returned by `PropertyProvider`) can declare multiple event types separated by space symbol.
ESL will create multiple subscriptions `ESLEventListener` object for each event separately in this case.

- #### `target` key
Type: `string | EventTarget | EventTarget[] | PropertyProvider<string | EventTarget | EventTarget[]>`
Description: the key to declare exact EventTarget for subscription.
As was mentioned previously by default subscription uses `host` object itself or `$host` key of the `host` object as an event target.
In case the `target` key is a string then it considered as a [`TraversingQuery`](../esl-traversing-query/README.md) to find 
a target relatively to `host | host.$host` object or absolutely in bounds of the active DOM tree.
The `target` key is also supports an exact reference(s) for `EventTargets`. 
Note: any `EventTarget` or event ESL `SynteticEventTarget` (including [`ESLMediaQuery`](../esl-media-query/README.md)) 
can be a target for listener API.
The `target` property can be declared via `PropertyProvider` as well.

- #### `selector` key
Type: `string | PropertyProvider<string>`
Description: the css selector to check the event bubbling chain.
The property to use ootb event delegation check of target.
Supports `PropertyProvider` to declare the computed value as well. 

- #### `capture` key
Type: `boolean`
Description: marker to use capturing phase of the DOM event to handle.

- #### `passive` key
Type: `boolean`
Description: marker to use passive subscription to the native event.
Note: ESL uses passive subscription by default for 'wheel', 'mousewheel', 'touchstart', 'touchmove' events.
You need to declare `passive` key explicitly to override such behaviour.

- #### `once` key
Type: `boolean`
Description: marker to unsubscribe listener with the first successful handling of the event.

- #### `inherit` special key
Type: `boolean`
Description: available in extended version of `ESLEventDesriptor` that used in descriptor declaration API.
Allows to inherit `ESLEventDesriptor` data from the `ESLEventDesriptorFn` declared with the same key in the property chain 
of currently decorated  `ESLEventDesriptorFn` holder. See `initDescriptor` usages example.


### Automatic (collectible) descriptors

If the `ESLEventDesriptorFn` is declared with the `auto` marker of the associated definition 
it became auto-collectable for the ESL event listeners module.
AUto-collectable (or auto-subscribable) descriptors should be declared with `ESLEventUtils.initDescriptor` or
`@listen` decorator as they are also stored under the special private collection of the holder object.
That means you can make all auto-collectable descriptors to be subscribed at once in the future.
The `ESLBaseElment` and `ESLMixinElement` do it in the `connectedCallback` ootb.
See the usage of [`ESLEventUtils.subscibe`](#-esleventutilssubscribe) for more details.


## Public API (`ESLEventUtils`)

The units mentioned previously are mostly implementation details of the module.
`ESLEventUtils` is the root class for the event listener module.
It's a facade for all ESL event listener module capabilities that represent all publicly available API.

Here is the module Public API:

### ⚡ `ESLEventUtils.subscribe`
`ESLEventUtils.subscribe` is the main method to create and subscribe `ESLEventListener`.

- Subscribe all auto-collectable(subscribable) descriptors of the `host` object:
    ```
    ESLEventUtils.subscribe(host: object)
    ```
- Subscribe `handler` function to the DOM event declared by `eventType` string
    ```
    ESLEventUtils.subscribe(host: object, eventType: string, handler: ESLListenerHandler)
    ```
- Subscribes `descriptorFn` type of `ESLEventDescriptorFn` by embedded meta-information
    ```
    ESLEventUtils.subscribe(host: object, descriptorFn: ESLEventDescriptorFn)
    ```
- Subscribes `handler` function by `ESLEventDescriptor` passed data
    ```
    ESLEventUtils.subscribe(host: object, descriptor: ESLEventDescriptor, handler: ESLListenerHandler)
    ```
- Subscribes `handler` type of `ESLEventDescriptorFn` with `ESLEventDescriptor` overriding meta-data
    ```
    ESLEventUtils.subscribe(host: object, descriptorFn: ESLEventDescriptor, handler: ESLEventDescriptorFn)
    ```

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

Method of the `ESLEventUtils` interface that allows to unsubscribe existing subscriptions.

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
Method of the `ESLEventUtils` interface that gathers auto-subscribable(collectible) descriptors from the passed object.

```typescript
ESLEventUtils.descriptors(host?: any): ESLListenerDescriptorFn[]
```

**Parameters**:
- `host` - An object to get descriptors from;

### ⚡ `ESLEventUtils.descriptors`
Deprecated alias for `ESLEventUtils.getAutoDescriptors`


### ⚡ `ESLEventUtils.initDescriptor`

`ESLEventUtils.initDescriptor` - decorate the passed key of the host object as `ESLEventDescriptorFn`

```typescript
ESLEventUtils.initDescriptor<T extends object>(
  host: T, 
  key: keyof T & string, 
  desc: ESLEventDescriptorExt
): ESLEventDescriptorFn;
```

**Parameters**:
- `host` - host object holder of decorated function;
- `key` - key of the `host` object that contains function to decorate;
- `desc` - `ESLEventDescriptor` (extended) meta information to describe future subscriptions

The extended `ESLEventDescriptor` information allows to pass `inherit` marker to create new descriptor instance 
based on descriptor declared in the prototype chain for the same key.
Note: if such key will not found then the `ReferenceError` will thrown by `ESLEventUtils.initDescriptor` method.

### ⚡ `@listen` decorator
The `@listen` decorator (awailable under `esl-utils/decorators`) is a sugar above `ESLEventUtils.initDescriptor` method. 
It allows you to declare class methods as an `ESLEventDescriptorFn` using TS `experimentalDecorators` feature.

Listeners described by `@listen` are auto-subscribable by default if they are not inherited (than the type is inherited)
or declared as manual explicitly (`{auto: false}`).


### ⚡ `ESLEventUtils.listeners`
Method of the `ESLEventUtils` interface, that gathers listeners currently subscribed to the passed `host` object.

```typescript
ESLEventUtils.initDescriptor(host: object, ...criteria: ESLListenerCriteria[]): ESLEventListener[];
```

**Parameters**:
- `host` - an object that stores and relates to the handlers;
- `criteria` - an optional set of criteria to filter the listeners list.


### ⚡ `ESLEventUtils.dispatch`

Method of the `ESLEventUtils` interface, that is used to dispatch custom DOM events.
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


### Listeners Full Showcase Example
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

## Embedded behavior of `ESLBaseElement` / `ESLMixinElement`

### Shortcuts

All the inheritors of `ESLBaseElement` and `ESLMixinElement` contain the short aliases for some `ESLEventUtils` methods.
The host parameter of the shortcut methods is always targeting current element/mixin.

- `$$on` ~ `ESLEventUtils.subscribe(this, ...)`
- `$$off` ~ `ESLEventUtils.unsubscribe(this, ...)`
- `$$fire` ~ `ESLEventUtils.dispatch(this, ...)`

Example:
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

Full list of descriptor options are available with `ESLEventDescriptor` object passed to decorator:
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
