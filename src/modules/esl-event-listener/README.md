[//]: # (TODO: rewrite)

# ESL Event Utils module

<a name="intro"></a>

## <a name="target">`SyntheticEventTarget` class</a>
`SyntheticEventTarget` base class to emulate `EventTarget` behaviour  for custom EventTargets. It supports both `EventListener` (`Function`) and `EventListenerObject` handlers.

### `addEventListener`
Method of the `SyntheticEventTarget` interface that sets up a function that will be called whenever the specified event is delivered to the target.

```typescript
addEventListener(type?: string = 'change', callback: EventListenerOrEventListenerObject)
```
**Parameters**:

`type` - A case-sensitive string representing the event type to listen for. Default event type is 'change' type.

`listener` - The object that receives a notification (an object that implements the Event interface) when an event of the specified type occurs. This parameter can be null, an object with a `handleEvent()` method, or a JavaScript function.

Method supports short calls without passing an event name. In this case callback will be assigned to 'change' event type.

Supported syntax
- `target.addEventListener('change', listener);`
- `target.addEventListener(listener);`

### `removeEventListener`
Method of the `SyntheticEventTarget` interface that removes an event listener previously registered with `SyntheticEventTarget.addEventListener()` method from the target.

```typescript
removeEventListener(type?: string = 'change', callback: EventListenerOrEventListenerObject)
```
**Parameters**:

`type` - A case-sensitive string representing the event type to listen for. Default event type is 'change' type;

`listener` - The object that receives a notification (an object that implements the Event interface) when an event of the specified type occurs. This parameter can be null, an object with a `handleEvent()` method, or a JavaScript function to remove from the event target.

Method supports short calls without passing an event name. In this case callback will be assigned to 'change' event type.

Supported syntax
- `target.removeEventListener('change', listener);`
- `target.removeEventListener(listener);`

### `hasEventListener`
`SyntheticEventTarget` **does not** implement access to list of listeners subscribed to target.
`hasEventListener` is method of the `SyntheticEventTarget` interface that checks if amount of subscribed listeners with specified event is more than passed number.

```typescript
hasEventListener(type?: string, minCount?: number): boolean
```

**Parameters**:

`type` - A case-sensitive string representing the event type to listen for. Default event type is 'change' type;

`mincount` - A number comparing to amount of event callbacks. Default count of event listeners is 0.

Method supports short calls without passing an event name or without passing an expected number of listeners.

Supported syntax
- `target.hasEventListener('change', 0);`
- `target.hasEventListener('change');`
- `target.hasEventListener(0);`
- `target.hasEventListener();`

### `dispatchEvent`
Method of the `SyntheticEventTarget` interface that dsipatches passed event. Returns true if `preventDefault()` was invoked successfully to indicate cancelation, and false otherwise.

```typescript
dispatchEvent(e: Event): boolean
```

**Parameters**:

`e` - An event to dispatch.

## <a name="listener">`ESLEventListener` class</a>
ESL has built-in mechanism to work with DOM events. `ESLEventListener` instance is used as an 'inner' record to process subscriptions made by `EventUtils`. Uses `EventListenerObject` interface to subscribe to event.

```typescript
new ESLEventListener($host: HTMLElement, handler: ESLListenerHandler, desc: ESLListenerDescriptor)
```
**Constructor parameters**:

`$host` - Element to subscribe listener to;

`handler` - Callback handler. See [ESLListenerHandler](#listenerHandler);

`desc` - An object that specifies characteristics about the event listener. See [ESLListenerDescriptor](#listenerDesc).

### `$targets`
Getter of the `ESLEventListener` interface that returns list of elements that will be listened by `ESLEventListener`.

```typescript
get $targets(): EventTarget[]
```

### `matches`
Method of the `ESLEventListener` interface that checks if the passed criteria matches current event listener.

```typescript
matches(desc?: ESLListenerCriteria): boolean
```
- If descriptor is `string` type, then criteria is checked by the `event` name;
- If descriptor is `function` type, then criteria is checked by the `handler` reference;
- If descriptor is `object` type, then criteria is checked as descriptor using `isSimilar` comparer.

**Parameters**:

`desc` - A descriptor to compare `ESLEventListener` to. See [ESLListenerCriteria](#listenerCriteria).

**Note**: `function` (handler) marcher has a priority over descriptor check, so handler function`s own properties will be ignored.

### `handleEvent`
Method of the `ESLEventListener` interface that handles caught event. It can used as callback for low-level subscriptions.

```typescript
handleEvent(e: Event): void
```
**Parameters**:

`e` - The Event object to handle.

### `subscribe`
Method of the `ESLEventListener` interface that subscribes or resubscribes event listener instance to targets specified in descriptor object.

```typescript
subscribe(): void 
```

### `unsubscribe`
Method of the `ESLEventListener` interface that unsubscribes event listener instance from targets specified in descriptor object.

```typescript
unsubscribe(): void
```

### `ESLEventListener.get`
Method of the `ESLEventListener` interface that returns stored listeners array that are currently subscribed to passed `host` object.

```typescript
ESLEventListener.get(host?: any): ESLEventListener[]
```
**Parameters**:

`host` - The object to check.

### `ESLEventListener.create`
Method of the `ESLEventListener` interface that creates event listeners based on passed `handler` and `desc` objects and subscribes to passed `target` element.

```typescript
ESLEventListener.create(target: HTMLElement, handler: ESLListenerHandler, desc: ESLListenerDescriptor): ESLEventListener[]
```

**Parameters**:

`target` - Element to subscribe listener to;

`handler` - Callback handler. See [ESLListenerHandler](#listenerHandler);

`desc` - An object that specifies characteristics about the event listener. See [ESLListenerDescriptor](#listenerDesc).

## <a name="eUtils">`Event Utils` class</a>

### `EventUtils.dispatch`
Method of the `EventUtils` interface that can be used to dispatch custom event. The event that is being dispatched is bubbling and cancelable by default.
```typescript
EventUtils.dispatch(el: EventTarget, eventName: string, eventInit?: CustomEventInit)
```

**Parameters**:

`el` - Target element;

`eventName` - Name of the event;

`eventInit` - An object that specifies characteristics about the event. This parameter can be used to everwrite the default behavior of bubbling and being cancelable.

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

`eventDesc` - Event type or obejct of evnt description data;

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

## <a name="misc">`Miscellaneous Event Utils`</a>

### Guards
- `isMouseEvent` - Checks if the passed event is `MouseEvent`.
```typescript
isMouseEvent = (event: Event): boolean
```
- `isTouchEvent` - Checks if the passed event is `TouchEvent`.
```typescript
isTouchEvent = (event: Event): boolean
```
- `isPointerEvent` - Checks if the passed event is `PointerEvent`.
```typescript
isPointerEvent = (event: Event): boolean
```

### Utils
- `isPassiveByDefault` - Method that returns `true` if the passed event should be passive by default. 
See [EventListenerOptions explainer](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)
```typescript
isPassiveByDefault = (event: string): boolean 
```
- `getCompositeTarget` - Method that gets the original CustomEvent source in case event bubbles from Shadow DOM.
```typescript
getCompositeTarget = (e: CustomEvent): EventTarget | null
```
- `getTouchPoint` - Method that returns touch point coordinates of `TouchEvent` or `PointerEvent`.
```typescript
getTouchPoint = (event: TouchEvent | PointerEvent | MouseEvent): Point
```
- `getOffsetPoint` - Method that returns element offset point coordinates.
```typescript
getOffsetPoint = (el: Element): Point
```

### Interfaces
- `Point` - Object that describes coordinates.
```typescript
interface Point {
  x: number;
  y: number;
}
```

### <a name="listenerDesc">`ESLListenerDescriptor` type</a>

```typescript
type ESLListenerDescriptor<EType extends keyof ESLListenerEventMap = string> = {
  /** A case-sensitive string (or provider function) representing the event type to listen for */
  event: EType | PropertyProvider<EType>;
  /**
   * A boolean value indicating that events for this listener will be dispatched on the capture phase.
   * @see AddEventListenerOptions.capture
   */
  capture?: boolean;
  /**
   * A boolean value that indicates that the function specified by listener will never call preventDefault()
   * @see AddEventListenerOptions.passive
   */
  passive?: boolean;

  /** A string (or provider function) representing CSS selector to check delegated event target (undefined (disabled) by default) */
  selector?: string | PropertyProvider<string>;
  /**
   * A string (or provider function) selector to find the target or {@link EventTarget} object to subscribe the event listener to
   * **Note**: string values are processed by the {@link TraversingQuery} syntax
   * (e.g. `button` selects all buttons globally, while `::find(button)` selects only buttons inside current element)
   */
  target?: EventTarget | string | null | PropertyProvider<EventTarget | string | null>;

  /** Identifier of the event listener. Can be used to group and unsubscribe listeners */
  id?: string;
  /**
   * A reference to the component (mixin) that holds the event listener descriptor
   * Used as a call context for the event listener handler if defined
   */
  context?: unknown;

  /** A boolean value indicating that the listener should be automatically subscribed within connected callback */
  auto?: boolean;
  /** A boolean value indicating that the listener should be invoked at most once after being added */
  once?: boolean;
};
```

### <a name="listenerDescFn">`ESLListenerDescriptorFn` type</a>

```typescript
type ESLListenerDescriptorFn<EType extends keyof ESLListenerEventMap = string> = 
ESLListenerHandler<ESLListenerEventMap[EType]> & ESLListenerDescriptor<EType>;
  ```

### <a name="listenerHandler">`ESLListenerHandler` type</a>

```typescript
type ESLListenerHandler<EType extends Event = Event> = (event: EType, listener?: ESLEventListener) => void
```

### <a name="listenerCriteria">`ESLListenerCriteria` type</a>

```typescript
type ESLListenerCriteria = undefined | keyof ESLListenerEventMap | ESLListenerHandler | Partial<ESLEventListener>;
```
