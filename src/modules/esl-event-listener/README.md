# ESL Event Listener module

Version: *1.0.0*.

Authors: *Alexey Stsefanovich (ala'n)*.

<a name="intro"></a>

Starting from the 4th release ESL has a built-in mechanism to work with DOM events. 
ESLEventListeners has more control and more advanced features than native DOM API.
In addition, ESLMixinElement and ESlBaseElement have even more syntax sugar 
to make consumer's code super small and clean.

## `ESLEventUtils` class

`ESLEventUtils` is a root class for the event listener module, it contains ESL event listeners module API.
One of the main advantages of `ESLEventUtils` over the native addEventListener is the extended control of subscriptions.
All ESL listeners are saved and associated with the host element, after that, 
the listener can be unhooked at any time in a variety of ways. 
And most importantly, you do not need the original callback handler for this.


Here the `ESLEventUtils` API:

### ⚡ `ESLEventUtils.subscribe`
The main method to create ESLEventListener and subscribe to DOM events.

```typescript
subscribe(host: HTMLElement, handler: ESLListenerHandler): ESLEventListener[];
subscribe<EType extends keyof ESLListenerEventMap>(
  host: HTMLElement,
  descriptor: EType | ESLListenerDescriptor<EType>,
  handler: ESLListenerHandler<ESLListenerEventMap[EType]>
): ESLEventListener[];
subscribe<EType extends keyof ESLListenerEventMap>(
  host: HTMLElement,
  descriptor: Partial<ESLListenerDescriptor>,
  handler: ESLListenerDescriptorFn<EType>
): ESLEventListener[];
```

**Parameters**:
- `host` - host element to store subscription (event target by default);
- `eventDesc` - Event type or object of event description data;
- `handler` - Callback handler. See [ESLListenerHandler](#listenerHandler).

Examples:
- `ESLEventUtils.subscribe($host, handlerFn);` - 
subscribes decorated `handlerFn` method to the `target`;
- `ESLEventUtils.subscribe($host, 'click', handlerFn);` - 
subscribes `handlerFn` function with the passed event type;
- `ESLEventUtils.subscribe($host, {event: 'scroll', target: window}, handlerFn);` - 
subscribes `handlerFn` function with the passed additional descriptor data.


### ⚡ `ESLEventUtils.unsubscribe`
Method of the `ESLEventUtils` interface that allows subscribing elements to DOM events.

```typescript
unsubscribe(
  host: HTMLElement,
  ...criteria: ESLListenerCriteria[]
): ESLEventListener[];
```

**Parameters**:
- `host` - An element to unsubsribe;
- `criteria` - An optional set of criteria to filter listeners to remove.

Examples:
- `ESLEventUtils.unsubscribe($host);` will unsubscribe everything bound to $host
- `ESLEventUtils.unsubscribe($host, handlerFn);` will unsubscribe everything that is bound to $host and is handled by handlerFn
- `ESLEventUtils.unsubscribe($host, 'click');` will unsubscribe everything bound to $host and process 'click'
- `ESLEventUtils.unsubscribe($host, 'click', handlerFn);` will unsubscribe everything that is bound to $host, processes 'click' event and handles handlerFn
- There can be any number of criteria.

### ⚡ `ESLEventUtils.isEventDescriptor`
Predicate to check if the passed argument is a function decorated with `ESLEventListener` metadata (`ESLListenerDescriptorFn``).

```typescript
ESLEventUtils.isEventDescriptor(obj: any): obj is ESLListenerDescriptorFn;
```

### ⚡ `ESLEventUtils.descriptors`
Method of the `ESLEventUtils` interface that gathers descriptors from the passed object. See [ESLListenerDescriptorFn](#listenerDescFn).

```typescript
ESLEventUtils.descriptors(
  target?: any, 
  auto: boolean = true
): ESLListenerDescriptorFn[]
```

**Parameters**:
- `target` - An object to get descriptors from;
- `auto` - A boolean value indicating that the listener should be automatically subscribed within connected callback.


### ⚡ `ESLEventUtils.listeners`
Method of the `ESLEventUtils` interface that gathers listeners currently subscribed to the target.

```typescript
ESLEventUtils.listeners(
  target: HTMLElement,
  ...criteria: ESLListenerCriteria[]
): ESLEventListener[];
```

**Parameters**:
- `host` - an object that stores and relates to the handlers;
- `criteria` - an optional set of criteria to filter listeners list.

### ⚡ `ESLEventUtils.dispatch`

Method of the `ESLEventUtils` interface that is used to dispatch custom events.
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


## Listeners methods on `ESLBaseElement` / `ESLMixinElement`
All the inheritors of `ESLBaseElement` and `ESLMixinElement` now have `$$on` and `$$off` methods,
which still have the same capabilities but only set the current element as the host.

```typescript
this.$$on('click', this.onClick);
this.$$off('click'); // или this.$$off(this.onClick)
```

### Auto-unbind
All the inheritors of `ESLBaseElement` and `ESLMixinElement` unsubscribe from events attached via ESL automatically 
on `disconnectedCallback`.

### Decorator `@listen`
The `@listen` decorator is now available in ESL, which makes it even easier to work with events

The following short snippet of code describes a listener that will automatically subscribe and unsubscribe 
on connected/disconnected callback inside `ESLBaseElement` or `ESLMixinElement`:
 ```typescript
class MyEl extends ESLBaseElement {
  @listen('click')
  onClick(e) { 
    //... 
  }
}
 ```

Full descriptor options are available with decorator as well
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
