## <a name="embedded-behavior-of-eslbaseelement-eslmixinelement">Embedded behavior of `ESLBaseElement` / `ESLMixinElement`</a>

### Shortcuts

All the inheritors of `ESLBaseElement` and `ESLMixinElement` contain the short aliases for some `ESLEventUtils` methods.
The host parameter of the shortcut methods is always targeting the current element/mixin.

- `$$on` ~ `ESLEventUtils.subscribe(this, ...)`
- `$$off` ~ `ESLEventUtils.unsubscribe(this, ...)`
- `$$fire` ~ `ESLEventUtils.dispatch(this, ...)`

Example:

```typescript
this.$$on('click', this.onClick); // ESLEventUtils.subscribe(this, 'click', this.onClick)
this.$$off('click'); // ESLEventUtils.unsubscribe(this, 'click')
```

### Auto-subscription / Auto-unbinding

All the inheritors of `ESLBaseElement` and `ESLMixinElement` automatically subscribe to all declared auto-subscribable descriptors
of their prototype chain.

They also unsubscribe all own listeners attached via ESL automatically on `disconnectedCallback`.

The following short snippet of code describes a listener that will automatically subscribe and unsubscribe
on connected/disconnected callback inside `ESLBaseElement`:

```typescript
class MyEl extends ESLBaseElement {
  // connectedCallback() {
  //   super.connectedCallback(); // - already contains ESLEventUtils.subscribe(this) call
  // }

  // Will be subscribed automatically on connectedCallback and unsubscribed on disconnectedCallback
  @listen('click')
  onClick(e) {
    //...
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
    this.$$off(this.onClick); // Unsubscribes this.onClick method
  }
}
```
