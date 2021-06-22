# UIP Plugin

[UIPPlugin](#uip-plugin) - base class for all UIP elements. Extending it allows creating custom UIP
components.

---

## Description:

All UIP elements are [UIPPlugin](#uip-plugin) instances. Plugin automatically sets *uip-plugin* class to its elements,
provides access to [UIPRoot](#uip-root) and adds **_onRootStateChange()** method, which is a key part in components
communication.

After initialization [UIPPlugin](#uip-plugin) subscribes to [UIPStateModel](#uip-state-model) changes and, after
destroying, automatically unsubscribes. **_onRootStateChange()** is called every time markup changes are detected.
As you can see, the flow is quite simple to what we usually do in
[Observable](https://en.wikipedia.org/wiki/Observer_pattern) pattern.

## Processing markup changes

**_onRootStateChange()** method is abstract, so you need to implement it by yourself. It has the following signature:

```typescript
import {UIPPlugin} from "./plugin";

class UIPComponent extends UIPPlugin {
  protected _onRootStateChange(e: StateModelFiredObj): void {
      //...;
  }
}
```

**StateModelFiredObj** is an interface we use for representing objects passed to subscription's callbacks. It's quite
simple:

```typescript
interface StateModelFiredObj {
  markup: string,
}
```

To make the long story shorter: we implement "reaction" callback in **_onRootStateChange()** (inside this callback we
have access to markup) and every time [UIPStateModel](#uip-state-model) produces markup updates, we "react" to them!

---

## Example

```typescript
import {UIPPlugin} from "./plugin";

class UIPPreview extends UIPPlugin {
  protected _onRootStateChange(): void {
    this.$inner.innerHTML = this.root!.model.html;
    this.innerHTML = '';
    this.appendChild(this.$inner);
  }
}
```

---

# UIP Root

[UIPRoot](#uip-root) - container for [UIPPlugin](#uip-plugin) components.

---

## Description:

[UIPRoot](#uip-plugin) contains [UIPStateModel](#uip-state-model) getter. It also allows [UIPPlugin](#uip-plugin) elements
subscribing to model changes (or unsubscribing from them). More details can be found in [UIPPlugin](#uip-plugin) docs.

---

## Example:

```html
<uip-root></uip-root>
```

---

# UIP State Model
