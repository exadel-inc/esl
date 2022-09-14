[//]: # (TODO)

# ESL Event Listener module

<a name="intro"></a>

ESL has a built-in mechanism to work with DOM events. 
ESLEventListeners has more control and more advanced features than native DOM API.
In addition, ESLMixinElement and ESlBaseElement have even more syntax sugar 
to make consumer's code super small and clean.

## EventUtils class

`EventUtils` is a root class for the event listener module, it contains ESL event listeners module API.

### `EventUtils.dispatch`
Method of the `EventUtils` interface that used to dispatch custom events. 
The event that is being dispatched is bubbling and cancelable by default.

```typescript
EventUtils.dispatch(el: EventTarget, eventName: string, eventInit?: CustomEventInit)
```

**Parameters**:
- `el` - EventTarget to dispatch event;
- `eventName` - name of the event to dispatch;
- `eventInit` - object that specifies characteristics of the event. 
This parameter can be used to overwrite the default behavior of bubbling and being cancelable.


### `EventUtils.subscribe`
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


### `EventUtils.unsubscribe`
Method of the `EventUtils` interface that allows subscribing elements to DOM events.

```typescript
unsubscribe(host: HTMLElement, ...criteria: ESLListenerCriteria[]): ESLEventListener[]
```

**Parameters**:
- `host` - An element to unsubsribe;
- `criteria` - An optional set of criteria to filter listeners to remove.


### `EventUtils.descriptors`
Method of the `EventUtils` interface that gathers descriptors from the passed object. See [ESLListenerDescriptorFn](#listenerDescFn).

```typescript
EventUtils.descriptors(target?: any, auto: boolean = true): ESLListenerDescriptorFn[]
```

**Parameters**:
- `target` - An object to get descriptors from;
- `auto` - A boolean value indicating that the listener should be automatically subscribed within connected callback.


### `EventUtils.listeners`
Method of the `EventUtils` interface that gathers listeners currently subscribed to the target.

```typescript
EventUtils.listeners(target: HTMLElement, ...criteria: ESLListenerCriteria[]): ESLEventListener[]
```

**Parameters**:
- `host` - An element which listeners to get;
- `criteria` - An optional set of criteria to filter listeners list.





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
