# ESL Event Listener module

Version: *2.0.0*.

Authors: *Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

Starting from the 4th release ESL has a built-in mechanism to work with DOM events.
ESL event listeners have more control and advanced features than native DOM API.
Besides, the [`ESlBaseElement`](../esl-base-element/README.md) and the [`ESLMixinElement`](../esl-mixin-element/README.md)
have even more pre-built syntax sugar to make the consumer's code briefer.

One of the main advantages of ESL listeners is the extended control of subscriptions.
All ESL listeners and their declarations are saved and associated with the host element. 
It means that ESL listeners can be subscribed or unsubscribed at any time in various ways.
And most importantly, you do not need the original callback handler to do this.

---

## Basic concepts

The ESL event listener module is based on the following major terms and classes:

### The `host`

Everything that happens with ESL event listeners should be associated with a `host` object.
The `host` is an object that "owns" (registers / deletes) the subscription.

By default, the `host` is used as an `EventTarget` (or an object implementing `EventTarget` interface) to subscribe.
But the `host` object is not necessarily related to an `EventTarget`.
We have at least two options to change the target. First of all, you can define the target explicitly.
Another way is to specify the default DOM target of the host object by providing a special `$host` key
(see `ESLMixinElement` implementation).

The `host` object is also used as a context to call the handler function of the subscription.

### The `handler`

The `handler` is a function that is used to process the subscription event.
ESL declares a generic type to describe such functions - `ESLListenerHandler`;

```typescript
export type ESLListenerHandler<EType extends Event = Event> = (event: EType) => void;
```

### The `ESLEventListener` class and *subscription*

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

All of the `ESLEventListener` instance fields are read-only; the subscription can't be changed once created. 

The `ESLEventListener`, as a class, describes the subscription behavior and
contains static methods to create and manage subscriptions.

### Descriptors (`ESLEventDesriptor`, `ESLEventDesriptorFn`)

The event listener *Descriptor* is an object to describe future subscriptions.
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
  
  The `target` property can be declared via `PropertyProvider` as well.  
  
- #### `selector` key
  <u>Type:</u> `string | PropertyProvider<string>`  
  <u>Default Value:</u> `null`  
  <u>Description:</u> the CSS selector to filter event targets for event delegation mechanism.
  
  Supports `PropertyProvider` to declare the computed value as well.
  
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


### ⚡ `ESLEventUtils.isEventDescriptor`
Predicate to check if the passed argument is a type of `ESLListenerDescriptorFn = ESLEventHandler & Partial<ESLEventDescriptor>`.

```typescript
ESLEventUtils.isEventDescriptor(obj: any): obj is ESLListenerDescriptorFn;
```

### ⚡ `ESLEventUtils.getAutoDescriptors`
Gathers auto-subscribable (collectable) descriptors from the passed object.

```typescript
ESLEventUtils.descriptors(host?: any): ESLListenerDescriptorFn[]
```

**Parameters**:
- `host` - object to get auto-collectable descriptors from;

### ⚡ `ESLEventUtils.descriptors`
Deprecated alias for `ESLEventUtils.getAutoDescriptors`


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


### ⚡ `ESLEventUtils.listeners`

Gathers listeners currently subscribed to the passed `host` object.

```typescript
ESLEventUtils.listeners(host: object, ...criteria: ESLListenerCriteria[]): ESLEventListener[];
```

**Parameters**:
- `host` - object that stores and relates to the handlers;
- `criteria` - optional set of criteria to filter the listeners list.


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

## Embedded behavior of `ESLBaseElement` / `ESLMixinElement`

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
