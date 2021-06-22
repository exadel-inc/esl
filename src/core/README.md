# UIP Plugin

[UIPPlugin](#uip-plugin) - base class for all UIP elements. Extending it allows creating custom UIP
components.

## Description

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

## Description:

[UIPRoot](#uip-plugin) contains [UIPStateModel](#uip-state-model) getter. It also allows [UIPPlugin](#uip-plugin) elements
subscribing to model changes (or unsubscribing from them). More details can be found in [UIPPlugin](#uip-plugin) docs.

## Example:

```html
<uip-root></uip-root>
```

---

# UIP State Model

[UIPStateModel](#uip-state-model) - state manager which contains current markup and provides methods for changing it.
Implements [Observable](https://en.wikipedia.org/wiki/Observer_pattern) pattern through extending
ESL's [Observable](https://github.com/exadel-inc/esl/blob/main/src/modules/esl-utils/abstract/observable.ts) class.

## Description

As we already mentioned, [UIPStateModel](#uip-state-model) is an observable. It distributes markup changes through
**StateModelFiredObj** objects (you can read more about it in [UIPPlugin](#uip-plugin) section). To trigger the
observable you need to change model's markup:

```typescript
import {UIPPlugin} from "./plugin";

class UIPComponent extends UIPPlugin {
    protected _onComponentChange() {
        //...
        this.root.model.html = 'New markup here!';
        //...
    }
}
```

[UIPStateModel](#uip-state-model) also has a getter for current markup:

```typescript
import {UIPPlugin} from "./plugin";

class UIPComponent extends UIPPlugin {
    protected processMarkup() {
        //...
        const currentMarkup = this.root.model.html;
        //...
    }
}
```

## Markup processing methods

[UIPStateModel](#uip-state-model) has some methods to make markup processing easier. They are used inside
[UIPSettings](../settings/README.md) and [UIPSetting](../settings/setting/README.md) plugins. These methods have the
following signatures:

```typescript
import {Observable} from "@exadel/esl";

class UIPStateModel extends Observable {
  public getAttribute(target: string, name: string): (string | null)[] {};
  public setAttribute(target: string, name: string, value: string | boolean): void {};
  public transformAttribute(target: string, name: string, transform: (current: string | null) => string | null): void {};
}
```

**getAttribute()** method returns attributes (*name* field) values from targets.

**setAttribute()** method sets attributes values for targets.

**transformAttribute()** method applies *transform* callback to attributes values for targets.
