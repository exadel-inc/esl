## Basic concepts

The `esl-event-listener` module is based on the following major terms and classes:

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

A simple descriptor is an object that is passed to ESLEventListener API to create a subscription.
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

  ⚠ See [OOTB Extended Event Targets](./3-extended-targets.md) of ESL to know how to optimize handling of frequent events.

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

  <u>Type:</u> `boolean | PropertyProvider<boolean>`
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
  <u>Description:</u> marker to use the capturing phase of the DOM event to handle.

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

The `ESLBaseElment` and the `ESLMixinElement` subscribe all auto-collectable descriptors in the `connectedCallback`.
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
