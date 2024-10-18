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

Gathers descriptors from the passed object.
Accepts criteria to filter the descriptors list.

```typescript
  ESLEventUtils.descriptors(host?: any): ESLListenerDescriptorFn[];
  ESLEventUtils.descriptors(host?: any, ...criteria: ESLListenerDescriptorCriteria[]): ESLListenerDescriptorFn[];
```

**Parameters**:

- `host` - object to get auto-collectable descriptors from;


<a name="-esleventutilsgetautodescriptors"></a>

### ⚡ <strike>`ESLEventUtils.getAutoDescriptors`</strike>

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
