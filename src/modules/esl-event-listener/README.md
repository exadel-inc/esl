[//]: # (TODO: rewrite)

# ESL Event Listener module

<a name="intro"></a>

ESL has built-in mechanism to work with DOM events.
`ESLEventListener` instance is used as an 'inner' record to process subscriptions made by `EventUtils`.

## <a name="eUtils">`Event Utils` class</a>

### `EventUtils.dispatch`
Method of the `EventUtils` interface that can be used to dispatch custom event. The event that is being dispatched is bubbling and cancelable by default.
```typescript
EventUtils.dispatch(el: EventTarget, eventName: string, eventInit?: CustomEventInit)
```

**Parameters**:

`el` - Target element;

`eventName` - Name of the event;

`eventInit` - An object that specifies characteristics about the event. This parameter can be used to overwrite the default behavior of bubbling and being cancelable.

### `EventUtils.descriptors`
Method of the `EventUtils` interface that gathers descriptors from the passed object. See [ESLListenerDescriptorFn](#listenerDescFn).

```typescript
EventUtils.descriptors(target?: any, auto: boolean = true): ESLListenerDescriptorFn[]
```

**Parameters**:

`target` - An object to get descriptors from;

`auto` - A boolean value indicating that the listener should be automatically subscribed within connected callback.

### `EventUtils.listeners`
Method of the `EventUtils` interface that gathers listeners currently subscribed to the target.

```typescript
EventUtils.listeners(target: HTMLElement, ...criteria: ESLListenerCriteria[]): ESLEventListener[]
```

**Parameters**:

`target` - An element which listeners to get;

`criteria` - An optional set of criteria to filter listeners list.

### `EventUtils.subscribe`
Method of the `EventUtils` interface that allows subscribing elements to DOM events.

```typescript
EventUtils.subscribe(target: HTMLElement, eventDesc?: string | Partial<ESLListenerDescriptor>, handler: ESLListenerHandler): ESLEventListener[]
```

**Parameters**:

`target` - An element to subsribe;

`eventDesc` - Event type or object of event description data;

`handler` - Callback handler. See [ESLListenerHandler](#listenerHandler).

Supported syntax
- `EventUtils.subscribe($host, handlerFn);` - subscribes decorated `handler` method to the `target`;
- `EventUtils.subscribe($host, 'click', handlerFn);` - subscribes `handler` function with the passed event type;
- `EventUtils.subscribe($host, {event: 'click'}, handlerFn);` - subscribes `handler` descriptor function with the passed additional descriptor data.

### `EventUtils.unsubscribe`
Method of the `EventUtils` interface that allows subscribing elements to DOM events.

```typescript
unsubscribe(target: HTMLElement, ...criteria: ESLListenerCriteria[]): ESLEventListener[]
```

**Parameters**:

`target` - An element to unsubsribe;

`criteria` - An optional set of criteria to filter listeners to remove.
