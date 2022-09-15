[//]: # (TODO)

# ESL Event Listener module

<a name="intro"></a>

ESL has a built-in mechanism to work with DOM events. 
ESLEventListeners has more control and more advanced features than native DOM API.
In addition, ESLMixinElement and ESlBaseElement have even more syntax sugar 
to make consumer's code super small and clean.

## EventUtils class

`EventUtils` is a root class for the event listener module, it contains ESL event listeners module API.
One of the main advantages of `EventUtils` over the native addEventListener is the extended control of subscriptions.
All ESL listeners are saved and associated with the host element, after that, 
the listener can be unhooked at any time in a variety of ways. 
And most importantly, you do not need the original callback handler for this.

For example 
- `EventUtils.unsubscribe($host);` will unsubscribe everything bound to $host
- `EventUtils.unsubscribe($host, handlerFn);` will unsubscribe everything that is bound to $host and is handled by handlerFn
- `EventUtils.unsubscribe($host, 'click');` will unsubscribe everything bound to $host and process 'click'
- `EventUtils.unsubscribe($host, 'click', handlerFn);` will unsubscribe everything that is bound to $host, processes 'click' event and handles handlerFn
- There can be any number of criteria.


Here the `EventUtils` API:

### ⚡ `EventUtils.subscribe`
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
- `EventUtils.subscribe($host, handlerFn);` - 
subscribes decorated `handlerFn` method to the `target`;
- `EventUtils.subscribe($host, 'click', handlerFn);` - 
subscribes `handlerFn` function with the passed event type;
- `EventUtils.subscribe($host, {event: 'scroll', target: window}, handlerFn);` - 
subscribes `handlerFn` function with the passed additional descriptor data.


### ⚡ `EventUtils.unsubscribe`
Method of the `EventUtils` interface that allows subscribing elements to DOM events.

```typescript
unsubscribe(
  host: HTMLElement,
  ...criteria: ESLListenerCriteria[]
): ESLEventListener[];
```

**Parameters**:
- `host` - An element to unsubsribe;
- `criteria` - An optional set of criteria to filter listeners to remove.


### ⚡ `EventUtils.descriptors`
Method of the `EventUtils` interface that gathers descriptors from the passed object. See [ESLListenerDescriptorFn](#listenerDescFn).

```typescript
EventUtils.descriptors(
  target?: any, 
  auto: boolean = true
): ESLListenerDescriptorFn[]
```

**Parameters**:
- `target` - An object to get descriptors from;
- `auto` - A boolean value indicating that the listener should be automatically subscribed within connected callback.


### ⚡ `EventUtils.listeners`
Method of the `EventUtils` interface that gathers listeners currently subscribed to the target.

```typescript
EventUtils.listeners(
  target: HTMLElement,
  ...criteria: ESLListenerCriteria[]
): ESLEventListener[];
```

**Parameters**:
- `host` - An element which listeners to get;
- `criteria` - An optional set of criteria to filter listeners list.

### ⚡ `EventUtils.dispatch`

Method of the `EventUtils` interface that is used to dispatch custom events.
The event that is being dispatched is bubbling and cancelable by default.

```typescript
EventUtils.dispatch(
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


## Listeners methods on ESLBaseElement / ESLMixinElement
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

    EventUtils.subscribe($host, this.onClick); // Low-level API support
  }
}
 ```
