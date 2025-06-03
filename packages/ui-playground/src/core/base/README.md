<a href="#uip-plugin" id="uip-plugin"></a>

## UIPPlugin

**UIPPlugin** - base class for all UIP elements.
Should be used as a parent class for all custom plugins of UIP to correctly observe UIPRoot state.

All UIP elements are **UIPPlugin** instances. Plugin automatically sets _uip-plugin_ class to its elements,
provides access to [UIPRoot](src/core/README.md#uip-root).

**UIPPlugin** has its own header section block, where additional buttons and header icon can be specified.

**UIPPlugin** uses the following attributes:

- **resizable** - allows resizing the plugin.
- **collapsible** - allows collapsing the plugin.
- **resizing** - indicates resizing state of the panel.
- **collapsed** - collapses the plugin by default.
- **vertical** - sets vertical orientation for the plugin.

### Processing markup changes

```typescript
import {UIPPlugin} from './plugin';

class UIPComponent extends UIPPlugin {
  @listen({event: 'uip:change', target: (that: UIPSetting) => that.$root})
  protected _onRootStateChange(): void {
    ...
  }
}
```

You can find a way of getting current markup in [UIPStateModel](src/core/README.md#uip-state-model) section.

### Example

```typescript
import {UIPPlugin} from './plugin';

class UIPPreview extends UIPPlugin {
  @listen({event: 'uip:change', target: (that: UIPPreview) => that.$root})
  protected _onRootStateChange(): void {
    this.$inner.innerHTML = this.model!.html;
    this.innerHTML = '';
    this.appendChild(this.$inner);
  }
}
```

---

<a href="#uip-root" id="uip-root"></a>

## UIPRoot

**UIPRoot** - container for **UIPPlugin** components.

**UIPRoot** contains [UIPStateModel](src/core/README.md#uip-state-model) and [UIPSnippets](src/plugins/snippets/README.md) getters. It also allows **UIPPlugin** elements
to subscribe to model, snippets or theme changes (or unsubscribe from them). More details can be found in [UIPPlugin](src/core/README.md#uip-plugin) section.

### Example

```html
<uip-root></uip-root>
```

---

<a href="#uip-state-model" id="uip-state-model"></a>

## UIPStateModel

**UIPStateModel** - state manager which contains current UIP state and provides methods for changing it.

**UIPStateModel** has current js, markup and note states. 
It also provides [UIPSnippet](src/plugins/snippets/README.md) item values, current active snippet and snippet item that relates to current anchor.
Every time we produce a change, it fires change event.

**UIPStateModel** also contains the following methods:

_getAttribute()_ - method returns attributes (_attr_ field) values from targets.

_changeAttribute()_ - callback is used for changing elements attributes. It takes _ChangeAttrConfig_ as
a parameter. This type looks like this:

```typescript
export type TransformSignature = (
  current: string | null
) => string | boolean | null;

export type ChangeAttrConfig = {
  target: string;
  attribute: string;
  modifier: UIPPlugin;
} & (
  | {
      value: string | boolean;
    }
  | {
      transform: TransformSignature;
    }
);
```

Here _attribute_ stands for attribute name and _target_ - for target elements. _Modifier_ field represents the
**UIPPlugin** instance which triggers attribute's changes.

The last field can either be _value_ (this value replaces current _attribute_'s value) or _transform_ function (it maps
current attribute value to the new one).

The examples of using this API can be found in [UIPSetting](src/plugins/settings/README.md) implementations (e.g. [UIPBoolSetting](src/settings/bool-setting/README.md)).

### Example

```typescript
import {UIPPlugin} from './plugin';

class UIPComponent extends UIPPlugin {
  protected _onComponentChange() {
    // ...
    this.model!.setHtml('New HTML here!', modifier);
    this.model!.setJS('New JS here!', modifier);
    this.model!.setNote('New Note here!', modifier);
    // ...
  }
}
```
