# ESL Event Utils module

<a name="intro"></a>
## `SyntheticEventTarget` class

`SyntheticEventTarget` base class to emulate `EventTarget` behaviour 
for custom EventTargets with an ability to access to subscribed listeners.

`SyntheticEventTarget` supports both `EventListener` (`Function`) and `EvventListenerObject`
handlers.

Currently `SyntheticEventTarget` **does not** support other events except `change`.

`SyntheticEventTarget` supports short calls without passing an event name.

## ESLEventListeners

ESL has builtin mechanism to work with DOM events.

### `EventUtils.dispatch` 
`EventUtils.dispatch` - short method to dispatches custom event.
Event bubbles and is cancelable by default, use `eventInit` param to override that.
```
EventUtils.dispatch(
  el: EventTarget, eventName: string, 
  eventInit?: CustomEventInit
)
``` 

### `EventUtils.subscribe`
`EventUtils.subscribe` - allows subscribing on DOM events using following syntax
 - `EventUtils.subscribe($host, 'click', handlerFn);`
 - `EventUtils.subscribe($host, {event: 'click'}, handlerFn);`



<!-- Replace with TS doc based generator in future -->
## Miscellaneous Event Utils

### Guards
- `isMouseEvent` - Checks if the passed event is `MouseEvent` 
- `isTouchEvent` - Checks if the passed event is `TouchEvent`
- `isPointerEvent` - Checks if the passed event is `PointerEvent`

### Utils
- `isPassiveByDefault` - Returns `true` if the passed event should be passive by default. 
See [EventListenerOptions explainer](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)
- `getCompositeTarget` - Gets the original CustomEvent source in case event bubbles from Shadow DOM
- `getTouchPoint` -  Returns touch point coordinates of `TouchEvent` or `PointerEvent`
- `getOffsetPoint` - Returns element offset point coordinates

### Interfaces
- `Point` - Object that describes coordinates
```typescript
interface Point {
  x: number;
  y: number;
}
```
